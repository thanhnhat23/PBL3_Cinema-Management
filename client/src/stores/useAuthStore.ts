import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import Swal from 'sweetalert2';
import { addToast } from '@heroui/toast';

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
                    title: "Đăng nhập thành công! Chào mừng bạn trở lại.",
                    icon: "success",
                    draggable: true
                });
            }
        } catch (error) {
            console.log('Error in signin: ', error);
            Swal.fire({
                icon: "error",
                title: "Đăng nhập thất bại!",
                text: "Vui lòng kiểm tra thông tin đăng nhập và thử lại.",
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
                title: "Đăng xuất thành công! Hẹn gặp lại bạn sau.",
                icon: "success",
                draggable: true
            });
        } catch (error) {
            console.log('Error in logout: ', error);
            Swal.fire({
                icon: "error",
                title: "Đăng xuất thất bại!",
                text: "Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.",
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
                title: 'Thành công',
                text: 'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản của bạn.',
                icon: 'success',
            });
        } catch (error) {
            console.log('Error in signup: ', error);
            Swal.fire({
                title: 'Lỗi',
                text: 'Đăng ký thất bại. Vui lòng kiểm tra email hoa.',
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
                title: 'Thành công',
                text: 'Xác minh email thành công! Bạn có thể đăng nhập ngay bây giờ.',
                icon: 'success',
            });
        } catch (error) {
            console.log('Error in verifyEmail: ', error);
            Swal.fire({
                title: 'Lỗi',
                text: 'Xác minh email thất bại. Vui lòng thử lại.',
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
                title: 'Thành công',
                text: 'Đã gửi liên kết đặt lại mật khẩu! Vui lòng kiểm tra email của bạn.',
                icon: 'success',
            });
        } catch (error) {
            console.log('Error in forgotPassword: ', error);
            Swal.fire({
                title: 'Lỗi',
                text: 'Gửi liên kết đặt lại mật khẩu thất bại. Vui lòng thử lại.',
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
                title: 'Thành công',
                text: 'Mã đặt lại mật khẩu hợp lệ! Bạn có thể tiếp tục đặt lại mật khẩu mới.',
                icon: 'success',
            });
            return true;
        } catch (error) {
            console.log('Error in checkResetPassword: ', error);
            Swal.fire({
                title: 'Lỗi',
                text: 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.',
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
                title: 'Thành công',
                text: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.',
                icon: 'success',
            });
        } catch (error) {
            console.log('Error in resetPassword: ', error);
            Swal.fire({
                title: 'Lỗi',
                text: 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.',
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
                title: "Đổi mật khẩu thành công",
                description: "Mật khẩu của bạn đã được đổi thành công.",
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.log('Error in changePassword: ', error);
            
            addToast({
                title: "Lỗi đổi mật khẩu",
                description: "Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại.",
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
                title: "Đổi email thành công",
                description: "Email của bạn đã được đổi thành công.",
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.log('Error in changeEmail: ', error);
            
            addToast({
                title: "Lỗi đổi email",
                description: "Đã xảy ra lỗi khi đổi email. Vui lòng thử lại.",
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
                title: "Đổi ngày sinh thành công",
                description: "Ngày sinh của bạn đã được đổi thành công.",
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.log('Error in changeBirthdate: ', error);
            
            addToast({
                title: "Lỗi đổi ngày sinh",
                description: "Đã xảy ra lỗi khi đổi ngày sinh. Vui lòng thử lại.",
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
                title: "Đổi ảnh đại diện thành công",
                description: "Ảnh đại diện của bạn đã được đổi thành công.",
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.log('Error in changeAvatar: ', error);
            
            addToast({
                title: "Lỗi đổi ảnh đại diện",
                description: "Đã xảy ra lỗi khi đổi ảnh đại diện. Vui lòng thử lại.",
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