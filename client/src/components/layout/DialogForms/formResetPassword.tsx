import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Button, Input } from "@heroui/react"
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlinePassword } from "react-icons/md"
import { EyeIcon } from "@/components/icons/eye"
import { EyeOffIcon } from "@/components/icons/eye-off"

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
                        Đặt lại mật khẩu
                    </DialogTitle>
                </div>
            </DialogHeader>
            <div className="grid gap-4">
                {/* Password field input */}
                <div className="grid gap-3">
                    <Input
                        key="reset-new-password"
                        isRequired
                        label="Mật khẩu mới"
                        labelPlacement="outside"
                        placeholder="Nhập Mật Khẩu Mới"
                        errorMessage="Vui lòng nhập mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                        type={isVisiblePassword ? "text" : "password"}
                        variant="faded"
                        name="reset-new-password"
                        data-lpignore="true"
                        data-form-type="reset-password"
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
                        value={formResetPass.newPassword}
                        onChange={(e) => setFormResetPass({...formResetPass, newPassword: e.target.value})}
                    />
                </div>

                {/* Confirm Password field input */}
                <div className="grid gap-3">
                    <Input
                        key="reset-confirm-new-password"
                        isRequired
                        label="Xác nhận mật khẩu"
                        labelPlacement="outside"
                        placeholder="Nhập Lại Mật Khẩu"
                        errorMessage="Vui lòng nhập mật khẩu xác nhận khớp với mật khẩu đã nhập"
                        type={isVisibleConfirmPassword ? "text" : "password"}
                        variant="faded"
                        name="reset-confirm-new-password"
                        data-lpignore="true"
                        data-form-type="reset-password"
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
                        value={formResetPass.confirmNewPassword}
                        onChange={(e) => setFormResetPass({...formResetPass, confirmNewPassword: e.target.value})}
                    />
                </div>
                <DialogFooter>
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col justify-center items-start mt-4">
                            <Button 
                                type="button"
                                onClick={onSubmitResetPassword}
                                radius="sm" 
                                color="primary" 
                                variant="shadow" 
                                isLoading={isResettingPassword}
                                className="mt-4 w-full"
                                isDisabled={!isResetPassFilled}
                            >
                                Đặt lại mật khẩu
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </div>
        </>
    )
}