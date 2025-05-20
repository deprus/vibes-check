import { db } from "@/server/db";
import { decksTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import ProfileClient from "./profile-client";
import { Deck } from "@/config/types";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const recentDecks = await db
    .select({
      id: decksTable.id,
      name: decksTable.name,
      description: decksTable.description,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
      isPublic: decksTable.isPublic,
      userId: decksTable.userId,
      colorStats: decksTable.colorStats,
    })
    .from(decksTable)
    .where(eq(decksTable.userId, session.user.id))
    .orderBy(decksTable.updatedAt)
    .limit(5);

  const mappedDecks: Deck[] = recentDecks.map((deck) => ({
    ...deck,
    colorStats: deck.colorStats as { [color: string]: number },
    authorName: session.user.name ?? "Unknown Author",
  }));

  return <ProfileClient user={session.user} recentDecks={mappedDecks} />;
}
