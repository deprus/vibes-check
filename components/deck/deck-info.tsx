import { notFound } from "next/navigation";
import { db } from "@/server/db";
import {
  decksTable,
  user,
  deckCardsTable,
  cardsTable,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { CopyDeckButton } from "./copy-deck-button";

export async function DeckInfo({ deckId }: { deckId: number }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const decks = await db
    .select({
      id: decksTable.id,
      name: decksTable.name,
      description: decksTable.description,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
      isPublic: decksTable.isPublic,
      userId: decksTable.userId,
      authorName: user.name,
    })
    .from(decksTable)
    .leftJoin(user, eq(decksTable.userId, user.id))
    .where(eq(decksTable.id, deckId));

  if (decks.length === 0) {
    notFound();
  }

  const deck = decks[0];
  const isOwner = session?.user?.id === deck.userId;

  const deckCards = await db
    .select({
      card: cardsTable,
      quantity: deckCardsTable.quantity,
    })
    .from(deckCardsTable)
    .leftJoin(cardsTable, eq(deckCardsTable.cardId, cardsTable.id))
    .where(eq(deckCardsTable.deckId, deckId));

  return (
    <div className="mb-8">
      <div className="flex flex-col justify-between md:flex-row md:items-center">
        <h1 className="mb-2 text-xl font-bold md:text-3xl">{deck.name}</h1>
        <div className="flex gap-2 md:items-center">
          <CopyDeckButton deckName={deck.name} deckCards={deckCards} />
          {isOwner && (
            <Button asChild variant="ghost" size="icon">
              <Link href={`/builder/${deck.id}`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit deck</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
      {deck.description && (
        <p className="mb-4 break-words text-gray-600">{deck.description}</p>
      )}
      <div className="text-sm text-gray-500">
        Created by {deck.authorName || "Unknown"} • Last updated{" "}
        {new Date(deck.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
