import { useEffect, useState } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/auth";

type Movie = {
    id: number;
    title: string;
    year: number;
    rating: string;
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
    const [year, setYear] = useState(0);
    const [rating, setRating] = useState("");

    async function createMovie(e: React.FormEvent) {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            await api.post(
                "/movies",
                {
                    title,
                    year,
                    rating,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            fetchMovies();

            setTitle("");
            setYear(0);
            setRating("");
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
    const [editYear, setEditYear] = useState(0);
    const [editRating, setEditRating] = useState("");

    function startEdit(movie: Movie) {
        setEditingId(movie.id);

        setEditTitle(movie.title);

        setEditYear(movie.year);

        setEditRating(movie.rating);
    }

    async function updateMovie(id: number) {
        try {
            const token = localStorage.getItem("token");

            await api.patch(
                `/movies/${id}`,
                {
                    title: editTitle,
                    yearReleased: editYear,
                    rating: editRating,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setEditingId(null);

            fetchMovies();
        } catch (error) {
            console.log(error);

            alert("Update failed");
        }
    }

    const [role, setRole] = useState("");

    function logout() {
        localStorage.removeItem("token");

        window.location.href = "/";
    }

    useEffect(() => {
        const token =
            localStorage.getItem('token');

        if (!token) {
            window.location.href = '/';

            return;
        }

        const decoded =
            jwtDecode<JwtPayload>(token);

        setRole(decoded.role);

        fetchMovies();
    }, []);

    return (
        <div>
            <h1>Movies Page</h1>

            <button onClick={logout}>Logout</button>

            {role !== "FLOORSTAFF" && (
                <form onSubmit={createMovie}>
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
                            placeholder="Year Released"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
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
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />

                            <input
                                type="number"
                                value={editYear}
                                onChange={(e) => setEditYear(Number(e.target.value))}
                            />

                            <input
                                type="text"
                                value={editRating}
                                onChange={(e) => setEditRating(e.target.value)}
                            />

                            <button onClick={() => updateMovie(movie.id)}>Save</button>
                        </div>
                    ) : (
                        <div>
                            <h3>{movie.title}</h3>

                            <p>{movie.year}</p>

                            <p>{movie.rating}</p>

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
