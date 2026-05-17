import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import Swal from 'sweetalert2';
import { addToast } from '@heroui/toast';
import i18n from '@/lib/i18n';

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar?: string;
    birthDate: Date;
    age: number;
    createdAt: Date;
    isEmailVerified: boolean;
}

export const useAuthStore = create<{
    authUser: null | AuthUser;
    isSigningUp: boolean;
    isSigningIn: boolean;
    isVerifyingEmail: boolean;
    isForgottingPassword: boolean;
    isResettingPassword: boolean;
    isCheckingResetPassword: boolean;
    isCheckingAuth: boolean;
    isChangingPassword: boolean;
    isChangingEmail: boolean;
    isChangingBirthdate: boolean;
    isChangingAvatar: boolean;

    checkAuth: () => Promise<void>;
    signin: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signup: (username: string, email: string, password: string, birthdate: string) => Promise<void>;
    verifyEmail: (userId: string, verificationCode: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (email: string, newPassword: string) => Promise<void>;
    checkResetPassword: (email: string, resetToken: string) => Promise<boolean>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    changeEmail: (newEmail: string) => Promise<void>;
    changeBirthdate: (newBirthDate: string) => Promise<void>;
    changeAvatar: (newAvatar: File | null) => Promise<void>;
    clearAuth: () => void;
}>((set, get) => ({
    authUser: null as null | AuthUser,

    isSigningUp: false,
    isSigningIn: false,
    isVerifyingEmail: false,
    isForgottingPassword: false,
    isResettingPassword: false,
    isCheckingResetPassword: false,
    isCheckingAuth: true,
    isChangingPassword: false,
    isChangingEmail: false,
    isChangingBirthdate: false,
    isChangingAvatar: false,

    checkAuth: async () => {
        try {
            set({ isCheckingAuth: true });

            const token = localStorage.getItem('token');
            if (!token) {
                set({
                    authUser: null,
                    isCheckingAuth: false
                });
                return;
            }

            const response = await _axios.get('v1/auth/me');
            const data = response.data?.data ?? response.data?.user;

            if (data) {
                const user = {
                    id: data.user_id,
                    username: data.userName,
                    email: data.email,
                    role: data.role,
                    avatar: data.avatar_path,
                    birthDate: new Date(data.birthDate),
                    age: data.age,
                    createdAt: new Date(data.createAt),
                    isEmailVerified: data.isEmailVerified,
                };

                set({ authUser: user });
                localStorage.setItem('authUser', JSON.stringify(user));
            }
        } catch (error) {
            console.log('Error in checkAuth: ', error)
            localStorage.removeItem('authUser');
            localStorage.removeItem('token');
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signin: async (username: string, password: string) => {
        try {
            set({ isSigningIn: true });

            const response = await _axios.post('v1/auth/login', { username, password });
            const data = response.data?.data ?? response.data?.Data;

            if (data?.token) {
                const { token, user_id, userName, email, role } = data;

                localStorage.setItem('token', token);

                // Fetch profile right away so navbar gets latest avatar/role immediately.
                await get().checkAuth();

                if (!get().authUser) {
                    const fallbackUser = {
                        id: user_id,
                        username: userName,
                        email: email,
                        role: role,
                        avatar: data.avatar_path,
                        birthDate: new Date(data.birthDate),
                        age: data.age,
                        createdAt: new Date(data.createAt),
                        isEmailVerified: data.isEmailVerified,
                    };

                    localStorage.setItem('authUser', JSON.stringify(fallbackUser));
                    set({ authUser: fallbackUser });
                }

                Swal.fire({
                    title: i18n.t('toasts.auth.signin_success'),
                    icon: "success",
                    draggable: true
                });
            }
        } catch (error) {
            console.log('Error in signin: ', error);
            Swal.fire({
                icon: "error",
                title: i18n.t('toasts.auth.signin_error'),
                text: i18n.t('toasts.auth.signin_error_desc'),
            });
        } finally {
            set({ isSigningIn: false });
        }
    },

    logout: async () => {
        try {
            const token = localStorage.getItem('token');

            localStorage.removeItem('token');
            localStorage.removeItem('authUser');
            set({ authUser: null });

            if (token) {
                await _axios.post('v1/auth/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            Swal.fire({
                title: i18n.t('toasts.auth.logout_success'),
                icon: "success",
                draggable: true
            });
        } catch (error) {
            console.log('Error in logout: ', error);
            Swal.fire({
                icon: "error",
                title: i18n.t('toasts.auth.logout_error'),
                text: i18n.t('toasts.auth.logout_error_desc'),
            });
        }
    },

    signup: async (username: string, email: string, password: string, birthdate: string) => {
        try {
            set({ isSigningUp: true });

            const parsedBirthdate = new Date(birthdate);
            if (Number.isNaN(parsedBirthdate.getTime())) {
                throw new Error('Invalid birthdate');
            }

            await _axios.post('v1/auth/register', {
                userName: username,
                email,
                password,
                birthDate: parsedBirthdate.toISOString(),
                role: 'User'
            });

            Swal.fire({
                title: i18n.t('toasts.auth.signup_success'),
                text: i18n.t('toasts.auth.signup_success_desc'),
                icon: 'success',
            });
        } catch (error) {
            console.log('Error in signup: ', error);
            Swal.fire({
                title: i18n.t('toasts.auth.signup_error'),
                text: i18n.t('toasts.auth.signup_error_desc'),
                icon: 'error',
            });
        } finally {
            set({ isSigningUp: false });
        }
    },

    verifyEmail: async (userId: string, verificationCode: string) => {
        try {
            set({ isVerifyingEmail: true });
            await _axios.post('v1/auth/verify-email', { userId, verificationCode });

            Swal.fire({
                title: i18n.t('common.success'),
                text: i18n.t('toasts.auth.verify_success'),
                icon: 'success',
            });
        } catch (error) {
            console.log('Error in verifyEmail: ', error);
            Swal.fire({
                title: i18n.t('common.error'),
                text: i18n.t('toasts.auth.verify_error_desc'),
                icon: 'error',
            });
        } finally {
            set({ isVerifyingEmail: false });
        }
    },

    forgotPassword: async (email: string) => {
        try {
            set({ isForgottingPassword: true });
            await _axios.post('v1/auth/forgot-password', { email });

            Swal.fire({
                title: i18n.t('common.success'),
                text: i18n.t('toasts.auth.forgot_success'),
                icon: 'success',
            });
        } catch (error) {
            console.log('Error in forgotPassword: ', error);
            Swal.fire({
                title: i18n.t('common.error'),
                text: i18n.t('toasts.auth.forgot_error_desc'),
                icon: 'error',
            });
        } finally {
            set({ isForgottingPassword: false });
        }
    },

    checkResetPassword: async (email: string, resetToken: string) => {
        try {
            set({ isCheckingResetPassword: true });
            await _axios.post('v1/auth/check-reset-password', { email, resetToken });

            await Swal.fire({
                title: i18n.t('common.success'),
                text: i18n.t('toasts.auth.reset_check_success'),
                icon: 'success',
            });
            return true;
        } catch (error) {
            console.log('Error in checkResetPassword: ', error);
            Swal.fire({
                title: i18n.t('common.error'),
                text: i18n.t('toasts.auth.reset_check_error_desc'),
                icon: 'error',
            });
            return false;
        } finally {
            set({ isCheckingResetPassword: false });
        }
    },

    resetPassword: async (email: string, newPassword: string) => {
        try {
            set({ isResettingPassword: true });
            await _axios.post('v1/auth/reset-password', { email, newPassword });

            Swal.fire({
                title: i18n.t('common.success'),
                text: i18n.t('toasts.auth.reset_success'),
                icon: 'success',
            });
        } catch (error) {
            console.log('Error in resetPassword: ', error);
            Swal.fire({
                title: i18n.t('common.error'),
                text: i18n.t('toasts.auth.reset_error_desc'),
                icon: 'error',
            });
        } finally {
            set({ isResettingPassword: false });
        }
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
        try {
            set({ isChangingPassword: true });
            await _axios.post('v1/auth/change-password', { currentPassword, newPassword });

            addToast({
                title: i18n.t('toasts.auth.change_password_success'),
                description: i18n.t('toasts.auth.change_password_desc'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.log('Error in changePassword: ', error);

            addToast({
                title: i18n.t('toasts.auth.change_password_error'),
                description: i18n.t('toasts.auth.change_password_error_desc'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isChangingPassword: false });
        }
    },

    changeEmail: async (newEmail: string) => {
        try {
            set({ isChangingEmail: true });
            await _axios.post('v1/auth/change-email', { newEmail });

            addToast({
                title: i18n.t('toasts.auth.change_email_success'),
                description: i18n.t('toasts.auth.change_email_desc'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.log('Error in changeEmail: ', error);

            addToast({
                title: i18n.t('toasts.auth.change_email_error'),
                description: i18n.t('toasts.auth.change_email_error_desc'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isChangingEmail: false });
        }
    },

    changeBirthdate: async (newBirthDate: string) => {
        try {
            set({ isChangingBirthdate: true });
            await _axios.post('v1/auth/change-birthdate', { newBirthDate: newBirthDate });

            addToast({
                title: i18n.t('toasts.auth.change_birthdate_success'),
                description: i18n.t('toasts.auth.change_birthdate_desc'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.log('Error in changeBirthdate: ', error);

            addToast({
                title: i18n.t('toasts.auth.change_birthdate_error'),
                description: i18n.t('toasts.auth.change_birthdate_error_desc'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isChangingBirthdate: false });
        }
    },

    changeAvatar: async (newAvatar: File | null) => {
        try {
            set({ isChangingAvatar: true });

            const formData = new FormData();
            if (newAvatar) {
                formData.append('file', newAvatar);
            }

            const response = await _axios.post('v1/auth/upload-avatar', formData);
            const avatarUrl = response.data?.avatarUrl ?? response.data?.data?.avatarUrl;

            if (avatarUrl) {
                const normalizedAvatarUrl = `${avatarUrl}${avatarUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;

                set((state) => {
                    if (!state.authUser) {
                        return {};
                    }

                    const updatedUser = {
                        ...state.authUser,
                        avatar: normalizedAvatarUrl,
                    };

                    localStorage.setItem('authUser', JSON.stringify(updatedUser));
                    return { authUser: updatedUser };
                });
            }

            addToast({
                title: i18n.t('toasts.auth.change_avatar_success'),
                description: i18n.t('toasts.auth.change_avatar_desc'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.log('Error in changeAvatar: ', error);

            addToast({
                title: i18n.t('toasts.auth.change_avatar_error'),
                description: i18n.t('toasts.auth.change_avatar_error_desc'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isChangingAvatar: false });
        }
    },

    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('authUser');
        set({ authUser: null });
    },
}));