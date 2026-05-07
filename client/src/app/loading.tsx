'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function Loading() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full opacity-30 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-72 h-72 bg-amber-500 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[150px]" 
        />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-12">
        {/* Main Loading Animation */}
        <div className="relative flex items-center justify-center">
          {/* Outer Spinning Ring */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 md:w-64 md:h-64 border-4 border-zinc-200 dark:border-white/5 border-t-amber-500 border-r-orange-600 rounded-full"
          />

          {/* Middle Pulse Ring */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-40 h-40 md:w-56 md:h-56 bg-amber-500/10 rounded-full blur-xl"
          />

          {/* Central Image/GIF */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-32 h-32 md:w-48 md:h-48 bg-white dark:bg-zinc-900/80 backdrop-blur-xl p-6 rounded-full border border-zinc-200 dark:border-white/10 shadow-2xl flex items-center justify-center overflow-hidden"
          >
             <Image
                src="https://i.pinimg.com/originals/4d/a4/f3/4da4f37803d15b04003d1667d413554e.gif"
                width={200}
                height={200}
                alt="Cinema Loading" 
                className="w-full h-full object-contain scale-150"
                unoptimized
                priority
              />
          </motion.div>
          
          {/* Floating Cinema Icons */}
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                rotate: [0, 360],
              }}
              style={{
                width: '100%',
                height: '100%',
                rotate: angle,
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.4, 1, 0.4]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]"
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
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-tight">
              {t('loading.title')}
            </h2>
            <div className="h-1 w-24 bg-linear-to-r from-amber-500 to-orange-600 mx-auto mt-2 rounded-full" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm md:text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed"
          >
            {t('loading.subtitle')}
          </motion.p>
          
          {/* Loading Bar */}
          <div className="w-full h-1 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden mt-6">
            <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1/2 h-full bg-linear-to-r from-transparent via-amber-500 to-transparent"
            />
          </div>
        </div>
      </div>

      {/* Decorative Background Text */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.03] whitespace-nowrap text-[25vw] font-black italic uppercase leading-none">
        {t('loading.bg_text')}
      </div>
    </div>
  );
}
