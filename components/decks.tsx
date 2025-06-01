"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Tabs, TabsContent } from "./ui/tabs";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { deleteDeck } from "@/server/actions/decks-actions";
import { Deck } from "@/config/types";
import { ITEMS_PER_PAGE, getMainColor, FilterState } from "@/lib/deck-utils";
import { DeckFilters } from "./deck/deck-filters";
import { DeckCard } from "./deck/deck-card";
import { DeckPagination } from "./deck/deck-pagination";
import { DeleteDeckDialog } from "./deck/delete-deck-dialog";

interface DecksProps {
  decks: Deck[];
  isMyDecks?: boolean;
}

export default function Decks({ decks, isMyDecks = false }: DecksProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedColors: [],
  });
  const [localDecks, setLocalDecks] = useState(decks);
  const [isDeletingDeck, setIsDeletingDeck] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: session } = useSession();

  const filteredDecks = useMemo(() => {
    return localDecks.filter((deck) => {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        deck.name.toLowerCase().includes(searchLower) ||
        deck.description?.toLowerCase().includes(searchLower) ||
        deck.authorName?.toLowerCase().includes(searchLower);

      const matchesColor =
        filters.selectedColors.length === 0 ||
        filters.selectedColors.includes(getMainColor(deck.colorStats));

      return matchesSearch && matchesColor;
    });
  }, [localDecks, filters]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredDecks.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentDecks = filteredDecks.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );

    return { totalPages, currentDecks };
  }, [filteredDecks, currentPage]);

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: value }));
  }, []);

  const handleColorsChange = useCallback((colors: string[]) => {
    setFilters((prev) => ({ ...prev, selectedColors: colors }));
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, paginationData.totalPages));
      setCurrentPage(validPage);
    },
    [paginationData.totalPages],
  );

  const handleDeleteDeck = useCallback(async () => {
    if (isDeletingDeck === null) return;

    setIsDeleting(true);

    try {
      const result = await deleteDeck(isDeletingDeck);

      if (result.success) {
        setLocalDecks((prev) =>
          prev.filter((deck) => deck.id !== isDeletingDeck),
        );
        toast.success("Deck deleted successfully");
      } else {
        console.error("Failed to delete deck:", result.error);
        toast.error(result.error || "Failed to delete deck");
      }
    } catch (error) {
      console.error("Error deleting deck:", error);
      toast.error("An error occurred while deleting the deck");
    } finally {
      setIsDeletingDeck(null);
      setIsDeleting(false);
    }
  }, [isDeletingDeck]);

  const isOwner = useCallback(
    (deck: Deck) => {
      return session?.user?.id === deck.userId;
    },
    [session?.user?.id],
  );

  const resetFilters = useCallback(() => {
    setFilters({ searchTerm: "", selectedColors: [] });
    setIsFilterOpen(false);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="mx-auto w-full py-8">
      <div className="mb-6 flex flex-col items-start justify-between md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">
            {isMyDecks ? "My Decks" : "Community Decks"}
          </h1>
          <p className="text-muted-foreground">
            {isMyDecks
              ? "Manage your created decks"
              : "Discover decks created by the community"}
          </p>
        </div>
        <div className="mt-4 flex gap-2 md:mt-0">
          <Button asChild variant="outline">
            <Link href={isMyDecks ? "/decks" : "/my-decks"}>
              {isMyDecks ? "Community Decks" : "My Decks"}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/builder">Create Deck</Link>
          </Button>
        </div>
      </div>

      <DeckFilters
        filters={filters}
        onSearchChange={handleSearchChange}
        onColorsChange={handleColorsChange}
        onReset={resetFilters}
        isFilterOpen={isFilterOpen}
        onFilterOpenChange={setIsFilterOpen}
      />

      <Tabs defaultValue="grid">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Showing {paginationData.currentDecks.length} of{" "}
            {filteredDecks.length} decks
            {paginationData.totalPages > 1 &&
              ` (Page ${currentPage} of ${paginationData.totalPages})`}
          </p>
        </div>

        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginationData.currentDecks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                isOwner={isOwner(deck)}
                onDelete={setIsDeletingDeck}
              />
            ))}
          </div>

          <DeckPagination
            currentPage={currentPage}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
          />
        </TabsContent>
      </Tabs>

      <DeleteDeckDialog
        isOpen={isDeletingDeck !== null}
        onOpenChange={() => setIsDeletingDeck(null)}
        onConfirm={handleDeleteDeck}
        isDeleting={isDeleting}
      />
    </div>
  );
}
