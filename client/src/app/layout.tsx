import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"

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
  title: {
    default: "MilkyWayyy Cinema",
    template: "%s | MilkyWayyy Cinema",
  },

  description: "Book movie tickets online at MilkyWayyy Cinema. Browse latest movies, check showtimes, and reserve seats. Fast booking, secure payment, and exclusive deals.",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  keywords: ["cinema", "movies", "tickets", "booking"],
  icons: {
    icon: "/logo.ico",
    apple: "/logo.png",
  },

  twitter: {
    card: "summary_large_image",
    images: ["https://i.pinimg.com/1200x/5a/4c/ab/5a4cab7414e67e62325985fcabf478d9.jpg"],
    creator: "@thanhnhat06",
  },

  openGraph: {
  title: "MilkyWayyy Cinema",
  description: "Book tickets and manage your cinema experience",
  url: "https://milkywayyy.me",
  images: [
    {
      url: "https://i.pinimg.com/1200x/5a/4c/ab/5a4cab7414e67e62325985fcabf478d9.jpg",
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
    <html lang="en" suppressHydrationWarning>
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
