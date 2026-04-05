import { useState } from "react";
export function useResetPassForm() {
  const [formResetPass, setFormResetPass] = useState({
    email: "",
    resetToken: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const isResetPassFilled =
    formResetPass.email.trim() !== "" &&
    formResetPass.resetToken.trim() !== "" &&
    formResetPass.newPassword.trim() !== "" &&
    formResetPass.confirmNewPassword.trim() !== "";
  const isForgotPassFilled = formResetPass.email.trim() !== "";
  const isCheckResetPassFilled = formResetPass.email.trim() !== "" && formResetPass.resetToken.trim() !== "";
  const resetResetPassForm = () =>
    setFormResetPass({
      email: "",
      resetToken: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  return {
    formResetPass,
    setFormResetPass,
    isResetPassFilled,
    isForgotPassFilled,
    isCheckResetPassFilled,
    resetResetPassForm,
  };
}
