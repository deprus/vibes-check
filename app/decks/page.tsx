import Decks from "@/components/decks";
import Loading from "@/components/loading";
import { db } from "@/server/db";
import { decksTable, user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { Suspense } from "react";

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
    })
    .from(decksTable)
    .leftJoin(user, eq(decksTable.userId, user.id))
    .where(eq(decksTable.isPublic, true));

  return (
    <Suspense fallback={<Loading />}>
      <Decks decks={decks} />{" "}
    </Suspense>
  );
}
