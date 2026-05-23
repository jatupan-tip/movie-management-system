type Movie = {
  id: number;
  title: string;
  yearReleased: number;
  rating: string;
  imageUrl?: string;
};

type Props = {
  movie: Movie;
  role: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function MovieCard({ movie, role, onEdit, onDelete }: Props) {
  return (
    <div className="card">
      <div className="card-top">
        {movie.imageUrl ? (
          <img
            src={`http://localhost:3000${movie.imageUrl}`}
            alt={movie.title}
            className="movie-preview"
          />
        ) : (
          <div
            className="movie-preview"
            style={{
              border: "2px dashed gray",
              color: "gray",
              fontWeight: "bold",
            }}
          >
            No Picture
          </div>
        )}

        <h3 className="movie-title">{movie.title}</h3>
      </div>

      <div className="card-bottom">
        <div className="card-detail">
          <p style={{ textIndent: "10px", fontSize: "14px" }}>
            Year Released: {movie.yearReleased}
          </p>

          <p style={{ textIndent: "10px", fontSize: "14px" }}>
            Rating: {movie.rating}
          </p>
        </div>

        <div className="card-button">
          {role !== "FLOORSTAFF" && (
            <div className="edit-button">
              <button onClick={onEdit}>
                <div className="edit-icon"></div>
              </button>
            </div>
          )}

          {role === "MANAGER" && (
            <div className="delete-button">
              <button
                onClick={() => {
                  const confirmed = window.confirm(`Delete "${movie.title}" ?`);

                  if (confirmed) {
                    onDelete();
                  }
                }}
              >
                <div className="delete-icon"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
