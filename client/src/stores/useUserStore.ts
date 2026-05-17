import { create } from "zustand";
import { _axios } from "@/lib/axios";
import { addToast } from "@heroui/toast";
import i18n from "@/lib/i18n";

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
    age: number;
}

interface ApiUser {
    user_id?: string;
    userName?: string;
    username?: string;
    birthDate: Date;
    email: string;
    profile_slug?: string;
    avatar_provider?: string;
    avatar_path?: string | null;
    createAt?: Date;
    createdAt?: Date;
    isBanned: boolean;
    isEmailVerified?: boolean;
    isVerified?: boolean;
    role: string;
    age: number;
}

export const useUserStore = create<{
    user: User | null;
    users: User[];
    isFetchingAllUsers: boolean;
    isFetchingUserByUserId: boolean;
    isBannedUser: boolean;

    fetchAllUsers: () => Promise<void>;
    fetchUserById: (userId: string) => Promise<void>;
    banUser: (userId: string) => Promise<void>;
}>((set) => ({
    user: null,
    users: [],
    isFetchingAllUsers: false,
    isFetchingUserByUserId: false,
    isBannedUser: false,

    fetchAllUsers: async () => {
        try {
            set({ isFetchingAllUsers: true });

            const response = await _axios.get('/v1/user/get-all');

            const users: User[] = (response.data as ApiUser[] ?? []).map((data) => ({
                user_id: data.user_id ?? "",
                username: data.userName ?? data.username ?? "",
                birthDate: data.birthDate,
                email: data.email,
                profile_slug: data.profile_slug ?? data.user_id ?? "",
                avatar_provider: data.avatar_provider ?? "local",
                avatar_path: data.avatar_path,
                createdAt: data.createAt ?? data.createdAt ?? new Date(0),
                isBanned: data.isBanned,
                isVerified: data.isEmailVerified ?? data.isVerified ?? false,
                role: data.role,
                age: data.age ?? 0
            }));

            set({ users });
        } catch (error) {
            console.error("Failed to fetch all users:", error);
        } finally {
            set({ isFetchingAllUsers: false });
        }
    },


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
                        age: data.age
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
            addToast({
                title: i18n.t('common.success'),
                description: i18n.t('toasts.user.ban_success'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.error(`Failed to ban user with ID ${userId}:`, error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.user.ban_error'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isBannedUser: false });
        }
    },
}));