// Constants
export const ITEMS_PER_PAGE = 12;
export const TOTAL_CARDS_IN_DECK = 52;

export const COLOR_MAP: Record<string, string> = {
  blue: "blue",
  red: "red",
  yellow: "yellow",
  green: "green",
  purple: "purple",
  colorless: "gray",
} as const;

// Utility functions
export const getColorGradient = (
  colorStats: Record<string, number>,
): string => {
  if (!colorStats || Object.keys(colorStats).length === 0) {
    return "";
  }

  const sortedColors = Object.entries(colorStats).sort((a, b) => b[1] - a[1]);
  let gradientString = "linear-gradient(to right";
  let position = 0;

  sortedColors.forEach(([color, count]) => {
    const percentage = (count / TOTAL_CARDS_IN_DECK) * 100;
    const startPos = position;
    position += percentage;

    const mappedColor = COLOR_MAP[color] || "gray";
    gradientString += `,${mappedColor} ${startPos.toFixed(0)}%`;
    gradientString += `,${mappedColor} ${position.toFixed(0)}%`;
  });

  return gradientString + ")";
};

export const getMainColor = (colorStats: Record<string, number>): string => {
  if (!colorStats || Object.keys(colorStats).length === 0) {
    return "";
  }

  const sortedColors = Object.entries(colorStats).sort((a, b) => b[1] - a[1]);
  return sortedColors[0][0];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Types
export interface FilterState {
  searchTerm: string;
  selectedColors: string[];
}
