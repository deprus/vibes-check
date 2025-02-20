"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Checkbox } from "./ui/checkbox";
import Penguin from "@/components/penguin";
import { useState } from "react";
import { CARD_COLORS, CARD_RARITIES } from "@/config/constants";

interface CardsFilterProps {
  selectedType: string[];
  setSelectedType: (value: string) => void;
  selectedRarity: string[];
  setSelectedRarity: (value: string) => void;
  selectedColor: string[];
  setSelectedColor: (value: string) => void;
  selectedCost: string[];
  setSelectedCost: (value: string) => void;
  activeFilters: number;
}

export default function CardsFilter({
  selectedType,
  setSelectedType,
  selectedRarity,
  setSelectedRarity,
  selectedColor,
  setSelectedColor,
  selectedCost,
  setSelectedCost,
  activeFilters,
}: CardsFilterProps) {
  const resetFilters = () => {
    setSelectedType("");
    setSelectedRarity("");
    setSelectedColor("");
    setSelectedCost("");
    setOpen(false);
  };
  const [open, setOpen] = useState(false);

  const toggleRarity = (toggledRarity: string) => {
    const rarityArray = selectedRarity;
    if (rarityArray.includes(toggledRarity)) {
      setSelectedRarity(
        rarityArray.filter((r) => r !== toggledRarity).join(","),
      );
    } else {
      setSelectedRarity([...rarityArray, toggledRarity].join(","));
    }
  };

  const toggleType = (toggledType: string) => {
    const typeArray = selectedType;
    if (typeArray.includes(toggledType)) {
      setSelectedType(typeArray.filter((t) => t !== toggledType).join(","));
    } else {
      setSelectedType([...typeArray, toggledType].join(","));
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-10 w-27 justify-start bg-transparent"
        >
          <Filter />
          Filters
          {activeFilters > 0 && (
            <Badge variant="outline" className="h-5 w-5 rounded-full">
              {activeFilters}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="text-lg">Filter Cards</SheetTitle>
          <SheetDescription>
            Apply filters to find the cards you&apos;re looking for.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="color">
              <AccordionTrigger>Color</AccordionTrigger>
              <AccordionContent className="w-full">
                <ToggleGroup
                  type="multiple"
                  size="lg"
                  className="flex w-full justify-start"
                  value={selectedColor}
                  onValueChange={(values) => {
                    setSelectedColor(values.join(","));
                  }}
                >
                  {CARD_COLORS.map((value) => (
                    <ToggleGroupItem
                      key={value}
                      className="h-fit cursor-pointer rounded-lg"
                      value={value}
                    >
                      <Penguin color={value} />
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cost">
              <AccordionTrigger>Cost</AccordionTrigger>
              <AccordionContent className="">
                <ToggleGroup
                  type="multiple"
                  size="default"
                  className="grid w-full grid-cols-5 grid-rows-2 justify-between"
                  value={selectedCost}
                  onValueChange={(values) => {
                    setSelectedCost(values.join(","));
                  }}
                >
                  {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9+"].map(
                    (value) => (
                      <ToggleGroupItem
                        className="cursor-pointer rounded-md"
                        key={value}
                        value={value}
                      >
                        {value}
                      </ToggleGroupItem>
                    ),
                  )}
                </ToggleGroup>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rarity">
              <AccordionTrigger>Rarity</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                {CARD_RARITIES.map((rarityCheck) => (
                  <div
                    key={rarityCheck}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={rarityCheck}
                      checked={selectedRarity.includes(rarityCheck)}
                      onCheckedChange={() => {
                        toggleRarity(rarityCheck);
                      }}
                    />
                    <label
                      htmlFor={rarityCheck}
                      className="text-sm font-medium"
                    >
                      {rarityCheck.charAt(0).toUpperCase() +
                        rarityCheck.slice(1)}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="type">
              <AccordionTrigger>Type</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                {["penguin", "action", "rod", "relic"].map((typeCheck) => (
                  <div key={typeCheck} className="flex items-center space-x-2">
                    <Checkbox
                      id={typeCheck}
                      checked={selectedType.includes(typeCheck)}
                      onCheckedChange={() => {
                        toggleType(typeCheck);
                      }}
                    />
                    <label htmlFor={typeCheck} className="text-sm font-medium">
                      {typeCheck.charAt(0).toUpperCase() + typeCheck.slice(1)}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <SheetFooter className="flex gap-4">
          <Button
            variant="destructive"
            onClick={resetFilters}
            className="self-end"
          >
            Reset Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
