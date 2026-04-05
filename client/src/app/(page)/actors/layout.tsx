import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diễn viên",
  description: "Xem danh sách diễn viên và vai diễn nổi bật của họ tại MilkyWayyy Cinema.",
  alternates: {
    canonical: "/actors",
  },
  openGraph: {
    title: "Diễn viên | MilkyWayyy Cinema",
    description: "Xem danh sách diễn viên và vai diễn nổi bật của họ tại MilkyWayyy Cinema.",
    images: ["https://i.pinimg.com/736x/06/74/65/067465e6f2d33400aab1630e2a307478.jpg"],
    url: "https://milkywayyy.me/actors",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diễn viên | MilkyWayyy Cinema",
    description: "Xem danh sách diễn viên và vai diễn nổi bật của họ tại MilkyWayyy Cinema.",
    images: ["https://i.pinimg.com/736x/06/74/65/067465e6f2d33400aab1630e2a307478.jpg"],
  },
};

export default function ActorsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
