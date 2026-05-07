'use client'
import { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@heroui/react";
import { useTranslation } from 'react-i18next';

// Global error must include html and body tags
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={i18n.language || 'vi'}>
      <body className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden p-4">
          {/* Background Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-72 h-72 bg-red-600 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-zinc-800 rounded-full blur-[150px] opacity-50" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-2xl">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full">
              <AlertTriangle size={48} className="text-red-500" />
            </div>

            <div className="space-y-4">
              <h1 className={`flex items-center justify-center text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none`}>
                {t('global_error.title')}<span className={`text-red-500 ml-3`}>{t('global_error.title_highlight')}</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                {t('global_error.description')}
              </p>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="h-16 px-10 rounded-sm bg-red-600 text-white font-bold text-lg uppercase tracking-widest shadow-2xl hover:bg-red-700 transition-all duration-300 hover:-translate-y-1"
                onClick={() => reset()}
                startContent={<RefreshCw size={24} />}
              >
                {t('global_error.button')}
              </Button>
            </div>

            {error?.digest && (
              <p className="text-xs text-zinc-500 font-mono opacity-50">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.02] whitespace-nowrap text-[20vw] font-black italic uppercase">
            {t('global_error.bg_text')}
          </div>
        </div>
      </body>
    </html>
  );
}
