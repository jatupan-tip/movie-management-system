import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/auth";

type Movie = {
  id: number;
  title: string;
  yearReleased: number;
  rating: string;
  imageUrl?: string;

  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);

  async function fetchMovies() {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/movies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMovies(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const [title, setTitle] = useState("");
  const [yearReleased, setYearReleased] = useState(0);
  const [rating, setRating] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function createMovie(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !yearReleased || !rating) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", title);
      formData.append("yearReleased", String(yearReleased));
      formData.append("rating", rating);

      if (image) {
        formData.append("image", image);
      }

      await api.post("/movies", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle("");
      setYearReleased(0);
      setRating("");
      setImage(null);
      setPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchMovies();
    } catch (error) {
      console.log(error);
      alert("Create movie failed");
    }
  }

  async function deleteMovie(id: number) {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchMovies();
    } catch (error) {
      console.log(error);

      alert("Delete failed");
    }
  }

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editYearReleased, setEditYearReleased] = useState(0);
  const [editRating, setEditRating] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState("");
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [removeImage, setRemoveImage] = useState(false);

  function startEdit(movie: Movie) {
    setEditingId(movie.id);
    setEditTitle(movie.title);
    setEditYearReleased(movie.yearReleased);
    setEditRating(movie.rating);
    setEditPreview(
      movie.imageUrl ? `http://localhost:3000${movie.imageUrl}` : "",
    );
    setEditImage(null);
    setRemoveImage(false);
  }

  async function updateMovie(id: number) {
    if (!editTitle || !editYearReleased || !editRating) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", editTitle);
      formData.append("yearReleased", String(editYearReleased));
      formData.append("rating", editRating);

      if (editImage) {
        formData.append("image", editImage);
      }

      formData.append("removeImage", String(removeImage));

      await api.patch(`/movies/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEditingId(null);
      setEditImage(null);
      setEditPreview("");

      fetchMovies();
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditYearReleased(0);
    setEditRating("");
    setEditImage(null);
    setEditPreview("");
  }

  const [role, setRole] = useState("");

  function logout() {
    localStorage.removeItem("token");

    window.location.href = "/";
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    const decoded = jwtDecode<JwtPayload>(token);

    setRole(decoded.role);

    fetchMovies();
  }, []);

  return (
    <div className="register-page">
      <h1>Movies Page</h1>

      <button onClick={logout}>Logout</button>

      {role !== "FLOORSTAFF" && (
        <form onSubmit={createMovie}>
          <label
            style={{
              display: "inline-block",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];

                  setImage(file);

                  setPreview(URL.createObjectURL(file));
                }
              }}
            />

            <div
              style={{
                width: "200px",
                height: "300px",
                border: "2px dashed gray",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();

                      setImage(null);

                      setPreview("");

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: "none",
                      background: "red",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ×
                  </button>
                </>
              ) : (
                <span>Select Image</span>
              )}
            </div>
          </label>

          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="YearReleased"
              value={yearReleased}
              onChange={(e) => setYearReleased(Number(e.target.value))}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>

          <button type="submit">Add Movie</button>
        </form>
      )}

      {movies.map((movie) => (
        <div key={movie.id}>
          {editingId === movie.id ? (
            <div>
              <label
                style={{
                  display: "inline-block",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files) {
                      const file = e.target.files[0];

                      setEditImage(file);

                      setEditPreview(URL.createObjectURL(file));

                      setRemoveImage(false);
                    }
                  }}
                />

                <div
                  style={{
                    width: "200px",
                    height: "300px",
                    border: "2px dashed gray",
                    borderRadius: "8px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {editPreview ? (
                    <>
                      <img
                        src={editPreview}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();

                          setEditImage(null);

                          setEditPreview("");

                          setRemoveImage(true);

                          if (editFileInputRef.current) {
                            editFileInputRef.current.value = "";
                          }
                        }}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          border: "none",
                          background: "red",
                          color: "white",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <span>Select Image</span>
                  )}
                </div>
              </label>

              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <input
                type="number"
                value={editYearReleased}
                onChange={(e) => setEditYearReleased(Number(e.target.value))}
              />

              <input
                type="text"
                value={editRating}
                onChange={(e) => setEditRating(e.target.value)}
              />

              <button onClick={() => updateMovie(movie.id)}>Save</button>

              <button onClick={cancelEdit}>Cancel</button>
            </div>
          ) : (
            <div>
              {movie.imageUrl ? (
                <img
                  src={`http://localhost:3000${movie.imageUrl}`}
                  alt={movie.title}
                  style={{
                    width: "200px",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  onError={() => {
                    console.log(
                      "IMAGE ERROR:",
                      `http://localhost:3000${movie.imageUrl}`,
                    );
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "200px",
                    height: "300px",
                    border: "2px dashed gray",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  No Picture
                </div>
              )}

              <h3>{movie.title}</h3>

              <p>{movie.yearReleased}</p>

              <p>{movie.rating}</p>

              <p>
                Created By:
                {movie.createdBy}
              </p>

              <p>
                Created At:
                {new Date(movie.createdAt).toLocaleString()}
              </p>

              {movie.updatedBy && (
                <p>
                  Updated By:
                  {movie.updatedBy}
                </p>
              )}

              {movie.updatedBy && (
                <p>
                  Updated At:
                  {new Date(movie.updatedAt).toLocaleString()}
                </p>
              )}

              {role !== "FLOORSTAFF" && (
                <button onClick={() => startEdit(movie)}>Edit</button>
              )}

              {role === "MANAGER" && (
                <button onClick={() => deleteMovie(movie.id)}>Delete</button>
              )}
            </div>
          )}

          <hr />
        </div>
      ))}
    </div>
  );
}
