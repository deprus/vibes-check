"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { filterCards, getActiveFilterCount, sortCards } from "@/lib/utils";
import { CardType, Deck } from "@/config/types";
import CardsFilter from "./cards-filter";
import CardLibrary from "./deck/card-library";
import SaveDeckDialog from "./deck/save-deck-dialog";
import { ImportDeckDialog } from "./deck/import-deck-dialog";
import DeckEditor from "./deck/deck-editor";
import CardSearch from "./deck/card-search";
import SortSelect from "./deck/sort-select";
import { useDeckManager } from "@/lib/hooks/use-deck-manager";

export default function BuilderCards({
  cards,
  existingDeck,
}: {
  cards: CardType[];
  existingDeck?: Deck;
}) {
  const router = useRouter();
  const {
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
    importDeck,
  } = useDeckManager(existingDeck);

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [selectedColor, setSelectedColor] = useQueryState("color", {
    defaultValue: "",
  });
  const [selectedCost, setSelectedCost] = useQueryState("cost", {
    defaultValue: "",
  });
  const [selectedRarity, setSelectedRarity] = useQueryState("rarity", {
    defaultValue: "",
  });
  const [selectedType, setSelectedType] = useQueryState("type", {
    defaultValue: "",
  });
  const [sortBy, setSortBy] = useQueryState("sort", {
    defaultValue: "name-asc",
  });

  const selectedColors = selectedColor ? selectedColor.split(",") : [];
  const selectedCosts = selectedCost ? selectedCost.split(",") : [];
  const selectedRarities = selectedRarity ? selectedRarity.split(",") : [];
  const selectedTypes = selectedType ? selectedType.split(",") : [];

  const filteredCards = sortCards(
    filterCards(
      cards,
      searchTerm,
      selectedTypes,
      selectedRarities,
      selectedCosts,
      selectedColors,
    ),
    sortBy,
  );

  const handleSaveDeck = async () => {
    const result = await saveDeck();
    setIsSaveDialogOpen(false);

    if (result?.success && result?.deckId) {
      router.push(`/decks/${result.deckId}`);
    }
  };

  const handleImportDeck = (deckData: {
    deckName: string;
    counts: Record<string, number>;
  }) => {
    importDeck(deckData, cards);
  };

  return (
    <div className="w-full py-8">
      <div className="flex flex-col items-start justify-between md:flex-row">
        <div className="mt-4 flex gap-2 md:mt-0">
          <SaveDeckDialog
            open={isSaveDialogOpen}
            onOpenChange={setIsSaveDialogOpen}
            deckName={deckName}
            setDeckName={setDeckName}
            deckDescription={deckDescription}
            setDeckDescription={setDeckDescription}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            onSave={handleSaveDeck}
            isSaving={isSaving}
            isExisting={!!existingDeck}
          />
          <ImportDeckDialog
            open={isImportDialogOpen}
            onOpenChange={setIsImportDialogOpen}
            onImport={handleImportDeck}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_350px]">
        <div className="order-2 lg:order-1">
          <Card className="h-full gap-0">
            <CardHeader>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CardSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <div className="flex-shrink-0">
                    <CardsFilter
                      selectedType={selectedTypes}
                      setSelectedType={setSelectedType}
                      selectedRarity={selectedRarities}
                      setSelectedRarity={setSelectedRarity}
                      selectedColor={selectedColors}
                      setSelectedColor={setSelectedColor}
                      selectedCost={selectedCosts}
                      setSelectedCost={setSelectedCost}
                      activeFilters={getActiveFilterCount(
                        searchTerm,
                        selectedTypes,
                        selectedRarities,
                        selectedCosts,
                        selectedColors,
                      )}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <SortSelect sortBy={sortBy} setSortBy={setSortBy} />
                  <p className="text-muted-foreground text-sm whitespace-nowrap">
                    {filteredCards.length} of {cards.length} cards
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardLibrary
                filteredCards={filteredCards}
                deck={deck}
                getTotalCardCount={getTotalCardCount}
                addCardToDeck={addCardToDeck}
              />
            </CardContent>
          </Card>
        </div>

        <div className="order-1 lg:order-2">
          <DeckEditor
            deck={deck}
            deckStats={getDeckStats()}
            getTotalCardCount={getTotalCardCount}
            decreaseCardCount={decreaseCardCount}
            increaseCardCount={increaseCardCount}
            clearDeck={clearDeck}
            onSave={() => setIsSaveDialogOpen(true)}
            onImport={() => setIsImportDialogOpen(true)}
            isSaving={isSaving}
            isExistingDeck={!!existingDeck}
          />
        </div>
      </div>
    </div>
  );
}
