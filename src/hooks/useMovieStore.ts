import { create } from "zustand";

type genresType = {
  id: number;
  name: "string";
};

type MovieType = {
  backdrop_path?: string;
  budget?: number;
  genres?: genresType[];
  id?: number;
  original_title?: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  revenue?: number;
  runtime?: number;
  status?: string;
  tagline?: string;
  title?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
};

type MovieData = {
  details: MovieType;
  setDetails?: (obj: MovieType) => void;
  reset?: (isExpired?: boolean) => void;
};

const useMovieStore = create<MovieData>()((set) => ({
  details: {},
  setDetails: (obj) => set(() => ({ details: obj })),
  reset: () =>
    set(() => ({
      details: {},
    })),
}));

export default useMovieStore;
