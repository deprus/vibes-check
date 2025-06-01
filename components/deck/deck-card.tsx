import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Edit, Trash2 } from "lucide-react";
import { Deck } from "@/config/types";
import { getColorGradient, formatDate } from "@/lib/deck-utils";

interface DeckCardProps {
  deck: Deck;
  isOwner: boolean;
  onDelete: (id: number) => void;
}

export const DeckCard = ({ deck, isOwner, onDelete }: DeckCardProps) => (
  <Card className="flex flex-col justify-between pb-0">
    <CardHeader>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-medium">
          {deck.authorName || "Unknown Author"}
        </span>
      </div>
      <CardTitle>{deck.name}</CardTitle>
    </CardHeader>
    <div className="flex flex-col gap-2">
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Last updated {formatDate(deck.updatedAt.toISOString())}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href={`/decks/${deck.id}`}>View</Link>
        </Button>
        {isOwner && (
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link href={`/builder/${deck.id}`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700"
              onClick={() => onDelete(deck.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )}
      </CardFooter>
      <div
        style={{
          backgroundImage: getColorGradient(deck.colorStats),
        }}
        className="h-4 w-full rounded-b-xl"
      />
    </div>
  </Card>
);
