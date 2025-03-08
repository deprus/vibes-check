import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DeckData from "./deck-data";
import { db } from "@/server/db";
import { decksTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Loading from "@/components/loading";

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

  const deck = await db
    .select({ userId: decksTable.userId })
    .from(decksTable)
    .where(eq(decksTable.id, deckId))
    .limit(1);

  if (deck.length === 0 || deck[0].userId !== session.user.id) {
    redirect("/my-decks");
  }

  return (
    <Suspense fallback={<Loading />}>
      <DeckData deckId={deckId} />
    </Suspense>
  );
}
