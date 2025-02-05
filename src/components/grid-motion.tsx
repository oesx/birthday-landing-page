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
      const singleCardDuration = 6 // 每张卡片经过一个位置的时间（秒）
      const cardsPerRow = 10 // 每行显示的卡片数
      
      const currentRefs = [...rowRefs.current] // 复制引用以避免 cleanup 问题
      for (const row of currentRefs) {
        if (!row) return

        // 偶数行向左，奇数行向右
        const isEvenRow = currentRefs.indexOf(row) % 2 === 0

        // 创建无限滚动动画
        const tl = gsap.timeline({ repeat: -1 })
        
        if (isEvenRow) {
          // 偶数行向左滚动
          tl.fromTo(row,
            { x: '0%' },
            {
              x: '-100%',
              duration: singleCardDuration * cardsPerRow,
              ease: 'none',
              immediateRender: false
            }
          ).set(row, { x: '0%', immediateRender: false })
        } else {
          // 奇数行向右滚动
          tl.fromTo(row,
            { x: '-100%' },
            {
              x: '0%',
              duration: singleCardDuration * cardsPerRow,
              ease: 'none',
              immediateRender: false
            }
          ).set(row, { x: '-100%', immediateRender: false })
        }
      }
    }

    // 启动自动滚动
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
              <video
                key={`video-${uniqueKey}`}
                className="grid-motion-video"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src={content} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className={`grid-motion-image ${getDynamicBgClass(content)}`} role="img" aria-label="Album cover" />
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
        <div className="grid-motion-container grid grid-rows-4 grid-cols-[100%] gap-[0.1rem]">
          {[...Array(4)].map((_, rowIndex) => {
            // 生成足够多的卡片来实现无限滚动
            const sequence = [...Array(40)].map((_, i) => ({
              content: combinedItems[Math.floor((rowIndex * 19937 + i * 104729) % combinedItems.length)],
              index: i
            }))
            
            return (
              <div
                key={`grid-row-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
rowIndex}`}
                className={cn(
                  "relative w-screen overflow-hidden",
                  "h-full"
                )}
              >
                <div
                  ref={(el: HTMLDivElement | null) => { rowRefs.current[rowIndex] = el }}
                  className="grid-motion-track flex gap-2"
                >
                  {sequence.map(({content, index}) => renderCard(content, rowIndex, index))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
