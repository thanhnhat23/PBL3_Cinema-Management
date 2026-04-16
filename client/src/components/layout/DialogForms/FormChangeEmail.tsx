import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Button, Input } from "@heroui/react"
import { MdEmail, MdOutlinePassword } from "react-icons/md"
import { EyeIcon } from "@/components/icons/eye"
import { EyeOffIcon } from "@/components/icons/eye-off"

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
        <>
            <DialogHeader>
                <div className="flex flex-col items-center justify-center w-full">
                    <DialogTitle className="text-center text-2xl font-bold mb-2">
                        Đổi Email
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
                {/* New email field input */}
                <div className="grid gap-3">
                    <Input 
                        key="change-new-email"
                        isRequired
                        isClearable
                        label="Email" 
                        labelPlacement="outside"
                        placeholder="Nhập Email mới"
                        errorMessage="Vui lòng nhập email không bỏ trống"
                        type="text" 
                        variant="faded"
                        name="change-new-email"
                        data-lpignore="true"
                        data-form-type="change-email"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        startContent={<MdEmail size={20} className="text-gray-500" />}
                        value={formChangeEmail.newEmail}
                        onChange={(e) => setFormChangeEmail({
                            ...formChangeEmail,
                            newEmail: e.target.value.trimEnd()
                        })}
                        onClear={() => setFormChangeEmail({...formChangeEmail, newEmail: ""})}
                    />
                </div>

                {/* Password field input */}
                <div className="grid gap-3">
                    <Input
                        key="confirm-password"
                        isRequired
                        label="Mật khẩu"
                        labelPlacement="outside"
                        placeholder="Nhập Mật Khẩu"
                        errorMessage=""
                        type={isVisiblePassword ? "text" : "password"}
                        variant="faded"
                        name="confirm-password"
                        data-lpignore="true"
                        data-form-type="change-password"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        startContent={<MdOutlinePassword size={20} className="text-gray-500" />}
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
                        value={formChangeEmail.password}
                        onChange={(e) => setFormChangeEmail({...formChangeEmail, password: e.target.value})}
                    />
                </div>
                <DialogFooter>
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col justify-center items-start mt-4">
                            <Button 
                                type="button"
                                onClick={onSubmitChangeEmail}
                                radius="sm" 
                                color="primary" 
                                variant="shadow" 
                                isLoading={isChangingEmail}
                                className="mt-4 w-full"
                                isDisabled={!isChangeEmailFilled}
                            >
                                Thay đổi email
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </div>
        </>
    )
}