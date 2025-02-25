import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CardType } from "@/config/types";
import { CARD_TYPES } from "@/config/constants";

interface DeckStats {
  total: number;
  byType: Record<string, number>;
  averageCost: string;
}

interface DeckEditorProps {
  deck: Map<string, { card: CardType; count: number }>;
  deckStats: DeckStats;
  getTotalCardCount: () => number;
  decreaseCardCount: (cardName: string) => void;
  increaseCardCount: (cardName: string) => void;
  clearDeck: () => void;
  onSave: () => void;
  isSaving: boolean;
  isExistingDeck: boolean;
}

export default function DeckEditor({
  deck,
  deckStats,
  getTotalCardCount,
  decreaseCardCount,
  increaseCardCount,
  clearDeck,
  onSave,
  isSaving,
  isExistingDeck,
}: DeckEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Deck</CardTitle>
        <p className="text-muted-foreground">{getTotalCardCount()}/40 cards</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cards">
          <TabsList className="grid w-full grid-cols-2 gap-1">
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="cards" className="mt-4">
            <div className="h-[450px] overflow-y-auto md:h-[550px] lg:h-[600px]">
              {deck.size === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                  <p className="text-muted-foreground mb-2">
                    Your deck is empty
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Click on cards from the library to add them to your deck
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {Array.from(deck.entries())
                    .sort(([, a], [, b]) => a.card.cost - b.card.cost)
                    .map(([cardName, { card, count }]) => (
                      <div
                        key={cardName}
                        className="flex items-center rounded-md py-2"
                      >
                        <Badge variant="outline" className="mr-2 h-5 w-5">
                          {card.cost}
                        </Badge>
                        <div className="mr-3 h-10 w-8">
                          <Image
                            src={card.img || "/placeholder.svg"}
                            alt={card.name}
                            width={200}
                            height={300}
                            className="h-full w-full rounded object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              card.color === "colorless" && "text-gray-500",
                              card.color === "yellow" && "text-yellow-500",
                              card.color === "blue" && "text-blue-500",
                              card.color === "red" && "text-red-500",
                              card.color === "green" && "text-green-500",
                              card.color === "purple" && "text-purple-500",
                            )}
                          >
                            {card.name}
                          </p>
                        </div>
                        <Badge variant="outline" className="mr-2 w-8">
                          {count}/4
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              decreaseCardCount(cardName);
                            }}
                          >
                            <span className="font-bold">-</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              increaseCardCount(cardName);
                            }}
                            disabled={count >= 4 || getTotalCardCount() >= 40}
                          >
                            <span className="font-bold">+</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="stats" className="mt-4">
            <div className="h-[600px] space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Card Types</h3>
                <div className="space-y-2">
                  {CARD_TYPES.map((type) => (
                    <div key={type} className="flex justify-between">
                      <span>{type}</span>
                      <span>{deckStats.byType[type] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="mb-2 font-medium">Average Cost</h3>
                <div className="text-2xl font-bold">
                  {deckStats.averageCost}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          className="flex-1"
          disabled={getTotalCardCount() !== 40 || isSaving}
          onClick={onSave}
        >
          <Save className="h-4 w-4" />
          {isSaving
            ? "Saving..."
            : isExistingDeck
              ? "Update Deck"
              : "Save Deck"}
        </Button>
        <Button className="flex-1" variant="destructive" onClick={clearDeck}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </CardFooter>
    </Card>
  );
}
