"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RankingJogadores = ({ estatisticas }: { estatisticas: any[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking de Jogadores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {estatisticas?.slice(0, 5).map((stat, index) => (
            <div
              key={stat.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-500">
                  #{index + 1}
                </span>
                <span className="font-medium">Jogador #{stat.idJogador}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  {stat.gols ?? 0} gols
                </span>
                <span className="text-sm text-slate-600">
                  {stat.assistencias ?? 0} assist.
                </span>
                <span className="font-bold text-emerald-600">{stat.nota}</span>
              </div>
            </div>
          ))}
          {(!estatisticas || estatisticas.length === 0) && (
            <p className="py-4 text-center text-slate-500">
              Nenhuma estatística registrada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingJogadores;
