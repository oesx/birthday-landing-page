"use client";

import React from "react";
import { GridMotion } from "./grid-motion";

const albumCovers = [
  "/albums/xinyaoye.jpg",
  "/albums/SZA-LANA.jpg",
  "/albums/shuqianjieshaonian.jpg",
  "/albums/MBDTF.jpg",
  "/albums/blonde.jpg",
  "/albums/fantexi.jpg",
  "/albums/woyongshenmebaniliuzhu.jpg",
  "/albums/SOS.mp4",
  "/albums/NEVER ENOUGH.mp4",
  "/albums/graduation.mp4",
];

export function AlbumBackground() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 z-0">
        <GridMotion
          items={albumCovers}
          gradientColor="rgb(0 0 0 / 0.5)"
        />
      </div>
    </div>
  );
}
