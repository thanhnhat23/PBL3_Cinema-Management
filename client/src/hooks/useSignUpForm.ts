import { useState } from "react";
import { DateValue } from "@heroui/react";

export function useSignUpForm() {
  const [formSignUp, setFormSignUp] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: null as DateValue | null,
  });
  const isSignUpFilled =
    formSignUp.username.trim() !== "" &&
    formSignUp.email.trim() !== "" &&
    formSignUp.password.trim() !== "" &&
    formSignUp.confirmPassword.trim() !== "" &&
    formSignUp.birthdate !== null;
  const resetSignUpForm = () =>
    setFormSignUp({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthdate: null,
    });
  return { formSignUp, setFormSignUp, isSignUpFilled, resetSignUpForm };
}
