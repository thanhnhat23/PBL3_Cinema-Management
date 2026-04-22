import { create } from "zustand";
import { _axios } from "@/lib/axios";

export interface GenreOption {
  genreId: number;
  genre: string;
  movie: number;
}

export const useGenreStore = create<{
  genres: GenreOption[];
  isFetchingGenres: boolean;
  hasLoadedGenres: boolean;
  fetchAllGenres: () => Promise<void>;
}>((set, get) => ({
  genres: [],
  isFetchingGenres: false,
  hasLoadedGenres: false,

  fetchAllGenres: async () => {
    if (get().hasLoadedGenres) return;

    try {
      set({ isFetchingGenres: true });
      const response = await _axios.get("/v1/admin/get-total-movies-by-genre");
      set({
        genres: response.data ?? [],
        hasLoadedGenres: true,
      });
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      set({ isFetchingGenres: false });
    }
  },
}));
