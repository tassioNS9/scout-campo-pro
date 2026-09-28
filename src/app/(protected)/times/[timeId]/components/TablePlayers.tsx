"use client";

import { ClipboardList, Pencil, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { deleteJogador } from "@/app/actions/delete-jogador";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Jogador } from "@/db/schema";

import EditModalDialog from "./EditModalDialog";

const positionClasses: Record<string, string> = {
  Goleiro:
    "border-scout-goleiro-border bg-scout-goleiro-bg text-scout-goleiro-text",
  Zagueiro:
    "border-scout-zagueiro-border bg-scout-zagueiro-bg text-scout-zagueiro-text",
  Lateral:
    "border-scout-lateral-border bg-scout-lateral-bg text-scout-lateral-text",
  Meia: "border-scout-meia-border bg-scout-meia-bg text-scout-meia-text",
  Atacante:
    "border-scout-atacante-border bg-scout-atacante-bg text-scout-atacante-text",
  Volante:
    "border-scout-volante-border bg-scout-volante-bg text-scout-volante-text",
};

const TablePlayers = ({
  jogadores,
  searchQuery,
}: {
  jogadores: Jogador[];
  searchQuery: string;
}) => {
  const [isLoadingJogadores] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Jogador | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (player: Jogador) => {
    setIsEditing(true);
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este jogador?")) {
      try {
        await deleteJogador(id);
        toast.success("Jogador apagado com sucesso");
      } catch {
        toast.error("Erro ao apagar jogador!");
      }
    }
  };
  const filteredPlayers = jogadores.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.posicao.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="border-scout-border hidden overflow-hidden rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-scout-border bg-scout-card-header border-b">
              <TableHead className="text-scout-dim w-15 text-xs tracking-wide uppercase">
                Nº
              </TableHead>
              <TableHead className="text-scout-dim text-xs tracking-wide uppercase">
                Jogador
              </TableHead>
              <TableHead className="text-scout-dim w-35 text-xs tracking-wide uppercase">
                Posição
              </TableHead>
              <TableHead className="text-scout-dim w-20 text-xs tracking-wide uppercase">
                Idade
              </TableHead>
              <TableHead className="text-scout-dim w-20 text-xs tracking-wide uppercase">
                Nota
              </TableHead>
              <TableHead className="text-scout-dim w-20 text-xs tracking-wide uppercase">
                Gols
              </TableHead>
              <TableHead className="text-scout-dim w-20 text-xs tracking-wide uppercase">
                Assist.
              </TableHead>
              <TableHead className="text-scout-dim w-30 text-xs tracking-wide uppercase">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoadingJogadores ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-scout-muted py-16 text-center"
                >
                  Carregando jogadores...
                </TableCell>
              </TableRow>
            ) : filteredPlayers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-scout-muted py-16 text-center"
                >
                  <Users size={40} className="mx-auto mb-3 opacity-30" />
                  Nenhum jogador encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredPlayers
                .sort((a, b) => a.numero - b.numero)
                .map((player) => {
                  const positionClass =
                    positionClasses[player.posicao] ??
                    "border-scout-border bg-scout-card text-scout-text";

                  return (
                    <TableRow
                      key={player.id}
                      className="border-scout-border hover:bg-scout-card-hover border-b bg-transparent transition-colors"
                    >
                      <TableCell>
                        <span className="border-scout-green-border bg-scout-green-dim text-scout-green flex h-9 w-9 items-center justify-center rounded-full border text-sm">
                          {player.numero}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Link href={`/jogador/${player.id}`}>
                          <Button
                            variant="ghost"
                            className="group h-auto justify-start p-0 text-left font-normal hover:bg-transparent"
                          >
                            <span className="text-scout-text text-[0.95rem] group-hover:underline">
                              {player.nome}
                            </span>
                          </Button>
                        </Link>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`rounded-full border px-2 py-1 text-xs ${positionClass}`}
                        >
                          {player.posicao}
                        </span>
                      </TableCell>

                      <TableCell className="text-scout-muted text-[0.9rem]">
                        {player.idade ? `${player.idade} anos` : "—"}
                      </TableCell>

                      <TableCell className="text-scout-muted text-[0.95rem]">
                        —
                      </TableCell>
                      <TableCell className="text-scout-text text-[0.9rem]">
                        0
                      </TableCell>
                      <TableCell className="text-scout-text text-[0.9rem]">
                        0
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/jogador/${player.id}`}>
                            <Button
                              variant="ghost"
                              className="border-scout-green-border bg-scout-green-dim text-scout-green hover:bg-scout-green h-auto min-w-0 rounded-lg border px-2 py-1 text-xs font-normal hover:text-black"
                              title="Ver registros"
                            >
                              <ClipboardList size={12} />
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            onClick={() => handleEdit(player)}
                            className="border-scout-sub17-border bg-scout-sub17-bg text-scout-sub17-text hover:bg-scout-sub17-text hover:text-scout-bg h-auto min-w-0 rounded-lg border px-2 py-1 text-xs font-normal"
                            title="Editar"
                          >
                            <Pencil size={12} />
                          </Button>

                          <Button
                            variant="ghost"
                            onClick={() => handleDelete(player.id)}
                            className="border-scout-profissional-border bg-scout-profissional-bg text-scout-profissional-text hover:bg-scout-profissional-text hover:text-scout-bg h-auto min-w-0 rounded-lg border px-2 py-1 text-xs font-normal"
                            title="Excluir"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {isLoadingJogadores ? (
          <div className="text-scout-muted py-16 text-center">
            <p>Carregando jogadores...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-scout-muted py-16 text-center">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum jogador encontrado</p>
          </div>
        ) : (
          filteredPlayers
            .sort((a, b) => a.numero - b.numero)
            .map((player) => {
              const positionClass =
                positionClasses[player.posicao] ??
                "border-scout-border bg-scout-card text-scout-text";

              return (
                <div
                  key={player.id}
                  className="border-scout-border bg-scout-card rounded-xl border p-4"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="border-scout-green-border bg-scout-green-dim text-scout-green flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm">
                      {player.numero}
                    </span>

                    <div className="min-w-0 flex-1">
                      <Link href={`/jogador/${player.id}`}>
                        <Button
                          variant="ghost"
                          className="h-auto w-full justify-start p-0 text-left hover:bg-transparent"
                        >
                          <p className="text-scout-text mb-0 truncate text-[0.95rem] font-normal">
                            {player.nome}
                          </p>
                        </Button>
                      </Link>

                      <p className="text-scout-muted mb-0 text-[0.78rem] font-normal">
                        {player.idade ? `${player.idade} anos` : "N/I"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2 py-1 text-xs ${positionClass}`}
                    >
                      {player.posicao}
                    </span>
                  </div>

                  <div className="mb-3 grid grid-cols-3 gap-2">
                    {[
                      { label: "Nota", value: "—" },
                      { label: "Gols", value: 0 },
                      { label: "Assist.", value: 0 },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="bg-scout-card-header rounded-lg p-2 text-center"
                      >
                        <p className="text-scout-text mb-0 font-normal">
                          {s.value}
                        </p>
                        <p className="text-scout-dim mb-0 text-[0.65rem] font-normal">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/jogador/${player.id}`}>
                      <Button
                        variant="ghost"
                        className="border-scout-green-border bg-scout-green-dim text-scout-green flex h-auto flex-1 items-center justify-center gap-1 rounded-lg border py-2 text-xs font-normal"
                      >
                        <ClipboardList size={13} />
                        Registros
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      onClick={() => handleEdit(player)}
                      className="border-scout-sub17-border bg-scout-sub17-bg text-scout-sub17-text flex h-auto items-center justify-center rounded-lg border px-3 py-2 text-xs font-normal"
                    >
                      <Pencil size={13} />
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(player.id)}
                      className="border-scout-profissional-border bg-scout-profissional-bg text-scout-profissional-text flex h-auto items-center justify-center rounded-lg border px-3 py-2 text-xs font-normal"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              );
            })
        )}
      </div>

      <EditModalDialog
        jogador={editingPlayer ?? null}
        isEditing={isEditing}
        showForm={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPlayer(null);
        }}
        onSuccess={() => {
          setShowForm(false);
        }}
      />
    </>
  );
};

export default TablePlayers;
