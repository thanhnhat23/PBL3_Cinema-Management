import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import { Button, Input, InputOtp } from "@heroui/react"
import { Mail, Send, Fingerprint } from "lucide-react"
import { cn } from "@/lib/utils";

interface FormForgotPasswordProps {
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

    onSubmitForgotPassword: () => void;
    isForgottingPassword: boolean;
    isForgotPassFilled: boolean;
    onSubmitCheckResetPassword: () => void;
    isCheckingResetPassword: boolean;
    isCheckResetPassFilled: boolean;
    resetForms: () => void;
    setOpenDialog: (dialog: "signin" | "signup" | "forgot-password" | "reset-password" | "change-password" | "change-email" | null) => void;
}

export const FormForgotPassword = ({
    formResetPass,
    setFormResetPass,
    onSubmitForgotPassword,
    isForgottingPassword,
    isForgotPassFilled,
    onSubmitCheckResetPassword,
    isCheckingResetPassword,
    isCheckResetPassFilled,
    resetForms,
    setOpenDialog
}: FormForgotPasswordProps) => {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300 p-4 md:p-0">
            <DialogHeader className="mb-8">
                <div className="flex flex-col items-center justify-center w-full gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-linear-to-r from-purple-500/20 to-pink-600/20 rounded-2xl blur-xl" />
                        <div className="relative bg-white dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-lg">
                            <Fingerprint size={32} className="text-purple-500" />
                        </div>
                    </div>

                    <div className="text-center space-y-1">
                        <DialogTitle className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white uppercase">
                            Quên mật khẩu?
                        </DialogTitle>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase opacity-80 text-center max-w-62.5">
                            Nhập email để nhận mã khôi phục tài khoản
                        </p>
                    </div>
                </div>
            </DialogHeader>
 
            <div className="space-y-8 flex flex-col gap-2">
                <div className="flex items-end gap-3">
                    <Input 
                        key="reset-email"
                        isRequired
                        label="Địa chỉ Email" 
                        labelPlacement="outside"
                        placeholder="Nhập email của bạn"
                        type="email" 
                        variant="bordered"
                        classNames={{
                            label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                            inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-purple-500/50 focus-within:!border-purple-500 transition-all rounded-sm",
                            input: "text-sm font-medium",
                        }}
                        startContent={<Mail size={16} className="text-zinc-400" />}
                        value={formResetPass.email}
                        onChange={(e) => setFormResetPass({
                            ...formResetPass,
                            email: e.target.value.trimEnd()
                        })}
                    />

                    <Button 
                        isIconOnly
                        type="button"
                        onClick={onSubmitForgotPassword}
                        isLoading={isForgottingPassword}
                        isDisabled={!isForgotPassFilled}
                        className={cn(
                            "w-12 h-11 rounded-sm transition-all duration-300",
                            isForgotPassFilled
                                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-600"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                        )}
                    >
                        <Send size={18}/>
                    </Button>
                </div>

                <div className="flex flex-col items-center gap-4 p-6 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-dashed border-zinc-200 dark:border-white/10">
                    <span className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Mã xác thực OTP</span>
                    <InputOtp 
                        isRequired
                        variant="faded"
                        length={6}
                        value={formResetPass.resetToken}
                        onValueChange={(value) => setFormResetPass({...formResetPass, resetToken: value})}
                        classNames={{
                            segment: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 h-12 w-10 text-lg font-black text-amber-500 rounded-sm"
                        }}
                    />  
                    <p className="text-[10px] text-zinc-400 font-medium italic">Vui lòng kiểm tra hộp thư đến hoặc thư rác</p>
                </div>
            </div>

            <DialogFooter className="mt-10">
                <div className="flex flex-col gap-6 w-full text-center">
                    <Button 
                        type="button"
                        onClick={onSubmitCheckResetPassword}
                        isLoading={isCheckingResetPassword}
                        isDisabled={!isCheckResetPassFilled}
                        className={cn(
                            "w-full h-12 rounded-sm font-bold text-sm uppercase tracking-widest transition-all duration-300",
                            isCheckResetPassFilled 
                                ? "bg-linear-to-r from-purple-500 to-pink-600 text-white shadow-[0_4px_15px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_25px_rgba(168,85,247,0.4)]"
                                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                        )}
                    >
                        Xác nhận mã OTP
                    </Button>

                    <button 
                        type="button"
                        onClick={() => {
                            resetForms();
                            setOpenDialog('signin');
                        }}
                        className="text-sm cursor-pointer font-semibold text-zinc-400 hover:text-amber-500 transition-colors tracking-widest"
                    >
                        Quay lại đăng nhập
                    </button>
                </div>
            </DialogFooter>
        </div>
    )
}