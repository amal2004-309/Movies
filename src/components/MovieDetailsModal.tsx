import type { MovieDetails } from "../types/movie";
import "./MovieDetailsModal.css";

interface MovieDetailsModalProps {
  movie: MovieDetails | null;
  loading: boolean;
  error: string;
  open: boolean;
  onClose: () => void;
}

export function MovieDetailsModal({
  movie,
  loading,
  error,
  open,
  onClose,
}: MovieDetailsModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="modal-card__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {loading ? (
          <div className="modal-card__loading">Loading details...</div>
        ) : error ? (
          <div className="modal-card__error">{error}</div>
        ) : movie ? (
          <>
            <div className="modal-card__header">
              <h2>{movie.Title}</h2>
              <span>{movie.Year}</span>
            </div>
            <p className="modal-card__meta">
              {movie.Genre} · {movie.Runtime} · {movie.Rated}
            </p>
            <p className="modal-card__plot">{movie.Plot}</p>
            <div className="modal-card__grid">
              <div>
                <strong>Director</strong>
                <p>{movie.Director}</p>
              </div>
              <div>
                <strong>Actors</strong>
                <p>{movie.Actors}</p>
              </div>
              <div>
                <strong>IMDb Rating</strong>
                <p>{movie.imdbRating}</p>
              </div>
              <div>
                <strong>Language</strong>
                <p>{movie.Language}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="modal-card__empty">No details available.</div>
        )}
      </div>
    </div>
  );
}
