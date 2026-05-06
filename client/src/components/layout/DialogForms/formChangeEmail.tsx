import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import { Button, Input } from "@heroui/react"
import { Mail, Lock, Eye, EyeOff, MailCheck } from "lucide-react"
import { cn } from "@/lib/utils";

interface FormChangeEmailProps {
    formChangeEmail: {
        currentEmail: string;
        newEmail: string;
        password: string;
    };

    setFormChangeEmail: (value: {
        currentEmail: string;
        newEmail: string;
        password: string;
    }) => void;

    isVisiblePassword: boolean;
    setIsVisiblePassword: (value: boolean) => void;
    onSubmitChangeEmail: () => void;
    isChangingEmail: boolean;
    isChangeEmailFilled: boolean;
}

export const FormChangeEmail = ({
    formChangeEmail,
    setFormChangeEmail,
    isVisiblePassword,
    setIsVisiblePassword,
    onSubmitChangeEmail,
    isChangingEmail,
    isChangeEmailFilled
}: FormChangeEmailProps) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 p-4 md:p-0">
            <DialogHeader className="mb-8">
                <div className="flex flex-col items-center justify-center w-full gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-linear-to-r from-blue-500/20 to-indigo-600/20 rounded-2xl blur-xl" />
                        <div className="relative bg-white dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-lg">
                            <MailCheck size={32} className="text-blue-500" />
                        </div>
                    </div>

                    <div className="text-center space-y-1">
                        <DialogTitle className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white uppercase">
                            Thay đổi Email
                        </DialogTitle>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase opacity-80">
                            Cập nhật thông tin liên lạc của bạn
                        </p>
                    </div>
                </div>
            </DialogHeader>

            <div className="space-y-6 flex flex-col gap-2">
                <Input 
                    key="change-new-email"
                    isRequired
                    label="Địa chỉ Email mới" 
                    labelPlacement="outside"
                    placeholder="Nhập địa chỉ email mới"
                    type="email" 
                    variant="bordered"
                    classNames={{
                        label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                        inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-blue-500/50 focus-within:!border-blue-500 transition-all rounded-sm",
                        input: "text-sm font-medium",
                    }}
                    startContent={<Mail size={16} className="text-zinc-400" />}
                    value={formChangeEmail.newEmail}
                    onChange={(e) => setFormChangeEmail({
                        ...formChangeEmail,
                        newEmail: e.target.value.trimEnd()
                    })}
                />

                <Input
                    key="confirm-password-email"
                    isRequired
                    label="Xác nhận mật khẩu"
                    labelPlacement="outside"
                    placeholder="Nhập mật khẩu để xác nhận"
                    type={isVisiblePassword ? "text" : "password"}
                    variant="bordered"
                    classNames={{
                        label: "text-zinc-500 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest",
                        inputWrapper: "h-11 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-blue-500/50 focus-within:!border-blue-500 transition-all rounded-sm",
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
                    value={formChangeEmail.password}
                    onChange={(e) => setFormChangeEmail({...formChangeEmail, password: e.target.value})}
                />
            </div>

            <DialogFooter className="mt-10">
                <Button 
                    type="button"
                    onClick={onSubmitChangeEmail}
                    isLoading={isChangingEmail}
                    isDisabled={!isChangeEmailFilled}
                    className={cn(
                        "w-full h-12 rounded-sm font-bold text-sm uppercase tracking-widest transition-all duration-300",
                        isChangeEmailFilled 
                            ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.4)]"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                    )}
                >
                    Cập nhật Email
                </Button>
            </DialogFooter>
        </div>
    )
}