import { create } from 'zustand';

interface AuthDialogStore {
    openDialog: 'signin' | 'signup' | 'forgot-password' | 'reset-password' | null;
    setOpenDialog: (dialog: 'signin' | 'signup' | 'forgot-password' | 'reset-password' | null) => void;
}

export const useAuthDialogStore = create<AuthDialogStore>((set) => ({
    openDialog: null,
    setOpenDialog: (dialog) => set({ openDialog: dialog }),
}));
