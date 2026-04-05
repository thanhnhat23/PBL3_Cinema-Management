'use client'

import { Dialog, DialogContent, DialogClose } from "../ui/dialog";
import { addToast, Button } from "@heroui/react";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useChangeEmailForm } from "@/hooks/useChangeEmailForm";
import { useSignInForm } from "@/hooks/useSignInForm";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import { useResetPassForm } from "@/hooks/useResetPassForm";
import { useChangePasswordForm } from "@/hooks/useChangePasswordForm";
import { useChangeBirthdateForm } from "@/hooks/useChangeBirthdateForm";
import { useChangeAvatarForm } from "@/hooks/useChangeAvatarForm";
import { useDialogStore } from "@/stores/useDialogStore";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import { FormChangeEmail } from "./DialogForms/FormChangeEmail";
import { FormChangePassword } from "./DialogForms/FormChangePassword";
import { FormResetPassword } from "./DialogForms/formResetPassword";
import { FormForgotPassword } from "./DialogForms/formForgotPassword";
import { FormChangeAvatar } from "./DialogForms/formChangeAvatar";
import { FormSignUp } from "./DialogForms/formSignUp";
import { FormSignIn } from "./DialogForms/formSignIn";
import { FormChangeBirthdate } from "./DialogForms/formChangeBirthdate";

