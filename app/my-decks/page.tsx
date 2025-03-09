import Decks from "@/components/decks";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { decksTable, user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function DecksContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

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
    .where(eq(decksTable.userId, session.user.id));

  return <Decks decks={decks} isMyDecks={true} />;
}

export default function DecksPage() {
  return <DecksContent />;
}
