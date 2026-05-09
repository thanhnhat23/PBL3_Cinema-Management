'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Loading() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Generate stars once
  const stars = useMemo(() => {
    const random = () => Math.random();

    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      size: random() * 2 + 1,
      top: `${random() * 100}%`,
      left: `${random() * 100}%`,
      duration: random() * 3 + 2,
      delay: random() * 5,
    }));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-zinc-950" />;

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0 z-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full opacity-0"
            style={{
              width: star.size,
              height: star.size,
              top: star.top,
              left: star.left,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Nebula/Cosmic Glows */}
      <div className="absolute inset-0 z-0 opacity-40">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-1/4 w-200 h-200 bg-indigo-900/40 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -120, 0],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-225 h-225 bg-purple-900/30 rounded-full blur-[180px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-amber-500/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-12">
        {/* Main Galaxy Core Animation */}
        <div className="relative flex items-center justify-center">
          {/* Cosmic Dust Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-56 h-56 md:w-72 md:h-72 border border-white/5 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute w-64 h-64 md:w-80 md:h-80 border-t border-amber-500/30 border-l border-transparent rounded-full blur-[1px]"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute w-72 h-72 md:w-96 md:h-96 border-b border-indigo-500/20 border-r border-transparent rounded-full blur-[2px]"
          />

          {/* Pulsing Core Aura */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-48 h-48 md:w-64 md:h-64 bg-amber-500/20 rounded-full blur-3xl shadow-[0_0_100px_rgba(245,158,11,0.2)]"
          />

          {/* Center Logo - The Star */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-36 h-36 md:w-52 md:h-52 p-8 rounded-full flex items-center justify-center overflow-hidden"
          >
             <Image
                src="/logo.png"
                width={200}
                height={200}
                alt="Cinema Loading" 
                className="w-full h-full object-contain scale-150"
                unoptimized
                priority
              />
          </motion.div>
          
          {/* Orbiting Stars/Planets */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{ rotate: 360 }}
              style={{
                width: '120%',
                height: '120%',
                rotate: angle,
              }}
              transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                className={cn(
                    "absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-[0_0_15px_white]",
                    i === 0 ? "bg-amber-400" : i === 1 ? "bg-indigo-400" : "bg-purple-400"
                )}
              />
            </motion.div>
          ))}
        </div>

        {/* Text Content */}
        <div className="text-center space-y-4 px-6 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter italic leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {t('loading.title')}
            </h2>
            <div className="h-1 w-32 bg-linear-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2 rounded-full" />
          </motion.div>
          
          {/* Cosmic Progress Indicator */}
          <div className="relative w-full h-1 bg-white/5 rounded-full overflow-hidden mt-8">
            <motion.div 
              animate={{ left: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute w-1/2 h-full bg-linear-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_10px_#f59e0b]"
            />
          </div>
        </div>
      </div>

      {/* Decorative Cosmic Text */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.03] whitespace-nowrap text-[25vw] font-black italic uppercase leading-none text-white">
        {t('loading.bg_text')}
      </div>
    </div>
  );
}