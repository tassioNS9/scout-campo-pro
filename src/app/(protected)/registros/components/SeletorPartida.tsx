"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
            className="w-full min-w-70 border-scout-border bg-scout-card font-semibold text-scout-muted"
          >
            <SelectValue placeholder="Selecione uma partida" />
          </SelectTrigger>
          <SelectContent className="border-scout-border bg-scout-card text-scout-text">
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
