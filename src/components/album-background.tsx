"use client";

import React, { useEffect, useState } from "react";
import { GridMotion } from "./grid-motion";

// 静态图片资源
const staticAlbumCovers = [
  "/albums/optimized/xinyaoye.jpg",
  "/albums/optimized/SZA-LANA.jpg",
  "/albums/optimized/shuqianjieshaonian.jpg",
  "/albums/optimized/MBDTF.jpg",
  "/albums/optimized/blonde.jpg",
  "/albums/optimized/fantexi.jpg",
  "/albums/optimized/woyongshenmebaniliuzhu.jpg",
];

// 视频资源（延迟加载）
const videoAlbumCovers = [
  "/albums/optimized/SOS.mp4",
  "/albums/optimized/NEVER ENOUGH.mp4",
  "/albums/optimized/graduation.mp4",
];

export function AlbumBackground() {
  const [items, setItems] = useState(staticAlbumCovers);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 预加载视频
    const preloadVideos = async () => {
      const loadVideo = (src: string) => {
        return new Promise((resolve) => {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => resolve(src);
          video.onerror = () => resolve(null);
          video.src = src;
        });
      };

      // 并行预加载所有视频
      const loadedVideos = await Promise.all(
        videoAlbumCovers.map(src => loadVideo(src))
      );

      // 过滤掉加载失败的视频
      const validVideos = loadedVideos.filter(Boolean) as string[];
      setItems([...staticAlbumCovers, ...validVideos]);
      setIsLoaded(true);
    };

    // 延迟加载视频，优先显示静态图片
    const timer = setTimeout(preloadVideos, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 z-0">
        <GridMotion
          items={items}
          gradientColor="rgb(0 0 0 / 0.5)"
          isLoaded={isLoaded}
        />
      </div>
    </div>
  );
}
