export type Color =
  | "blue"
  | "red"
  | "yellow"
  | "green"
  | "purple"
  | "colorless";

export type Category = "action" | "penguin" | "rod" | "relic";

export type Rarity = "common" | "uncommon" | "rare" | "epic";

export type CardType = {
  id: number;
  name: string;
  category: Category;
  color: Color;
  rarity: Rarity;
  cost: number;
  img: string;
};

export type Deck = {
  id: number;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  authorName: string | null;
  cards?: {
    card: CardType;
    count: number;
  }[];
  isPublic: boolean;
};

export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};
