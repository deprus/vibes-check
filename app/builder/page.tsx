import BuilderCards from "@/components/builder-cards";
import { db } from "@/server/db";
import { cardsTable } from "@/server/db/schema";
import { Suspense } from "react";
export default async function DeckBuilderPage() {
  const cards = await db.select().from(cardsTable);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuilderCards cards={cards} />
    </Suspense>
  );
}
