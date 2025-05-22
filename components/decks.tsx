"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { deleteDeck } from "@/server/actions/decks-actions";
import { Deck } from "@/config/types";

const getColorGradient = (colorStats: { [color: string]: number }) => {
  if (!colorStats || Object.keys(colorStats).length === 0) {
    return "";
  }

  const colorMap: Record<string, string> = {
    blue: "blue",
    red: "red",
    yellow: "yellow",
    green: "green",
    purple: "purple",
    colorless: "gray",
  };

  let gradientString = "linear-gradient(to right";
  let position = 0;

  const sortedColors = Object.entries(colorStats).sort((a, b) => b[1] - a[1]);

  const totalCards = Object.values(colorStats).reduce(
    (sum, count) => sum + count,
    0,
  );

  sortedColors.forEach(([color, count]) => {
    const percentage = (count / totalCards) * 100;
    const startPos = position;
    position += percentage;

    gradientString += `,${colorMap[color] || "#6b7282"} ${startPos.toFixed(0)}%`;

    gradientString += `,${colorMap[color] || "#6b7282"} ${position.toFixed(0)}%`;
  });

  gradientString += ")";
  return gradientString;
};

export default function Decks({
  decks,
  isMyDecks = false,
}: {
  decks: Deck[];
  isMyDecks?: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [localDecks, setLocalDecks] = useState(decks);
  const [isDeletingDeck, setIsDeletingDeck] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { data: session } = useSession();

  const filteredDecks = localDecks.filter(
    (deck) =>
      deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deck.description &&
        deck.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (deck.authorName &&
        deck.authorName.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredDecks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDecks = filteredDecks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleDeleteDeck = async () => {
    if (isDeletingDeck === null) return;

    setIsDeleting(true);

    try {
      const result = await deleteDeck(isDeletingDeck);

      if (result.success) {
        setLocalDecks(localDecks.filter((deck) => deck.id !== isDeletingDeck));
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
  };

  const isOwner = (deck: Deck) => {
    return session?.user?.id === deck.userId;
  };

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

      <div className="mb-6">
        <Input
          placeholder="Search decks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Tabs defaultValue="grid">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Showing {currentDecks.length} of {filteredDecks.length} decks
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </div>

        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentDecks.map((deck) => (
              <Card
                key={deck.id}
                className="flex flex-col justify-between pb-0"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {deck.authorName || "Unknown Author"}
                    </span>
                  </div>
                  <CardTitle>{deck.name}</CardTitle>
                </CardHeader>
                <div className="flex flex-col gap-2">
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Last updated {formatDate(deck.updatedAt.toISOString())}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/decks/${deck.id}`}>View</Link>
                    </Button>
                    {isOwner(deck) && (
                      <div className="flex gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Link href={`/builder/${deck.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => setIsDeletingDeck(deck.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                  <div
                    style={{
                      backgroundImage: getColorGradient(deck.colorStats),
                    }}
                    className="h-4 w-full rounded-b-xl"
                  ></div>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog
        open={isDeletingDeck !== null}
        onOpenChange={() => setIsDeletingDeck(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this deck? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeletingDeck(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteDeck}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
