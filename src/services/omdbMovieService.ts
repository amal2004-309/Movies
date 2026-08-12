import type {
  Movie,
  OmdbMovieDetailsResponse,
  OmdbSearchResponse,
  MovieDetails,
} from "../types/movie";

const API_URL =
  import.meta.env.VITE_API_URL?.trim() ?? "https://www.omdbapi.com/";

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "Missing OMDb API key. Set VITE_OMDB_API_KEY in your environment.",
    );
  }

  return apiKey;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as T | null;

  console.log("[omdbMovieService] Received data:", data);

  if (!data) {
    throw new Error("OMDb returned an unreadable response.");
  }

  return data;
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<{ movies: Movie[]; totalResults: number }> {
  const apiKey = getApiKey();
  const requestUrl = `${API_URL}?apikey=${encodeURIComponent(apiKey)}&s=${encodeURIComponent(query)}&page=${page}`;

  let response: Response;

  try {
    response = await fetch(requestUrl);
  } catch {
    throw new Error(
      "Unable to reach the OMDb API. Please check your connection and try again.",
    );
  }

  const data = await handleResponse<OmdbSearchResponse>(response);

  const errorMessage =
    data.Error === "Invalid API key!"
      ? "Invalid OMDb API key. Update VITE_OMDB_API_KEY in .env and restart the dev server."
      : data.Error
        ? `OMDb request failed: ${data.Error}`
        : !response.ok
          ? `OMDb request failed with status ${response.status}.`
          : null;

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return {
    movies: data.Search ?? [],
    totalResults: Number(data.totalResults ?? 0),
  };
}

export async function getMovieDetails(imdbID: string): Promise<MovieDetails> {
  const apiKey = getApiKey();
  const requestUrl = `${API_URL}?apikey=${encodeURIComponent(apiKey)}&i=${encodeURIComponent(imdbID)}&plot=full`;

  let response: Response;

  try {
    response = await fetch(requestUrl);
  } catch {
    throw new Error(
      "Unable to reach the OMDb API. Please check your connection and try again.",
    );
  }

  const data = await handleResponse<OmdbMovieDetailsResponse>(response);

  if (data.Response === "False") {
    throw new Error(data.Error ?? "Unable to load movie details.");
  }

  return data;
}
