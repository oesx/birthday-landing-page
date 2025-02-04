"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  let clickTimer: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        setIsLoaded(true);
        videoRef.current?.play();
        setIsPlaying(true);
      });
    }
  }, []);

  const handleClick = () => {
    if (clickTimer === null) {
      clickTimer = setTimeout(() => {
        if (videoRef.current?.paused) {
          videoRef.current.play();
          setIsPlaying(true);
        }
        clickTimer = null;
      }, 200);
    }
  };

  const handleDoubleClick = () => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }
    if (!videoRef.current?.paused) {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        className="relative w-full h-full"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
        
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="px-6 py-3 bg-black/30 backdrop-blur-sm rounded-full text-blue-100/70 text-sm tracking-wider border border-blue-100/20">
              点击播放背景视频
            </span>
          </motion.div>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-blue-900/10" />
      </motion.div>
    </div>
  );
}
