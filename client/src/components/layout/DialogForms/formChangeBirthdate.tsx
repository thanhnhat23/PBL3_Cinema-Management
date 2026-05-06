import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import { DatePicker, DateValue, Button } from "@heroui/react";
import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils";

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
        <div className="animate-in fade-in zoom-in-95 duration-300 p-4 md:p-0">
            <DialogHeader className="mb-8">
                <div className="flex flex-col items-center justify-center w-full gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-linear-to-r from-amber-500/20 to-orange-600/20 rounded-2xl blur-xl" />
                        <div className="relative bg-white dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-lg">
                            <CalendarDays size={32} className="text-amber-500" />
                        </div>
                    </div>

                    <div className="text-center space-y-1">
                        <DialogTitle className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white uppercase">
                            Cập nhật Ngày sinh
                        </DialogTitle>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase opacity-80">
                            Hãy cho chúng tôi biết ngày vui của bạn
                        </p>
                    </div>
                </div>
            </DialogHeader>

            <div className="space-y-6">
                <DatePicker
                    key="change-birthdate-picker"
                    isRequired
                    label="Ngày sinh mới"
                    labelPlacement="outside"
                    variant="bordered"
                    selectorButtonPlacement="start"
                    showMonthAndYearPickers
                    value={formChangeBirthdate.birthdate}
                    onChange={(date) => setFormChangeBirthdate({...formChangeBirthdate, birthdate: date})}
                    classNames={{
                        label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                        inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-amber-500/50 transition-all rounded-sm",
                        selectorButton: "text-zinc-400",
                    }}
                />
            </div>

            <DialogFooter className="mt-10">
                <Button 
                    type="button"
                    onClick={onSubmitChangeBirthdate}
                    isLoading={isChangingBirthdate}
                    isDisabled={!isChangeBirthdateFilled}
                    className={cn(
                        "w-full h-12 rounded-sm font-bold text-sm uppercase tracking-widest transition-all duration-300",
                        isChangeBirthdateFilled 
                            ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.4)]"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                    )}
                >
                    Cập nhật ngay
                </Button>
            </DialogFooter>
        </div>
    );
}