"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

export function InfoButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed right-4 bottom-4 rounded-full"
        >
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About Vibes Check</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            All card information and images are sourced from{" "}
            <a
              href="https://vibes.game"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Vibes: The Pudgy TCG
            </a>
            .
          </p>
          <p>
            This tool is not affiliated with or endorsed by Orange Cap Games. It
            is an independent project that helps players browse cards, build and
            share decks with the community.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
