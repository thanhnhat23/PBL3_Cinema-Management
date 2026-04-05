import { useState } from 'react';

export function useChangeAvatarForm() {
    const [formChangeAvatar, setFormChangeAvatar] = useState({
        avatar: null as File | null,
    });

    const isChangeAvatarFilled = formChangeAvatar.avatar !== null;

    const resetChangeAvatarForm = () =>
        setFormChangeAvatar({
            avatar: null,
        });
    
    return { formChangeAvatar, setFormChangeAvatar, isChangeAvatarFilled, resetChangeAvatarForm };
}