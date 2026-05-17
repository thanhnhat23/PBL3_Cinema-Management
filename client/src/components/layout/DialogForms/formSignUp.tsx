import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import { Button, DatePicker, type DateValue, Input } from "@heroui/react";
import Image from "next/image"
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface FormSignUpProps {
    formSignUp: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
        birthdate: DateValue | null;
    };

    setFormSignUp: (value: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
        birthdate: DateValue | null;
    }) => void;

    isVisiblePassword: boolean;
    setIsVisiblePassword: (value: boolean) => void;
    isVisibleConfirmPassword: boolean;
    setIsVisibleConfirmPassword: (value: boolean) => void;
    onSubmitSignUp: () => void;
    isSigningUp: boolean;
    isSignUpFilled: boolean;
    resetForms: () => void;
    setOpenDialog: (dialog: "signin" | "signup" | "forgot-password" | "reset-password" | "change-password" | "change-email" | null) => void;
}

export const FormSignUp = ({
    formSignUp,
    setFormSignUp,
    isVisiblePassword,
    setIsVisiblePassword,
    isVisibleConfirmPassword,
    setIsVisibleConfirmPassword,
    onSubmitSignUp,
    isSigningUp,
    isSignUpFilled,
    resetForms,
    setOpenDialog
}: FormSignUpProps) => {
    const { t } = useTranslation();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-h-[85vh] overflow-y-auto px-1 custom-scrollbar p-4 md:p-0">
            <DialogHeader className="mb-8">
                <div className="flex flex-col items-center justify-center w-full gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-linear-to-r from-fuchsia-500/20 to-pink-600/20 rounded-full blur-2xl group-hover:opacity-100 transition duration-1000 opacity-70" />
                            <div className="relative p-4">
                                <Image 
                                    src="/logo.png" 
                                    alt="MilkyWayyy Logo" 
                                    className="h-24 w-auto object-contain"
                                    width={80}
                                    height={80}
                                />
                            </div>
                        </div>

                    <div className="text-center space-y-1">
                        <DialogTitle className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white uppercase">
                            {t('auth.create_account')}
                        </DialogTitle>
                        <p className="text-xs font-bold text-amber-500 uppercase opacity-80">
                            {t('auth.join_us')}
                        </p>
                    </div>
                </div>
            </DialogHeader>

            <div className="grid gap-5">
                <Input 
                    key="signup-username"
                    isRequired
                    label={t('auth.username')} 
                    labelPlacement="outside"
                    placeholder={t('auth.username_signup_placeholder')}
                    type="text" 
                    variant="bordered"
                    classNames={{
                        label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                        inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-amber-500/50 focus-within:!border-amber-500 transition-all rounded-sm",
                        input: "text-sm font-medium",
                    }}
                    startContent={<User size={16} className="text-zinc-400" />}
                    value={formSignUp.username}
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    onChange={(e) => setFormSignUp({
                        ...formSignUp,
                        username: e.target.value.trimEnd()
                    })}
                />

                <Input 
                    key="signup-email"
                    isRequired
                    label={t('auth.email')} 
                    labelPlacement="outside"
                    placeholder={t('auth.email_placeholder')}
                    type="email" 
                    variant="bordered"
                    classNames={{
                        label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                        inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-amber-500/50 focus-within:!border-amber-500 transition-all rounded-sm",
                        input: "text-sm font-medium",
                    }}
                    startContent={<Mail size={16} className="text-zinc-400" />}
                    value={formSignUp.email}
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    onChange={(e) => setFormSignUp({...formSignUp, email: e.target.value})}
                />

                <DatePicker
                    key="signup-birthdate"
                    isRequired
                    label={t('auth.birthdate')}
                    labelPlacement="outside"
                    variant="bordered"
                    selectorButtonPlacement="start"
                    showMonthAndYearPickers
                    value={formSignUp.birthdate}
                    onChange={(date) => setFormSignUp({...formSignUp, birthdate: date})}
                    classNames={{
                        label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                        inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-amber-500/50 transition-all rounded-sm",
                        selectorButton: "text-zinc-400",
                    }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        key="signup-password"
                        isRequired
                        label={t('auth.password')}
                        labelPlacement="outside"
                        placeholder={t('auth.password_signup_placeholder')}
                        type={isVisiblePassword ? "text" : "password"}
                        variant="bordered"
                        classNames={{
                            label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                            inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-amber-500/50 focus-within:!border-amber-500 transition-all rounded-sm",
                            input: "text-sm font-medium",
                        }}
                        startContent={<Lock size={16} className="text-zinc-400" />}
                        endContent={
                            <button
                                type="button"
                                className="p-1 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full"
                                onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                            >
                                {isVisiblePassword ? <Eye size={14} className="text-zinc-400" /> : <EyeOff size={14} className="text-zinc-400" />}
                            </button>
                        }
                        value={formSignUp.password}
                        autoComplete="new-password"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        onChange={(e) => setFormSignUp({...formSignUp, password: e.target.value})}
                    />

                    <Input
                        key="signup-confirm-password"
                        isRequired
                        label={t('auth.confirm_password')}
                        labelPlacement="outside"
                        placeholder={t('auth.confirm_password_placeholder')}
                        type={isVisibleConfirmPassword ? "text" : "password"}
                        variant="bordered"
                        classNames={{
                            label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                            inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-amber-500/50 focus-within:!border-amber-500 transition-all rounded-sm",
                            input: "text-sm font-medium",
                        }}
                        startContent={<ShieldCheck size={16} className="text-zinc-400" />}
                        endContent={
                            <button
                                type="button"
                                className="p-1 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full"
                                onClick={() => setIsVisibleConfirmPassword(!isVisibleConfirmPassword)}
                            >
                                {isVisibleConfirmPassword ? <Eye size={14} className="text-zinc-400" /> : <EyeOff size={14} className="text-zinc-400" />}
                            </button>
                        }
                        value={formSignUp.confirmPassword}
                        autoComplete="new-password"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        onChange={(e) => setFormSignUp({...formSignUp, confirmPassword: e.target.value})}
                    />
                </div>
            </div>

            <DialogFooter className="mt-10">
                <div className="flex flex-col gap-6 w-full">
                    <Button 
                        type="button"
                        onClick={onSubmitSignUp}
                        isLoading={isSigningUp}
                        isDisabled={!isSignUpFilled}
                        className={cn(
                            "w-full h-12 rounded-sm font-bold text-sm uppercase tracking-widest transition-all duration-300",
                            isSignUpFilled 
                                ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-[0_4px_15px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.5)]"
                                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                        )}
                    >
                        {t('auth.register_button')}
                    </Button>

                    <div className="text-center pb-4">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                            {t('auth.already_have_account')}{" "}
                            <button 
                                type="button"
                                onClick={() => {
                                    resetForms();
                                    setOpenDialog('signin');
                                }}
                                className="text-amber-500 font-semibold cursor-pointer hover:underline underline-offset-4"
                            >
                                {t('auth.login_now')}
                            </button>
                        </p>
                    </div>
                </div>
            </DialogFooter>
        </div>
    )
}