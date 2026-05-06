import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import { Button, Input } from "@heroui/react"
import { Lock, ShieldCheck, RefreshCcw, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils";

interface FormResetPasswordProps {
    formResetPass: {
        email: string;
        resetToken: string;
        newPassword: string;
        confirmNewPassword: string;
    };
    setFormResetPass: (value: {
        email: string;
        resetToken: string;
        newPassword: string;
        confirmNewPassword: string;
    }) => void;

    isVisiblePassword: boolean;
    setIsVisiblePassword: (value: boolean) => void;
    isVisibleConfirmPassword: boolean;
    setIsVisibleConfirmPassword: (value: boolean) => void;
    onSubmitResetPassword: () => void;
    isResettingPassword: boolean;
    isResetPassFilled: boolean;
}

export const FormResetPassword = ({
    formResetPass,
    setFormResetPass,
    isVisiblePassword,
    setIsVisiblePassword,
    isVisibleConfirmPassword,
    setIsVisibleConfirmPassword,
    onSubmitResetPassword,
    isResettingPassword,
    isResetPassFilled
}: FormResetPasswordProps) => {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300 p-4 md:p-0">
            <DialogHeader className="mb-8">
                <div className="flex flex-col items-center justify-center w-full gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-linear-to-r from-emerald-500/20 to-teal-600/20 rounded-2xl blur-xl" />
                        <div className="relative bg-white dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-lg">
                            <RefreshCcw size={32} className="text-emerald-500" />
                        </div>
                    </div>

                    <div className="text-center space-y-1">
                        <DialogTitle className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white uppercase">
                            Đặt lại mật khẩu
                        </DialogTitle>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase opacity-80">
                            Thiết lập mật khẩu mới cho tài khoản
                        </p>
                    </div>
                </div>
            </DialogHeader>

            <div className="space-y-6 flex flex-col gap-2">
                <Input
                    key="reset-new-password"
                    isRequired
                    label="Mật khẩu mới"
                    labelPlacement="outside"
                    placeholder="Nhập mật khẩu mới của bạn"
                    type={isVisiblePassword ? "text" : "password"}
                    variant="bordered"
                    classNames={{
                        label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                        inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-emerald-500/50 focus-within:!border-emerald-500 transition-all rounded-sm",
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
                    value={formResetPass.newPassword}
                    autoComplete="new-password"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    onChange={(e) => setFormResetPass({...formResetPass, newPassword: e.target.value})}
                />

                <Input
                    key="reset-confirm-new-password"
                    isRequired
                    label="Xác nhận mật khẩu mới"
                    labelPlacement="outside"
                    placeholder="Nhập lại mật khẩu mới"
                    type={isVisibleConfirmPassword ? "text" : "password"}
                    variant="bordered"
                    classNames={{
                        label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                        inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-emerald-500/50 focus-within:!border-emerald-500 transition-all rounded-sm",
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
                    value={formResetPass.confirmNewPassword}
                    autoComplete="new-password"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    onChange={(e) => setFormResetPass({...formResetPass, confirmNewPassword: e.target.value})}
                />
            </div>

            <DialogFooter className="mt-10">
                <Button 
                    type="button"
                    onClick={onSubmitResetPassword}
                    isLoading={isResettingPassword}
                    isDisabled={!isResetPassFilled}
                    className={cn(
                        "w-full h-12 rounded-sm font-bold text-sm uppercase tracking-widest transition-all duration-300",
                        isResetPassFilled 
                            ? "bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)]"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                    )}
                >
                    Đặt lại mật khẩu ngay
                </Button>
            </DialogFooter>
        </div>
    )
}