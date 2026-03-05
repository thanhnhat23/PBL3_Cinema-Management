import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { addToast } from '@heroui/toast';

export const useAuthStore = create<{
    authUser: null | { id: string; username: string; email: string; role: string, avatar?: string };
    isSigningUp: boolean;
    isSigningIn: boolean;
    isVerifyingEmail: boolean;
    isForgottingPassword: boolean;
    isResettingPassword: boolean;
    isCheckingResetPassword: boolean;
    isCheckingAuth: boolean;
    checkAuth: () => Promise<void>;
    signin: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signup: (username: string, email: string, password: string, birthdate: string) => Promise<void>;
    verifyEmail: (userId: string, verificationCode: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (email: string, newPassword: string) => Promise<void>;
    checkResetPassword: (email: string, resetToken: string) => Promise<void>;
}>((set) => ({
    authUser: null as null | { id: string; username: string; email: string; role: string, avatar?: string },

    isSigningUp: false,
    isSigningIn: false,
    isVerifyingEmail: false,
    isForgottingPassword: false,
    isResettingPassword: false,
    isCheckingResetPassword: false,
    isCheckingAuth: true,

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
                    avatar: data.avatar_path
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

                const user = {
                    id: user_id,
                    username: userName,
                    email: email,
                    role: role,
                };
                localStorage.setItem('authUser', JSON.stringify(user));

                set({ authUser: user });

                addToast({
                    title: 'Thành công',
                    description: 'Đăng nhập thành công! Chào mừng bạn trở lại.',
                    color: 'success',
                });
            }
        } catch (error) {
            console.log('Error in signin: ', error);
            addToast({
                title: 'Lỗi',
                description: 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập và thử lại.',
                color: 'danger',
            });
        } finally {
            set({ isSigningIn: false });
        }
    },

    logout: async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Xóa token ngay lập tức để tránh sử dụng token cũ
            localStorage.removeItem('token');
            localStorage.removeItem('authUser');
            set({ authUser: null });
            
            // Gọi API logout để blacklist token trên server
            if (token) {
                await _axios.post('v1/auth/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            addToast({
                title: 'Thành công',
                description: 'Đăng xuất thành công! Hẹn gặp lại bạn sau.',
                color: 'success',
            });
        } catch (error) {
            console.log('Error in logout: ', error);
            // Vẫn hiển thị thành công vì đã xóa token ở client
            addToast({
                title: 'Thành công',
                description: 'Đăng xuất thành công! Hẹn gặp lại bạn sau.',
                color: 'success',
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

            const response = await _axios.post('v1/auth/register', {
                userName: username,
                email,
                password,
                birthDate: parsedBirthdate.toISOString(),
                role: 'User'
            });

            addToast({
                title: 'Thành công',
                description: 'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản của bạn.',
                color: 'success',
            });
        } catch (error) {
            console.log('Error in signup: ', error);
            addToast({
                title: 'Lỗi',
                description: 'Đăng ký thất bại. Vui lòng kiểm tra email hoa.',
                color: 'danger',
            });
        } finally {
            set({ isSigningUp: false });
        }
    },

    verifyEmail: async (userId: string, verificationCode: string) => {
        try {
            set({ isVerifyingEmail: true });
            const response = await _axios.post('v1/auth/verify-email', { userId, verificationCode });

            if (response.data?.data) {
                addToast({
                    title: 'Thành công',
                    description: 'Xác minh email thành công! Bạn có thể đăng nhập ngay bây giờ.',
                    color: 'success',
                });
            }
        } catch (error) {
            console.log('Error in verifyEmail: ', error);
            addToast({
                title: 'Lỗi',
                description: 'Xác minh email thất bại. Vui lòng thử lại.',
                color: 'danger',
            });
        } finally {
            set({ isVerifyingEmail: false });
        }
    },

    forgotPassword: async (email: string) => {
        try {
            set({ isForgottingPassword: true });

            const response = await _axios.post('v1/auth/forgot-password', { email });
            if (response.data?.data) {
                addToast({
                    title: 'Thành công',
                    description: 'Đã gửi liên kết đặt lại mật khẩu! Vui lòng kiểm tra email của bạn.',
                    color: 'success',
                });
            }
        } catch (error) {
            console.log('Error in forgotPassword: ', error);
            addToast({
                title: 'Lỗi',
                description: 'Gửi liên kết đặt lại mật khẩu thất bại. Vui lòng thử lại.',
                color: 'danger',
            });
        } finally {
            set({ isForgottingPassword: false });
        }
    },

    checkResetPassword: async (email: string, resetToken: string) => {
        try {
            set({ isCheckingResetPassword: true });
            const response = await _axios.post('v1/auth/check-reset-password', { email, resetToken });
            if (response.data?.data) {
                addToast({
                    title: 'Thành công',
                    description: 'Mã đặt lại mật khẩu hợp lệ! Bạn có thể tiếp tục đặt lại mật khẩu mới.',
                    color: 'success',
                });
            }
        } catch (error) {
            console.log('Error in checkResetPassword: ', error);
            addToast({
                title: 'Lỗi',
                description: 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.',
                color: 'danger',
            });
        } finally {
            set({ isCheckingResetPassword: false });
        }
    },

    resetPassword: async (email: string, newPassword: string) => {
        try {
            set({ isResettingPassword: true });
            const response = await _axios.post('v1/auth/reset-password', { email, newPassword });
            if (response.data?.data) {
                addToast({
                    title: 'Thành công',
                    description: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.',
                    color: 'success',
                });
            }
        } catch (error) {
            console.log('Error in resetPassword: ', error);
            addToast({
                title: 'Lỗi',
                description: 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.',
                color: 'danger',
            });
        } finally {
            set({ isResettingPassword: false });
        }
    },
}));