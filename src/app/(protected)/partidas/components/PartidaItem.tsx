import { Calendar, Trophy } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PartidaItemProps {
  partida: {
    id: number;
    time: number | string;
    nomeTimeAdversario: number | string;
    placarTime: number | null;
    placarTimeAdversario: number | null;
    data: Date;
    campeonato: string | null;
    categoria: string;
    status: string | null;
  };
}

const PartidaItem = ({ partida }: PartidaItemProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      planejada: "bg-blue-100 text-blue-700",
      em_andamento: "bg-emerald-100 text-emerald-700",
      finalizada: "bg-slate-100 text-slate-700",
    };
    const labels: Record<string, string> = {
      planejada: "Planejada",
      em_andamento: "Em Andamento",
      finalizada: "Finalizada",
    };
    const s = status ?? "planejada";
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${styles[s] ?? styles.planejada}`}
      >
        {labels[s] ?? "Planejada"}
      </span>
    );
  };

  return (
    <Card key={partida.id} className="transition hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Partida #{partida.id}</CardTitle>
          {getStatusBadge(partida.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
          <div className="flex-1 text-center">
            <p className="text-sm font-semibold text-slate-900">
              {partida.time}
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {partida.placarTime ?? 0}
            </p>
          </div>
          <div className="px-2 font-bold text-slate-400">×</div>
          <div className="flex-1 text-center">
            <p className="text-sm font-semibold text-slate-900">
              {partida.nomeTimeAdversario}
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {partida.placarTimeAdversario ?? 0}
            </p>
          </div>
        </div>
        <div className="space-y-1 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(partida.data)}</span>
          </div>
          {partida.campeonato && (
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>{partida.campeonato}</span>
            </div>
          )}
          <p>
            <strong>Categoria:</strong> {partida.categoria}
          </p>
        </div>
        <div className="flex gap-2 pt-2">
          <Link href={`/dashboard?partida=${partida.id}`}>
            <Button size="sm" variant="outline">
              Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartidaItem;
