'use client'

import { 
    Dialog, 
    DialogContent,
    DialogHeader, 
    DialogTitle, 
    DialogClose,
    DialogFooter,
} from "../ui/dialog";
import { 
    Image,
    addToast,
    Button,
    DatePicker,
    Input,
    InputOtp,
    type DateValue
} from "@heroui/react";
import { EyeOffIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { EyeIcon } from "../icons/eye";
import { IoIosMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail, MdOutlinePassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useAuthDialogStore } from "@/stores/useAuthDialogStore";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import { SendHorizontal } from "../icons/send-horizontal";
import Link from "next/link";

export const AuthDialog = () => {
    const [isVisiblePassword, setIsVisiblePassword] = useState(false);
    const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false);

        const [formSignIn, setFormSignIn] = useState({
        username: '',
        password: ''
    });

    const [formSignUp, setFormSignUp] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthdate: null as DateValue | null,
    });

    const [formResetPass, setFormResetPass] = useState({
        email: '',
        resetToken: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const resetForms = () => {
        setFormSignIn({
            username: '',
            password: ''
        });

        setFormSignUp({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            birthdate: null,
        });

        setFormResetPass({
            email: '',
            resetToken: '',
            newPassword: '',
            confirmNewPassword: '',
        });
    };

    const { 
        isSigningUp,
        isSigningIn, 
        isForgottingPassword, 
        isResettingPassword,
        isCheckingResetPassword, 
        signup, 
        signin, 
        forgotPassword, 
        resetPassword,
        checkResetPassword, 
    } = useAuthStore();
    const { openDialog, setOpenDialog } = useAuthDialogStore();

    const checkConfirmPassword = () => {
        if (formSignUp.password !== formSignUp.confirmPassword) {
            return false;
        }
        return true;
    }

    const checkPasswordStrength = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(password);
    }

    const checkUsernameValidity = (username: string) => {
        if (/\s/.test(username)) {
            return false;
        }

        const trimmed = username.trim();
        const regex = /^[a-zA-Z0-9_]{3,}$/;
        return regex.test(trimmed);
    }

    const onSubmitSignIn = async () => {
        const username = formSignIn.username.trim();
        await signin(username, formSignIn.password);

        const currentAuthUser = useAuthStore.getState().authUser;
        if (currentAuthUser) {
            setOpenDialog(null);
            resetForms();
        }
    };

    const onSubmitSignUp = async () => {
        const username = formSignUp.username.trim();
        if (!checkUsernameValidity(username)) {
            addToast({
                title: "Lỗi",
                description: "Tên đăng nhập không hợp lệ (ít nhất 3 ký tự, chỉ gồm chữ cái, số và dấu gạch dưới).",
                color: "warning"
            });
            return;
        }

        if (!checkPasswordStrength(formSignUp.password)) {
            addToast({
                title: "Lỗi",
                description: "Mật khẩu chưa đủ mạnh (ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số).",
                color: "warning"
            });
            return;
        }

        if (!checkConfirmPassword()) {
            addToast({
                title: "Lỗi",
                description: "Mật khẩu xác nhận không khớp!",
                color: "warning"
            });
            return;
        }

        const birthdateIso = formSignUp.birthdate?.toDate('UTC').toISOString() ?? '';

        await signup(
            formSignUp.username.trim(),
            formSignUp.email,
            formSignUp.password,
            birthdateIso
        );

        const currentAuthUser = useAuthStore.getState().authUser;
        if (currentAuthUser) {
            setOpenDialog(null);
            resetForms();
        }
    };

    const onSubmitForgotPassword = async () => {
        await forgotPassword(formResetPass.email);
        addToast({
            title: 'Thành công',
            description: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email và nhập mã OTP để đặt lại mật khẩu.',
            color: 'success'
        });
    };

    const onSubmitCheckResetPassword = async () => {
        await checkResetPassword(formResetPass.email, formResetPass.resetToken);
        
        addToast({
            title: 'Thành công',
            description: 'Mã OTP hợp lệ, bạn có thể đặt lại mật khẩu mới.',
            color: 'success'
        });
        setOpenDialog('reset-password');
    };

    const onSubmitResetPassword = async () => {
        if (formResetPass.newPassword !== formResetPass.confirmNewPassword) {
            addToast({
                title: "Lỗi",
                description: "Mật khẩu xác nhận không khớp!",
                color: "warning"
            });
            return;
        }

        if (!checkPasswordStrength(formResetPass.newPassword)) {
            addToast({
                title: "Lỗi",
                description: "Mật khẩu chưa đủ mạnh (ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số).",
                color: "warning"
            });
            return;
        }

        await resetPassword(formResetPass.email, formResetPass.newPassword);
        addToast({
            title: 'Thành công',
            description: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.',
            color: 'success'
        });
        setOpenDialog(null);
        resetForms();
    };

    return (
        <Dialog
            modal={false}
            open={openDialog !== null}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setOpenDialog(null);
                    resetForms();
                }
            }}
        >
            {openDialog && (
                <DialogContent 
                    from="top" 
                    showCloseButton={false} 
                    className="sm:max-w-106.25"
                    key={openDialog}
                >
                    <DialogClose asChild className="flex justify-center">
                        <Button 
                            type="button"
                            isIconOnly 
                            aria-label="Close" 
                            variant="light" 
                            size="sm" 
                            className="absolute top-2 right-2"
                            onClick={() => {
                                setOpenDialog(null);
                                resetForms();
                            }}
                        >
                            <XIcon size={18}/>
                        </Button>
                    </DialogClose>

                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={openDialog || 'empty'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            {openDialog === 'signin' && (
                                <>
                                    <DialogHeader>
                                        <div className="flex flex-col items-center justify-center w-full mb-4">
                                            <Image 
                                                src="/logo.png" 
                                                alt="Profile image" 
                                                className="rounded-md h-36 object-cover mb-2"
                                            />
                                            <DialogTitle>
                                                Đăng nhập tài khoản
                                            </DialogTitle>
                                        </div>
                                    </DialogHeader>

                                    <div className="grid gap-4">
                                        {/* Username field input */}
                                        <div className="grid gap-3">
                                            <Input 
                                                key="signin-username"
                                                isRequired
                                                isClearable
                                                label="Tên đăng nhập" 
                                                labelPlacement="outside"
                                                placeholder="Nhập Tên Đăng Nhập"
                                                errorMessage="Vui lòng nhập tên đăng nhập không bỏ trống"
                                                type="text" 
                                                variant="faded"
                                                name="signin-username"
                                                data-lpignore="true"
                                                data-form-type="signin"
                                                readOnly
                                                onFocus={(e) => e.target.removeAttribute('readonly')}
                                                startContent={<FaUser size={16} className="text-gray-500" />}
                                                value={formSignIn.username}
                                                onChange={(e) => setFormSignIn({
                                                    ...formSignIn,
                                                    username: e.target.value.trimEnd()
                                                })}
                                            />
                                        </div>

                                        {/* Password field input */}
                                        <div className="grid gap-3">
                                            <Input
                                                key="signin-password"
                                                isRequired
                                                label="Mật khẩu"
                                                labelPlacement="outside"
                                                placeholder="Nhập Mật Khẩu"
                                                errorMessage="Vui lòng nhập mật khẩu không bỏ trống"
                                                type={isVisiblePassword ? "text" : "password"}
                                                variant="faded"
                                                name="signin-password"
                                                data-lpignore="true"
                                                data-form-type="signin"
                                                readOnly
                                                onFocus={(e) => e.target.removeAttribute('readonly')}
                                                startContent={<RiLockPasswordFill size={20} className="text-gray-500" />}
                                                endContent={
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-center"
                                                        onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                                                    >
                                                        {isVisiblePassword ? (
                                                            <EyeIcon size={18}/>
                                                        ) : (
                                                            <EyeOffIcon size={18}/>
                                                        )}
                                                    </button>
                                                }
                                                value={formSignIn.password}
                                                onChange={(e) => setFormSignIn({...formSignIn, password: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <div className="flex flex-col gap-4 w-full">
                                            <div className="flex flex-col justify-center items-start mt-4">
                                                <Link 
                                                    href="#" 
                                                    className="text-sm text-primary underline underline-offset-4"
                                                    onClick={() => {
                                                        setOpenDialog('forgot-password')
                                                    }}
                                                >
                                                    Quên mật khẩu?
                                                </Link>

                                                <Button 
                                                    type="button"
                                                    onClick={onSubmitSignIn}
                                                    radius="sm" 
                                                    color="primary" 
                                                    variant="shadow" 
                                                    isLoading={isSigningIn}
                                                    className="mt-4 w-full"
                                                >
                                                    Đăng nhập
                                                </Button>
                                            </div>

                                            <hr />

                                            <div className="flex flex-col gap-2">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Chưa có tài khoản? </span>
                                                <Button 
                                                    type="button"
                                                    onClick={() => {
                                                        resetForms();
                                                        setOpenDialog('signup');
                                                    }}
                                                    radius="sm" 
                                                    color="primary" 
                                                    variant="shadow" 
                                                >
                                                    Đăng ký
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogFooter>
                                </>
                            )}

                            {openDialog === 'signup' && (
                                <>
                                    <DialogHeader>
                                        <div className="flex flex-col items-center justify-center w-full mb-4">
                                            <Image 
                                                src="/logo.png" 
                                                alt="Profile image" 
                                                className="rounded-md h-36 object-cover mb-2"
                                            />
                                            <DialogTitle>
                                                Đăng ký tài khoản
                                            </DialogTitle>
                                        </div>
                                    </DialogHeader>
                                    <div className="grid gap-4">
                                        {/* Username field input */}
                                        <div className="grid gap-3">
                                            <Input 
                                                key="signup-username"
                                                isRequired
                                                isClearable
                                                label="Tên đăng nhập" 
                                                labelPlacement="outside"
                                                placeholder="Nhập Tên Đăng Nhập"
                                                errorMessage="Vui lòng nhập tên đăng nhập không bỏ trống"
                                                type="text" 
                                                variant="faded"
                                                name="signup-username"
                                                data-lpignore="true"
                                                data-form-type="signup"
                                                readOnly
                                                onFocus={(e) => e.target.removeAttribute('readonly')}
                                                startContent={<FaUser size={14} className="text-gray-500" />}
                                                value={formSignUp.username}
                                                onChange={(e) => setFormSignUp({
                                                    ...formSignUp,
                                                    username: e.target.value.trimEnd()
                                                })}
                                            />
                                        </div>

                                        {/* Email field input */}
                                        <div className="grid gap-3">
                                            <Input 
                                                key="signup-email"
                                                isRequired
                                                isClearable
                                                label="Tên email" 
                                                labelPlacement="outside"
                                                placeholder="Nhập Tên Email"
                                                errorMessage="Vui lòng nhập email không bỏ trống"
                                                type="email" 
                                                variant="faded"
                                                name="signup-email"
                                                data-lpignore="true"
                                                data-form-type="signup"
                                                readOnly
                                                onFocus={(e) => e.target.removeAttribute('readonly')}
                                                startContent={<IoIosMail size={20} className="text-gray-500" />}
                                                value={formSignUp.email}
                                                onChange={(e) => setFormSignUp({...formSignUp, email: e.target.value})}
                                            />
                                        </div>

                                        {/* BirthDate field input */}
                                        <div className="grid gap-3">
                                            <DatePicker
                                                key="signup-birthdate"
                                                isRequired
                                                label="Ngày sinh"
                                                labelPlacement="outside"
                                                variant="faded"
                                                errorMessage="Vui lòng chọn ngày sinh hợp lệ"
                                                selectorButtonPlacement="start"
                                                showMonthAndYearPickers
                                                value={formSignUp.birthdate}
                                                onChange={(date) => setFormSignUp({...formSignUp, birthdate: date})}
                                                classNames={{
                                                    selectorIcon: "text-zinc-500"
                                                }}
                                            />
                                        </div>

                                        {/* Password field input */}
                                        <div className="grid gap-3">
                                            <Input
                                                key="signup-password"
                                                isRequired
                                                label="Mật khẩu"
                                                labelPlacement="outside"
                                                placeholder="Nhập Mật Khẩu"
                                                errorMessage="Vui lòng nhập mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                                                type={isVisiblePassword ? "text" : "password"}
                                                variant="faded"
                                                name="signup-password"
                                                data-lpignore="true"
                                                data-form-type="signup"
                                                readOnly
                                                onFocus={(e) => e.target.removeAttribute('readonly')}
                                                startContent={<RiLockPasswordFill size={20} className="text-gray-500" />}
                                                endContent={
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-center"
                                                        onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                                                    >
                                                        {isVisiblePassword ? (
                                                            <EyeIcon size={18}/>
                                                        ) : (
                                                            <EyeOffIcon size={18}/>
                                                        )}
                                                    </button>
                                                }
                                                value={formSignUp.password}
                                                onChange={(e) => setFormSignUp({...formSignUp, password: e.target.value})}
                                            />
                                        </div>

                                        {/* Confirm Password field input */}
                                        <div className="grid gap-3">
                                            <Input
                                                key="signup-confirm-password"
                                                isRequired
                                                label="Xác nhận mật khẩu"
                                                labelPlacement="outside"
                                                placeholder="Nhập Lại Mật Khẩu"
                                                errorMessage="Vui lòng nhập mật khẩu xác nhận khớp với mật khẩu đã nhập"
                                                type={isVisibleConfirmPassword ? "text" : "password"}
                                                variant="faded"
                                                name="signup-confirm-password"
                                                data-lpignore="true"
                                                data-form-type="signup"
                                                readOnly
                                                onFocus={(e) => e.target.removeAttribute('readonly')}
                                                startContent={<MdOutlinePassword size={20} className="text-gray-500" />}
                                                endContent={
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-center"
                                                        onClick={() => setIsVisibleConfirmPassword(!isVisibleConfirmPassword)}
                                                    >
                                                        {isVisibleConfirmPassword ? (
                                                            <EyeIcon size={18}/>
                                                        ) : (
                                                            <EyeOffIcon size={18}/>
                                                        )}
                                                    </button>
                                                }
                                                value={formSignUp.confirmPassword}
                                                onChange={(e) => setFormSignUp({...formSignUp, confirmPassword: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <div className="flex flex-col gap-4 w-full">
                                            <div className="flex justify-end items-center">
                                                <Button 
                                                    type="button"
                                                    onClick={onSubmitSignUp}
                                                    radius="sm" 
                                                    color="primary" 
                                                    variant="shadow" 
                                                    isLoading={isSigningUp}
                                                    className="w-full mt-8"
                                                >
                                                    Đăng ký
                                                </Button>
                                            </div>

                                            <hr />

                                            <div className="flex flex-col gap-2">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Đã có tài khoản? </span>
                                                <Button 
                                                    type="button"
                                                    onClick={() => {
                                                        resetForms();
                                                        setOpenDialog('signin');
                                                    }}
                                                    radius="sm" 
                                                    color="primary" 
                                                    variant="shadow" 
                                                >
                                                    Đăng Nhập
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogFooter>
                                </>
                            )}

                            {openDialog === 'forgot-password' && (
                                <>
                                    <DialogHeader>
                                        <div className="flex flex-col items-center justify-center w-full mb-4">
                                            <Image 
                                                src="/logo.png" 
                                                alt="Profile image" 
                                                className="rounded-md h-36 object-cover mb-2"
                                            />
                                            <DialogTitle>
                                                Quên mật khẩu
                                            </DialogTitle>
                                        </div>
                                    </DialogHeader>

                                    <div className="grid gap-4">
                                        {/* Email field input */}
                                        <div className="grid gap-3">
                                            <div className="flex gap-2">
                                                <Input 
                                                    key="reset-email"
                                                    isRequired
                                                    isClearable
                                                    label="Email" 
                                                    labelPlacement="outside"
                                                    placeholder="Nhập Email"
                                                    errorMessage="Vui lòng nhập email không bỏ trống"
                                                    type="text" 
                                                    variant="faded"
                                                    name="reset-email"
                                                    data-lpignore="true"
                                                    data-form-type="reset-password"
                                                    readOnly
                                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                                    startContent={<MdEmail size={20} className="text-gray-500" />}
                                                    value={formResetPass.email}
                                                    onChange={(e) => setFormResetPass({
                                                        ...formResetPass,
                                                        email: e.target.value.trimEnd()
                                                    })}
                                                />

                                                <Button 
                                                    isIconOnly
                                                    type="button"
                                                    onClick={onSubmitForgotPassword}
                                                    radius="lg" 
                                                    color="primary" 
                                                    variant="shadow" 
                                                    isLoading={isForgottingPassword}
                                                    className="w-12 self-end"
                                                >
                                                    <SendHorizontal animateOnHover size={18}/>
                                                </Button>
                                            </div>

                                            <div className="flex flex-col items-center gap-1 mt-2">
                                                <span className="text-lg font-medium">OTP </span>
                                                <InputOtp 
                                                    isRequired
                                                    variant="faded"
                                                    length={6}
                                                    value={formResetPass.resetToken}
                                                    onValueChange={(value) => 
                                                        setFormResetPass({...formResetPass, resetToken: value})} 
                                                />  
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <div className="flex flex-col gap-4 w-full">
                                            <div className="flex flex-col justify-center items-start mt-4">
                                                <Button 
                                                    type="button"
                                                    onClick={onSubmitCheckResetPassword}
                                                    radius="sm" 
                                                    color="primary" 
                                                    variant="shadow" 
                                                    isLoading={isCheckingResetPassword}
                                                    className="mt-4 w-full"
                                                >
                                                    Xác nhận OTP
                                                </Button>
                                            </div>

                                            <hr />

                                            <div className="flex flex-col gap-2">
                                                <Button 
                                                    type="button"
                                                    onClick={() => {
                                                        resetForms();
                                                        setOpenDialog('signin');
                                                    }}
                                                    radius="sm" 
                                                    color="primary" 
                                                    variant="shadow" 
                                                >
                                                    Trở về đăng nhập
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogFooter>
                                </>
                            )}

                            {openDialog === 'reset-password' && (
                                <>
                                    <DialogHeader>
                                        <div className="flex flex-col items-center justify-center w-full mb-4">
                                            <Image 
                                                src="/logo.png" 
                                                alt="Profile image" 
                                                className="rounded-md h-36 object-cover mb-2"
                                            />
                                            <DialogTitle>
                                                Đặt lại mật khẩu
                                            </DialogTitle>
                                        </div>
                                    </DialogHeader>
                                    <div className="grid gap-4">
                                        {/* Password field input */}
                                        <div className="grid gap-3">
                                            <Input
                                                key="reset-new-password"
                                                isRequired
                                                label="Mật khẩu mới"
                                                labelPlacement="outside"
                                                placeholder="Nhập Mật Khẩu Mới"
                                                errorMessage="Vui lòng nhập mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                                                type={isVisiblePassword ? "text" : "password"}
                                                variant="faded"
                                                name="reset-new-password"
                                                data-lpignore="true"
                                                data-form-type="reset-password"
                                                readOnly
                                                onFocus={(e) => e.target.removeAttribute('readonly')}
                                                startContent={<RiLockPasswordFill size={20} className="text-gray-500" />}
                                                endContent={
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-center"
                                                        onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                                                    >
                                                        {isVisiblePassword ? (
                                                            <EyeIcon size={18}/>
                                                        ) : (
                                                            <EyeOffIcon size={18}/>
                                                        )}
                                                    </button>
                                                }
                                                value={formResetPass.newPassword}
                                                onChange={(e) => setFormResetPass({...formResetPass, newPassword: e.target.value})}
                                            />
                                        </div>

                                        {/* Confirm Password field input */}
                                        <div className="grid gap-3">
                                            <Input
                                                key="reset-confirm-new-password"
                                                isRequired
                                                label="Xác nhận mật khẩu"
                                                labelPlacement="outside"
                                                placeholder="Nhập Lại Mật Khẩu"
                                                errorMessage="Vui lòng nhập mật khẩu xác nhận khớp với mật khẩu đã nhập"
                                                type={isVisibleConfirmPassword ? "text" : "password"}
                                                variant="faded"
                                                name="reset-confirm-new-password"
                                                data-lpignore="true"
                                                data-form-type="reset-password"
                                                readOnly
                                                onFocus={(e) => e.target.removeAttribute('readonly')}
                                                startContent={<MdOutlinePassword size={20} className="text-gray-500" />}
                                                endContent={
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-center"
                                                        onClick={() => setIsVisibleConfirmPassword(!isVisibleConfirmPassword)}
                                                    >
                                                        {isVisibleConfirmPassword ? (
                                                            <EyeIcon size={18}/>
                                                        ) : (
                                                            <EyeOffIcon size={18}/>
                                                        )}
                                                    </button>
                                                }
                                                value={formResetPass.confirmNewPassword}
                                                onChange={(e) => setFormResetPass({...formResetPass, confirmNewPassword: e.target.value})}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <div className="flex flex-col gap-4 w-full">
                                                <div className="flex flex-col justify-center items-start mt-4">
                                                    <Button 
                                                        type="button"
                                                        onClick={onSubmitResetPassword}
                                                        radius="sm" 
                                                        color="primary" 
                                                        variant="shadow" 
                                                        isLoading={isResettingPassword}
                                                        className="mt-4 w-full"
                                                    >
                                                        Đặt lại mật khẩu
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogFooter>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </DialogContent>
            )}
        </Dialog>
    );
};