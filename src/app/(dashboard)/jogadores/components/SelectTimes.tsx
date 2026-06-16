"use client";

import { SelectTrigger } from "@radix-ui/react-select";
import { ChevronDown, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { C } from "@/constants/Colors";
import type { Time } from "@/db/schema";

const SelectTimes = () => {
  const [times] = useState<Time[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Time | null>(null);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  return (
    <div className="relative md:shrink-0">
      <p style={{ color: C.muted, fontSize: "0.75rem" }} className="mb-1">
        Selecione um time
      </p>
      <Button
        variant="ghost"
        onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
        className="flex h-auto w-full items-center justify-between gap-3 rounded-lg px-4 py-2 font-normal md:w-auto"
        style={{
          backgroundColor: C.card,
          color: C.text,
          border: `1px solid ${C.border}`,
          minWidth: "200px",
        }}
      >
        <div className="flex w-full items-center gap-3">
          <Users size={14} style={{ color: C.green }} />
          <span className="flex-1 overflow-hidden text-left text-sm whitespace-nowrap">
            {selectedTeam ? selectedTeam.nome : "Carregando..."}
          </span>
          <ChevronDown size={14} style={{ color: C.dim }} />
        </div>
      </Button>
      {teamDropdownOpen && (
        <div
          className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-lg"
          style={{
            backgroundColor: C.card,
            border: `1px solid ${C.border}`,
          }}
        >
          {times.map((t) => (
            <Button
              key={t.id}
              variant="ghost"
              onClick={() => {
                setSelectedTeam(t);
                setTeamDropdownOpen(false);
              }}
              className="h-auto w-full justify-start rounded-none px-4 py-2 text-left text-sm font-normal"
              style={{
                color: t.id === selectedTeam?.id ? C.green : C.text,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = C.cardHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {t.nome}
            </Button>
          ))}
        </div>
      )}

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {times.map((t) => (
              <SelectItem key={t.id} value={t.nome}>
                {t.nome}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectTimes;
