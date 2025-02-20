import { Color } from "./types";

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/cards", label: "Cards" },
  { href: "/builder", label: "Deck Builder" },
  { href: "/decks", label: "Decks" },
];

export const CARD_TYPES = ["action", "penguin", "rod", "relic"];

export const CARD_COLORS = [
  "blue",
  "red",
  "yellow",
  "green",
  "purple",
  "colorless",
] as const;
export const CARD_RARITIES = ["common", "uncommon", "rare", "epic"];

export const backgroundColors: Record<Color, string> = {
  blue: "bg-blue-900",
  red: "bg-red-900",
  yellow: "bg-yellow-700",
  green: "bg-green-900",
  purple: "bg-purple-900",
  colorless: "bg-gray-600",
};
