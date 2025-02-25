import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { CardType } from "@/config/types";

export const filterCards = (
  cards: CardType[],
  searchTerm: string,
  selectedTypes: string[],
  selectedRarities: string[],
  selectedCosts: string[],
  selectedColors: string[],
) => {
  return cards.filter((card) => {
    const matchesSearch = card.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(card.category);
    const matchesRarity =
      selectedRarities.length === 0 || selectedRarities.includes(card.rarity);
    const matchesCost =
      selectedCosts.length === 0 ||
      selectedCosts.some((cost) => {
        if (cost === "9+") {
          return card.cost >= 9;
        }
        return card.cost.toString() === cost;
      });
    const matchesColor =
      selectedColors.length === 0 || selectedColors.includes(card.color);
    return (
      matchesSearch &&
      matchesType &&
      matchesRarity &&
      matchesCost &&
      matchesColor
    );
  });
};

export const sortCards = (cards: CardType[], sortBy: string) => {
  return [...cards].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "cost-asc":
        return a.cost - b.cost;
      case "cost-desc":
        return b.cost - a.cost;
      default:
        return 0;
    }
  });
};

export const getActiveFilterCount = (
  searchTerm: string,
  selectedTypes: string[],
  selectedRarities: string[],
  selectedCosts: string[],
  selectedColors: string[],
) => {
  let count = 0;
  if (searchTerm) count++;

  count += selectedTypes.filter((type) => type).length;
  count += selectedRarities.filter((rarity) => rarity).length;
  count += selectedCosts.filter((cost) => cost).length;
  count += selectedColors.filter((color) => color).length;

  return count;
};
