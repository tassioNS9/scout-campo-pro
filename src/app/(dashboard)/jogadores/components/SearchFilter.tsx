"use client";

import { Search } from "lucide-react";

import { C } from "@/constants/Colors";
interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchFilter = ({ searchQuery, setSearchQuery }: SearchFilterProps) => {
  return (
    <div className="relative flex-1">
      <Search
        size={14}
        className="absolute top-1/2 left-3 -translate-y-1/2"
        style={{ color: C.dim }}
      />
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar jogador ou posição..."
        className="w-full rounded-lg py-2 pr-4 pl-9 text-sm outline-none"
        style={{
          backgroundColor: C.card,
          color: C.text,
          border: `1px solid ${C.border}`,
        }}
      />
    </div>
  );
};

export default SearchFilter;
