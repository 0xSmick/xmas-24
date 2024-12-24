export type Player = {
  id: string;
  name: string;
  color: string;
  points: number;
  shield: number;
};

export type Card = {
  id: string;
  type: "points" | "power";
  value: number;
  isUsed: boolean;
  powerType?: PowerCardType;
};

export type PowerCardType = "takeGive" | "gamble" | "shield" | "swap";

export type PowerAction = {
  type: PowerCardType;
  action: string;
  targetPlayer?: string | null;
};

export type PowerActionResult = {
  title: string;
  message: string;
  points: number;
  isSuccess?: boolean;
  targetPlayer?: string;
};
