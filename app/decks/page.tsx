import Decks from "@/components/decks";
import { db } from "@/server/db";
import { decksTable, user } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function DecksPage() {
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
      colorStats: decksTable.colorStats,
    })
    .from(decksTable)
    .leftJoin(user, eq(decksTable.userId, user.id))
    .where(eq(decksTable.isPublic, true))
    .then((results) =>
      results.map((deck) => ({
        ...deck,
        colorStats: deck.colorStats as { [color: string]: number },
      })),
    );

  return <Decks decks={decks} />;
}
