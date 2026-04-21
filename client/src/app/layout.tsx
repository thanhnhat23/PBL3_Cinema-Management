import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"
import { TooltipProvider } from "@/components/ui/tooltip"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://milkywayyy.me"),
  applicationName: "MilkyWayyy Cinema",

  title: {
    default: "MilkyWayyy Cinema",
    template: "%s | MilkyWayyy Cinema",
  },

  alternates: {
    canonical: "/",
  },

  description: "Nơi đặt vé xem phim trực tuyến tại MilkyWayyy Cinema. Duyệt phim mới nhất, kiểm tra lịch chiếu và đặt chỗ ngồi. Đặt vé nhanh chóng, thanh toán an toàn và ưu đãi độc quyền. Lưu ý: Đây là một dự án đồ án Công nghệ phần mềm 2026, không phải một trang web thương mại thực sự.",

  category: "entertainment",

  verification: {
    google: "BDMQ5FjIluw49croN__9bJmrph52opWUnbi3--maFbc",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  keywords: ["cinema", "movies", "tickets", "booking", "reviews", "MilkyWayyy Cinema", "milkywayyy"],
  icons: {
    icon: "/logo.ico",
    apple: "/logo.png",
  },

  twitter: {
    card: "summary_large_image",
    title: "MilkyWayyy Cinema",
    description: "Website đồ án Công nghệ phần mềm 2026 - Đặt vé xem phim trực tuyến tại MilkyWayyy Cinema. Duyệt phim mới nhất, kiểm tra lịch chiếu và đặt chỗ ngồi. Đặt vé nhanh chóng, thanh toán an toàn và ưu đãi độc quyền.",
    images: ["https://i.pinimg.com/1200x/99/0f/ae/990fae21b0a8c52347bc45269ce1a7aa.jpg"],
    creator: "@thanhnhat06",
  },

  openGraph: {
    title: "MilkyWayyy Cinema",
    siteName: "MilkyWayyy Cinema",
    description: "Website đồ án Công nghệ phần mềm 2026 - Đặt vé xem phim trực tuyến tại MilkyWayyy Cinema. Duyệt phim mới nhất, kiểm tra lịch chiếu và đặt chỗ ngồi. Đặt vé nhanh chóng, thanh toán an toàn và ưu đãi độc quyền.",
    url: "https://milkywayyy.me",
    locale: "vi_VN",
    images: [
      {
        url: "https://i.pinimg.com/1200x/99/0f/ae/990fae21b0a8c52347bc45269ce1a7aa.jpg",
        width: 1200,
        height: 630,
      }
    ],
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TooltipProvider>
          <Providers>{children}</Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
