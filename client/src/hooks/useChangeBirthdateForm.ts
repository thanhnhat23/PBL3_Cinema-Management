import { useState } from "react";
import { DateValue } from "@heroui/react";

export function useChangeBirthdateForm() {
  const [formChangeBirthdate, setFormChangeBirthdate] = useState({
    birthdate: null as DateValue | null,
  });

  const isChangeBirthdateFilled = formChangeBirthdate.birthdate !== null;

  const resetChangeBirthdateForm = () =>
    setFormChangeBirthdate({
      birthdate: null,
    });
    
  return { formChangeBirthdate, setFormChangeBirthdate, isChangeBirthdateFilled, resetChangeBirthdateForm };
}