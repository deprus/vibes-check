import { notFound } from "next/navigation";
import BuilderCards from "@/components/builder-cards";
import { db } from "@/server/db";
import {
  cardsTable,
  decksTable,
  deckCardsTable,
  user,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type EditDeckPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDeckPage({ params }: EditDeckPageProps) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const deckId = parseInt(id);

  if (isNaN(deckId)) {
    notFound();
  }

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
      colorStats: decksTable.colorStats,
    })
    .from(decksTable)
    .leftJoin(user, eq(decksTable.userId, user.id))
    .where(eq(decksTable.id, deckId));

  if (decks.length === 0) {
    notFound();
  }

  const deck = decks[0];

  if (deck.userId !== session.user.id) {
    redirect("/my-decks");
  }

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
        colorStats: deck.colorStats as { [color: string]: number },
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
