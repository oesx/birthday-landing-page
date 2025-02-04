"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { VideoBackground } from "./video-background";
import { Particles } from "./particles";
import { StarBorder } from "./ui/star-border";

export function LandingPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.7) {
        router.push("/messages");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  return (
    <div className="relative min-h-[200vh] overflow-hidden" ref={containerRef}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <VideoBackground />
        
        {/* 主要内容 */}
        <motion.div 
          className="relative z-10 flex flex-col items-center justify-center h-screen px-4"
          style={{ opacity, scale, y }}
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

          {mounted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
              <StarBorder
                color="rgb(255, 255, 255)"
                speed="4s"
                className="group"
              >
                <span className="text-sm tracking-widest text-blue-100/70 group-hover:text-blue-100 transition-colors duration-300">
                  向下滚动查看留言
                </span>
              </StarBorder>
            </motion.div>
          )}
        </motion.div>

        {/* 装饰元素 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="stars-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className={`star star-${i + 1} animate-twinkle`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}
          </div>

          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-900/10 to-blue-900/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />

          <Particles />
          <div className="particles" />
          <div className="overlay" />
          <div className="noise" />
        </div>
      </div>
    </div>
  );
}
