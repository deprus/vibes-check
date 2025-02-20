import CardsSearchFilter from "@/components/cards-search-filter";
import { db } from "@/server/db";
import { cardsTable } from "@/server/db/schema";
import { Suspense } from "react";

export default async function CardsPage() {
  const cards = await db.select().from(cardsTable);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardsSearchFilter cards={cards} />
    </Suspense>
  );
}
