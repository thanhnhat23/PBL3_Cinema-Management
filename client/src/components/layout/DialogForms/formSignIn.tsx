import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Button, Input } from "@heroui/react"
import { User, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FormSignInProps {
    formSignIn: {
        username: string;
        password: string;
    };

    setFormSignIn: (value: {
        username: string;
        password: string;
    }) => void;

    isVisiblePassword: boolean;
    setIsVisiblePassword: (value: boolean) => void;
    onSubmitSignIn: () => void;
    isSigningIn: boolean;
    isSignInFilled: boolean;
    resetForms: () => void;
    setOpenDialog: (dialog: "signin" | "signup" | "forgot-password" | "reset-password" | "change-password" | "change-email" | null) => void;
}

export const FormSignIn = ({
    formSignIn,
    setFormSignIn,
    isVisiblePassword,
    setIsVisiblePassword,
    onSubmitSignIn,
    isSigningIn,
    isSignInFilled,
    resetForms,
    setOpenDialog
}: FormSignInProps) => {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300 p-4 md:p-0">
            <DialogHeader className="mb-8">
                <div className="flex flex-col items-center justify-center w-full gap-6">
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
                            Chào mừng trở lại
                        </DialogTitle>
                        <p className="text-xs font-bold text-amber-500 uppercase opacity-80">
                            Đăng nhập vào tài khoản của bạn
                        </p>
                    </div>
                </div>
            </DialogHeader>

            <div className="space-y-6 flex flex-col gap-2">
                <Input 
                    key="signin-username"
                    isRequired
                    label="Tên đăng nhập" 
                    labelPlacement="outside"
                    placeholder="Nhập tên đăng nhập của bạn"
                    type="text" 
                    variant="bordered"
                    classNames={{
                        label: "text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-widest",
                        inputWrapper: "h-12 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-amber-500/50 focus-within:!border-amber-500 transition-all rounded-sm",
                        input: "text-sm font-medium",
                    }}
                    startContent={<User size={18} className="text-zinc-400" />}
                    value={formSignIn.username}
                    autoComplete="username"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    onChange={(e) => setFormSignIn({
                        ...formSignIn,
                        username: e.target.value.trim()
                    })}
                />

                <div className="space-y-2">
                    <Input
                        key="signin-password"
                        isRequired
                        label="Mật khẩu"
                        labelPlacement="outside"
                        placeholder="Nhập mật khẩu"
                        type={isVisiblePassword ? "text" : "password"}
                        variant="bordered"
                        classNames={{
                            label: "text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-widest",
                            inputWrapper: "h-12 border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 hover:border-amber-500/50 focus-within:!border-amber-500 transition-all rounded-sm",
                            input: "text-sm font-medium",
                        }}
                        startContent={<Lock size={18} className="text-zinc-400" />}
                        endContent={
                            <button
                                type="button"
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors"
                                onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                            >
                                {isVisiblePassword ? (
                                    <Eye size={18} className="text-zinc-400" />
                                ) : (
                                    <EyeOff size={18} className="text-zinc-400" />
                                )}
                            </button>
                        }
                        value={formSignIn.password}
                        autoComplete="current-password"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        onChange={(e) => setFormSignIn({...formSignIn, password: e.target.value})}
                    />
                    
                    <div className="flex justify-end pt-2">
                        <Link 
                            href="#" 
                            className="text-sm font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                            onClick={() => setOpenDialog('forgot-password')}
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                </div>
            </div>

            <DialogFooter className="mt-10">
                <div className="flex flex-col gap-6 w-full">
                    <Button 
                        type="button"
                        onClick={onSubmitSignIn}
                        isLoading={isSigningIn}
                        isDisabled={!isSignInFilled}
                        className={cn(
                            "w-full h-12 rounded-sm font-bold text-sm uppercase tracking-widest transition-all duration-300",
                            isSignInFilled 
                                ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-[0_4px_15px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 active:translate-y-0"
                                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                        )}
                    >
                        Đăng nhập ngay
                    </Button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200 dark:border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-zinc-950 px-4 text-zinc-500 font-bold">Hoặc</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                            Chưa có tài khoản?{" "}
                            <button 
                                type="button"
                                onClick={() => {
                                    resetForms();
                                    setOpenDialog('signup');
                                }}
                                className="text-amber-500 font-semibold hover:underline underline-offset-4 cursor-pointer"
                            >
                                Đăng kí ngay
                            </button>
                        </p>
                    </div>
                </div>
            </DialogFooter>
        </div>
    )
}