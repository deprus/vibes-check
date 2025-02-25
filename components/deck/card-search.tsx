"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CardSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function CardSearch({ searchTerm, setSearchTerm }: CardSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="text-muted-foreground absolute top-3 left-2.5 h-4 w-4" />
      <Input
        placeholder="Search cards..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-10 pl-8"
      />
    </div>
  );
}