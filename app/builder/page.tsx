import BuilderCards from "@/components/builder-cards";
import { db } from "@/server/db";
import { cardsTable } from "@/server/db/schema";

export default async function DeckBuilderPage() {
  const cards = await db.select().from(cardsTable);
  return <BuilderCards cards={cards} />;
}
