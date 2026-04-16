import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Button, Input } from "@heroui/react"
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { EyeIcon } from "@/components/icons/eye"
import { EyeOffIcon } from "@/components/icons/eye-off"
import Link from "next/link";

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
        <>
            <DialogHeader>
                <div className="flex flex-col items-center justify-center w-full">
                    <DialogTitle className="text-center text-2xl font-bold mb-2">
                        Đăng nhập
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
                {/* Username field input */}
                <div className="grid gap-3">
                    <Input 
                        key="signin-username"
                        isRequired
                        isClearable
                        label="Tên đăng nhập" 
                        labelPlacement="outside"
                        placeholder="Nhập Tên Đăng Nhập"
                        errorMessage="Vui lòng nhập tên đăng nhập không bỏ trống"
                        type="text" 
                        variant="faded"
                        name="signin-username"
                        data-lpignore="true"
                        data-form-type="signin"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        startContent={<FaUser size={16} className="text-gray-500" />}
                        value={formSignIn.username}
                        onChange={(e) => setFormSignIn({
                            ...formSignIn,
                            username: e.target.value.trimEnd()
                        })}
                        onClear={() => setFormSignIn({ ...formSignIn, username: "" })}
                    />
                </div>

                {/* Password field input */}
                <div className="grid gap-3">
                    <Input
                        key="signin-password"
                        isRequired
                        label="Mật khẩu"
                        labelPlacement="outside"
                        placeholder="Nhập Mật Khẩu"
                        errorMessage="Vui lòng nhập mật khẩu không bỏ trống"
                        type={isVisiblePassword ? "text" : "password"}
                        variant="faded"
                        name="signin-password"
                        data-lpignore="true"
                        data-form-type="signin"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        startContent={<RiLockPasswordFill size={20} className="text-gray-500" />}
                        endContent={
                            <button
                                type="button"
                                className="flex items-center justify-center"
                                onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                            >
                                {isVisiblePassword ? (
                                    <EyeIcon size={18}/>
                                ) : (
                                    <EyeOffIcon size={18}/>
                                )}
                            </button>
                        }
                        value={formSignIn.password}
                        onChange={(e) => setFormSignIn({...formSignIn, password: e.target.value})}
                    />
                </div>
            </div>
            <DialogFooter>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col justify-center items-start mt-4">
                        <Link 
                            href="#" 
                            className="text-sm text-primary underline underline-offset-4"
                            onClick={() => {
                                setOpenDialog('forgot-password')
                            }}
                        >
                            Quên mật khẩu?
                        </Link>

                        <Button 
                            type="button"
                            onClick={onSubmitSignIn}
                            radius="sm" 
                            color="primary" 
                            variant="shadow" 
                            isLoading={isSigningIn}
                            className="mt-4 w-full"
                            isDisabled={!isSignInFilled}
                        >
                            Đăng nhập
                        </Button>
                    </div>

                    <hr />

                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Chưa có tài khoản? </span>
                        <Button 
                            type="button"
                            onClick={() => {
                                resetForms();
                                setOpenDialog('signup');
                            }}
                            radius="sm" 
                            color="primary" 
                            variant="faded" 
                        >
                            Đăng ký
                        </Button>
                    </div>
                </div>
            </DialogFooter>
        </>
    )
}