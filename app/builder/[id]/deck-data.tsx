import { db } from "@/server/db";
import {
  cardsTable,
  decksTable,
  deckCardsTable,
  user,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import BuilderCards from "@/components/builder-cards";

type DeckDataProps = {
  deckId: number;
};

export default async function DeckData({ deckId }: DeckDataProps) {
  const decks = await db
    .select({
      id: decksTable.id,
      name: decksTable.name,
      description: decksTable.description,
      userId: decksTable.userId,
      isPublic: decksTable.isPublic,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
      authorName: user.name,
    })
    .from(decksTable)
    .leftJoin(user, eq(decksTable.userId, user.id))
    .where(eq(decksTable.id, deckId));

  if (decks.length === 0) {
    return null;
  }

  const deck = decks[0];

  const deckCards = await db
    .select({
      card: cardsTable,
      quantity: deckCardsTable.quantity,
    })
    .from(deckCardsTable)
    .leftJoin(cardsTable, eq(deckCardsTable.cardId, cardsTable.id))
    .where(eq(deckCardsTable.deckId, deckId));

  const allCards = await db.select().from(cardsTable);

  return (
    <BuilderCards
      cards={allCards}
      existingDeck={{
        id: deck.id,
        name: deck.name,
        description: deck.description || "",
        userId: deck.userId,
        createdAt: deck.createdAt,
        updatedAt: deck.updatedAt,
        authorName: deck.authorName,
        isPublic: deck.isPublic,
        cards: deckCards
          .filter(
            (
              item,
            ): item is {
              card: NonNullable<typeof item.card>;
              quantity: number;
            } => item.card !== null,
          )
          .map((item) => ({
            card: item.card,
            count: item.quantity,
          })),
      }}
    />
  );
}
