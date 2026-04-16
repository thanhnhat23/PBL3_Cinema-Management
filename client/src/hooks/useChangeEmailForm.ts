import { useState } from "react";

export function useChangeEmailForm(authUserEmail: string) {
  const [formChangeEmail, setFormChangeEmail] = useState({
    currentEmail: authUserEmail || "",
    newEmail: "",
    password: "",
  });

  const isChangeEmailFilled =
    formChangeEmail.currentEmail.trim() !== "" &&
    formChangeEmail.newEmail.trim() !== "" &&
    formChangeEmail.password.trim() !== "";

  const resetChangeEmailForm = () =>
    setFormChangeEmail({
      currentEmail: authUserEmail || "",
      newEmail: "",
      password: "",
    });

  return {
    formChangeEmail,
    setFormChangeEmail,
    isChangeEmailFilled,
    resetChangeEmailForm,
  };
}
