"use client"

import React from "react"

import { cn } from "@/lib/utils"

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const [meteorStyles, setMeteorStyles] = React.useState<Array<React.CSSProperties & Record<string, string>>>([]);

  React.useEffect(() => {
    if (!isMounted || typeof window === "undefined") {
      setMeteorStyles([]);
      return;
    }

    const styles = [...new Array(number)].map(() => ({
      "--angle": -angle + "deg",
      top: "-5%",
      left: `calc(0% + ${Math.floor(Math.random() * window.innerWidth)}px)`,
      animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
      animationDuration:
        Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) +
        "s",
    }));

    setMeteorStyles(styles);
  }, [isMounted, number, minDelay, maxDelay, minDuration, maxDuration, angle]);

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head
        <span
          key={idx}
          style={{ 
            ...style,
            transformOrigin: "0 0",
            boxShadow: isDark 
              ? "0 0 20px 8px rgba(229, 231, 235, 0.6), 0 0 40px 15px rgba(229, 231, 235, 0.3)"
              : "0 0 20px 8px rgba(56, 189, 248, 0.6), 0 0 40px 15px rgba(56, 189, 248, 0.3)",
          } as React.CSSProperties}
          className={cn(
            "animate-meteor pointer-events-none absolute size-0.5 rounded-full bg-sky-400 dark:bg-white",
            className
          )}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-12.5 -translate-y-1/2 bg-linear-to-r from-sky-400 dark:from-zinc-200 via-sky-300 dark:via-zinc-200 to-transparent" />
        </span>
      ))}
    </>
  )
}
