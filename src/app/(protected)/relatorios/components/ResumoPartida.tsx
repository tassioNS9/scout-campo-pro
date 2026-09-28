import { FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResumoPartida = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resumo da Partida
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
            <p className="text-sm text-slate-600">Gols</p>
            <p className="text-3xl font-bold text-emerald-600">{totalGols}</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
            <p className="text-sm text-slate-600">Finalizações</p>
            <p className="text-3xl font-bold text-blue-600">
              {totalFinalizacoes}
            </p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-center">
            <p className="text-sm text-slate-600">Desarmes</p>
            <p className="text-3xl font-bold text-purple-600">
              {totalDesarmes}
            </p>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
            <p className="text-sm text-slate-600">Dribles</p>
            <p className="text-3xl font-bold text-yellow-600">{totalDribles}</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-600">Total de Eventos</p>
          <p className="text-3xl font-bold text-slate-900">{totalEventos}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumoPartida;
