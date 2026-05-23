import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../../types/auth";
import TopBar from "../topbar/Topbar";
import Sidebar from "../topbar/Sidebar";
import EditMovieCard from "./components/EditMovieCard";
import MovieCard from "./components/MovieCard";
import AddMovie from "./components/AddMovie";
import MovieFilter from "./components/MovieFilter";
import UserManagement from "../topbar/sidebar-menu/UserManagement";
import PersonalDetails from "../topbar/sidebar-menu/PersonalDetails";
import ChangePassword from "../topbar/sidebar-menu/ChangePassword";

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
  const [showSidebar, setShowSidebar] = useState(false);

  const [showCreateMovie, setShowCreateMovie] = useState(false);

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

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  function logout() {
    localStorage.removeItem("token");

    window.location.href = "/";
  }

  const [showFilter, setShowFilter] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchTitle, setSearchTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;

  function toggleRating(rating: string) {
    setCurrentPage(1);

    if (rating === "all") {
      setSelectedRatings([]);
      return;
    }

    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating],
    );
  }

  const filteredMovies = [...movies]
    .filter((movie) => {
      const matchRating =
        selectedRatings.length === 0 || selectedRatings.includes(movie.rating);

      const matchTitle = movie.title
        .toLowerCase()
        .includes(searchTitle.toLowerCase());

      return matchRating && matchTitle;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.yearReleased - a.yearReleased;

        case "oldest":
          return a.yearReleased - b.yearReleased;

        case "az":
          return a.title.localeCompare(b.title);

        case "za":
          return b.title.localeCompare(a.title);

        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = filteredMovies.slice(
    startIndex,
    startIndex + moviesPerPage,
  );

  const [currentView, setCurrentView] = useState("movies");

  async function refreshProfile() {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsername(response.data.data.username);
      setEmail(response.data.data.email);
      setRole(response.data.data.role);
    } catch (error) {
      console.log(error);
    }
  }

  async function deactivateAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.patch(
        "/users/deactivate",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Account deleted");

      localStorage.removeItem("token");

      window.location.href = "/";
    } catch (error: any) {
      console.log(error);

      alert(error?.response?.data?.message || "Deactivate failed");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    const decoded = jwtDecode<JwtPayload>(token);

    const updatedUsername = localStorage.getItem("updatedUsername");

    setUsername(updatedUsername || decoded.username);
    setEmail(decoded.email);
    setRole(decoded.role);

    console.log(decoded);

    fetchMovies();
    refreshProfile();
  }, []);

  return (
    <div className="movies-management-page">
      {showSidebar && <div className="sidebar-overlay"></div>}

      <TopBar role={role} onOpenSidebar={() => setShowSidebar(!showSidebar)} />

      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onLogout={logout}
        username={username}
        role={role}
        email={email}
        onGoHome={() => setCurrentView("movies")}
        onOpenPersonalDetails={() => setCurrentView("personal")}
        onOpenChangePassword={() => setCurrentView("change-password")}
        onDeactivateAccount={deactivateAccount}
        onOpenUserManagement={() => setCurrentView("users")}
      />

      {currentView === "movies" && (
        <>
          {showCreateMovie ? (
            <AddMovie
              onClose={() => setShowCreateMovie(false)}
              onCreated={fetchMovies}
            />
          ) : (
            <>
              {editingId !== null && <div className="edit-overlay"></div>}

              <div className="movies-page">
                <div className="movies-topic">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search movie title..."
                      value={searchTitle}
                      onChange={(e) => {
                        setSearchTitle(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <div className="topic-button">
                    {role !== "FLOORSTAFF" && (
                      <div className="add-button">
                        <button onClick={() => setShowCreateMovie(true)}>
                          +
                        </button>
                      </div>
                    )}

                    <div className="filter-wrapper">
                      <div
                        className={`filter-button ${showFilter ? "filter-active" : ""}`}
                      >
                        <button onClick={() => setShowFilter(!showFilter)}>
                          <div className="filter-icon"></div>
                        </button>
                      </div>

                      <MovieFilter
                        showFilter={showFilter}
                        selectedRatings={selectedRatings}
                        toggleRating={toggleRating}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        setCurrentPage={setCurrentPage}
                        setShowFilter={setShowFilter}
                      />
                    </div>
                  </div>
                </div>

                <div className="movies-detail">
                  <div className="movies-card">
                    {currentMovies.map((movie) => (
                      <div
                        key={movie.id}
                        className={
                          editingId !== null
                            ? editingId === movie.id
                              ? "movie-card-active"
                              : "movie-card-disabled"
                            : ""
                        }
                      >
                        {editingId === movie.id ? (
                          <EditMovieCard
                            editTitle={editTitle}
                            setEditTitle={setEditTitle}
                            editYearReleased={editYearReleased}
                            setEditYearReleased={setEditYearReleased}
                            editRating={editRating}
                            setEditRating={setEditRating}
                            editPreview={editPreview}
                            setEditPreview={setEditPreview}
                            setEditImage={setEditImage}
                            setRemoveImage={setRemoveImage}
                            editFileInputRef={editFileInputRef}
                            onSave={() => updateMovie(movie.id)}
                            onCancel={cancelEdit}
                          />
                        ) : (
                          <MovieCard
                            movie={movie}
                            role={role}
                            onEdit={() => startEdit(movie)}
                            onDelete={() => deleteMovie(movie.id)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={currentPage === index + 1 ? "active-page" : ""}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {currentView === "users" && <UserManagement />}

      {currentView === "personal" && (
        <PersonalDetails onProfileUpdated={refreshProfile} />
      )}

      {currentView === "change-password" && <ChangePassword />}
    </div>
  );
}
