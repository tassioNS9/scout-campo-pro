"use client";

import { Star } from "lucide-react";
import { useState } from "react";

const AnaliseTextual = () => {
  const [analysis, setAnalysis] = useState("");
  const [suggestions, setSuggestions] = useState("");

  return (
    <div className="border-scout-border bg-scout-card mb-4 rounded-xl border p-5">
      <div className="mb-4 flex items-center gap-2">
        <Star size={15} className="text-scout-green" />
        <h2 className="text-scout-text text-sm">Análise e Sugestões</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-scout-muted mb-2 block text-xs">
            Análise da Partida
          </label>
          <textarea
            rows={4}
            value={analysis}
            onChange={(e) => setAnalysis(e.target.value)}
            placeholder="Descreva a análise geral da partida..."
            className="border-scout-border-light bg-scout-card-header text-scout-text placeholder:text-scout-muted focus:border-scout-green focus:ring-scout-green w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:ring-1"
          />
        </div>
        <div>
          <label className="text-scout-muted mb-2 block text-xs">
            Sugestões Táticas
          </label>
          <textarea
            rows={4}
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            placeholder="Descreva as sugestões táticas para próximas partidas..."
            className="border-scout-border-light bg-scout-card-header text-scout-text placeholder:text-scout-muted focus:border-scout-green focus:ring-scout-green w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:ring-1"
          />
        </div>
      </div>
    </div>
  );
};

export default AnaliseTextual;
