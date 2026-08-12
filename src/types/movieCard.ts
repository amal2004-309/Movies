import type { Movie } from "./movie";

export interface MovieCardProps {
  movie: Movie;
  isFavourite?: boolean;
  isFavouriteView?: boolean;
  onFavourite?: (movie: Movie) => void | Promise<void>;
  onRemove?: () => void;
  onSelect?: () => void;
}
