"use client";

import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { backgroundColors } from "@/config/constants";
import { CardType } from "@/config/types";
import CardsFilter from "./cards-filter";
import { filterCards, getActiveFilterCount, sortCards } from "@/lib/utils";

export default function CardsSearchFilter({ cards }: { cards: CardType[] }) {
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [selectedColor, setSelectedColor] = useQueryState("color", {
    defaultValue: "",
  });
  const [selectedCost, setSelectedCost] = useQueryState("cost", {
    defaultValue: "",
  });
  const [selectedRarity, setSelectedRarity] = useQueryState("rarity", {
    defaultValue: "",
  });
  const [selectedType, setSelectedType] = useQueryState("type", {
    defaultValue: "",
  });
  const [sortBy, setSortBy] = useQueryState("sort", {
    defaultValue: "name-asc",
  });

  const selectedColors = selectedColor ? selectedColor.split(",") : [];
  const selectedCosts = selectedCost ? selectedCost.split(",") : [];
  const selectedRarities = selectedRarity ? selectedRarity.split(",") : [];
  const selectedTypes = selectedType ? selectedType.split(",") : [];

  const filteredCards = sortCards(
    filterCards(
      cards,
      searchTerm,
      selectedTypes,
      selectedRarities,
      selectedCosts,
      selectedColors,
    ),
    sortBy,
  );

  return (
    <div className="flex w-full flex-col gap-2 py-8">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Card Library</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <CardsFilter
            selectedType={selectedTypes}
            setSelectedType={setSelectedType}
            selectedRarity={selectedRarities}
            setSelectedRarity={setSelectedRarity}
            selectedColor={selectedColors}
            setSelectedColor={setSelectedColor}
            selectedCost={selectedCosts}
            setSelectedCost={setSelectedCost}
            activeFilters={getActiveFilterCount(
              searchTerm,
              selectedTypes,
              selectedRarities,
              selectedCosts,
              selectedColors,
            )}
          />
        </div>
      </div>

      <Tabs defaultValue="grid">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex w-full items-center justify-between md:justify-start md:gap-4">
            <TabsList className="gap-1">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="cost-asc">Cost (Low to High)</SelectItem>
                <SelectItem value="cost-desc">Cost (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-muted-foreground text-sm whitespace-nowrap">
            {filteredCards.length} of {cards.length} cards
          </p>
        </div>

        <TabsContent value="grid">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredCards.map((card) => (
              <Card key={card.name} className="p-0">
                <div className="relative aspect-[2/3]">
                  <Image
                    src={card.img || "/placeholder.svg"}
                    alt={card.name}
                    className="h-full w-full object-cover"
                    width={200}
                    height={300}
                  />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="grid grid-cols-1 gap-4 space-y-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCards.map((card) => (
              <Card
                key={card.name}
                className={`${backgroundColors[card.color]} p-2`}
              >
                <CardContent className="flex items-center gap-4 px-0">
                  <div className="h-24 w-18 flex-shrink-0">
                    <Image
                      src={card.img || "/placeholder.svg"}
                      alt={card.name}
                      className="h-full w-full object-cover"
                      width={200}
                      height={300}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{card.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {card.category} • {card.rarity} • cost: {card.cost}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
