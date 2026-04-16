import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@heroui/react";
import { FileUpload } from "@/components/ui/file-upload";
import { AvatarElement } from '@/components/ui/avatar';
import { type AuthUser, useAuthStore } from "@/stores/useAuthStore";

interface FormChangeAvatarProps {
    avatarPath: string | null;

    formChangeAvatar: {
        avatar: File | null;
    };

    setFormChangeAvatar: (value: {
        avatar: File | null;
    }) => void;

    onSubmitChangeAvatar: () => void;
    isChangingAvatar: boolean;
    isChangeAvatarFilled: boolean;
}

export const FormChangeAvatar = ({
    formChangeAvatar,
    setFormChangeAvatar,
    onSubmitChangeAvatar,
    isChangingAvatar,
    isChangeAvatarFilled,
    avatarPath,
}: FormChangeAvatarProps) => {
    const previewAvatarSrc = formChangeAvatar.avatar
        ? URL.createObjectURL(formChangeAvatar.avatar)
        : (avatarPath || "/logo.png");

    const handleFileChange = (files: File | null) => {
        setFormChangeAvatar({ avatar: files });
    };

    const authUser = useAuthStore((state: { authUser: AuthUser | null }) => state.authUser);

    return (
        <>
            <DialogHeader>
                <DialogTitle className="items-center justify-center text-center text-2xl font-bold w-full mb-10">
                    Đổi ảnh đại diện
                </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
                {/* Preview avatar */}
                <div className="flex justify-center">
                    <div className="relative inline-flex items-center justify-center">
                        <span className="pointer-events-none absolute h-36 w-36 rounded-full bg-pink-500/80 blur-2xl animate-pulse" />
                        <span className="pointer-events-none absolute h-42 w-42 rounded-full bg-purple-400/70 blur-3xl" />
                        <AvatarElement 
                            previewSrc={previewAvatarSrc}
                            authUser={authUser}
                            width="w-36"
                            height="h-36"
                            widthDeco="w-44"
                            translatex="-translate-x-1/11"
                            custom="shadow-[0px_0px_30px_rgba(16,185,129,0.55)] transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                </div>

                {/* Avatar field input */}
                <div className="grid gap-3">
                    <FileUpload 
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <DialogFooter>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex justify-end items-center">
                        <Button 
                            type="button"
                            onClick={onSubmitChangeAvatar}
                            radius="sm" 
                            color="primary" 
                            variant="shadow" 
                            isLoading={isChangingAvatar}
                            className="w-full mt-8"
                            isDisabled={!isChangeAvatarFilled}
                        >
                            Đổi ảnh đại diện
                        </Button>
                    </div>
                </div>
            </DialogFooter>
        </>
    );
}