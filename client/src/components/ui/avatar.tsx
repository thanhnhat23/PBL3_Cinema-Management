import { Avatar } from "@heroui/react";
import Image from "next/image";
import { type User } from "@/stores/useUserStore";
import { type AuthUser } from "@/stores/useAuthStore";

interface UserProps {
    user?: User | null;
    authUser?: AuthUser | null;
    previewSrc?: string;
    width?: string;
    height?: string;
    left?: string;
    translatex?: string;
    top?: string;
    translatey?: string;
    widthDeco?: string;
    custom?: string;
    role?: number;
    avatar?: string | null;
}

export const AvatarElement = ({ 
    user,
    authUser,
    previewSrc,
    width,
    height,
    left,
    translatex,
    top = "top-1/2",
    translatey = "-translate-y-1/2",
    widthDeco,
    custom,
    avatar,
    role = 2
}: UserProps) => {
  const defaultAvatar = "https://i.pinimg.com/1200x/dc/00/eb/dc00ebc8d85a3cf802aecb502cf7e212.jpg";
  const tmdbAvatar = `https://image.tmdb.org/t/p/original/${avatar}`;

  const isAdmin = Number(authUser?.role) === 0 || Number(user?.role) === 0 || role === 0;
  const isStaff = Number(authUser?.role) === 1 || Number(user?.role) === 1 || role === 1;
  const decorationAdmin = "https://cdn.discordapp.com/avatar-decoration-presets/a_0559ecfc5e0d72ed1a2c5f1a6fd84558.png?size=300&passthrough=true";
  const decorationStaff = "https://cdn.discordapp.com/avatar-decoration-presets/a_13913a00bd9990ab4102a3bf069f0f3f.png?size=300&passthrough=true";
  const decorationUser = "https://cdn.discordapp.com/avatar-decoration-presets/a_f7dcc7b9b55715880755e24ff440f241.png?size=300&passthrough=true";

  const decorationSrc = isAdmin ? decorationAdmin :
                        isStaff ? decorationStaff : decorationUser;
  
  const getAvatarSrc = () => {
    if (previewSrc) return previewSrc;
    if (authUser?.avatar) return authUser.avatar;
    if (user?.avatar_path) return user.avatar_path;
    if (avatar) return tmdbAvatar;
    return defaultAvatar;
  };

    return (
        <div className="relative inline-block">
            <Avatar 
              src={getAvatarSrc()} 
              className={`${width} ${height} ring-2 ring-fuchsia-200 ${custom}`}
            />

            <Image 
              src={decorationSrc}
              alt="Avatar Decoration"
              width={250}
              height={250}
              unoptimized
              className={`pointer-events-none absolute ${left} ${top} z-10 ${widthDeco} max-w-none ${translatex} ${translatey}`}
            />
        </div>
    )
}