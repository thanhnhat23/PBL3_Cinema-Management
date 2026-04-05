import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đánh giá phim",

  description:
    "Theo dõi đánh giá phim mới nhất từ cộng đồng người dùng MilkyWayyy Cinema.",

  alternates: {
    canonical: "/reviews",
  },

  openGraph: {
    title: "Đánh giá phim | MilkyWayyy Cinema",
    description: "Theo dõi đánh giá phim mới nhất từ cộng đồng người dùng MilkyWayyy Cinema.",
    images: ["https://i.pinimg.com/736x/94/60/cb/9460cb02305f3f1e50afab287c93df1e.jpg"],
    url: "https://milkywayyy.me/reviews",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Đánh giá phim | MilkyWayyy Cinema",
    images: ["https://i.pinimg.com/736x/94/60/cb/9460cb02305f3f1e50afab287c93df1e.jpg"],
    description:
      "Theo dõi đánh giá phim mới nhất từ cộng đồng người dùng MilkyWayyy Cinema.",
  },
};

export default function ReviewsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
