import { notFound } from "next/navigation";
import { db } from "@/server/db";
import {
  decksTable,
  user,
  deckCardsTable,
  cardsTable,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DeckPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DeckPage(props: DeckPageProps) {
  const params = await props.params;
  const deckId = parseInt(params.id);

  if (isNaN(deckId)) {
    notFound();
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
    .where(eq(decksTable.id, deckId));

  if (decks.length === 0) {
    notFound();
  }

  const deck = decks[0];

  const deckCards = await db
    .select({
      card: cardsTable,
      quantity: deckCardsTable.quantity,
    })
    .from(deckCardsTable)
    .leftJoin(cardsTable, eq(deckCardsTable.cardId, cardsTable.id))
    .where(eq(deckCardsTable.deckId, deckId));

  const sortedDeckCards = [...deckCards].sort((a, b) => {
    const costA = a.card?.cost !== undefined ? a.card.cost : Infinity;
    const costB = b.card?.cost !== undefined ? b.card.cost : Infinity;
    return costA - costB;
  });

  return (
    <div className="w-full py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{deck.name}</h1>
        {deck.description && (
          <p className="mb-4 break-words text-gray-600">{deck.description}</p>
        )}
        <div className="text-sm text-gray-500">
          Created by {deck.authorName || "Unknown"} • Last updated{" "}
          {new Date(deck.updatedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="list" className="mb-4">
          <TabsList className="mb-4">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="grid">Grid</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {sortedDeckCards.map((deckCard) => (
                <div
                  key={deckCard.card?.id}
                  className={`rounded-lg p-3 bg-${
                    deckCard.card?.color || "gray"
                  }-900/30 border border-${
                    deckCard.card?.color || "gray"
                  }-900/50 flex items-center`}
                >
                  <div className="mr-4 h-16 w-12 flex-shrink-0 overflow-hidden rounded-md">
                    {deckCard.card?.img ? (
                      <Image
                        src={deckCard.card.img}
                        alt={deckCard.card?.name || "Card"}
                        className="h-full w-full object-cover"
                        width={48}
                        height={64}
                      />
                    ) : (
                      <div
                        className={`h-full w-full bg-${
                          deckCard.card?.color || "gray"
                        }-800 flex items-center justify-center`}
                      >
                        <span className="text-xs">
                          {deckCard.card?.name?.substring(0, 2) || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">
                      {deckCard.card?.name || "Unknown Card"}
                    </div>
                    <div className="truncate text-sm text-gray-400">
                      {deckCard.card?.type} • {deckCard.card?.color} •{" "}
                      {deckCard.card?.rarity} • Cost: {deckCard.card?.cost}
                    </div>
                  </div>
                  <div className="ml-auto shrink-0 rounded bg-black/50 px-2 py-1 text-sm font-medium">
                    {deckCard.quantity}x
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="grid">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {sortedDeckCards.map((deckCard) => (
                <div key={deckCard.card?.id} className="relative">
                  <div className="bg-opacity-70 absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black text-sm text-white">
                    {deckCard.quantity}x
                  </div>
                  <div className="card relative aspect-[2/3]">
                    {deckCard.card?.img ? (
                      <Image
                        src={deckCard.card.img}
                        alt={deckCard.card?.name || "Card"}
                        className="h-full w-full rounded-lg object-cover"
                        width={200}
                        height={300}
                      />
                    ) : (
                      <div
                        className={`h-full w-full rounded-lg bg-${
                          deckCard.card?.color || "gray"
                        }-900 flex items-center justify-center p-4`}
                      >
                        <div className="text-center">
                          <div className="font-semibold">
                            {deckCard.card?.name || "Unknown Card"}
                          </div>
                          <div className="text-sm text-gray-300">
                            {deckCard.card?.type} • {deckCard.card?.rarity}
                          </div>
                          <div className="mt-1 text-sm">
                            Cost: {deckCard.card?.cost}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
