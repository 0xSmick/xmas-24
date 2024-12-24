"use client";

import { useMemo } from "react";

interface Snowflake {
  id: number;
  left: string;
  size: number;
  opacity: number;
  animationDuration: string;
  animationDelay: string;
}

export function Snowfall() {
  const snowflakes: Snowflake[] = useMemo(() => {
    return Array.from({ length: 150 }).map((_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 1, // 1-5px
      opacity: Math.random() * 0.7 + 0.1, // 0.1-0.8
      animationDuration: `${Math.random() * 15 + 5}s`, // 5-20s
      animationDelay: `-${Math.random() * 15}s`, // 0-15s delay
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full"
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `snowfall ${flake.animationDuration} linear infinite`,
            animationDelay: flake.animationDelay,
            willChange: "transform",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) rotate(0deg);
          }
          100% {
            transform: translateY(calc(100vh + 10px)) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
