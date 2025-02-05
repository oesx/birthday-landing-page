"use client";

import { AlbumBackground } from "./album-background";

export function HomePage() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 专辑墙背景 */}
      <div className="absolute inset-0 z-0">
        <AlbumBackground />
      </div>

      {/* 主标题 */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="space-y-12 text-center">
          <h1 className="text-9xl font-noto font-medium tracking-[0.2em] text-white/95 leading-none">靖宇</h1>
          <div className="space-y-3">
            <h2 className="text-3xl font-cormorant tracking-[0.8em] text-white uppercase">KUNMING</h2>
            <p className="text-lg font-noto tracking-[0.5em] text-white">二零二五年二月七日</p>
          </div>
        </div>
      </div>
    </div>
  );
}
