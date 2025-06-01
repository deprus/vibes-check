import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Badge } from "../ui/badge";
import { Filter } from "lucide-react";
import { CARD_COLORS } from "@/config/constants";
import { FilterState } from "@/lib/deck-utils";
import Penguin from "../penguin";

interface DeckFiltersProps {
  filters: FilterState;
  onSearchChange: (value: string) => void;
  onColorsChange: (colors: string[]) => void;
  onReset: () => void;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
}

export const DeckFilters = ({
  filters,
  onSearchChange,
  onColorsChange,
  onReset,
  isFilterOpen,
  onFilterOpenChange,
}: DeckFiltersProps) => {
  const activeFilters = filters.selectedColors.length;

  return (
    <div className="mb-6 flex gap-2">
      <Input
        placeholder="Search decks..."
        value={filters.searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-md"
      />
      <Sheet open={isFilterOpen} onOpenChange={onFilterOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4" />
            Filter
            {activeFilters > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
              >
                {activeFilters}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Decks</SheetTitle>
            <SheetDescription>
              Filter decks by their main color
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4">
            <div className="space-y-4">
              <div>
                <h3 className="mb-3 text-sm font-medium">Main Color</h3>
                <ToggleGroup
                  type="multiple"
                  size="lg"
                  className="flex w-full flex-wrap justify-start gap-2"
                  value={filters.selectedColors}
                  onValueChange={onColorsChange}
                >
                  {CARD_COLORS.map((color) => (
                    <ToggleGroupItem
                      key={color}
                      className="h-fit cursor-pointer rounded-lg"
                      value={color}
                    >
                      <Penguin color={color} />
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={onReset} className="flex-1">
                Reset
              </Button>
              <Button
                onClick={() => onFilterOpenChange(false)}
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
