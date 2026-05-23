import { useState } from "react";
import api from "../../../services/api";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

type MovieForm = {
  id: string;
  title: string;
  yearReleased: number | "";
  rating: string;
  image: File | null;
  preview: string;
};

export default function AddMovie({ onClose, onCreated }: Props) {
  const [moviesForm, setMoviesForm] = useState<MovieForm[]>([
    {
      id: crypto.randomUUID(),
      title: "",
      yearReleased: "",
      rating: "",
      image: null,
      preview: "",
    },
  ]);

  function handleChange(index: number, field: keyof MovieForm, value: any) {
    setMoviesForm((prev) => {
      const updated = structuredClone(prev);

      updated[index][field] = value;

      return updated;
    });
  }

  function addMoreMovie() {
    setMoviesForm([
      ...moviesForm,
      {
        id: crypto.randomUUID(),
        title: "",
        yearReleased: "",
        rating: "",
        image: null,
        preview: "",
      },
    ]);
  }

  function removeMovie(index: number) {
    const movie = moviesForm[index];

    const isEmpty =
      !movie.title &&
      movie.yearReleased === "" &&
      !movie.rating &&
      !movie.image;

    if (isEmpty) {
      setMoviesForm((prev) => prev.filter((_, i) => i !== index));

      return;
    }

    const confirmed = window.confirm(`Delete "${movie.title || "Untitled"}" ?`);

    if (confirmed) {
      setMoviesForm((prev) => prev.filter((_, i) => i !== index));
    }
  }

  async function createMovies(e: React.FormEvent) {
    e.preventDefault();

    const hasData = moviesForm.some(
      (movie) =>
        movie.title || movie.yearReleased !== "" || movie.rating || movie.image,
    );

    if (!hasData) {
      alert("No movie data");
      return;
    }

    for (const movie of moviesForm) {
      const hasSomeData =
        movie.title || movie.yearReleased !== "" || movie.rating || movie.image;

      const isIncomplete =
        !movie.title || movie.yearReleased === "" || !movie.rating;

      if (hasSomeData && isIncomplete) {
        alert("Please fill all fields");
        return;
      }
    }

    const confirmed = window.confirm("Do you want to save all movies?");

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      for (const movie of moviesForm) {
        const formData = new FormData();

        formData.append("title", movie.title);
        formData.append("yearReleased", String(movie.yearReleased));
        formData.append("rating", movie.rating);

        if (movie.image) {
          formData.append("image", movie.image);
        }

        await api.post("/movies", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      alert("Create movies success");

      onCreated();
      onClose();
    } catch (error) {
      console.log(error);

      alert("Create movies failed");
    }
  }

  function hasAnyData() {
    return moviesForm.some(
      (movie) =>
        movie.title || movie.yearReleased !== "" || movie.rating || movie.image,
    );
  }

  return (
    <form onSubmit={createMovies}>
      <div className="add-movies-page">
        <div className="movies-topic">
          <h1>Add Movies</h1>

          <div className="topic-button">
            <div className="save-all-button">
              <button type="submit">
                <div className="save-icon"></div>
              </button>
            </div>

            <div className="back-button">
              <button
                type="button"
                onClick={() => {
                  if (!hasAnyData()) {
                    onClose();
                    return;
                  }

                  const confirmed = window.confirm("Discard all changes?");

                  if (confirmed) {
                    onClose();
                  }
                }}
              >
                <div className="back-icon"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="movies-detail">
          <div className="movies-card">
            {moviesForm.map((movie, index) => (
              <div className="card" key={movie.id}>
                <div className="card-top-edit">
                  <label className="edit-preview">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        if (e.target.files) {
                          const file = e.target.files[0];

                          handleChange(index, "image", file);

                          handleChange(
                            index,
                            "preview",
                            URL.createObjectURL(file),
                          );
                        }
                      }}
                    />

                    {movie.preview ? (
                      <>
                        <img src={movie.preview} className="movie-preview" />

                        <button
                          type="button"
                          className="remove-image-button"
                          onClick={(e) => {
                            e.preventDefault();

                            handleChange(index, "image", null);
                            handleChange(index, "preview", "");
                          }}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div
                        className="movie-preview"
                        style={{
                          border: "2px dashed gray",
                          color: "gray",
                          fontWeight: "bold",
                        }}
                      >
                        Select Image
                      </div>
                    )}
                  </label>
                </div>

                <div className="card-bottom">
                  <div className="edit-input-group">
                    <div className="input-container">
                      <input
                        type="text"
                        placeholder=" "
                        value={movie.title}
                        onChange={(e) =>
                          handleChange(index, "title", e.target.value)
                        }
                        className="edit-input"
                      />

                      <label className="input-label">Title</label>
                    </div>

                    <div className="input-container">
                      <input
                        type="number"
                        placeholder=" "
                        value={movie.yearReleased}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "yearReleased",
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                        className="edit-input"
                      />

                      <label className="input-label">Year Released</label>
                    </div>

                    <div className="input-container">
                      <select
                        value={movie.rating}
                        onChange={(e) =>
                          handleChange(index, "rating", e.target.value)
                        }
                        className="edit-input"
                      >
                        <option value="">--</option>
                        <option value="G">G</option>
                        <option value="PG">PG</option>
                        <option value="M">M</option>
                        <option value="MA">MA</option>
                        <option value="R">R</option>
                      </select>

                      <label className="input-label">Rating</label>
                    </div>
                  </div>

                  <div className="card-button">
                    <div className="delete-button">
                      <button type="button" onClick={() => removeMovie(index)}>
                        <div className="delete-icon"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="add-card" onClick={addMoreMovie}>
              +
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
