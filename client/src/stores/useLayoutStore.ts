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
    | null;

interface LayoutStore {
    openLayout: LayoutKey;
    setOpenLayout: (layout: LayoutKey) => void;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
    openLayout: 'stats',
    setOpenLayout: (layout) => set({ openLayout: layout }),
}));