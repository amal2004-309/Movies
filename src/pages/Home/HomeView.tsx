import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { MovieCard } from "../../components/MovieCard/MovieCard";
import { MovieDetailsModal } from "../../components/MovieDetailsModal";
import { Notification } from "../../components/Notification";
import { getMovieDetails } from "../../services/omdbMovieService";
import { useHomeViewModel } from "./useHomeViewModel";
import type { MovieDetails } from "../../types/movie";
import "./HomeView.css";

export function HomeView() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query")?.trim() ?? "";
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);

  const {
    page,
    movies,
    loading,
    loadingMore,
    error,
    notification,
    clearNotification,
    favouriteIds,
    hasMore,
    loadInitialMovies,
    loadFavouriteStatus,
    handleFavourite,
    handleSearch,
    handleLoadMore,
  } = useHomeViewModel();

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    void loadFavouriteStatus();

    if (query) {
      void handleSearch(query);
      return;
    }

    void loadInitialMovies();
  }, [
    location.pathname,
    location.state,
    query,
    loadInitialMovies,
    loadFavouriteStatus,
    handleSearch,
  ]);

  useEffect(() => {
    if (!selectedMovieId) {
      setSelectedMovie(null);
      setDetailsError("");
      return;
    }

    setDetailsLoading(true);
    setDetailsError("");

    void getMovieDetails(selectedMovieId)
      .then((movie) => setSelectedMovie(movie))
      .catch((error: unknown) => {
        setDetailsError(
          error instanceof Error
            ? error.message
            : "Unable to load movie details.",
        );
      })
      .finally(() => setDetailsLoading(false));
  }, [selectedMovieId]);

  function handleOpenDetails(imdbID: string) {
    setSelectedMovieId(imdbID);
    setDetailsOpen(true);
  }

  function handleCloseDetails() {
    setDetailsOpen(false);
    setSelectedMovieId(null);
  }

  return (
    <main className="home">
      {notification ? (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      ) : null}
      {query ? (
        <p className="home__summary">
          Showing page {page} results for “{query}”.
        </p>
      ) : null}
      {loading ? <p>Loading movies...</p> : null}
      {error ? <p>{error}</p> : null}

      <section className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavourite={favouriteIds.has(movie.imdbID)}
            onFavourite={handleFavourite}
            onSelect={() => handleOpenDetails(movie.imdbID)}
          />
        ))}
      </section>

      {hasMore ? (
        <div className="home__load-more">
          <button
            className="home__load-more-button"
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading more…" : "Load more results"}
          </button>
        </div>
      ) : null}

      <MovieDetailsModal
        open={detailsOpen}
        movie={selectedMovie}
        loading={detailsLoading}
        error={detailsError}
        onClose={handleCloseDetails}
      />
    </main>
  );
}
