"use client";

import Link from "next/link";

import { Edit, Share2, Trash2 } from "lucide-react";
import { useState, ChangeEvent } from "react";

import { deleteDeck, saveDeck } from "@/server/actions/decks-actions";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

type Deck = {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  userId: string;
};

type EditDeckState = {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  colorStats: { [color: string]: number };
};

export default function MyDecks({ decks: initialDecks }: { decks: Deck[] }) {
  const [decks, setDecks] = useState(initialDecks);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeletingDeck, setIsDeletingDeck] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingDeck, setEditingDeck] = useState<EditDeckState | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredDecks = decks.filter(
    (deck) =>
      deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deck.description &&
        deck.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

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
        setDecks(decks.filter((deck) => deck.id !== isDeletingDeck));
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

  const handleEditDeck = async () => {
    if (!editingDeck) return;

    setIsEditing(true);

    try {
      const result = await saveDeck({
        id: editingDeck.id,
        name: editingDeck.name,
        description: editingDeck.description,
        isPublic: editingDeck.isPublic,
        cards: [],
        colorStats: editingDeck.colorStats,
      });

      if (result.success) {
        setDecks(
          decks.map((deck) =>
            deck.id === editingDeck.id
              ? {
                  ...deck,
                  name: editingDeck.name,
                  description: editingDeck.description,
                  isPublic: editingDeck.isPublic,
                  updatedAt: new Date(),
                }
              : deck,
          ),
        );
        toast.success("Deck updated successfully");
        setEditingDeck(null);
      } else {
        console.error("Failed to update deck:", result.error);
        toast.error(result.error || "Failed to update deck");
      }
    } catch (error) {
      console.error("Error updating deck:", error);
      toast.error("An error occurred while updating the deck");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6 flex flex-col items-start justify-between md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">My Decks</h1>
          <p className="text-muted-foreground">Manage your created decks</p>
        </div>
        <div className="mt-4 flex gap-2 md:mt-0">
          <Button asChild variant="outline">
            <Link href="/decks">Community Decks</Link>
          </Button>
          <Button asChild>
            <Link href="/builder">Create Deck</Link>
          </Button>
        </div>
      </div>
      <div className="mb-6">
        <Input
          placeholder="Search my decks..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          className="max-w-md"
        />
      </div>
      <Tabs defaultValue="grid">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Showing {filteredDecks.length} of {decks.length} decks
          </p>
        </div>

        {filteredDecks.length === 0 ? (
          <div className="py-12 text-center">
            <h2 className="mb-2 text-xl font-medium">No decks found</h2>
            <p className="text-muted-foreground mb-6">
              You haven&apos;t created any decks yet or none match your search.
            </p>
            <Button asChild>
              <Link href="/builder">Create Your First Deck</Link>
            </Button>
          </div>
        ) : (
          <>
            <TabsContent value="grid" className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDecks.map((deck) => (
                  <Card key={deck.id}>
                    <CardHeader>
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            deck.isPublic
                              ? "bg-green-200 text-green-800"
                              : "bg-amber-200 text-amber-800"
                          }`}
                        >
                          {deck.isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                      <CardTitle>{deck.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        Last updated {formatDate(deck.updatedAt.toISOString())}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/decks/${deck.id}`}>View</Link>
                      </Button>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share</span>
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
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      <Dialog
        open={isDeletingDeck !== null}
        onOpenChange={(open) => !open && setIsDeletingDeck(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              deck and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeletingDeck(null)}>
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
      <Dialog
        open={editingDeck !== null}
        onOpenChange={(open) => !open && setEditingDeck(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Deck</DialogTitle>
            <DialogDescription>
              Make changes to your deck information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editingDeck?.name || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditingDeck((prev) =>
                    prev ? { ...prev, name: e.target.value } : null,
                  )
                }
                placeholder="Deck name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={editingDeck?.description || ""}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setEditingDeck((prev) =>
                    prev ? { ...prev, description: e.target.value } : null,
                  )
                }
                placeholder="Description (optional)"
                className="border-input bg-background focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={editingDeck?.isPublic}
                onCheckedChange={(checked) =>
                  setEditingDeck((prev) =>
                    prev ? { ...prev, isPublic: checked === true } : null,
                  )
                }
              />
              <Label htmlFor="isPublic">Make this deck public</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDeck(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditDeck}
              disabled={isEditing || !editingDeck?.name}
            >
              {isEditing ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
