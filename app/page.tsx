import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto self-center px-4">
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Vibes TCG Deck Builder
        </h1>
        <p className="text-muted-foreground max-w-[700px] text-lg">
          Build, save, and share your custom card decks with our easy-to-use
          deck builder.
        </p>
        <div className="mt-4 flex gap-4">
          <Button asChild size="lg">
            <Link href="/builder">Start Building</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/cards">Browse Cards</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
