import { useState } from "react";
export function useChangePasswordForm() {
  const [formChangePassword, setFormChangePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const isChangePasswordFilled =
    formChangePassword.currentPassword.trim() !== "" &&
    formChangePassword.newPassword.trim() !== "" &&
    formChangePassword.confirmNewPassword.trim() !== "";
  const resetChangePasswordForm = () =>
    setFormChangePassword({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  return { formChangePassword, setFormChangePassword, isChangePasswordFilled, resetChangePasswordForm };
}
