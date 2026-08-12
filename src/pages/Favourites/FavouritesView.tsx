import { MovieCard } from "../../components/MovieCard/MovieCard";
import { Notification } from "../../components/Notification";
import { useFavouritesViewModel } from "./useFavouritesViewModel";
import "./FavouritesView.css";

export function FavouritesView() {
  const {
    favourites,
    loading,
    error,
    notification,
    removeMovie,
    clearNotification,
  } = useFavouritesViewModel();

  return (
    <main className="favourites">
      {notification ? (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      ) : null}
      {loading ? <p>Loading favourites...</p> : null}
      {error ? <p>{error}</p> : null}

      {!loading && !error && favourites.length === 0 ? (
        <p>You have no favourites yet. Add some from Home.</p>
      ) : null}

      <section className="movie-grid">
        {favourites.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavouriteView={true}
            onRemove={() => void removeMovie(movie.imdbID)}
          />
        ))}
      </section>
    </main>
  );
}
