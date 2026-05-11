import { create } from 'zustand';

export type LayoutKey = 
    | 'stats' 
    | 'movies' 
    | 'tickets' 
    | 'showtimes' 
    | 'cinemas' 
    | 'users'
    | 'sync'
    | 'revenue'
    | 'foods'

interface LayoutStore {
    openLayout: LayoutKey | null;
    setOpenLayout: (layout: LayoutKey | null) => void;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
    openLayout: 'stats',
    setOpenLayout: (layout) => set({ openLayout: layout }),
}));