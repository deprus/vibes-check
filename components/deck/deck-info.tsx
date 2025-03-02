import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { decksTable, user } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function DeckInfo({ deckId }: { deckId: number }) {
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

  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold">{deck.name}</h1>
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