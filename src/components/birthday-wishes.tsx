"use client";

import React from "react";
import { VelocityScroll } from "./ui/velocity-scroll";

const birthdayWishes = [
  "生日快乐！愿你的人生如彩虹般绚丽！🌈",
  "Happy Birthday! May your life be filled with joy! 🎉",
  "祝你生日快乐，心想事成！🎂",
  "又长大一岁啦！生日快乐！🎈",
  "愿你的生活充满色彩！🎨",
  "Happy Birthday! Wishing you all the best! 🌟",
  "生日快乐！新的一年，新的开始！✨",
  "Happy Birthday! May all your dreams come true! 🌙",
  "祝你开心每一天！生日快乐！🎁",
  "生日快乐！愿你永远年轻快乐！💫"
];

export function BirthdayWishes() {
  return (
    <div className="flex flex-col gap-24 py-12 w-full overflow-hidden">
      <VelocityScroll 
        text={birthdayWishes[0]} 
        default_velocity={2} 
        className="text-5xl font-bold text-white tracking-[0.2em] whitespace-nowrap"
      />
      <VelocityScroll 
        text={birthdayWishes[1]} 
        default_velocity={3} 
        className="text-5xl font-bold text-blue-400 tracking-[0.2em] whitespace-nowrap"
      />
      <VelocityScroll 
        text={birthdayWishes[2]} 
        default_velocity={4} 
        className="text-5xl font-bold text-pink-400 tracking-[0.2em] whitespace-nowrap"
      />
    </div>
  );
}
