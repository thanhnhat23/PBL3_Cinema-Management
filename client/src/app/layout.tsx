import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"
import { TooltipProvider } from "@/components/ui/tooltip"
import NextTopLoader from 'nextjs-toploader';
import { cookies } from "next/headers";
import i18n, { i18nConfig } from "@/lib/i18n";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('i18next')?.value || 'en';
  
  // Initialize i18n for the server
  if (!i18n.isInitialized) {
    await i18n.init({
      ...i18nConfig,
      lng: locale
    });
  } else if (i18n.language !== locale) {
    await i18n.changeLanguage(locale);
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || !theme) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextTopLoader 
          color="#f59e0b"
          initialPosition={0.05}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 15px #f59e0b,0 0 10px #f59e0b"
        />
        <TooltipProvider>
          <Providers locale={locale}>{children}</Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
