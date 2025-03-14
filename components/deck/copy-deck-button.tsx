"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyDeckButtonProps {
  deckName: string;
  deckCards: Array<{
    card: {
      name: string;
    } | null;
    quantity: number;
  }>;
}

export function CopyDeckButton({ deckName, deckCards }: CopyDeckButtonProps) {
  const handleCopy = () => {
    const counts: Record<string, number> = {};
    deckCards.forEach((deckCard) => {
      if (deckCard.card?.name) {
        const formattedName = deckCard.card.name
          .replace(/\s+/g, "")
          .replace(/[',!]/g, "");
        counts[formattedName] = deckCard.quantity;
      }
    });

    const exportData = {
      deckName,
      counts,
    };

    navigator.clipboard.writeText(JSON.stringify(exportData));
    toast.success("Deck code copied to clipboard!");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="flex items-center gap-2"
    >
      <Copy className="h-4 w-4" />
      Copy Import Code
    </Button>
  );
}
