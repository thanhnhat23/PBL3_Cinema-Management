import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Button, Input, InputOtp } from "@heroui/react"
import { MdEmail } from "react-icons/md";
import { SendHorizontal } from "@/components/icons/send-horizontal";

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
                        Quên mật khẩu
                    </DialogTitle>
                </div>
            </DialogHeader>

            <div className="grid gap-4">
                {/* Email field input */}
                <div className="grid gap-3">
                    <div className="flex gap-2">
                        <Input 
                            key="reset-email"
                            isRequired
                            isClearable
                            label="Email" 
                            labelPlacement="outside"
                            placeholder="Nhập Email"
                            errorMessage="Vui lòng nhập email không bỏ trống"
                            type="text" 
                            variant="faded"
                            name="reset-email"
                            data-lpignore="true"
                            data-form-type="reset-password"
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            startContent={<MdEmail size={20} className="text-gray-500" />}
                            value={formResetPass.email}
                            onChange={(e) => setFormResetPass({
                                ...formResetPass,
                                email: e.target.value.trimEnd()
                            })}
                            onClear={() => setFormResetPass({...formResetPass, email: ""})}
                        />

                        <Button 
                            isIconOnly
                            type="button"
                            onClick={onSubmitForgotPassword}
                            radius="lg" 
                            color="primary" 
                            variant="shadow" 
                            isLoading={isForgottingPassword}
                            className="w-12 self-end"
                            isDisabled={!isForgotPassFilled}
                        >
                            <SendHorizontal animateOnHover size={18}/>
                        </Button>
                    </div>

                    <div className="flex flex-col items-center gap-1 mt-2">
                        <span className="text-lg font-medium">OTP </span>
                        <InputOtp 
                            isRequired
                            variant="faded"
                            length={6}
                            value={formResetPass.resetToken}
                            onValueChange={(value) => setFormResetPass({...formResetPass, resetToken: value})} 
                        />  
                    </div>
                </div>
            </div>
            <DialogFooter>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col justify-center items-start mt-4">
                        <Button 
                            type="button"
                            onClick={onSubmitCheckResetPassword}
                            radius="sm" 
                            color="primary" 
                            variant="shadow" 
                            isLoading={isCheckingResetPassword}
                            className="mt-4 w-full"
                            isDisabled={!isCheckResetPassFilled}
                        >
                            Xác nhận OTP
                        </Button>
                    </div>

                    <hr />

                    <div className="flex flex-col gap-2">
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
                            Trở về đăng nhập
                        </Button>
                    </div>
                </div>
            </DialogFooter>
        </>
    )
}