#!/bin/bash

# 创建优化后的目录
mkdir -p public/albums/optimized

# 优化 JPG 图片
for img in public/albums/*.jpg; do
  filename=$(basename "$img")
  echo "Optimizing $filename..."
  convert "$img" -strip -quality 80 -resize "800x800>" "public/albums/optimized/$filename"
done

# 优化视频
for video in public/albums/*.mp4; do
  filename=$(basename "$video")
  echo "Optimizing $video..."
  ffmpeg -i "$video" \
    -vf "scale=800:-1" \
    -c:v libx264 \
    -crf 28 \
    -preset medium \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    "public/albums/optimized/$filename"
done