export const AuthDialog = () => {
    const [isVisiblePassword, setIsVisiblePassword] = useState(false);
    const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false);

    const { 
        authUser,
        isSigningUp,
        isSigningIn, 
        isForgottingPassword, 
        isResettingPassword,
        isCheckingResetPassword, 
        isChangingPassword,
        isChangingEmail,
        isChangingBirthdate,
        isChangingAvatar,
        signup, 
        signin, 
        forgotPassword, 
        resetPassword,
        checkResetPassword, 
        changePassword,
        changeEmail,
        changeBirthdate,
        changeAvatar
    } = useAuthStore();
    const { openDialog, setOpenDialog } = useDialogStore();

    const {
        formSignIn,
        setFormSignIn,
        isSignInFilled,
        resetSignInForm
    } = useSignInForm();

    const {
        formSignUp,
        setFormSignUp,
        isSignUpFilled,
        resetSignUpForm
    } = useSignUpForm();

    const {
        formResetPass,
        setFormResetPass,
        isResetPassFilled,
        isForgotPassFilled,
        isCheckResetPassFilled,
        resetResetPassForm
    } = useResetPassForm();

    const {
        formChangePassword,
        setFormChangePassword,
        isChangePasswordFilled,
        resetChangePasswordForm
    } = useChangePasswordForm();

    const {
        formChangeEmail,
        setFormChangeEmail,
        isChangeEmailFilled,
        resetChangeEmailForm
    } = useChangeEmailForm(authUser?.email || "");

    const {
        formChangeBirthdate,
        setFormChangeBirthdate,
        isChangeBirthdateFilled,
        resetChangeBirthdateForm
    } = useChangeBirthdateForm();

    const {
        formChangeAvatar,
        setFormChangeAvatar,
        isChangeAvatarFilled,
        resetChangeAvatarForm
    } = useChangeAvatarForm();

    const resetForms = () => {
        resetSignInForm();
        resetSignUpForm();
        resetResetPassForm();
        resetChangePasswordForm();
        resetChangeEmailForm();
        resetChangeBirthdateForm();
        resetChangeAvatarForm();
    };

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
    };

    const onSubmitCheckResetPassword = async () => {
        await checkResetPassword(formResetPass.email, formResetPass.resetToken);
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
        setOpenDialog(null);
        resetForms();
    };

    const onSubmitChangePassword = async () => {
        if (!checkPasswordStrength(formChangePassword.newPassword)) {
            addToast({
                title: "Lỗi",
                description: "Mật khẩu chưa đủ mạnh (ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số).",
                color: "warning"
            });
            return;
        }

        if (formChangePassword.newPassword !== formChangePassword.confirmNewPassword) {
            addToast({
                title: "Lỗi",
                description: "Mật khẩu xác nhận không khớp!",
                color: "warning"
            });
            return;
        }

        await changePassword(formChangePassword.currentPassword, formChangePassword.newPassword);
        setOpenDialog(null);
        resetForms();
    };

    const onSubmitChangeEmail = async () => {
        if (formChangeEmail.newEmail !== formChangeEmail.currentEmail) {
            addToast({
                title: "Lỗi",
                description: "Email xác nhận không khớp!",
                color: "warning"
            });
            return;
        }

        await changeEmail(formChangeEmail.newEmail);
        setOpenDialog(null);
        resetForms();
    };

    const onSubmitChangeBirthdate = async () => {
        const birthdateIso = formChangeBirthdate.birthdate?.toDate('UTC').toISOString() ?? '';
        console.log("Submitting change birthdate with value:", birthdateIso);
        await changeBirthdate(birthdateIso);

        setOpenDialog(null);
        resetForms();
    };

    const onSubmitChangeAvatar = async () => {
        if (!formChangeAvatar.avatar) {
            addToast({
                title: "Lỗi",
                description: "Vui lòng chọn một ảnh đại diện để tiếp tục.",
                color: "warning"
            });
            return;
        }

        await changeAvatar(formChangeAvatar.avatar);
        setOpenDialog(null);
        resetForms();
    }

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
                                <FormSignIn 
                                    formSignIn={formSignIn}
                                    setFormSignIn={setFormSignIn}
                                    isVisiblePassword={isVisiblePassword}
                                    setIsVisiblePassword={setIsVisiblePassword}
                                    onSubmitSignIn={onSubmitSignIn}
                                    isSigningIn={isSigningIn}
                                    isSignInFilled={isSignInFilled}
                                    resetForms={resetForms}
                                    setOpenDialog={setOpenDialog}
                                />
                            )}

                            {openDialog === 'signup' && (
                                <FormSignUp 
                                    formSignUp={formSignUp}
                                    setFormSignUp={setFormSignUp}
                                    isVisiblePassword={isVisiblePassword}
                                    setIsVisiblePassword={setIsVisiblePassword}
                                    isVisibleConfirmPassword={isVisibleConfirmPassword}
                                    setIsVisibleConfirmPassword={setIsVisibleConfirmPassword}
                                    onSubmitSignUp={onSubmitSignUp}
                                    isSigningUp={isSigningUp}
                                    isSignUpFilled={isSignUpFilled}
                                    resetForms={resetForms}
                                    setOpenDialog={setOpenDialog}
                                />
                            )}

                            {openDialog === 'forgot-password' && (
                                <FormForgotPassword 
                                    formResetPass={formResetPass}
                                    setFormResetPass={setFormResetPass}
                                    onSubmitForgotPassword={onSubmitForgotPassword}
                                    isForgottingPassword={isForgottingPassword}
                                    isForgotPassFilled={isForgotPassFilled}
                                    onSubmitCheckResetPassword={onSubmitCheckResetPassword}
                                    isCheckingResetPassword={isCheckingResetPassword}
                                    isCheckResetPassFilled={isCheckResetPassFilled}
                                    resetForms={resetForms}
                                    setOpenDialog={setOpenDialog}
                                />
                            )}

                            {openDialog === 'reset-password' && (
                                <FormResetPassword 
                                    formResetPass={formResetPass}
                                    setFormResetPass={setFormResetPass}
                                    isVisiblePassword={isVisiblePassword}
                                    setIsVisiblePassword={setIsVisiblePassword}
                                    isVisibleConfirmPassword={isVisibleConfirmPassword}
                                    setIsVisibleConfirmPassword={setIsVisibleConfirmPassword}
                                    onSubmitResetPassword={onSubmitResetPassword}
                                    isResettingPassword={isResettingPassword}
                                    isResetPassFilled={isResetPassFilled}
                                />
                            )}
                            
                            {openDialog === 'change-password' && (
                                <FormChangePassword 
                                    formChangePassword={formChangePassword}
                                    setFormChangePassword={setFormChangePassword}
                                    isVisiblePassword={isVisiblePassword}
                                    setIsVisiblePassword={setIsVisiblePassword}
                                    isVisibleConfirmPassword={isVisibleConfirmPassword}
                                    setIsVisibleConfirmPassword={setIsVisibleConfirmPassword}
                                    onSubmitChangePassword={onSubmitChangePassword}
                                    isChangingPassword={isChangingPassword}
                                    isChangePasswordFilled={isChangePasswordFilled}
                                />
                            )}

                            {openDialog === 'change-email' && (
                                <FormChangeEmail 
                                    formChangeEmail={formChangeEmail}
                                    setFormChangeEmail={setFormChangeEmail}
                                    isVisiblePassword={isVisiblePassword}
                                    setIsVisiblePassword={setIsVisiblePassword}
                                    onSubmitChangeEmail={onSubmitChangeEmail}
                                    isChangingEmail={isChangingEmail}
                                    isChangeEmailFilled={isChangeEmailFilled}
                                />
                            )}

                            {openDialog === 'change-birthdate' && (
                                <FormChangeBirthdate
                                    formChangeBirthdate={formChangeBirthdate}
                                    setFormChangeBirthdate={setFormChangeBirthdate}
                                    onSubmitChangeBirthdate={onSubmitChangeBirthdate}
                                    isChangingBirthdate={isChangingBirthdate}
                                    isChangeBirthdateFilled={isChangeBirthdateFilled}
                                />
                            )}

                            {openDialog === 'settings' && (
                                <FormChangeAvatar
                                    formChangeAvatar={formChangeAvatar}
                                    setFormChangeAvatar={setFormChangeAvatar}
                                    onSubmitChangeAvatar={onSubmitChangeAvatar}
                                    isChangingAvatar={isChangingAvatar}
                                    isChangeAvatarFilled={isChangeAvatarFilled}
                                    avatarPath={authUser?.avatar || "https://i.pinimg.com/1200x/dc/00/eb/dc00ebc8d85a3cf802aecb502cf7e212.jpg"}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </DialogContent>
            )}
        </Dialog>
    );
};