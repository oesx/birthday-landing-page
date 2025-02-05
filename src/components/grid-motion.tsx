'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { cn } from "@/lib/utils"
import '@/styles/grid-motion.css'
import type { ReactNode } from 'react'

type RowRef = HTMLDivElement | null

interface GridMotionProps {
  items?: (string | ReactNode)[]
  gradientColor?: string
  className?: string
  onItemClick?: (index: number) => void
  isLoaded?: boolean
}

const defaultItems = Array.from({ length: 10 }, (_, index) => `Item ${index + 1}`)

function getDynamicBgClass(url: string): string {
  // Generate a simple classname by removing non-alphanumeric characters
  const className = `dyn-bg-${url.replace(/[^a-z0-9]/gi, '')}`;
  if (typeof document !== 'undefined' && !document.getElementById(className)) {
    const style = document.createElement('style');
    style.id = className;
    style.innerHTML = `.${className} { background-image: url("${url}"); }`;
    document.head.appendChild(style);
  }
  return className;
}

export function GridMotion({
  items = [],
  gradientColor = 'black',
  className,
  onItemClick
}: GridMotionProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<RowRef[]>([])
  const mouseXRef = useRef(0)

  const combinedItems = items?.length ? items.slice(0, 10) : defaultItems

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const mouseX = e.clientX
    const centerX = window.innerWidth / 2
    const deltaX = (mouseX - centerX) / centerX

    const currentRefs = [...rowRefs.current]
    for (const row of currentRefs) {
      if (!row) continue

      const animation = gsap.getTweensOf(row)[0]
      if (!animation) continue

      // 根据鼠标位置调整速度
      const speedFactor = 1 + (deltaX * 0.3)
      const timeScale = Math.max(0.5, Math.min(1.5, speedFactor))
      animation.timeScale(timeScale)
    }
  }, [])

  useEffect(() => {
    mouseXRef.current = window.innerWidth / 2
    gsap.ticker.lagSmoothing(0)

    // 自动滚动动画
    const autoScroll = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      
      // 移动端使用更简单的动画
      if (isMobile) {
        const currentRefs = [...rowRefs.current]
        for (const row of currentRefs) {
          if (!row) continue

          const isEvenRow = currentRefs.indexOf(row) % 2 === 0
          const startX = isEvenRow ? 0 : -100
          const endX = isEvenRow ? -100 : 0
          
          gsap.set(row, { xPercent: startX })
          
          gsap.to(row, {
            xPercent: endX,
            duration: 15,
            ease: 'none',
            repeat: -1,
            yoyo: true
          })
        }
      } else {
        // 桌面端保持原有动画
        const cardsPerRow = 20
        const singleCardDuration = 8
        
        const currentRefs = [...rowRefs.current]
        for (const row of currentRefs) {
          if (!row) continue

          const isEvenRow = currentRefs.indexOf(row) % 2 === 0
          const tl = gsap.timeline({ 
            repeat: -1,
            defaults: {
              ease: 'none',
              duration: singleCardDuration * cardsPerRow,
            }
          })
          
          if (isEvenRow) {
            tl.fromTo(row,
              { xPercent: 0 },
              { xPercent: -100 }
            ).set(row, { xPercent: 0 })
          } else {
            tl.fromTo(row,
              { xPercent: -100 },
              { xPercent: 0 }
            ).set(row, { xPercent: -100 })
          }
        }
      }
    }

    autoScroll()
    
    // 添加鼠标交互
    window.addEventListener('mousemove', handleMouseMove)

    // 添加窗口大小变化监听
    const handleResize = () => {
      mouseXRef.current = window.innerWidth / 2
      // 重新初始化滚动
      const currentRefs = [...rowRefs.current] // 复制引用以避免 cleanup 问题
      for (const row of currentRefs) {
        if (row) gsap.killTweensOf(row)
      }
      autoScroll()
    }
    window.addEventListener('resize', handleResize)

    const currentRows = [...rowRefs.current];
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      for (const row of currentRows) {
        if (row) gsap.killTweensOf(row)
      }
    }
  }, [handleMouseMove])

  const renderCard = (content: string | ReactNode, rowIndex: number, i: number) => {
    const uniqueKey = `item-${rowIndex}-${i}`
    const isPortrait = typeof window !== 'undefined' && window.matchMedia('(orientation: portrait)').matches
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    
    // 计算当前卡片是否在可视区域内
    const isInViewport = () => {
      if (typeof window === 'undefined') return true
      const viewportHeight = window.innerHeight
      const cardHeight = isPortrait ? 60 : (isMobile ? 80 : 180)
      const rowPosition = rowIndex * cardHeight
      return rowPosition >= -cardHeight && rowPosition <= viewportHeight + cardHeight
    }

    // 延迟加载不在可视区域内的卡片
    const shouldLoad = isInViewport()
    
    return (
      <button 
        key={typeof content === 'object' && content !== null && 'id' in content ? 
          String(content.id) : 
          `grid-item-${rowIndex}-${i}-${String(content ?? '')}`}
        type="button"
        className="grid-motion-item" 
        onClick={() => onItemClick?.((rowIndex * 10 + i) % combinedItems.length)}
        onKeyDown={(e) => e.key === 'Enter' && onItemClick?.((rowIndex * 10 + i) % combinedItems.length)}
      >
        {typeof content === 'string' ? (
          content.endsWith('.mp4') ? (
            <div className="grid-motion-content">
              {shouldLoad && (
                <video
                  key={`video-${uniqueKey}`}
                  className="grid-motion-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  width={isPortrait ? "60" : (isMobile ? "80" : "200")}
                  height={isPortrait ? "60" : (isMobile ? "80" : "200")}
                >
                  <source src={content} type="video/mp4" />
                </video>
              )}
            </div>
          ) : (
            <div 
              className={cn(
                'grid-motion-image',
                shouldLoad && 'loaded',
                shouldLoad && getDynamicBgClass(content)
              )} 
              role="img" 
              aria-label="Album cover"
              {...(shouldLoad ? { 'data-bg-url': true, style: { '--bg-url': `url(${content})` } } : {})}
            />
          )
        ) : (
          <div className="grid-motion-text">
            {content}
          </div>
        )}
      </button>
    )
  }

  return (
    <div className={cn("h-full w-full overflow-hidden", className)} ref={gridRef}>
      <section
        className={cn(
          "relative flex h-screen w-full items-center justify-center overflow-hidden",
          "grid-motion-gradient"
        )}
        data-gradient-color={gradientColor}
      >
        <div 
          className={cn(
            "grid-motion-container grid grid-rows-[6] md:grid-rows-4 grid-cols-[100%] gap-[0.1rem]",
            "opacity-100 transition-opacity duration-500"
          )}
        >
          {[...Array(typeof window !== 'undefined' ? 
            // 竖屏设备显示更多行
            window.matchMedia('(orientation: portrait)').matches ? 12 : 
            // 横屏设备和桌面端
            window.innerWidth < 768 ? 8 : 4
          : 4)].map((_, rowIndex) => {
            const isPortrait = typeof window !== 'undefined' && window.matchMedia('(orientation: portrait)').matches;
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            // 竖屏设备每行显示更少的卡片
            const cardsPerRow = isPortrait ? 6 : (isMobile ? 8 : 20);
            const sequence = [...Array(cardsPerRow)].map((_, i) => ({
              content: combinedItems[Math.floor((rowIndex * 19937 + i * 104729) % combinedItems.length)],
              index: i
            }))
            
            return (
              <div
                key={`grid-row-${rowIndex}-${Math.random().toString(36).slice(2, 7)}`}
                className={cn(
                  "relative w-screen overflow-hidden",
                  "h-full"
                )}
              >
                <div
                  ref={(el: HTMLDivElement | null) => { rowRefs.current[rowIndex] = el }}
                  className="grid-motion-track flex gap-2 will-change-transform"               >
                  {sequence.map(({content}, i) => renderCard(content, rowIndex, i))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
