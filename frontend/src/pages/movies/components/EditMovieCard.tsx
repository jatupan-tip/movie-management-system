import type { RefObject } from "react";

type Props = {
  editTitle: string;
  setEditTitle: (value: string) => void;

  editYearReleased: number;
  setEditYearReleased: (value: number) => void;

  editRating: string;
  setEditRating: (value: string) => void;

  editPreview: string;
  setEditPreview: (value: string) => void;

  setEditImage: (file: File | null) => void;
  setRemoveImage: (value: boolean) => void;

  editFileInputRef: RefObject<HTMLInputElement | null>;

  onSave: () => void;
  onCancel: () => void;
};

export default function EditMovieCard({
  editTitle,
  setEditTitle,
  editYearReleased,
  setEditYearReleased,
  editRating,
  setEditRating,
  editPreview,
  setEditPreview,
  setEditImage,
  setRemoveImage,
  editFileInputRef,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="card">
      <div className="card-top-edit">
        <label className="edit-preview">
          <input
            ref={editFileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];

                setEditImage(file);
                setEditPreview(URL.createObjectURL(file));
                setRemoveImage(false);
              }
            }}
          />

          {editPreview ? (
            <>
              <img src={editPreview} className="movie-preview" />

              <button
                type="button"
                className="remove-image-button"
                onClick={(e) => {
                  e.preventDefault();

                  setEditImage(null);
                  setEditPreview("");
                  setRemoveImage(true);

                  if (editFileInputRef.current) {
                    editFileInputRef.current.value = "";
                  }
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
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="edit-input"
            />
            <label className="input-label">Title</label>
          </div>

          <div className="input-container">
            <input
              type="number"
              value={editYearReleased}
              onChange={(e) => setEditYearReleased(Number(e.target.value))}
              className="edit-input"
            />
            <label className="input-label">Year Released</label>
          </div>

          <div className="input-container">
            <select
              value={editRating}
              onChange={(e) => setEditRating(e.target.value)}
              className="edit-input"
            >
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
          <div className="save-button">
            <button onClick={onSave}>
              <div className="save-icon"></div>
            </button>
          </div>

          <div className="cancel-button">
            <button onClick={onCancel}>
              <div className="cancel-icon"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
