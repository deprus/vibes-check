import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/components/loading";
import { DeckInfo } from "@/components/deck/deck-info";
import { DeckCards } from "@/components/deck/deck-cards";

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

  return (
    <div className="w-full py-8">
      <Suspense fallback={<Loading />}>
        <DeckInfo deckId={deckId} />
        <DeckCards deckId={deckId} />
      </Suspense>
    </div>
  );
}
