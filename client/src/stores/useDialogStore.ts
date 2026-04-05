import { create } from 'zustand';

interface DialogStore {
    openDialog: 'signin' | 'signup' | 'forgot-password' | 'reset-password' | 'settings' | 'change-password' | 'change-email' | 'change-birthdate' | null;
    setOpenDialog: (dialog: 'signin' | 'signup' | 'forgot-password' | 'reset-password' | 'settings' | 'change-password' | 'change-email' | 'change-birthdate' | null) => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
    openDialog: null,
    setOpenDialog: (dialog) => set({ openDialog: dialog }),
}));