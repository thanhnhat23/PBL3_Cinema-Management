"use client"

import { useCallback, useEffect, useRef, useState, forwardRef } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"

interface ThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
  renderAs?: "auto" | "button" | "span"
}

export const ThemeToggler = forwardRef<HTMLButtonElement, ThemeTogglerProps>(({
  className,
  duration = 400,
  renderAs = "auto",
  ...props
}, ref) => {
  const [isDark, setIsDark] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)

  const shouldRenderSpan =
    renderAs === "span" ||
    (renderAs === "auto" && Boolean(className?.split(/\s+/).includes("hidden")))

  useEffect(() => {
    // Merge external ref with internal ref
    if (ref) {
      if (typeof ref === 'function') {
        ref(triggerRef.current as HTMLButtonElement | null)
      } else {
        ref.current = triggerRef.current as HTMLButtonElement | null
      }
    }
  }, [ref])

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    // Set initial theme from localStorage or default to dark
    const savedTheme = localStorage.getItem("theme")
    const initialDark = savedTheme === "dark" || !savedTheme
    
    if (initialDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    
    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = useCallback(async () => {
    if (!triggerRef.current) return

    await document.startViewTransition(() => {
      flushSync(() => {
        const newTheme = !isDark
        setIsDark(newTheme)
        document.documentElement.classList.toggle("dark")
        localStorage.setItem("theme", newTheme ? "dark" : "light")
      })
    }).ready

    const { top, left, width, height } =
      triggerRef.current.getBoundingClientRect()
    const x = window.innerWidth - (left + width / 2)
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [isDark, duration])

  if (shouldRenderSpan) {
    return (
      <span
        ref={triggerRef as React.Ref<HTMLSpanElement>}
        onClick={toggleTheme}
        className={cn(className)}
        {...(props as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {isDark ? <Sun /> : <Moon />}
        <span className="sr-only">Toggle theme</span>
      </span>
    )
  }

  return (
    <button
      ref={triggerRef as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={toggleTheme}
      className={cn(className)}
      {...props}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
})

ThemeToggler.displayName = "ThemeToggler"
