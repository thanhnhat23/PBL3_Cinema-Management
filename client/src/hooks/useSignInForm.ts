import { useState } from "react";
export function useSignInForm() {
  const [formSignIn, setFormSignIn] = useState({ username: "", password: "" });
  const isSignInFilled = formSignIn.username.trim() !== "" && formSignIn.password.trim() !== "";
  const resetSignInForm = () => setFormSignIn({ username: "", password: "" });
  return { formSignIn, setFormSignIn, isSignInFilled, resetSignInForm };
}
