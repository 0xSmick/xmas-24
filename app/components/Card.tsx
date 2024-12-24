"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import type { PowerCardType } from "@/app/types/game";

interface CardProps {
  isFlipped: boolean;
  onClick: () => void;
  type: "points" | "power";
  value: number;
  isCurrentPlayer: boolean;
  isUsed: boolean;
  powerType?: PowerCardType;
}

const getPowerEmoji = (powerType?: PowerCardType): string => {
  switch (powerType) {
    case "takeGive":
      return "🔄";
    case "gamble":
      return "🎲";
    case "shield":
      return "🛡️";
    case "swap":
      return "⇄";
    default:
      return "⚡";
  }
};

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
    <div
      onClick={onClick}
      className={cn(
        "w-20 h-20 bg-white bg-opacity-20 rounded-lg shadow-lg cursor-pointer",
        "transition-transform duration-300",
        isFlipped ? "rotate-y-180 pointer-events-none" : "hover:scale-105",
        isUsed ? "opacity-50" : ""
      )}
    >
      <div className="w-full h-full flex items-center justify-center">
        {isFlipped ? (
          <span className="text-2xl">
            {type === "points" ? `+${value}` : getPowerEmoji(powerType)}
          </span>
        ) : (
          <span className="text-2xl">🎁</span>
        )}
      </div>
    </div>
  );
});
