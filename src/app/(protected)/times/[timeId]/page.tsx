import { ArrowLeft, ClipboardList, Shield, Swords } from "lucide-react";
import Link from "next/link";

import { getCountJogadoresByTime } from "@/app/actions/get-count-jogadores-by-time";
import { listJogadoresByTime } from "@/app/actions/list-jogadores-by-time";
import { listTimes } from "@/app/actions/list-times";
import { Button } from "@/components/ui/button";

import CreateJogadorButton from "../components/CreateJogadorButton";
import SelectTimes from "./components/SelectTimes";
import TablePlayers from "./components/TablePlayers";

const TimeListPage = async ({
  params,
}: {
  params: Promise<{ timeId?: string }>;
}) => {
  const { timeId } = await params;
  const [times, jogadores, [{ count: playerCount }]] = await Promise.all([
    listTimes(),
    listJogadoresByTime(Number(timeId)),
    getCountJogadoresByTime(Number(timeId)),
  ]);
  const timeIdSelecionado = timeId ?? times[0]?.id.toString();

  return (
    <div className="dark min-h-screen w-full bg-[linear-gradient(160deg,var(--scout-bg)_0%,var(--scout-bg-alt)_100%)]">
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                className="flex h-auto shrink-0 items-center justify-center gap-2 rounded-lg border border-scout-border bg-scout-card px-3 py-2 text-scout-muted hover:bg-scout-card-hover hover:text-scout-text"
              >
                <ArrowLeft size={16} />
                <span className="text-sm font-normal">Voltar</span>
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <div className="shrink-0 rounded-lg border border-scout-green-border bg-scout-green-dim p-2">
                <Shield size={18} className="text-scout-green" />
              </div>

              <div>
                <h1 className="mb-0 text-[clamp(1rem,4vw,1.4rem)] leading-tight text-scout-text">
                  Gerenciamento de Jogadores
                </h1>
                <p className="mb-0 text-[0.78rem] text-scout-muted">
                  Cadastre e organize seus jogadores
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/partidas">
              <Button
                variant="outline"
                className="flex h-auto flex-1 items-center justify-center gap-2 rounded-lg border border-scout-border bg-scout-card px-3 py-2 text-scout-muted hover:bg-scout-card-hover hover:text-scout-text md:flex-none"
              >
                <Swords size={15} />
                <span className="text-sm font-normal">Partidas</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              className="flex h-auto flex-1 items-center justify-center gap-2 rounded-lg border border-scout-green-border bg-scout-green-dim px-3 py-2 text-scout-green hover:bg-scout-green hover:text-black md:flex-none"
            >
              <ClipboardList size={15} />
              <span className="text-sm font-normal">Registros</span>
            </Button>

            <CreateJogadorButton times={times} />
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 md:mb-6 md:flex-row md:items-end md:gap-4">
          <SelectTimes times={times} timeIdSelecionado={timeIdSelecionado} />

          <div className="flex shrink-0 items-center gap-0 overflow-hidden rounded-lg border border-scout-border">
            {[
              { label: "Jogadores", value: playerCount },
              { label: "Gols", value: 0 },
              { label: "Média", value: "—" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`flex-1 px-4 py-2 text-center ${
                  i > 0 ? "border-l border-scout-border" : ""
                } bg-scout-card`}
              >
                <p className="mb-0 text-[1rem] text-scout-green">{stat.value}</p>
                <p className="mb-0 text-[0.65rem] text-scout-dim">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <TablePlayers jogadores={jogadores} searchQuery="" />
      </div>
    </div>
  );
};

export default TimeListPage;
