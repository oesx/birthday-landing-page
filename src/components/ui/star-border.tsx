import { cn } from "@/lib/utils"
import type { ElementType, ComponentPropsWithoutRef } from "react"

interface StarBorderProps<T extends ElementType> {
  as?: T
  color?: string
  speed?: string
  className?: string
  children: React.ReactNode
}

export function StarBorder<T extends ElementType = "button">({ 
  as,
  className,
  color,
  speed = "6s",
  children,
  ...props
}: StarBorderProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = as || "button"
  const defaultColor = color || "hsl(var(--foreground))"

  return (
    <Component 
      className={cn(
        "relative inline-block py-[1px] overflow-hidden rounded-[20px] cursor-pointer",
        className
      )} 
      {...props}
      type="button"
    >
      <div
        className={cn(
          "absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0",
          "opacity-20 dark:opacity-70",
          "star-border-gradient"
        )}
        data-star-color={defaultColor}
        data-animation-speed={speed}
      />
      <div
        className={cn(
          "absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0",
          "opacity-20 dark:opacity-70",
          "star-border-gradient"
        )}
        data-star-color={defaultColor}
        data-animation-speed={speed}
      />
      <div className={cn(
        "relative z-1 border text-white text-center text-base py-2.5 px-6 rounded-[20px]",
        "bg-black/80 backdrop-blur-sm border-white/20 hover:bg-black/90 transition-colors duration-300"
      )}>
        {children}
      </div>
    </Component>
  )
}
