"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortSelectProps {
  sortBy: string;
  setSortBy: (value: string) => void;
}

export default function SortSelect({ sortBy, setSortBy }: SortSelectProps) {
  return (
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-[130px] shrink-0">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
        <SelectItem value="cost-asc">Cost (Low to High)</SelectItem>
        <SelectItem value="cost-desc">Cost (High to Low)</SelectItem>
      </SelectContent>
    </Select>
  );
}