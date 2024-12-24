"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { Card } from "./components/Card";
import { PlayerDashboard } from "./components/PlayerDashboard";
import { CardModal } from "./components/CardModal";
import { Snowfall } from "./components/Snowfall";
import type {
  Player,
  Card as CardType,
  PowerCardType,
  PowerAction,
  PowerActionResult,
} from "./types/game";

const initialPlayers: Player[] = [
  { id: "1", name: "Mom", color: "#FF6B6B", points: 5, shield: 0 },
  { id: "2", name: "Lyssi", color: "#4ECDC4", points: 5, shield: 0 },
  { id: "3", name: "Chris", color: "#45B7D1", points: 5, shield: 0 },
  { id: "4", name: "Dad", color: "#FFB347", points: 5, shield: 0 },
];

const generateInitialCards = (): CardType[] => {
  // Create point cards
  const pointCards: CardType[] = [
    // 10 point cards
    ...[...Array(2)].map((_, i) => ({
      id: `points-10-${i}`,
      type: "points" as const,
      value: 10,
      isUsed: false,
    })),
    // 7 point cards
    ...[...Array(2)].map((_, i) => ({
      id: `points-7-${i}`,
      type: "points" as const,
      value: 7,
      isUsed: false,
    })),
    // 5 point cards
    ...[...Array(3)].map((_, i) => ({
      id: `points-5-${i}`,
      type: "points" as const,
      value: 5,
      isUsed: false,
    })),
    // 3 point cards
    ...[...Array(3)].map((_, i) => ({
      id: `points-3-${i}`,
      type: "points" as const,
      value: 3,
      isUsed: false,
    })),
  ];

  // Create power cards
  const powerCards: CardType[] = [
    // Take/Give cards
    ...[...Array(3)].map((_, i) => ({
      id: `power-takeGive-${i}`,
      type: "power" as const,
      value: 0,
      powerType: "takeGive" as const,
      isUsed: false,
    })),
    // Gamble cards
    ...[...Array(3)].map((_, i) => ({
      id: `power-gamble-${i}`,
      type: "power" as const,
      value: 0,
      powerType: "gamble" as const,
      isUsed: false,
    })),
    // Shield cards
    ...[...Array(2)].map((_, i) => ({
      id: `power-shield-${i}`,
      type: "power" as const,
      value: 0,
      powerType: "shield" as const,
      isUsed: false,
    })),
    // Swap cards
    ...[...Array(4)].map((_, i) => ({
      id: `power-swap-${i}`,
      type: "power" as const,
      value: 0,
      powerType: "swap" as const,
      isUsed: false,
    })),
  ];

  // Create generic prize cards
  const genericPrizes: CardType[] = [
    { id: "prize-high", type: "points", value: 25, isUsed: false },
    { id: "prize-mid", type: "points", value: 1, isUsed: false },
    { id: "prize-low", type: "points", value: 1, isUsed: false },
  ];

  // Combine all cards and shuffle
  const allCards = [...pointCards, ...powerCards, ...genericPrizes];

  // Fisher-Yates shuffle
  for (let i = allCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
  }

  return allCards;
};

const COLUMNS = ["A", "B", "C", "D", "E"];
const ROWS = ["1", "2", "3", "4", "5"];

