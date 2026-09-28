"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { C } from "@/constants/Colors";

const AnaliseTextual = () => {
  const [analysis, setAnalysis] = useState("");
  const [suggestions, setSuggestions] = useState("");

  return (
    <div
      className="mb-4 rounded-xl p-5"
      style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
    >
      <div className="mb-4 flex items-center gap-2">
        <Star size={15} style={{ color: C.green }} />
        <h2 className="text-white" style={{ fontSize: "0.95rem" }}>
          Análise e Sugestões
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label
            className="mb-2 block"
            style={{ color: C.muted, fontSize: "0.8rem" }}
          >
            Análise da Partida
          </label>
          <textarea
            rows={4}
            value={analysis}
            onChange={(e) => setAnalysis(e.target.value)}
            placeholder="Descreva a análise geral da partida..."
            className="w-full resize-none rounded-lg px-4 py-3 text-sm outline-none"
            style={{
              backgroundColor: C.cardHeader,
              color: C.text,
              border: `1px solid ${C.borderLight}`,
            }}
          />
        </div>
        <div>
          <label
            className="mb-2 block"
            style={{ color: C.muted, fontSize: "0.8rem" }}
          >
            Sugestões Táticas
          </label>
          <textarea
            rows={4}
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            placeholder="Descreva as sugestões táticas para próximas partidas..."
            className="w-full resize-none rounded-lg px-4 py-3 text-sm outline-none"
            style={{
              backgroundColor: C.cardHeader,
              color: C.text,
              border: `1px solid ${C.borderLight}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnaliseTextual;
