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
        <>
            <DialogHeader>
                <div className="flex flex-col items-center justify-center w-full">
                    <DialogTitle className="text-center text-2xl font-bold mb-2">
                        Đổi mật khẩu
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
                {/* Current Password field input */}
                <div className="grid gap-3">
                    <Input
                        key="change-current-password"
                        isRequired
                        label="Mật khẩu hiện tại"
                        labelPlacement="outside"
                        placeholder="Nhập Mật Khẩu Hiện Tại"
                        type="text"
                        variant="faded"
                        name="change-current-password"
                        data-lpignore="true"
                        data-form-type="change-password"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        startContent={<RiLockPasswordFill size={20} className="text-gray-500" />}
                        value={formChangePassword.currentPassword}
                        onChange={(e) => setFormChangePassword({...formChangePassword, currentPassword: e.target.value})}
                    />
                </div>

                {/* New Password field input */}
                <div className="grid gap-3">
                    <Input
                        key="change-new-password"
                        isRequired
                        label="Mật khẩu mới"
                        labelPlacement="outside"
                        placeholder="Nhập Mật Khẩu Mới"
                        errorMessage="Vui lòng nhập mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                        type={isVisiblePassword ? "text" : "password"}
                        variant="faded"
                        name="change-new-password"
                        data-lpignore="true"
                        data-form-type="change-password"
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
                        value={formChangePassword.newPassword}
                        onChange={(e) => setFormChangePassword({...formChangePassword, newPassword: e.target.value})}
                    />
                </div>

                {/* Confirm Password field input */}
                <div className="grid gap-3">
                    <Input
                        key="change-confirm-new-password"
                        isRequired
                        label="Xác nhận mật khẩu"
                        labelPlacement="outside"
                        placeholder="Nhập Lại Mật Khẩu"
                        errorMessage="Vui lòng nhập mật khẩu xác nhận khớp với mật khẩu đã nhập"
                        type={isVisibleConfirmPassword ? "text" : "password"}
                        variant="faded"
                        name="change-confirm-new-password"
                        data-lpignore="true"
                        data-form-type="change-password"
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
                        value={formChangePassword.confirmNewPassword}
                        onChange={(e) => setFormChangePassword({...formChangePassword, confirmNewPassword: e.target.value})}
                    />
                </div>
                <DialogFooter>
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col justify-center items-start mt-4">
                            <Button 
                                type="button"
                                onClick={onSubmitChangePassword}
                                radius="sm" 
                                color="primary" 
                                variant="shadow" 
                                isLoading={isChangingPassword}
                                className="mt-4 w-full"
                                isDisabled={!isChangePasswordFilled}
                            >
                                Thay đổi mật khẩu
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </div>
        </>
    )
}