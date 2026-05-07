'use client'
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@heroui/react";
import { useTranslation } from 'react-i18next';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 relative overflow-hidden p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-500 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[150px] opacity-50" />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Animated GIF */}
        <div className="flex justify-center items-center order-2 md:order-1">
          <div className="relative group">
            <div className="absolute -inset-4 bg-linear-to-tr from-red-500/20 to-orange-600/20 rounded-sm blur-2xl group-hover:opacity-100 transition duration-1000 opacity-70" />
            <div className="relative bg-white dark:bg-zinc-900/50 backdrop-blur-xl p-2 rounded-sm border border-zinc-200 dark:border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
              <Image
                src="https://i.pinimg.com/originals/5f/e2/76/5fe2766bc465290b7b95856832cef409.gif"
                width={550}
                height={550}
                alt="500 Server Error Animation"
                className="rounded-sm mix-blend-normal dark:mix-blend-lighten"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8 order-1 md:order-2">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <AlertTriangle size={12} />
              {t('error_500.error_label')}
            </div>
            <h1 className={`flex ${i18n.language === 'ja' ? 'flex-col' : ''} text-7xl md:text-9xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-none`}>
              {t('error_500.title_main')}<span className={`text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] ${i18n.language !== 'ja' ? 'ml-2' : ''}`}>{t('error_500.title_highlight')}</span>
            </h1>
          </div>

          <div className="space-y-4 max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-200">
              {t('error_500.subtitle')}
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              {t('error_500.description')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto pt-4">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-6 rounded-sm bg-linear-to-r from-red-500 to-orange-600 text-white font-bold text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:shadow-[0_15px_40px_rgba(239,68,68,0.5)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
              onClick={() => reset()}
              startContent={<RefreshCw size={18} />}
            >
              {t('error_500.retry')}
            </Button>

            <Button
              as={Link}
              href="/"
              variant="bordered"
              size="lg"
              className="w-full sm:w-auto h-14 px-6 rounded-sm border-2 border-zinc-200 dark:border-white/10 font-bold text-sm uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
              startContent={<Home size={18} />}
            >
              {t('error_500.back_home')}
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Text */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.03] whitespace-nowrap text-[20vw] font-black italic uppercase">
        {t('error_500.bg_text')}
      </div>
    </div>
  );
}
