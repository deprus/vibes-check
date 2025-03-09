import CardsSearchFilter from "@/components/cards-search-filter";
import { db } from "@/server/db";
import { cardsTable } from "@/server/db/schema";

export default async function CardsPage() {
  const cards = await db.select().from(cardsTable);
  return <CardsSearchFilter cards={cards} />;
}
