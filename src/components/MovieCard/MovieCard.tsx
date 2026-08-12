import { useState } from "react";
import type { MovieCardProps } from "../../types/movieCard";
import "./MovieCard.css";

export function MovieCard({
  movie,
  isFavourite = false,
  isFavouriteView = false,
  onFavourite,
  onRemove,
  onSelect,
}: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const posterUrl =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : null;

  const imageUrl = posterUrl
    ? `https://images.weserv.nl/?url=${encodeURIComponent(posterUrl)}`
    : null;

  return (
    <article
      className={`movie-card${isFavourite ? " movie-card--favourite" : ""}`}
      onClick={() => {
        if (onSelect) {
          onSelect();
        }
      }}
      tabIndex={0}
      role="button"
      onKeyDown={(event) => {
        if (event.key === "Enter" && onSelect) {
          onSelect();
        }
      }}
    >
      <div className="movie-card__image-container">
        {imageUrl && !imageError ? (
          <img
            className="movie-card__image"
            src={imageUrl}
            alt={`${movie.Title} poster`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="movie-card__image movie-card__image--placeholder">
            <div className="movie-card__placeholder-icon">🎬</div>
            <span>No poster available</span>
          </div>
        )}
      </div>

      <div className="movie-card__body">
        <h2 className="movie-card__title">{movie.Title}</h2>
        <p className="movie-card__meta">
          {movie.Year} • {movie.Type}
        </p>

        <div className="movie-card__footer">
          <span className="movie-card__type">{movie.Type}</span>

          {isFavouriteView ? (
            <button
              className="movie-card__remove-btn"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRemove?.();
              }}
            >
              Remove
            </button>
          ) : (
            <button
              className={`movie-card__button${isFavourite ? " movie-card__button--favourited" : ""}`}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (onFavourite) {
                  void onFavourite(movie);
                }
              }}
            >
              <span className="movie-card__heart">
                {isFavourite ? "♥" : "♡"}
              </span>
              {isFavourite ? " Added" : " Add to favourites"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
