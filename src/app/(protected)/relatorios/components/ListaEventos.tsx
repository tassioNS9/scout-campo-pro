"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ListaEventos = ({ eventos }: { eventos: any[] }) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Histórico de Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {eventos?.map((evento) => (
            <div
              key={evento.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
            >
              <div className="flex items-center gap-3">
                <span className="rounded bg-slate-200 px-2 py-1 font-mono text-xs">
                  {evento.tempo} {evento.minuto}&apos;
                </span>
                <span className="font-medium text-slate-900">
                  {evento.tipoEvento}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {evento.zona && (
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                    {evento.zona}
                  </span>
                )}
                <span className="text-sm text-slate-600">
                  Jogador #{evento.idJogador}
                </span>
              </div>
            </div>
          ))}
          {(!eventos || eventos.length === 0) && (
            <p className="py-4 text-center text-slate-500">
              Nenhum evento registrado para esta partida
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListaEventos;
