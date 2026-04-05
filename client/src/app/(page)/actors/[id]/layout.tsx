import type { Metadata } from "next";

type ActorSeo = {
  name?: string;
  biography?: string | null;
  profile_path?: string | null;
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : process.env.NODE_ENV === "development"
    ? "http://localhost:5143/api"
    : "https://cinema-api-vetv.onrender.com/api";

const truncate = (text: string, max = 160) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}...`;
};

async function getActor(id: string): Promise<ActorSeo | null> {
  try {
    const response = await fetch(`${API_BASE}/v1/actor/get/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    return (await response.json()) as ActorSeo;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const actor = await getActor(id);

  if (!actor?.name) {
    return {
      title: "Chi tiết diễn viên",
      description:
        "Xem thông tin diễn viên và các phim đã tham gia tại MilkyWayyy Cinema.",
      alternates: {
        canonical: `/actors/${id}`,
      },
    };
  }

  const description = truncate(
    actor.biography?.trim() ||
      `Xem tiểu sử và các phim nổi bật của diễn viên ${actor.name} tại MilkyWayyy Cinema.`
  );

  const imageUrl = actor.profile_path
    ? `https://image.tmdb.org/t/p/original${actor.profile_path}`
    : "https://milkywayyy.me/h.png";
  const canonical = `/actors/${id}`;

  return {
    title: actor.name,
    description: description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${actor.name} | MilkyWayyy Cinema`,
      description: description,
      url: `https://milkywayyy.me${canonical}`,
      type: "profile",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${actor.name} | MilkyWayyy Cinema`,
      description: description,
      images: [imageUrl],
    },
  };
}

export default function ActorDetailLayout({ children }: Props) {
  return children;
}
