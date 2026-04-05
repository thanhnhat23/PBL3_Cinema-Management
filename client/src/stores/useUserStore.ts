import { create } from "zustand";
import { _axios } from "@/lib/axios";

export interface User {
    user_id: string;
    username: string;
    birthDate: Date;
    email: string;
    profile_slug: string;
    avatar_provider: string;
    avatar_path?: string | null;
    createdAt: Date;
    isBanned: boolean;
    isVerified: boolean;
    role: string;
}

export const useUserStore = create<{
    user: User | null;
    isFetchingUserByUserId: boolean;
    isBannedUser: boolean;

    fetchUserById: (userId: string) => Promise<void>;
    banUser: (userId: string) => Promise<void>;
}>(( set) => ({
    user: null,
    isFetchingUserByUserId: false,
    isBannedUser: false,

    fetchUserById: async (userId: string) => {
        try {
            set({ isFetchingUserByUserId: true });

            const response = await _axios.get(`/v1/user/get/${userId}`);

            if (response.data) {
                const data = response.data;
                set({
                    user: {
                        user_id: data.user_id,
                        username: data.userName,
                        birthDate: data.birthDate,
                        email: data.email,
                        profile_slug: data.profile_slug ?? data.user_id,
                        avatar_provider: data.avatar_provider ?? "local",
                        avatar_path: data.avatar_path,
                        createdAt: data.createAt,
                        isBanned: data.isBanned,
                        isVerified: data.isEmailVerified,
                        role: data.role,
                    },
                });
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        } finally {
            set({ isFetchingUserByUserId: false });
        }
    },

    banUser: async (userId: string) => {
        try {
            set({ isBannedUser: true });

            await _axios.put(`/v1/user/banned/${userId}?isBanned=true`);

            // Update local state to reflect the ban
            set((state) => {
                if (state.user && state.user.user_id === userId) {
                    return { user: { ...state.user, isBanned: true } };
                }
                return {};
            });
        } catch (error) {
            console.error(`Failed to ban user with ID ${userId}:`, error);
        } finally {
            set({ isBannedUser: false });
        }
    },
}));