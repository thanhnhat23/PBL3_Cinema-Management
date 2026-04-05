import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim",
  description: "Khám phá phim đang chiếu, sắp chiếu và phim phổ biến tại MilkyWayyy Cinema.",
  alternates: {
    canonical: "/movies",
  },
  openGraph: {
    title: "Phim | MilkyWayyy Cinema",
    description: "Khám phá phim đang chiếu, sắp chiếu và phim phổ biến tại MilkyWayyy Cinema.",
    url: "https://milkywayyy.me/movies",
    type: "website",
    images: ["https://i.pinimg.com/1200x/77/27/30/772730bb91978c874dcc1c8e08fe7f96.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phim | MilkyWayyy Cinema",
    description: "Khám phá phim đang chiếu, sắp chiếu và phim phổ biến tại MilkyWayyy Cinema.",
    images: ["https://i.pinimg.com/1200x/77/27/30/772730bb91978c874dcc1c8e08fe7f96.jpg"],
  },
};

export default function MoviesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
