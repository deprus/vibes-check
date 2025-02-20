export type Color =
  | "blue"
  | "red"
  | "yellow"
  | "green"
  | "purple"
  | "colorless";

export type CardType = "action" | "penguin" | "rod" | "relic";

export type Rarity = "common" | "uncommon" | "rare" | "epic";

export type Card = {
  id: number;
  name: string;
  type: CardType;
  color: Color;
  rarity: Rarity;
  cost: number;
  img: string;
};
