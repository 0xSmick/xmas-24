"use client";

import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Player {
  id: string;
  name: string;
  points: number;
  shield: number;
  color: string;
}

interface PlayerDashboardProps {
  player: Player;
  isActive: boolean;
}

export function PlayerDashboard({ player, isActive }: PlayerDashboardProps) {
  const [prevPoints, setPrevPoints] = useState(player.points);
  const [animationKey, setAnimationKey] = useState(0);
  const pointDiff = player.points - prevPoints;

  useEffect(() => {
    if (player.points !== prevPoints) {
      setAnimationKey((prev) => prev + 1);
      setPrevPoints(player.points);
    }
  }, [player.points, prevPoints]);

  return (
    <div
      className={`p-4 rounded-lg relative ${
        isActive
          ? "ring-4 ring-yellow-400 animate-pulse bg-opacity-90"
          : "bg-opacity-60"
      }`}
      style={{ backgroundColor: player.color }}
    >
      <div className="flex flex-col items-center">
        <div className="text-lg font-bold">
          {player.name}
          {isActive && <span className="ml-2">🎲</span>}
        </div>
        <div className="text-2xl font-bold">{player.points}</div>
        {player.shield > 0 && <div className="mt-1">🛡️ {player.shield}</div>}

        <AnimatePresence>
          {pointDiff !== 0 && (
            <motion.div
              key={`points-animation-${animationKey}`}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -50 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 text-3xl font-bold"
              style={{
                color: pointDiff > 0 ? "#4ade80" : "#ef4444",
                zIndex: 50,
              }}
            >
              {pointDiff > 0 ? `+${pointDiff}` : pointDiff}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
