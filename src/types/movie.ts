export type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

export type MovieDetails = Movie & {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  imdbRating: string;
};

export type OmdbSearchResponse = {
  Search?: Movie[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
};

export type OmdbMovieDetailsResponse = MovieDetails & {
  Response: "True" | "False";
  Error?: string;
};
