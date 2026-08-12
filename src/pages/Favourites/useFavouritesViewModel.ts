import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Movie } from "../../types/movie";
import {
  getFavourites as getFavouritesModel,
  removeFavourite as removeFavouriteModel,
} from "./FavouritesModel";

type Notification = {
  message: string;
  type: "success" | "error";
};

export function useFavouritesViewModel() {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<Notification | null>(null);

  const loadMovies = useCallback(async () => {
    if (!user) {
      setFavourites([]);
      return;
    }

    setLoading(true);
    setError("");
    setNotification(null);

    try {
      const movies = await getFavouritesModel(user.uid);
      setFavourites(movies);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const removeMovie = useCallback(
    async (imdbID: string) => {
      if (!user) {
        setError("User not authenticated");
        return;
      }

      const movieToRemove = favourites.find((movie) => movie.imdbID === imdbID);
      setLoading(true);
      setError("");
      setNotification(null);

      try {
        await removeFavouriteModel(user.uid, imdbID);
        setFavourites((prev) => prev.filter((m) => m.imdbID !== imdbID));
        setNotification({
          type: "success",
          message: `${movieToRemove?.Title ?? "Movie"} was removed from your favourites.`,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [user, favourites],
  );

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    void loadMovies();
  }, [loadMovies]);

  return {
    favourites,
    loading,
    error,
    notification,
    loadMovies,
    removeMovie,
    clearNotification,
  } as const;
}
