"use client";

import { useEffect } from "react";

export function Particles() {
  useEffect(() => {
    const particlesContainer = document.querySelector(".particles") as HTMLDivElement;
    if (!particlesContainer) return;

    const particleCount = 50;

    function createParticle() {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Random size between 2 and 6 pixels
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Random starting position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      // Add animation
      particle.style.animation = `
        float ${Math.random() * 3 + 2}s ease-in-out infinite,
        fadeIn ${Math.random() * 2 + 1}s ease-in
      `;

      particlesContainer.appendChild(particle);
    }

    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
      createParticle();
    }

    // Add 3D rotation effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const location = document.querySelector(".location") as HTMLDivElement;
      const mainText = document.querySelector(".main-text") as HTMLDivElement;
      if (!location || !mainText) return;

      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

      location.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      mainText.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      particlesContainer.innerHTML = "";
    };
  }, []);

  return null;
}
