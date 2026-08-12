import type { Movie } from "../../types/movie";
import { searchMovies } from "../../services/omdbMovieService";

const MOVIE_SEED_KEYWORDS = [
  "Batman",
  "Avengers",
  "Harry Potter",
  "Star Wars",
  "Spider-Man",
  "Marvel",
  "Disney",
  "Matrix",
  "Lord of the Rings",
  "Fast",
  "Mission Impossible",
  "Pixar",
  "Horror",
  "Comedy",
  "Action",
];

export async function getMovies(
  query: string,
  page = 1,
): Promise<{ movies: Movie[]; totalResults: number }> {
  const cleanedQuery = query.trim();

  if (cleanedQuery.length < 2) {
    throw new Error("Search query must contain at least two characters.");
  }

  return searchMovies(cleanedQuery, page);
}

function shuffleMovies<T>(items: T[]): T[] {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentItem = shuffledItems[index];

    shuffledItems[index] = shuffledItems[randomIndex];
    shuffledItems[randomIndex] = currentItem;
  }

  return shuffledItems;
}

export async function initialMovies(): Promise<Movie[]> {
  const uniqueMovies = new Map<string, Movie>();
  const shuffledKeywords = shuffleMovies(MOVIE_SEED_KEYWORDS);

  for (
    let keywordIndex = 0;
    keywordIndex < shuffledKeywords.length && uniqueMovies.size < 20;
    keywordIndex += 5
  ) {
    const keywordBatch = shuffledKeywords.slice(keywordIndex, keywordIndex + 5);
    const batchResults = await Promise.all(
      keywordBatch.map((keyword) =>
        searchMovies(keyword).then((result) => result.movies),
      ),
    );

    for (const movie of batchResults.flat()) {
      uniqueMovies.set(movie.imdbID, movie);
    }
  }

  const shuffledMovies = shuffleMovies(Array.from(uniqueMovies.values()));

  if (shuffledMovies.length < 20) {
    throw new Error("Unable to load enough unique movies for the home screen.");
  }

  return shuffledMovies.slice(0, 20);
}
