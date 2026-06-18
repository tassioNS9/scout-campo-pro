import { ArrowLeft, ClipboardList, Shield, Swords } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { C } from "@/constants/Colors";
import { getJogadoresByTime, getTimesAll } from "@/db/queries";

import SearchFilter from "./components/SearchFilter";
import SelectTimes from "./components/SelectTimes";
import TablePlayers from "./components/TablePlayers";

// const positionStyles: Record<string, string> = {
//   Goleiro: "bg-green-500/20 text-green-400 border-green-500/30",
//   Zagueiro: "bg-blue-500/20 text-blue-400 border-blue-500/30",
//   Lateral: "bg-sky-500/20 text-sky-400 border-sky-500/30",
//   Meia: "bg-orange-500/20 text-orange-400 border-orange-500/30",
//   Atacante: "bg-red-500/20 text-red-400 border-red-500/30",
//   Volante: "bg-purple-500/20 text-purple-400 border-purple-500/30",
// };

interface SearchParamsProps {
  searchParams: Promise<{ timeId?: string; nome?: string }>;
}

export default async function JogadoresPage({
  searchParams,
}: SearchParamsProps) {
  const { timeId, nome } = await searchParams; // 👈

  if (!timeId || isNaN(Number(timeId))) {
    redirect("/jogadores?timeId=21");
  }
  const times = await getTimesAll();

  const jogadores = await getJogadoresByTime(Number(timeId));

  return (
    <div className="bg-background dark min-h-screen w-full">
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                className="bg-card text-muted-foreground border-border hover:text-foreground hover:bg-accent flex h-auto shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2"
              >
                <ArrowLeft size={16} />
                <span className="text-sm font-normal">Voltar</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 border-primary/30 shrink-0 rounded-lg border p-2">
                <Shield size={18} className="text-primary" />
              </div>
              <div>
                <h1
                  className="text-foreground mb-0 leading-tight"
                  style={{ fontSize: "clamp(1rem, 4vw, 1.4rem)" }}
                >
                  Gerenciamento de Jogadores
                </h1>
                <p className="text-muted-foreground mb-0 text-[0.78rem]">
                  Cadastre e organize seus jogadores
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-accent hover:bg-secondary/80 flex h-auto flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 md:flex-none"
            >
              <Swords size={15} />
              <span className="text-sm font-normal">Partidas</span>
            </Button>
            <Button
              variant="outline"
              className="bg-primary/20 text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground flex h-auto flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 md:flex-none"
            >
              <ClipboardList size={15} />
              <span className="text-sm font-normal">Registros</span>
            </Button>
            {/* <Button
              variant="default"
              onClick={() => {
                if (!selectedTeam) {
                  toast.error("Selecione um time primeiro");
                  return;
                }
                setEditingPlayer(null);
                setFormData({
                  numero: "",
                  nome: "",
                  posicao: "Atacante",
                  idade: "",
                });
                setShowForm(true);
              }}
              className="flex h-auto flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 md:flex-none"
              style={{ backgroundColor: C.green, color: "#000" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Plus size={15} />
              <span className="text-sm font-normal">Novo Jogador</span>
            </Button> */}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 md:mb-6 md:flex-row md:items-end md:gap-4">
          <SelectTimes times={times} timeIdSelecionado={timeId} />

          {/* Search */}
          <SearchFilter />
          {/* Stats summary */}
          <div
            className="flex shrink-0 items-center gap-0 overflow-hidden rounded-lg"
            style={{ border: `1px solid ${C.border}` }}
          >
            {[
              { label: "Jogadores", value: 12 },
              {
                label: "Gols",
                value: 0,
              },
              {
                label: "Média",
                value: "—",
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="flex-1 px-4 py-2 text-center"
                style={{
                  backgroundColor: C.card,
                  borderLeft: i > 0 ? `1px solid ${C.border}` : "none",
                }}
              >
                <p
                  className="mb-0"
                  style={{ color: C.green, fontSize: "1rem" }}
                >
                  {stat.value}
                </p>
                <p
                  className="mb-0"
                  style={{ color: C.dim, fontSize: "0.65rem" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Players — cards on mobile, table on desktop */}
        <TablePlayers jogadores={jogadores} searchQuery="" />
        <></>

        {/* Position legend */}
      </div>
    </div>
  );
}
