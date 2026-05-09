"use client";

import { useTranslation } from "react-i18next";
import { RefreshCw, AlertTriangle, Settings, Film, Ticket, Camera, Tv, Monitor } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MaintenancePage() {
  const { t, i18n } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [apiStatus, setApiStatus] = useState<'ACTIVE' | 'UNREACHABLE' | 'CHECKING'>('CHECKING');
  const [dbStatus, setDbStatus] = useState<'ACTIVE' | 'FAILED' | 'CHECKING'>('CHECKING');

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const checkHealth = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
                      (process.env.NODE_ENV === 'development' ? 'http://localhost:5143' : 'https://cinema-api-vetv.onrender.com');
        
        const response = await fetch(`${apiUrl}/api/ping`, { 
          cache: 'no-store',
          method: 'GET',
        });

        if (response.ok) {
          setApiStatus('ACTIVE');
          setDbStatus('ACTIVE');
        } else if (response.status === 503) {
          setApiStatus('ACTIVE');
          setDbStatus('FAILED');
        } else {
          setApiStatus('UNREACHABLE');
          setDbStatus('FAILED');
        }
      } catch (error) {
        setApiStatus('UNREACHABLE');
        setDbStatus('FAILED');
      }
    };

    checkHealth();
    checkInterval = setInterval(checkHealth, 30000);
    
    progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 300);

    return () => {
      clearInterval(checkInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Background Cinematic Floating Elements */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-20 dark:opacity-10 overflow-hidden">
        <Film className="absolute top-10 left-10 w-24 h-24 text-amber-500 animate-[bounce_10s_infinite]" />
        <Ticket className="absolute bottom-20 right-10 w-32 h-32 text-orange-500 animate-[pulse_8s_infinite] rotate-12" />
        <Camera className="absolute top-1/4 right-1/4 w-16 h-16 text-zinc-400 animate-[spin_20s_linear_infinite]" />
        <Tv className="absolute bottom-1/4 left-1/4 w-20 h-20 text-amber-600 animate-bounce" />
        <Monitor className="absolute top-1/2 left-20 w-12 h-12 text-orange-400 opacity-50" />
      </div>

      {/* Main Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[150px] opacity-50" />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Animated Media Container */}
        <div className="flex justify-center items-center order-2 md:order-1">
          <div className="relative group">
            {/* Multi-layer Glow */}
            <div className="absolute -inset-8 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -inset-4 bg-linear-to-tr from-amber-500/20 to-orange-600/20 rounded-sm blur-2xl group-hover:opacity-100 transition duration-1000 opacity-70" />
            
            <div className="relative bg-white dark:bg-zinc-900/50 backdrop-blur-3xl p-3 rounded-sm border border-zinc-200 dark:border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
              <div className="relative overflow-hidden rounded-xs">
                <Image
                  src="https://i.pinimg.com/originals/5f/e2/76/5fe2766bc465290b7b95856832cef409.gif"
                  width={550}
                  height={550}
                  alt="System Suspended Animation"
                  className="rounded-sm mix-blend-normal dark:mix-blend-lighten transition-all duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
              </div>
              
              {/* Floating Settings/System Badge */}
              <div className="absolute -top-6 -right-6 bg-zinc-900 dark:bg-white p-2 rounded-sm shadow-2xl border border-zinc-700 dark:border-zinc-200">
                <Settings className="text-white dark:text-black animate-[spin_6s_linear_infinite]" size={18} />
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3 px-4 py-2 bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
                <div className={`w-2 h-2 rounded-full animate-ping ${apiStatus === 'ACTIVE' ? 'bg-green-500' : 'bg-amber-500'}`} />
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                  {apiStatus === 'CHECKING' ? 'Checking connection...' : t('maintenance.monitoring')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Content & Live Progress */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-10 order-1 md:order-2">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
              <AlertTriangle size={12} className="animate-pulse" />
              {t('maintenance.label')}
            </div>
            
            <h1 className={`flex flex-col ${i18n.language === 'ja' ? 'flex-col' : ''} text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-[0.85]`}>
              <span className="opacity-90">{t('maintenance.title_main')}</span>
              <span className="text-amber-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)] relative">
                {t('maintenance.title_highlight')}
                <span className="absolute -right-8 top-0 text-xl font-bold text-zinc-300 dark:text-zinc-700 not-italic tracking-normal">®</span>
              </span>
            </h1>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-zinc-800 dark:text-zinc-200 italic uppercase tracking-tight">
                {t('maintenance.subtitle')}
              </h2>
              <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium opacity-80">
                {t('maintenance.description')}
              </p>
            </div>
            
            {/* Live Status/Progress Section */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <span>{t('maintenance.protocol')}</span>
                <span className="text-amber-500">{t('maintenance.polling')}</span>
              </div>
              
              <div className="relative h-1 w-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden rounded-full">
                <div 
                  className="absolute left-0 top-0 h-full bg-amber-500 transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3 text-amber-500 font-black text-xs uppercase tracking-[0.2em] animate-pulse">
                <RefreshCw size={14} className="animate-spin" />
                <span>{t('maintenance.auto_reconnect')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Massive Background Text - Upgraded */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.03] dark:opacity-[0.02] whitespace-nowrap text-[30vw] font-black italic uppercase tracking-tighter leading-none flex gap-10">
        <span>{t('maintenance.bg_text')}</span>
        <span>{t('maintenance.bg_text')}</span>
      </div>

      {/* Corner Decorative Code Snippet Style */}
      <div className="absolute top-10 right-10 hidden lg:block font-mono text-[10px] text-zinc-300 dark:text-zinc-700 pointer-events-none select-none">
        <div className="border-l border-amber-500/30 pl-4 space-y-1">
          <p>{t('maintenance.report_title')}</p>
          <p>{t('maintenance.db_conn')}: <span className={dbStatus === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}>
            {dbStatus === 'CHECKING' ? 'WAITING...' : (dbStatus === 'ACTIVE' ? t('maintenance.status_active') : t('maintenance.status_failed'))}
          </span></p>
          <p>{t('maintenance.api_gateway')}: <span className={apiStatus === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}>
            {apiStatus === 'CHECKING' ? 'WAITING...' : (apiStatus === 'ACTIVE' ? t('maintenance.status_active') : t('maintenance.status_unreachable'))}
          </span></p>
          <p>{t('maintenance.recovery_mode')}: <span className="text-amber-500">{t('maintenance.status_active')}</span></p>
          <p>PING_INTERVAL: 30000ms</p>
        </div>
      </div>
    </div>
  );
}
