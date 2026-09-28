"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { C } from "@/constants/Colors";
import { Partida } from "@/db/queries";

type SeletorPartidaProps = {
  partidas: Partida[];
  partidaIdSelecionada: number | null;
  onSelect: (partidaId: number | null) => void;
};

const SeletorPartida = ({
  partidas,
  partidaIdSelecionada,
  onSelect,
}: SeletorPartidaProps) => {
  return (
    <div className="relative mb-6 inline-block">
      <div className="absolute top-full z-10 mt-1 overflow-hidden rounded-lg">
        <Select
          value={partidaIdSelecionada ? partidaIdSelecionada.toString() : ""}
          onValueChange={(value: string) =>
            onSelect(value ? Number(value) : null)
          }
        >
          <SelectTrigger
            className="w-full font-semibold text-[#8b95b0]"
            style={{
              backgroundColor: C.card,
              border: `1px solid ${C.border}`,
              minWidth: "280px",
            }}
          >
            <SelectValue placeholder="Selecione uma partida" />
          </SelectTrigger>
          <SelectContent className="bg-[#1c2438] text-white">
            {partidas.map((p) => (
              <SelectItem key={p.id} value={p.id.toString()}>
                {p.nomeTime.split(" ")[0]} ×{" "}
                {p.nomeTimeAdversario.split(" ")[0]}{" "}
                {new Date(p.data).toLocaleDateString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SeletorPartida;
