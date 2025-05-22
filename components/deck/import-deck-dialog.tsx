"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Import } from "lucide-react";
import { toast } from "sonner";

interface ImportDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (deckData: {
    deckName: string;
    counts: Record<string, number>;
  }) => void;
}

export function ImportDeckDialog({
  open,
  onOpenChange,
  onImport,
}: ImportDeckDialogProps) {
  const [importCode, setImportCode] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!importCode.trim()) {
      toast.error("Please enter a deck code");
      return;
    }

    setIsImporting(true);
    try {
      const deckData = JSON.parse(importCode.trim());

      // Validate the structure
      if (
        !deckData.deckName ||
        !deckData.counts ||
        typeof deckData.counts !== "object"
      ) {
        throw new Error("Invalid deck code format");
      }

      // Validate counts are numbers
      for (const [cardName, count] of Object.entries(deckData.counts)) {
        if (typeof count !== "number" || count < 1 || count > 4) {
          throw new Error(`Invalid card count for ${cardName}: ${count}`);
        }
      }

      onImport(deckData);
      setImportCode("");
      onOpenChange(false);
      toast.success("Deck imported successfully!");
    } catch (error) {
      console.error("Import error:", error);
      toast.error(
        "Invalid deck code format. Please check your code and try again.",
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancel = () => {
    setImportCode("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Import className="h-5 w-5" />
            Import Deck Code
          </DialogTitle>
          <DialogDescription>
            Paste a deck code to import cards into your builder. This will
            replace your current deck.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="import-code">Deck Code</Label>
            <Textarea
              id="import-code"
              placeholder='Paste your deck code here (e.g., {"deckName":"My Deck","counts":{"CardName":4}})'
              value={importCode}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setImportCode(e.target.value)
              }
              rows={6}
              className="resize-none break-all whitespace-pre-wrap"
              style={{ wordBreak: "break-all", overflowWrap: "break-word" }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isImporting}>
            {isImporting ? "Importing..." : "Import Deck"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
