import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMovies, initialMovies } from "./HomeModel";
import { getFavourites, addFavourite } from "../Favourites/FavouritesModel";
import { useAuth } from "../../context/AuthContext";
import type { Movie } from "../../types/movie";

type Notification = {
  message: string;
  type: "success" | "error";
};

export function useHomeViewModel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<Notification | null>(null);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());

  const loadInitialMovies = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotification(null);
    setPage(1);
    setTotalResults(0);

    try {
      const initialMovieList = await initialMovies();
      setMovies(initialMovieList);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while loading movies.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(
    async (searchQuery?: string) => {
      const nextQuery =
        searchQuery !== undefined ? searchQuery.trim() : query.trim();

      if (!nextQuery) {
        setError("Please enter a movie title to search.");
        return;
      }

      setQuery(nextQuery);
      setLoading(true);
      setError("");
      setNotification(null);
      setPage(1);

      try {
        const result = await getMovies(nextQuery, 1);
        setMovies(result.movies);
        setTotalResults(result.totalResults);
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong while searching for movies.";

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  const handleLoadMore = useCallback(async () => {
    if (!query || loadingMore) {
      return;
    }

    const nextPage = page + 1;
    setLoadingMore(true);
    setError("");
    setNotification(null);

    try {
      const result = await getMovies(query, nextPage);
      setMovies((prev) => [...prev, ...result.movies]);
      setPage(nextPage);
      setTotalResults(result.totalResults);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while loading more movies.";

      setError(message);
    } finally {
      setLoadingMore(false);
    }
  }, [query, page, loadingMore]);

  const hasMore = movies.length < totalResults;

  const loadFavouriteStatus = useCallback(async () => {
    if (!user) {
      setFavouriteIds(new Set());
      return;
    }

    try {
      const favourites = await getFavourites(user.uid);
      setFavouriteIds(new Set(favourites.map((movie) => movie.imdbID)));
    } catch (err) {
      console.error("Unable to load favourite status:", err);
    }
  }, [user]);

  const handleFavourite = useCallback(
    async (movie: Movie) => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        await addFavourite(user.uid, movie);
        setFavouriteIds((prev) => new Set(prev).add(movie.imdbID));
        setNotification({
          type: "success",
          message: `${movie.Title} was added to your favourites.`,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Failed to save favourite:", errorMessage);
        setError(`Failed to save favourite: ${errorMessage}`);
      }
    },
    [user, navigate],
  );

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    query,
    setQuery,
    movies,
    page,
    hasMore,
    loading,
    loadingMore,
    error,
    notification,
    favouriteIds,
    handleSearch,
    handleLoadMore,
    loadInitialMovies,
    loadFavouriteStatus,
    handleFavourite,
    clearNotification,
  };
}
