"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  PowerCardType,
  PowerAction,
  PowerActionResult,
} from "@/app/types/game";

// Add new types for power cards
export type PowerCardType = "takeGive" | "gamble" | "shield" | "swap";
export type PowerCardState = "reveal" | "action" | "confirmation";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardType: "points" | "power";
  cardValue: number;
  currentPoints: number;
  onConfirm: () => void;
  powerType?: PowerCardType;
  players?: string[];
  onPowerAction?: (action: PowerAction) => PowerActionResult;
  actionResult?: PowerActionResult | null;
  setActionResult: (result: PowerActionResult | null) => void;
  selectedPlayer?: string;
  setSelectedPlayer: (player: string) => void;
}

export function CardModal({
  isOpen,
  onClose,
  cardType,
  cardValue,
  powerType,
  currentPoints,
  onConfirm,
  players,
  onPowerAction,
  actionResult,
  setActionResult,
  selectedPlayer,
  setSelectedPlayer,
}: CardModalProps) {
  const renderPowerContent = () => {
    if (cardType === "power" && powerType) {
      switch (powerType) {
        case "gamble":
          // Show result if we have one
          if (actionResult) {
            return (
              <div className="space-y-4">
                <p className="text-center font-bold text-xl">
                  {actionResult.title}
                </p>
                <p className="text-center">{actionResult.message}</p>
                <DialogFooter>
                  <Button onClick={onClose}>Close</Button>
                </DialogFooter>
              </div>
            );
          }

          // Show initial gamble UI
          return (
            <div className="space-y-4">
              <p className="font-bold text-center">
                Current Points: {currentPoints}
              </p>
              <p className="text-center">
                Flip a coin: Heads doubles your points, Tails halves them!
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => {
                    const result = onPowerAction({
                      type: "gamble",
                      action: "flip",
                    });
                    setActionResult(result);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Flip Coin
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          );

        case "takeGive":
          // Show result if we have one
          if (actionResult) {
            return (
              <div className="space-y-4">
                <p className="text-center font-bold text-xl">
                  {actionResult.title}
                </p>
                <p className="text-center">{actionResult.message}</p>
                <DialogFooter>
                  <Button onClick={onClose}>Close</Button>
                </DialogFooter>
              </div>
            );
          }

          // Show initial takeGive UI
          return (
            <div className="space-y-4">
              <p className="text-center">
                Choose an action and a target player:
              </p>
              <div className="flex flex-col gap-4">
                <select
                  value={selectedPlayer}
                  className="mt-2 p-2 rounded bg-gray-700 text-white"
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                >
                  <option value="">Select a player</option>
                  {players?.map((player) => (
                    <option key={player} value={player}>
                      {player}
                    </option>
                  ))}
                </select>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => {
                      const result = onPowerAction({
                        type: "takeGive",
                        action: "take",
                        targetPlayer: selectedPlayer,
                      });
                      setActionResult(result);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!selectedPlayer}
                  >
                    Take 7 Points
                  </Button>
                  <Button
                    onClick={() => {
                      const result = onPowerAction({
                        type: "takeGive",
                        action: "give",
                        targetPlayer: selectedPlayer,
                      });
                      setActionResult(result);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!selectedPlayer}
                  >
                    Give 3 Points
                  </Button>
                  <Button
                    onClick={onClose}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          );

        case "swap":
          // Show result if we have one
          if (actionResult) {
            return (
              <div className="space-y-4">
                <p className="text-center font-bold text-xl">
                  {actionResult.title}
                </p>
                <p className="text-center">{actionResult.message}</p>
                <DialogFooter>
                  <Button onClick={onClose}>Close</Button>
                </DialogFooter>
              </div>
            );
          }

          // Show initial swap UI
          return (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>Swap Points</DialogTitle>
                <DialogDescription>
                  Choose a player to swap points with. Your current points:{" "}
                  {currentPoints}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <select
                  value={selectedPlayer}
                  className="mt-2 p-2 rounded bg-gray-700 text-white"
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                >
                  <option value="">Select a player</option>
                  {players?.map((player) => (
                    <option key={player} value={player}>
                      {player}
                    </option>
                  ))}
                </select>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => {
                      const result = onPowerAction({
                        type: "swap",
                        action: "swap",
                        targetPlayer: selectedPlayer,
                      });
                      setActionResult(result);
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!selectedPlayer}
                  >
                    Swap Points
                  </Button>
                  <Button
                    onClick={onClose}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          );

        // Other power types will go here
        default:
          return null;
      }
    }

    // Points card handling
    return (
      <div className="space-y-4">
        <p className="text-center">You got {cardValue} points!</p>
        <DialogFooter>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>{renderPowerContent()}</DialogContent>
    </Dialog>
  );
}

// Helper functions for power card text
function getPowerCardDescription(powerType?: PowerCardType): string {
  switch (powerType) {
    case "takeGive":
      return "You can either take 7 points from another player or give 3 points to another player.";
    case "gamble":
      return "Take a chance to double your points or lose half of them!";
    case "shield":
      return "Protect yourself from other players' actions for 3 turns.";
    case "swap":
      return "Swap your points with another player.";
    default:
      return "";
  }
}

function getPowerCardConfirmation(
  powerType?: PowerCardType,
  action?: string,
  targetPlayer?: string
): string {
  switch (powerType) {
    case "takeGive":
      return action === "take"
        ? `You took 7 points from ${targetPlayer}`
        : `You gave 3 points to ${targetPlayer}`;
    case "gamble":
      return `Coin flip complete! Check your new point total!`;
    case "shield":
      return "Shield activated! You're protected for 3 turns.";
    case "swap":
      return `You swapped points with ${targetPlayer}!`;
    default:
      return "";
  }
}
