"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { MessageWall } from "./message-wall";

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const handleClick = async () => {
    if (!isPlaying) {
      try {
        setIsPlaying(true);
        if (videoRef.current) {
          await videoRef.current.play();
        }
        if (audioRef.current) {
          await audioRef.current.play();
        }
      } catch (error) {
        console.error('Error playing media:', error);
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="relative min-h-[200vh] bg-black overflow-hidden" ref={containerRef}>
      <button 
        className="sticky top-0 h-screen overflow-hidden w-full border-none bg-transparent" 
        onClick={handleClick}
        type="button"
      >
        {/* 视频背景 */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover video-background ${isPlaying ? 'playing' : ''}`}
          playsInline
          muted
          loop
          aria-label="背景视频"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          <track kind="captions" src="/videos/captions.vtt" srcLang="zh" label="中文字幕" />
        </video>

        {/* 音频 */}
        <audio ref={audioRef} loop>
          <source src="/audio/background.mp3" type="audio/mp3" />
          <track kind="captions" src="/audio/captions.vtt" srcLang="zh" label="中文字幕" />
        </audio>
        
        {/* 主要内容 */}
        <motion.div 
          className="relative z-10 flex flex-col items-center justify-center h-screen px-4"
          style={{ opacity, scale }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="main-text text-[12vw] md:text-[10vw] tracking-[0.2em] leading-none font-bold text-white relative"
            data-text="靖宇"
          >
            靖宇
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="location mt-8 text-2xl md:text-3xl tracking-[0.5em] font-light text-blue-100"
          >
            KUNMING
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="date mt-6 text-lg md:text-xl tracking-[0.3em] font-light text-blue-50/80"
          >
            二零二五年二月七日
          </motion.div>

          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
              <span className="text-sm tracking-widest text-blue-100/70">
                点击任意位置开始
              </span>
            </motion.div>
          )}
        </motion.div>
      </button>

      {/* 留言墙部分 */}
      <div className="relative z-10 min-h-screen bg-black">
        <div className="container mx-auto px-4 py-16">
          <MessageWall />
        </div>
      </div>
    </div>
  );
}
