import { useState } from "react";
import { CardType, Deck } from "@/config/types";
import { CARD_TYPES } from "@/config/constants";
import { saveDeck as saveDeckAction } from "@/server/actions/decks-actions";
import { toast } from "sonner";

export function useDeckManager(existingDeck?: Deck) {
  const [deckName, setDeckName] = useState(existingDeck?.name || "New Deck");
  const [deckDescription, setDeckDescription] = useState(
    existingDeck?.description || "",
  );
  const [isPublic, setIsPublic] = useState(existingDeck?.isPublic || false);
  const [deck, setDeck] = useState<
    Map<string, { card: CardType; count: number }>
  >(() => {
    if (existingDeck && existingDeck.cards) {
      const initialDeck = new Map<string, { card: CardType; count: number }>();
      existingDeck.cards.forEach(({ card, count }) => {
        initialDeck.set(card.name, { card, count });
      });
      return initialDeck;
    }
    return new Map();
  });
  const [isSaving, setIsSaving] = useState(false);

  const getTotalCardCount = () => {
    let count = 0;
    deck.forEach((item) => {
      count += item.count;
    });
    return count;
  };

  const addCardToDeck = (card: CardType) => {
    const currentCount = getTotalCardCount();
    if (currentCount >= 40) return;

    const newDeck = new Map(deck);
    const existingCard = newDeck.get(card.name);

    if (existingCard) {
      if (existingCard.count < 4 && currentCount < 40) {
        newDeck.set(card.name, {
          ...existingCard,
          count: existingCard.count + 1,
        });
      }
    } else {
      newDeck.set(card.name, { card, count: 1 });
    }

    setDeck(newDeck);
  };

  const decreaseCardCount = (cardName: string) => {
    const newDeck = new Map(deck);
    const existingCard = newDeck.get(cardName);

    if (existingCard && existingCard.count > 1) {
      newDeck.set(cardName, { ...existingCard, count: existingCard.count - 1 });
    } else {
      newDeck.delete(cardName);
    }

    setDeck(newDeck);
  };

  const increaseCardCount = (cardName: string) => {
    const currentCount = getTotalCardCount();
    if (currentCount >= 40) return;

    const newDeck = new Map(deck);
    const existingCard = newDeck.get(cardName);

    if (existingCard && existingCard.count < 4) {
      newDeck.set(cardName, { ...existingCard, count: existingCard.count + 1 });
    }

    setDeck(newDeck);
  };

  const getDeckStats = () => {
    return {
      total: getTotalCardCount(),
      byType: CARD_TYPES.reduce(
        (acc, type) => {
          let typeCount = 0;
          deck.forEach(({ card, count }) => {
            if (card.category === type) {
              typeCount += count;
            }
          });
          acc[type] = typeCount;
          return acc;
        },
        {} as Record<string, number>,
      ),
      averageCost:
        getTotalCardCount() > 0
          ? (
              Array.from(deck.values()).reduce(
                (sum, { card, count }) => sum + card.cost * count,
                0,
              ) / getTotalCardCount()
            ).toFixed(1)
          : "0.0",
    };
  };

  const saveDeck = async () => {
    const deckCards = Array.from(deck.values()).map(({ card, count }) => ({
      cardId: card.id,
      quantity: count,
    }));

    console.log("Saving deck:", { name: deckName, cards: deckCards });
    setIsSaving(true);
    try {
      const result = await saveDeckAction({
        id: existingDeck?.id,
        name: deckName,
        cards: deckCards,
        description: deckDescription,
        isPublic: isPublic,
      });
      if (result.error) {
        console.error("Error saving deck:", result.error);
        toast.error(result.error);
        setIsSaving(false);
        return result;
      }
      setIsSaving(false);
      toast.success("Deck saved successfully");
      return result;
    } catch (error) {
      console.error("Error saving deck:", error);
      toast.error("Error saving deck");
      setIsSaving(false);
    }
  };

  const clearDeck = () => setDeck(new Map());

  return {
    deck,
    deckName,
    setDeckName,
    deckDescription,
    setDeckDescription,
    isPublic,
    setIsPublic,
    isSaving,
    addCardToDeck,
    decreaseCardCount,
    increaseCardCount,
    getTotalCardCount,
    getDeckStats,
    saveDeck,
    clearDeck,
  };
}
