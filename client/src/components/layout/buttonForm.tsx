import { Button } from "@heroui/react";
import { useAuthDialogStore } from "@/stores/useAuthDialogStore";

export const FormLayout = () => {
    const { setOpenDialog } = useAuthDialogStore();

    return (
        <Button 
            variant="ghost"
            onClick={() => setOpenDialog('signin')}
        >
            Đăng nhập
        </Button>
    );
}; 