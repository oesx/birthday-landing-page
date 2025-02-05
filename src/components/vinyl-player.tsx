"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Album {
  id: number;
  title: string;
  cover: string;
  isAnimated: boolean;
  songs: {
    title: string;
    url: string;
  }[];
}

interface VinylPlayerProps {
  currentAlbum: Album | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextSong: () => void;
  onPrevSong: () => void;
  currentSongIndex: number;
}

export function VinylPlayer({
  currentAlbum,
  isPlaying,
  onPlayPause,
  onNextSong,
  onPrevSong,
  currentSongIndex,
}: VinylPlayerProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="relative w-40 h-40 group">
        {/* 唱片机底座 - 增强黑胶质感 */}
        <motion.div
          className="absolute inset-0 rounded-full shadow-2xl"
          style={{
            background: `
              radial-gradient(circle at center,
                #000000 0%,
                #1a1a1a 40%,
                #2a2a2a 60%,
                #1a1a1a 80%,
                #000000 100%
              ),
              repeating-radial-gradient(circle at center,
                transparent 0%,
                transparent 5%,
                rgba(0, 0, 0, 0.1) 5.1%,
                transparent 5.2%,
                transparent 7%
              )
            `,
          }}
        />

        {/* 唱片 */}
        {currentAlbum && (
          <motion.div
            className="absolute inset-[25%] rounded-full overflow-hidden"
            animate={{
              rotate: isPlaying ? 360 : 0,
            }}
            transition={{
              duration: 2,
              repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
              ease: "linear",
            }}
          >
            <div className="relative w-full h-full">
              {currentAlbum.isAnimated ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-full"
                >
                  <source src={currentAlbum.cover} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={currentAlbum.cover}
                  alt={currentAlbum.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </div>
          </motion.div>
        )}

        {/* 控制按钮 - 鼠标悬停时显示 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-sm p-2 rounded-full">
            <button
              type="button"
              onClick={onPrevSong}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              title="上一首"
              aria-label="上一首"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
                role="img"
                aria-hidden="true"
              >
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </button>
            <button
              type="button"
              onClick={onPlayPause}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              title="播放/暂停"
              aria-label="播放/暂停"
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>
            <button
              onClick={onNextSong}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              title="下一首"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
                role="img"
                aria-hidden="true"
              >
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* 当前播放信息 - 鼠标悬停时显示 */}
        {currentAlbum && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-sm font-medium truncate">{currentAlbum.title}</p>
            <p className="text-white/70 text-xs truncate">
              {currentAlbum.songs[currentSongIndex].title}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
