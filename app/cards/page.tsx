import CardsSearchFilter from "@/components/cards-search-filter";
import Loading from "@/components/loading";
import { db } from "@/server/db";
import { cardsTable } from "@/server/db/schema";
import { Suspense } from "react";

export default async function CardsPage() {
  const cards = await db.select().from(cardsTable);
  return (
    <Suspense fallback={<Loading />}>
      <CardsSearchFilter cards={cards} />
    </Suspense>
  );
}
