import { ArrowLeft, Swords } from "lucide-react";
import Link from "next/link";

import { listPartidas } from "@/app/actions/list-partidas";
import { listTimes } from "@/app/actions/list-times";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import CreatePartidaButton from "./components/CreatePartidaButton";
import PartidaList from "./components/PartidaList";

export default async function PartidasPage() {
  const [partidasData, timesData] = await Promise.all([
    listPartidas(),
    listTimes(),
  ]);

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(160deg,var(--scout-bg)_0%,var(--scout-bg-alt)_100%)]">
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                className="border-scout-border bg-scout-card text-scout-muted flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2"
                size="sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <div className="border-scout-green-border bg-scout-green-dim shrink-0 rounded-lg border p-2">
                <Swords size={18} className="text-scout-green" />
              </div>

              <div>
                <h1 className="text-scout-text text-[clamp(1rem,4vw,1.4rem)] leading-tight">
                  Gerenciamento de Partidas
                </h1>
                <p className="text-scout-muted text-[0.78rem]">
                  Crie e acompanhe suas partidas
                </p>
              </div>
            </div>
          </div>

          <CreatePartidaButton times={timesData} />
        </div>

        {partidasData.length > 0 ? (
          <PartidaList partidas={partidasData} />
        ) : (
          <Card className="py-12 text-center">
            <CardContent>
              <p className="mb-4 text-slate-600">Nenhuma partida cadastrada</p>
              <CreatePartidaButton times={timesData} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
