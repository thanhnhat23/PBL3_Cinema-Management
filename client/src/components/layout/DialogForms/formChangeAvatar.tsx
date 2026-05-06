import { 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@heroui/react";
import { FileUpload } from "@/components/ui/file-upload";
import { AvatarElement } from '@/components/ui/avatar';
import { type AuthUser, useAuthStore } from "@/stores/useAuthStore";
import { Camera } from "lucide-react"
import { cn } from "@/lib/utils";

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
        <div className="animate-in fade-in zoom-in-95 duration-300">
            <DialogHeader className="mb-8">
                <div className="flex flex-col items-center justify-center w-full gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-linear-to-r from-pink-500/20 to-rose-600/20 rounded-2xl blur-xl" />
                        <div className="relative bg-white dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-lg">
                            <Camera size={32} className="text-pink-500" />
                        </div>
                    </div>

                    <div className="text-center space-y-1">
                        <DialogTitle className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white uppercase">
                            Ảnh đại diện
                        </DialogTitle>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase opacity-80">
                            Cập nhật diện mạo mới cho bạn
                        </p>
                    </div>
                </div>
            </DialogHeader>

            <div className="space-y-10">
                <div className="flex justify-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-linear-to-tr from-pink-500/30 via-purple-500/30 to-rose-500/30 rounded-full blur-2xl group-hover:opacity-100 transition-opacity duration-700 opacity-60" />
                        <div className="relative">
                            <AvatarElement 
                                previewSrc={previewAvatarSrc}
                                authUser={authUser}
                                width="w-40"
                                height="h-40"
                                widthDeco="w-48"
                                translatex="-translate-x-1/11"
                                custom="shadow-2xl border-4 border-white dark:border-zinc-900 transition-all duration-500 group-hover:scale-105 group-hover:rotate-2"
                            />
                            <div className="absolute bottom-2 right-2 bg-pink-500 p-2 rounded-full text-white shadow-lg border-2 border-white dark:border-zinc-900 animate-bounce">
                                <Camera size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-1 bg-zinc-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-white/10 hover:border-pink-500/50 transition-colors duration-300">
                    <FileUpload 
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <DialogFooter className="mt-10">
                <Button 
                    type="button"
                    onClick={onSubmitChangeAvatar}
                    isLoading={isChangingAvatar}
                    isDisabled={!isChangeAvatarFilled}
                    className={cn(
                        "w-full h-12 rounded-sm font-bold text-sm uppercase tracking-widest transition-all duration-300",
                        isChangeAvatarFilled 
                            ? "bg-linear-to-r from-pink-500 to-rose-600 text-white shadow-[0_4px_15px_rgba(236,72,153,0.3)] hover:shadow-[0_8px_25px_rgba(236,72,153,0.4)]"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                    )}
                >
                    Lưu ảnh đại diện
                </Button>
            </DialogFooter>
        </div>
    );
}