import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import { MdOutlinePassword } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { Button, DatePicker, type DateValue, Input } from "@heroui/react";
import Image from "next/image"
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { EyeIcon } from "@/components/icons/eye"
import { EyeOffIcon } from "@/components/icons/eye-off"

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
    return (
        <>
            <DialogHeader>
                <div className="flex flex-col items-center justify-center w-full mb-4">
                    <Image 
                        src="/logo.png" 
                        alt="Profile image" 
                        className="rounded-md h-36 object-cover mb-2"
                        width={150}
                        height={150}
                    />
                    <DialogTitle>
                        Đăng ký tài khoản
                    </DialogTitle>
                </div>
            </DialogHeader>
            <div className="grid gap-4">
                {/* Username field input */}
                <div className="grid gap-3">
                    <Input 
                        key="signup-username"
                        isRequired
                        isClearable
                        label="Tên đăng nhập" 
                        labelPlacement="outside"
                        placeholder="Nhập Tên Đăng Nhập"
                        errorMessage="Vui lòng nhập tên đăng nhập không bỏ trống"
                        type="text" 
                        variant="faded"
                        name="signup-username"
                        data-lpignore="true"
                        data-form-type="signup"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        startContent={<FaUser size={14} className="text-gray-500" />}
                        value={formSignUp.username}
                        onChange={(e) => setFormSignUp({
                            ...formSignUp,
                            username: e.target.value.trimEnd()
                        })}
                        onClear={() => setFormSignUp({ ...formSignUp, username: "" })}
                    />
                </div>

                {/* Email field input */}
                <div className="grid gap-3">
                    <Input 
                        key="signup-email"
                        isRequired
                        isClearable
                        label="Tên email" 
                        labelPlacement="outside"
                        placeholder="Nhập Tên Email"
                        errorMessage="Vui lòng nhập email không bỏ trống"
                        type="email" 
                        variant="faded"
                        name="signup-email"
                        data-lpignore="true"
                        data-form-type="signup"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        startContent={<IoIosMail size={20} className="text-gray-500" />}
                        value={formSignUp.email}
                        onChange={(e) => setFormSignUp({...formSignUp, email: e.target.value})}
                        onClear={() => setFormSignUp({ ...formSignUp, email: "" })}
                    />
                </div>

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
                        value={formSignUp.birthdate}
                        onChange={(date) => setFormSignUp({...formSignUp, birthdate: date})}
                        classNames={{
                            selectorIcon: "text-zinc-500"
                        }}
                    />
                </div>

                {/* Password field input */}
                <div className="grid gap-3">
                    <Input
                        key="signup-password"
                        isRequired
                        label="Mật khẩu"
                        labelPlacement="outside"
                        placeholder="Nhập Mật Khẩu"
                        errorMessage="Vui lòng nhập mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                        type={isVisiblePassword ? "text" : "password"}
                        variant="faded"
                        name="signup-password"
                        data-lpignore="true"
                        data-form-type="signup"
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
                        value={formSignUp.password}
                        onChange={(e) => setFormSignUp({...formSignUp, password: e.target.value})}
                    />
                </div>

                {/* Confirm Password field input */}
                <div className="grid gap-3">
                    <Input
                        key="signup-confirm-password"
                        isRequired
                        label="Xác nhận mật khẩu"
                        labelPlacement="outside"
                        placeholder="Nhập Lại Mật Khẩu"
                        errorMessage="Vui lòng nhập mật khẩu xác nhận khớp với mật khẩu đã nhập"
                        type={isVisibleConfirmPassword ? "text" : "password"}
                        variant="faded"
                        name="signup-confirm-password"
                        data-lpignore="true"
                        data-form-type="signup"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        startContent={<MdOutlinePassword size={20} className="text-gray-500" />}
                        endContent={
                            <button
                                type="button"
                                className="flex items-center justify-center"
                                onClick={() => setIsVisibleConfirmPassword(!isVisibleConfirmPassword)}
                            >
                                {isVisibleConfirmPassword ? (
                                    <EyeIcon size={18}/>
                                ) : (
                                    <EyeOffIcon size={18}/>
                                )}
                            </button>
                        }
                        value={formSignUp.confirmPassword}
                        onChange={(e) => setFormSignUp({...formSignUp, confirmPassword: e.target.value})}
                    />
                </div>
            </div>
            <DialogFooter>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex justify-end items-center">
                        <Button 
                            type="button"
                            onClick={onSubmitSignUp}
                            radius="sm" 
                            color="primary" 
                            variant="shadow" 
                            isLoading={isSigningUp}
                            className="w-full mt-8"
                            isDisabled={!isSignUpFilled}
                        >
                            Đăng ký
                        </Button>
                    </div>

                    <hr />

                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Đã có tài khoản? </span>
                        <Button 
                            type="button"
                            onClick={() => {
                                resetForms();
                                setOpenDialog('signin');
                            }}
                            radius="sm" 
                            color="primary" 
                            variant="faded" 
                        >
                            Đăng Nhập
                        </Button>
                    </div>
                </div>
            </DialogFooter>
        </>
    )
}