import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import { Button, Input } from "@heroui/react"
import { Lock, ShieldCheck, KeyRound, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils";

interface FormChangePasswordProps {
    formChangePassword: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    };

    setFormChangePassword: (value: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }) => void;

    isVisiblePassword: boolean;
    setIsVisiblePassword: (value: boolean) => void;
    isVisibleConfirmPassword: boolean;
    setIsVisibleConfirmPassword: (value: boolean) => void;
    onSubmitChangePassword: () => void;
    isChangingPassword: boolean;
    isChangePasswordFilled: boolean;
}

export const FormChangePassword = ({
    formChangePassword,
    setFormChangePassword,
    isVisiblePassword,
    setIsVisiblePassword,
    isVisibleConfirmPassword,
    setIsVisibleConfirmPassword,
    onSubmitChangePassword,
    isChangingPassword,
    isChangePasswordFilled
}: FormChangePasswordProps) => {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300 p-4 md:p-0">
            <DialogHeader className="mb-8">
                <div className="flex flex-col items-center justify-center w-full gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-linear-to-r from-red-500/20 to-orange-600/20 rounded-2xl blur-xl" />
                        <div className="relative bg-white dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-lg">
                            <KeyRound size={32} className="text-orange-500" />
                        </div>
                    </div>

                    <div className="text-center space-y-1">
                        <DialogTitle className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white uppercase">
                            Đổi mật khẩu
                        </DialogTitle>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase opacity-80">
                            Bảo mật tài khoản của bạn
                        </p>
                    </div>
                </div>
            </DialogHeader>

            <div className="space-y-5 flex flex-col gap-2">
                <Input
                    key="change-current-password"
                    isRequired
                    label="Mật khẩu hiện tại"
                    labelPlacement="outside"
                    placeholder="Nhập mật khẩu đang sử dụng"
                    type="password"
                    variant="bordered"
                    classNames={{
                        label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                        inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-orange-500/50 focus-within:!border-orange-500 transition-all rounded-sm",
                        input: "text-sm font-medium",
                    }}
                    startContent={<Lock size={16} className="text-zinc-400" />}
                    value={formChangePassword.currentPassword}
                    autoComplete="one-time-code"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    onChange={(e) => setFormChangePassword({...formChangePassword, currentPassword: e.target.value})}
                />

                <Input
                    key="change-new-password"
                    isRequired
                    label="Mật khẩu mới"
                    labelPlacement="outside"
                    placeholder="Nhập mật khẩu mới"
                    type={isVisiblePassword ? "text" : "password"}
                    variant="bordered"
                    classNames={{
                        label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                        inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-orange-500/50 focus-within:!border-orange-500 transition-all rounded-sm",
                        input: "text-sm font-medium",
                    }}
                    startContent={<ShieldCheck size={16} className="text-zinc-400" />}
                    endContent={
                        <button
                            type="button"
                            className="p-1 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full"
                            onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                        >
                            {isVisiblePassword ? <Eye size={14} className="text-zinc-400" /> : <EyeOff size={14} className="text-zinc-400" />}
                        </button>
                    }
                    value={formChangePassword.newPassword}
                    autoComplete="new-password"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    onChange={(e) => setFormChangePassword({...formChangePassword, newPassword: e.target.value})}
                />

                <Input
                    key="change-confirm-new-password"
                    isRequired
                    label="Xác nhận mật khẩu"
                    labelPlacement="outside"
                    placeholder="Nhập lại mật khẩu mới"
                    type={isVisibleConfirmPassword ? "text" : "password"}
                    variant="bordered"
                    classNames={{
                        label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                        inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-orange-500/50 focus-within:!border-orange-500 transition-all rounded-sm",
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
                    value={formChangePassword.confirmNewPassword}
                    autoComplete="new-password"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    onChange={(e) => setFormChangePassword({...formChangePassword, confirmNewPassword: e.target.value})}
                />
            </div>

            <DialogFooter className="mt-10">
                <Button 
                    type="button"
                    onClick={onSubmitChangePassword}
                    isLoading={isChangingPassword}
                    isDisabled={!isChangePasswordFilled}
                    className={cn(
                        "w-full h-12 rounded-sm font-black text-sm uppercase tracking-widest transition-all duration-300",
                        isChangePasswordFilled 
                            ? "bg-linear-to-r from-red-500 to-orange-600 text-white shadow-[0_4px_15px_rgba(239,68,68,0.3)] hover:shadow-[0_8px_25px_rgba(239,68,68,0.4)]"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                    )}
                >
                    Xác nhận thay đổi
                </Button>
            </DialogFooter>
        </div>
    )
}