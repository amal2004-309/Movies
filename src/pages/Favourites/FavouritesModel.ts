import { ref, get, set, remove } from "firebase/database";
import { realtimeDb } from "../../services/firebaseService";
import type { Movie } from "../../types/movie";

function validateUserId(userId: string): void {
  if (!userId || userId.trim() === "") {
    throw new Error("User ID is required to manage favourites");
  }
}

function validateDatabase(): void {
  if (!realtimeDb) {
    throw new Error(
      "Realtime Database is not initialized. Please check your VITE_FIREBASE_DATABASE_URL environment variable.",
    );
  }
}

export async function getFavourites(userId: string): Promise<Movie[]> {
  validateUserId(userId);
  validateDatabase();

  try {
    const favouritesRef = ref(realtimeDb, `users/${userId}/favourites`);
    const snapshot = await get(favouritesRef);

    if (!snapshot.exists()) {
      return [];
    }

    const favouritesData = snapshot.val() as Record<string, Movie>;
    return Object.values(favouritesData);
  } catch (error) {
    console.error("Error loading favourites:", error);
    throw error;
  }
}

export async function addFavourite(
  userId: string,
  movie: Movie,
): Promise<void> {
  validateUserId(userId);
  validateDatabase();

  try {
    const favouriteRef = ref(
      realtimeDb,
      `users/${userId}/favourites/${movie.imdbID}`,
    );
    await set(favouriteRef, movie);
    console.log("Successfully added favourite:", movie.imdbID);
  } catch (error) {
    console.error("Error saving favourite:", error);
    throw error;
  }
}

export async function removeFavourite(
  userId: string,
  imdbID: string,
): Promise<void> {
  validateUserId(userId);
  validateDatabase();

  try {
    const favouriteRef = ref(
      realtimeDb,
      `users/${userId}/favourites/${imdbID}`,
    );
    await remove(favouriteRef);
    console.log("Successfully removed favourite:", imdbID);
  } catch (error) {
    console.error("Error removing favourite:", error);
    throw error;
  }
}
