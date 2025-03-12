import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import { CardType } from "@/config/types";

interface CardLibraryProps {
  filteredCards: CardType[];
  deck: Map<string, { card: CardType; count: number }>;
  getTotalCardCount: () => number;
  addCardToDeck: (card: CardType) => void;
}

export default function CardLibrary({
  filteredCards,
  deck,
  getTotalCardCount,
  addCardToDeck,
}: CardLibraryProps) {
  return (
    <div className="h-[700px] overflow-y-auto select-none">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCards.map((card) => (
          <div
            key={card.name}
            className={`group relative cursor-pointer ${
              getTotalCardCount() >= 52 && !deck.has(card.name)
                ? "pointer-events-none opacity-50"
                : ""
            } ${
              deck.has(card.name) && deck.get(card.name)?.count === 4
                ? "pointer-events-none opacity-50"
                : ""
            }`}
            onClick={() => addCardToDeck(card)}
          >
            <div className="aspect-[2/3] overflow-hidden rounded-md">
              <Image
                src={card.img || "/placeholder.svg"}
                alt={card.name}
                className="h-full w-full object-cover"
                width={200}
                height={300}
              />
            </div>
            {!(deck.has(card.name) && deck.get(card.name)?.count === 4) && (
              <div className="bg-card/60 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <PlusCircle className="h-10 w-10 text-white" />
              </div>
            )}
            {deck.has(card.name) && (
              <Badge
                className={`absolute top-1 right-1 ${
                  deck.get(card.name)?.count === 4
                    ? "bg-gray-700 text-white"
                    : "bg-white text-black"
                }`}
              >
                {deck.get(card.name)?.count}/4
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
