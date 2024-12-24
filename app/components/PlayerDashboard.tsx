"use client";

import { memo } from "react";

interface Player {
  id: string;
  name: string;
  points: number;
  shield: number;
  color: string;
}

interface PlayerDashboardProps {
  player: Player;
  isCurrentTurn: boolean;
  isActive: boolean;
}

export function PlayerDashboard({
  player,
  isActive,
}: {
  player: Player;
  isActive: boolean;
}) {
  return (
    <div
      className={`
        p-4 rounded-lg
        ${
          isActive
            ? "ring-4 ring-yellow-400 animate-pulse bg-opacity-90"
            : "bg-opacity-60"
        }
        transition-all duration-3000
      `}
      style={{ backgroundColor: player.color }}
    >
      <div className="flex flex-col items-center">
        <div className="text-lg font-bold">
          {player.name}
          {isActive && <span className="ml-2">🎲</span>}
        </div>
        <div className="text-2xl font-bold">{player.points}</div>
        {player.shield > 0 && <div className="mt-1">🛡️ {player.shield}</div>}
      </div>
    </div>
  );
}
