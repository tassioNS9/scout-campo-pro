"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/dist/client/components/navigation";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";
import { C } from "@/constants/Colors";

const SearchFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = useDebouncedCallback((termo: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (termo) {
      params.set("nome", termo);
    } else {
      params.delete("nome");
    }

    startTransition(() => {
      router.push(`/jogadores?${params.toString()}`);
    });
  }, 400);
  return (
    <div className="relative flex-1">
      <Search
        size={14}
        className="absolute top-1/2 left-3 -translate-y-1/2"
        style={{ color: C.dim }}
      />
      <Input
        defaultValue={searchParams.get("nome") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        data-pending={isPending ? "true" : undefined}
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