export default function ChristmasGiftGame() {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [flippedCards, setFlippedCards] = useState<boolean[]>(
    Array(25).fill(false)
  );
  const [gameCards] = useState<CardType[]>(() => {
    const cards = generateInitialCards();

    // Debug logging
    console.log("=== Card Distribution ===");

    const pointCards = cards.filter((c) => c.type === "points");
    console.log("Point Cards:", {
      total: pointCards.length,
      values: pointCards.map((c) => c.value).sort((a, b) => b - a),
      distribution: pointCards.reduce((acc, card) => {
        acc[card.value] = (acc[card.value] || 0) + 1;
        return acc;
      }, {} as Record<number, number>),
    });

    const powerCards = cards.filter((c) => c.type === "power");
    console.log("Power Cards:", {
      total: powerCards.length,
      types: powerCards.reduce((acc, card) => {
        acc[card.powerType!] = (acc[card.powerType!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    });

    return cards;
  });
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const actionProcessedRef = useRef<string>("");
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionResult, setActionResult] = useState<PowerActionResult | null>(
    null
  );
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");

  const handleCardClick = useCallback(
    (card: CardType, index: number) => {
      if (flippedCards[index]) return;

      setFlippedCards((prev) => {
        const newFlipped = [...prev];
        newFlipped[index] = true;
        return newFlipped;
      });

      // For point cards, automatically add points and move to next player
      if (card.type === "points") {
        console.log("Points before update:", players[currentPlayer].points);

        setPlayers((prev) => {
          if (!card.isUsed) {
            const newPlayers = [...prev];
            newPlayers[currentPlayer].points += card.value;
            card.isUsed = true;
            console.log(
              "Points after update:",
              newPlayers[currentPlayer].points
            );
            return newPlayers;
          }
          return prev;
        });

        // Delay moving to next player to allow animation to play
        setCurrentPlayer((prev) => (prev + 1) % players.length);
      } else {
        // For power cards, show the modal
        setSelectedCard(card);
        setShowCardModal(true);
      }
    },
    [flippedCards, currentPlayer, players.length]
  );

  const handleConfirm = useCallback(() => {
    console.log("Page: handleConfirm called");
    if (selectedCard?.type === "points") {
      console.log("Page: Adding points:", selectedCard.value);

      // Use functional update to ensure we're working with latest state
      setPlayers((prev) => {
        // Check if we've already updated points for this card
        if (!selectedCard.isUsed) {
          const newPlayers = [...prev];
          newPlayers[currentPlayer].points += selectedCard.value;
          console.log(
            "Page: New points for player:",
            newPlayers[currentPlayer].points
          );

          // Mark the card as used
          if (selectedCard) {
            selectedCard.isUsed = true;
          }

          return newPlayers;
        }
        return prev; // Return unchanged state if card was already used
      });

      setCurrentPlayer((prev) => (prev + 1) % players.length);
      setShowCardModal(false);
    }
  }, [selectedCard, currentPlayer, players.length]);

  const handlePowerAction = useCallback(
    (action: PowerAction): PowerActionResult => {
      const actionKey = `${selectedCard?.id}-${action.type}-${action.action}`;
      console.log("Attempting action:", actionKey);
      console.log("Current ref value:", actionProcessedRef.current);

      if (actionProcessedRef.current === actionKey) {
        console.log("Skipping duplicate action:", actionKey);
        return {
          title: "Action Already Taken",
          message: "This action has already been processed",
          points: players[currentPlayer].points,
        };
      }

      // Set the ref BEFORE processing the action
      actionProcessedRef.current = actionKey;
      console.log("Set new ref value:", actionProcessedRef.current);

      switch (action.type) {
        case "gamble": {
          const chance = Math.random();
          const isWin = chance > 0.5;
          let newPoints = 0;

          console.log("Starting gamble:", {
            currentPoints: players[currentPlayer].points,
            isWin,
          });

          setPlayers((current) => {
            // Skip if we've already processed this action
            if (selectedCard?.isUsed) {
              console.log("Card already used, skipping update");
              return current;
            }

            const newPlayers = [...current];
            const player = newPlayers[currentPlayer];

            if (isWin) {
              player.points *= 2;
            } else {
              player.points = Math.floor(player.points / 2);
            }

            newPoints = player.points;

            // Mark card as used within the same update
            if (selectedCard) {
              selectedCard.isUsed = true;
            }

            return newPlayers;
          });

          const result = {
            title: isWin ? "Lucky! 🎉" : "Unlucky! 😢",
            message: isWin
              ? `Your points doubled to ${newPoints}!`
              : `Your points were halved to ${newPoints}!`,
            points: newPoints,
            isSuccess: isWin,
          };

          return result;
        }

        case "takeGive": {
          console.log("Starting takeGive action:", {
            action,
            currentPlayer: players[currentPlayer].name,
            currentPoints: players[currentPlayer].points,
          });

          if (!action.targetPlayer) {
            console.log("Error: No target player selected");
            return {
              title: "Error",
              message: "No target player selected",
              points: players[currentPlayer].points,
            };
          }

          const targetPlayerIndex = players.findIndex(
            (p) => p.name === action.targetPlayer
          );

          const actionKey = `${selectedCard?.id}-${action.type}-${action.action}-${action.targetPlayer}`;
          console.log("Action key:", actionKey);
          console.log("Current ref value:", actionProcessedRef.current);

          if (actionProcessedRef.current === actionKey) {
            console.log("Skipping duplicate action");
            return {
              title: "Action Already Taken",
              message: "This action has already been processed",
              points: players[currentPlayer].points,
            };
          }

          let finalCurrentPoints = players[currentPlayer].points;
          let finalTargetPoints = players[targetPlayerIndex].points;

          setPlayers((current) => {
            // Skip if we've already processed this action
            if (selectedCard?.isUsed) {
              console.log("Card already used, skipping update");
              return current;
            }

            const newPlayers = [...current];
            const currentPlayerObj = newPlayers[currentPlayer];
            const targetPlayerObj = newPlayers[targetPlayerIndex];

            console.log("Before points modification:", {
              currentPlayer: currentPlayerObj.name,
              currentPoints: currentPlayerObj.points,
              targetPlayer: targetPlayerObj.name,
              targetPoints: targetPlayerObj.points,
            });

            if (action.action === "take") {
              const pointsToTake = Math.min(7, targetPlayerObj.points);
              targetPlayerObj.points -= pointsToTake;
              currentPlayerObj.points += pointsToTake;
              finalCurrentPoints = currentPlayerObj.points;
              finalTargetPoints = targetPlayerObj.points;

              console.log("After take action:", {
                pointsTaken: pointsToTake,
                newCurrentPoints: currentPlayerObj.points,
                newTargetPoints: targetPlayerObj.points,
              });
            } else if (action.action === "give") {
              const pointsToGive = Math.min(3, currentPlayerObj.points);
              currentPlayerObj.points -= pointsToGive;
              targetPlayerObj.points += pointsToGive;
              finalCurrentPoints = currentPlayerObj.points;
              finalTargetPoints = targetPlayerObj.points;

              console.log("After give action:", {
                pointsGiven: pointsToGive,
                newCurrentPoints: currentPlayerObj.points,
                newTargetPoints: targetPlayerObj.points,
              });
            }

            // Mark card as used within the same update
            if (selectedCard) {
              selectedCard.isUsed = true;
            }

            return newPlayers;
          });

          actionProcessedRef.current = actionKey;

          const isTake = action.action === "take";
          const pointsAmount = isTake ? 7 : 3;

          const result = {
            title: isTake ? "Points Taken!" : "Points Given!",
            message: isTake
              ? `You took ${pointsAmount} points from ${action.targetPlayer}`
              : `You gave ${pointsAmount} points to ${action.targetPlayer}`,
            points: finalCurrentPoints,
            targetPlayer: action.targetPlayer,
          };

          console.log("Action result:", result);
          return result;
        }

        case "swap": {
          console.log("=== Starting Swap Action ===");
          console.log("Initial state:", {
            action,
            currentPlayer: players[currentPlayer].name,
            currentPoints: players[currentPlayer].points,
            selectedCard: selectedCard?.id,
          });

          if (!action.targetPlayer) {
            console.log("❌ Error: No target player selected");
            return {
              title: "Error",
              message: "No target player selected",
              points: players[currentPlayer].points,
            };
          }

          const targetPlayerIndex = players.findIndex(
            (p) => p.name === action.targetPlayer
          );

          const actionKey = `${selectedCard?.id}-${action.type}-${action.action}-${action.targetPlayer}`;
          console.log("🔑 Action tracking:", {
            actionKey,
            currentRef: actionProcessedRef.current,
            cardUsed: selectedCard?.isUsed,
          });

          if (actionProcessedRef.current === actionKey) {
            console.log("⚠️ Skipping duplicate action");
            return {
              title: "Action Already Taken",
              message: "This action has already been processed",
              points: players[currentPlayer].points,
            };
          }

          let finalCurrentPoints = players[currentPlayer].points;
          let finalTargetPoints = players[targetPlayerIndex].points;

          setPlayers((current) => {
            // Skip if we've already processed this action
            if (selectedCard?.isUsed) {
              console.log("Card already used, skipping update");
              return current;
            }

            const newPlayers = [...current];
            const currentPlayerObj = newPlayers[currentPlayer];
            const targetPlayerObj = newPlayers[targetPlayerIndex];

            console.log("Before points swap:", {
              currentPlayer: currentPlayerObj.name,
              currentPoints: currentPlayerObj.points,
              targetPlayer: targetPlayerObj.name,
              targetPoints: targetPlayerObj.points,
            });

            // Perform the swap
            const tempPoints = currentPlayerObj.points;
            currentPlayerObj.points = targetPlayerObj.points;
            targetPlayerObj.points = tempPoints;

            finalCurrentPoints = currentPlayerObj.points;
            finalTargetPoints = targetPlayerObj.points;

            console.log("After points swap:", {
              currentPlayer: currentPlayerObj.name,
              currentPoints: currentPlayerObj.points,
              targetPlayer: targetPlayerObj.name,
              targetPoints: targetPlayerObj.points,
            });

            // Mark card as used within the same update
            if (selectedCard) {
              selectedCard.isUsed = true;
            }

            return newPlayers;
          });

          actionProcessedRef.current = actionKey;

          const result = {
            title: "Points Swapped!",
            message: `Swapped ${finalTargetPoints} points with ${action.targetPlayer}'s ${finalCurrentPoints} points!`,
            points: finalCurrentPoints,
            targetPlayer: action.targetPlayer,
          };

          console.log("Action result:", result);
          return result;
        }

        case "shield": {
          console.log("=== Starting Shield Action ===");

          setPlayers((current) => {
            // Skip if we've already processed this action
            if (selectedCard?.isUsed) {
              console.log("Card already used, skipping update");
              return current;
            }

            const newPlayers = [...current];
            const currentPlayerObj = newPlayers[currentPlayer];

            console.log("🛡️ Before shield activation:", {
              player: currentPlayerObj.name,
              shield: currentPlayerObj.shield,
            });

            // Set shield duration to 2 turns
            currentPlayerObj.shield = 3;

            // Mark card as used within the same update
            if (selectedCard) {
              selectedCard.isUsed = true;
            }

            return newPlayers;
          });

          const result = {
            title: "Shield Activated!",
            message:
              "You are protected from take and swap actions for 2 turns!",
            points: players[currentPlayer].points,
          };

          return result;
        }

        default:
          return {
            title: "Invalid Action",
            message: "This power card type is not supported",
            points: players[currentPlayer].points,
          };
      }
    },
    [currentPlayer, players, selectedCard]
  );

  const handleModalClose = useCallback(() => {
    setShowCardModal(false);
    setActionResult(null);

    // Move to next player when modal closes, regardless of action taken
    if (selectedCard?.type === "power") {
      // Only reduce shield count for players who have an active shield
      setPlayers((current) =>
        current.map((player) => ({
          ...player,
          shield: player.shield > 0 ? player.shield - 1 : 0,
        }))
      );
      setCurrentPlayer((prev) => (prev + 1) % players.length);
    }
  }, [selectedCard?.type, players.length]);

  const cardGrid = (
    <div className="relative">
      {/* Column labels (A-E) */}
      <div className="flex mb-2">
        <div className="w-12"></div>
        {COLUMNS.map((col) => (
          <div key={col} className="w-32 text-center text-xl font-bold">
            {col}
          </div>
        ))}
      </div>

      {/* Grid with row labels */}
      <div className="space-y-2">
        {ROWS.map((row, rowIndex) => (
          <div key={row} className="flex items-center">
            <div className="w-12 text-xl font-bold text-center flex items-center justify-center h-24">
              {row}
            </div>
            <div className="flex items-center justify-between flex-1">
              {gameCards
                .slice(rowIndex * 5, (rowIndex + 1) * 5)
                .map((card, colIndex) => {
                  const index = rowIndex * 5 + colIndex;
                  return (
                    <Card
                      key={index}
                      isFlipped={flippedCards[index]}
                      onClick={() => handleCardClick(card, index)}
                      type={card.type}
                      value={card.value}
                      isCurrentPlayer={currentPlayer === 0}
                      isUsed={card.isUsed}
                      powerType={
                        card.type === "power" ? card.powerType : undefined
                      }
                    />
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const updateShields = useCallback(() => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => ({
        ...player,
        shield: Math.max(0, player.shield - 1),
      }))
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 text-white flex flex-col items-center justify-center p-4">
      <Snowfall />

      <div className="flex gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-8 text-red-500 filter drop-shadow-lg text-center">
            🎄 Holiday Gift Gambit 🎁
          </h1>

          <div className="flex justify-center space-x-4 mb-8 z-10">
            {players.map((player, index) => (
              <PlayerDashboard
                key={player.id}
                player={player}
                isActive={index === currentPlayer}
              />
            ))}
          </div>

          <div className="relative z-10">{cardGrid}</div>
        </div>

        <div className="w-64 bg-white bg-opacity-10 p-4 rounded-lg self-start mt-24">
          <h2 className="text-xl font-bold mb-4">Rules</h2>

          {/* Prize Rules */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Prizes</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Players choose gifts in order of points</li>
              <li>1st: $300 max</li>
              <li>2nd: $200 max</li>
              <li>3rd: $100 max</li>
            </ul>
          </div>

          {/* Power Cards */}
          <div>
            <h3 className="font-bold mb-2">Power Cards</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-lg">🔄</span>
                <span>Take 7 or give 3 of your points</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">🎲</span>
                <span>Double or halve your points</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <span>Shield take/swap for 2 turns</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">⇄</span>
                <span>Swap all your points with another player</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {selectedCard && (
        <CardModal
          isOpen={showCardModal}
          onClose={handleModalClose}
          cardType={selectedCard.type}
          cardValue={selectedCard.value}
          currentPoints={players[currentPlayer].points}
          onConfirm={handleConfirm}
          powerType={selectedCard.powerType}
          players={players
            .filter(
              (p) => p.name !== players[currentPlayer].name && p.shield === 0
            )
            .map((p) => p.name)}
          onPowerAction={handlePowerAction}
          actionResult={actionResult}
          setActionResult={setActionResult}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
        />
      )}
    </div>
  );
}
