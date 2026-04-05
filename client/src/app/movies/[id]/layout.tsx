import type { Metadata } from "next";

type MovieSeo = {
  title?: string;
  overview?: string;
  poster_path?: string | null;
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

async function getMovie(id: string): Promise<MovieSeo | null> {
  try {
    const response = await fetch(`${API_BASE}/v1/movie/get/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    return (await response.json()) as MovieSeo;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie?.title) {
    return {
      title: "Chi tiết phim",
      description: "Xem thông tin phim và lịch chiếu tại MilkyWayyy Cinema.",
      alternates: {
        canonical: `/movies/${id}`,
      },
    };
  }

  const description = truncate(
    movie.overview?.trim() ||
      `Xem thông tin chi tiết, trailer và đánh giá phim ${movie.title} tại MilkyWayyy Cinema.`
  );

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://milkywayyy.me/logo.png";
  const canonical = `/movies/${id}`;

  return {
    title: movie.title,
    description: description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${movie.title} | MilkyWayyy Cinema`,
      description: description,
      url: `https://milkywayyy.me${canonical}`,
      type: "video.movie",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${movie.title} | MilkyWayyy Cinema`,
      description: description,
      images: [imageUrl],
    },
  };
}

export default function MovieDetailLayout({ children }: Props) {
  return children;
}
