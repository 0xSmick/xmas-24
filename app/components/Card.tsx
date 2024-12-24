"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { PowerCardType } from "./CardModal";

interface CardProps {
  isFlipped: boolean;
  onClick: () => void;
  type: "points" | "power";
  value: number;
  isCurrentPlayer: boolean;
  isUsed: boolean;
  powerType?: PowerCardType;
}

export const Card = memo(function Card({
  isFlipped,
  onClick,
  type,
  value,
  isCurrentPlayer,
  isUsed,
  powerType,
}: CardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs mb-1 text-white">
        {type === "power" ? `${powerType} (${value})` : `points: ${value}`}
      </div>

      <div
        className={`w-20 h-20 bg-white bg-opacity-20 rounded-lg shadow-lg cursor-pointer 
          transition-transform duration-300 ${isFlipped ? "rotate-y-180" : ""} 
          ${isUsed ? "opacity-50" : ""}`}
        onClick={onClick}
      >
        <div className="w-full h-full flex items-center justify-center">
          {isFlipped ? (
            <span className="text-2xl">
              {type === "points" ? `+${value}` : "⚡"}
            </span>
          ) : (
            <span className="text-2xl">🎁</span>
          )}
        </div>
      </div>
    </div>
  );
});
