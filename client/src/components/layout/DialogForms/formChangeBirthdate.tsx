import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import { DatePicker, DateValue, Button } from "@heroui/react";
import Image from "next/image";

interface FormChangeBirthdateProps {
    formChangeBirthdate: {
        birthdate: DateValue | null;
    };

    setFormChangeBirthdate: (value: {
        birthdate: DateValue | null;
    }) => void;

    onSubmitChangeBirthdate: () => void;

    isChangingBirthdate: boolean;
    isChangeBirthdateFilled: boolean;
}

export const FormChangeBirthdate = ({
    formChangeBirthdate,
    setFormChangeBirthdate,
    onSubmitChangeBirthdate,
    isChangingBirthdate,
    isChangeBirthdateFilled,
}: FormChangeBirthdateProps) => {
    return (
        <>
            <DialogHeader>
                <div className="flex flex-col items-center justify-center w-full">
                    <DialogTitle className="text-center text-2xl font-bold mb-2">
                        Đổi ngày sinh
                    </DialogTitle>

                    <div className="relative inline-flex items-center justify-center">
                        <span className="pointer-events-none absolute h-26 w-26 rounded-full bg-purple-500/55 blur-2xl animate-pulse" />
                        <span className="pointer-events-none absolute h-32 w-32 rounded-full bg-fuchsia-400/50 blur-3xl" />
                        <Image 
                            src="/logo.png" 
                            alt="Profile image" 
                            className="rounded-md h-36 object-cover relative z-10"
                            width={150}
                            height={150}
                        />
                    </div>
                </div>
            </DialogHeader>

            <div className="grid gap-4">
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
                        value={formChangeBirthdate.birthdate}
                        onChange={(date) => setFormChangeBirthdate({...formChangeBirthdate, birthdate: date})}
                        classNames={{
                            selectorIcon: "text-zinc-500"
                        }}
                    />
                </div>
            </div>

            <DialogFooter>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex justify-end items-center">
                        <Button 
                            type="button"
                            onClick={onSubmitChangeBirthdate}
                            radius="sm" 
                            color="primary" 
                            variant="shadow" 
                            isLoading={isChangingBirthdate}
                            className="w-full mt-8"
                            isDisabled={!isChangeBirthdateFilled}
                        >
                            Đổi ngày sinh
                        </Button>
                    </div>
                </div>
            </DialogFooter>
        </>
    )
}