"use client";

import { ClipboardList, Pencil, Trash2, Users } from "lucide-react";
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
import { C } from "@/constants/Colors";
import { Jogador } from "@/db/schema";

import ModalDialog from "./ModalDialog";

const positionColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Goleiro: { bg: "#1a2e1a", text: "#4ade80", border: "#1a4a1a" },
  Zagueiro: { bg: "#1a2540", text: "#60a5fa", border: "#1a3560" },
  Lateral: { bg: "#1a2540", text: "#93c5fd", border: "#1a3560" },
  Meia: { bg: "#2e2018", text: "#fb923c", border: "#4a2e10" },
  Atacante: { bg: "#2e1a1a", text: "#f87171", border: "#4a1a1a" },
  Volante: { bg: "#201a2e", text: "#c084fc", border: "#301a4a" },
};

const TablePlayers = ({
  jogadores,
  searchQuery,
}: {
  jogadores: Jogador[];
  searchQuery: string;
}) => {
  const [isLoadingJogadores, setIsLoadingJogadores] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Jogador | null>(null);

  const handleEdit = (player: Jogador) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este jogador?")) {
      try {
        await deleteJogador(id);
        toast.success("Jogador apagado com sucesso");
      } catch (err) {
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
      <div
        className="hidden overflow-hidden rounded-xl md:block"
        style={{ border: `1px solid ${C.border}` }}
      >
        <Table>
          <TableHeader>
            <TableRow
              style={{
                backgroundColor: C.cardHeader,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <TableHead
                style={{ color: C.dim }}
                className="w-15 text-xs tracking-wide uppercase"
              >
                Nº
              </TableHead>
              <TableHead
                style={{ color: C.dim }}
                className="text-xs tracking-wide uppercase"
              >
                Jogador
              </TableHead>
              <TableHead
                style={{ color: C.dim }}
                className="w-35 text-xs tracking-wide uppercase"
              >
                Posição
              </TableHead>
              <TableHead
                style={{ color: C.dim }}
                className="w-20 text-xs tracking-wide uppercase"
              >
                Idade
              </TableHead>
              <TableHead
                style={{ color: C.dim }}
                className="w-20 text-xs tracking-wide uppercase"
              >
                Nota
              </TableHead>
              <TableHead
                style={{ color: C.dim }}
                className="w-20 text-xs tracking-wide uppercase"
              >
                Gols
              </TableHead>
              <TableHead
                style={{ color: C.dim }}
                className="w-20 text-xs tracking-wide uppercase"
              >
                Assist.
              </TableHead>
              <TableHead
                style={{ color: C.dim }}
                className="w-30 text-xs tracking-wide uppercase"
              >
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoadingJogadores ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-16 text-center"
                  style={{ color: C.muted }}
                >
                  Carregando jogadores...
                </TableCell>
              </TableRow>
            ) : filteredPlayers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-16 text-center"
                  style={{ color: C.muted }}
                >
                  <Users size={40} className="mx-auto mb-3 opacity-30" />
                  Nenhum jogador encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredPlayers
                .sort((a, b) => a.numero - b.numero)
                .map((player) => {
                  const posStyle = positionColors[player.posicao] ?? {
                    bg: C.card,
                    text: C.text,
                    border: C.border,
                  };
                  return (
                    <TableRow
                      key={player.id}
                      style={{
                        borderBottom: `1px solid ${C.border}`,
                        backgroundColor: "transparent",
                      }}
                      className="transition-colors hover:bg-[#212b42]"
                    >
                      <TableCell>
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full text-sm"
                          style={{
                            backgroundColor: C.greenDim,
                            color: C.green,
                            border: `1px solid ${C.greenBorder}`,
                          }}
                        >
                          {player.numero}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          className="group h-auto justify-start p-0 text-left font-normal hover:bg-transparent"
                        >
                          <span
                            className="text-white group-hover:underline"
                            style={{ fontSize: "0.95rem" }}
                          >
                            {player.nome}
                          </span>
                        </Button>
                      </TableCell>

                      <TableCell>
                        <span
                          className="rounded-full px-2 py-1 text-xs"
                          style={{
                            backgroundColor: posStyle.bg,
                            color: posStyle.text,
                            border: `1px solid ${posStyle.border}`,
                          }}
                        >
                          {player.posicao}
                        </span>
                      </TableCell>

                      <TableCell style={{ color: C.muted, fontSize: "0.9rem" }}>
                        {player.idade ? `${player.idade} anos` : "—"}
                      </TableCell>

                      <TableCell
                        style={{ color: C.muted, fontSize: "0.95rem" }}
                      >
                        —
                      </TableCell>
                      <TableCell style={{ color: C.text, fontSize: "0.9rem" }}>
                        0
                      </TableCell>
                      <TableCell style={{ color: C.text, fontSize: "0.9rem" }}>
                        0
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            className="h-auto min-w-0 rounded-lg px-2 py-1 text-xs font-normal"
                            style={{
                              backgroundColor: C.greenDim,
                              color: C.green,
                              border: `1px solid ${C.greenBorder}`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = C.green;
                              e.currentTarget.style.color = "#000";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                C.greenDim;
                              e.currentTarget.style.color = C.green;
                            }}
                            title="Ver registros"
                          >
                            <ClipboardList size={12} />
                          </Button>

                          <Button
                            variant="ghost"
                            onClick={() => handleEdit(player)}
                            className="h-auto min-w-0 rounded-lg px-2 py-1 text-xs font-normal"
                            style={{
                              backgroundColor: "#1a2540",
                              color: "#60a5fa",
                              border: "1px solid #1a3560",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#2563eb";
                              e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#1a2540";
                              e.currentTarget.style.color = "#60a5fa";
                            }}
                            title="Editar"
                          >
                            <Pencil size={12} />
                          </Button>

                          <Button
                            variant="ghost"
                            onClick={() => handleDelete(player.id)}
                            className="h-auto min-w-0 rounded-lg px-2 py-1 text-xs font-normal"
                            style={{
                              backgroundColor: "#2e1a1a",
                              color: "#f87171",
                              border: "1px solid #4a1a1a",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#dc2626";
                              e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#2e1a1a";
                              e.currentTarget.style.color = "#f87171";
                            }}
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
      {/* Mobile: card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {isLoadingJogadores ? (
          <div className="py-16 text-center" style={{ color: C.muted }}>
            <p>Carregando jogadores...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="py-16 text-center" style={{ color: C.muted }}>
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum jogador encontrado</p>
          </div>
        ) : (
          filteredPlayers
            .sort((a, b) => a.numero - b.numero)
            .map((player) => {
              const posStyle = positionColors[player.posicao] ?? {
                bg: C.card,
                text: C.text,
                border: C.border,
              };
              return (
                <div
                  key={player.id}
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: C.card,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm"
                      style={{
                        backgroundColor: C.greenDim,
                        color: C.green,
                        border: `1px solid ${C.greenBorder}`,
                      }}
                    >
                      {player.numero}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Button
                        variant="ghost"
                        className="h-auto w-full justify-start p-0 text-left hover:bg-transparent"
                      >
                        <p
                          className="mb-0 truncate font-normal text-white"
                          style={{ fontSize: "0.95rem" }}
                        >
                          {player.nome}
                        </p>
                      </Button>
                      <p
                        className="mb-0 font-normal"
                        style={{ color: C.muted, fontSize: "0.78rem" }}
                      >
                        {player.idade ? `${player.idade} anos` : "N/I"}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-1 text-xs"
                      style={{
                        backgroundColor: posStyle.bg,
                        color: posStyle.text,
                        border: `1px solid ${posStyle.border}`,
                      }}
                    >
                      {player.posicao}
                    </span>
                  </div>

                  <div className="mb-3 grid grid-cols-3 gap-2">
                    {[
                      {
                        label: "Nota",
                        value: "—",
                        highlight: false,
                      },
                      { label: "Gols", value: 0 },
                      { label: "Assist.", value: 0 },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-lg p-2 text-center"
                        style={{ backgroundColor: C.cardHeader }}
                      >
                        <p
                          className="mb-0 font-normal"
                          style={{
                            color: (s as any).highlight ? C.green : C.text,
                            fontSize: "1rem",
                          }}
                        >
                          {s.value}
                        </p>
                        <p
                          className="mb-0 font-normal"
                          style={{ color: C.dim, fontSize: "0.65rem" }}
                        >
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="flex h-auto flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs font-normal"
                      style={{
                        backgroundColor: C.greenDim,
                        color: C.green,
                        border: `1px solid ${C.greenBorder}`,
                      }}
                    >
                      <ClipboardList size={13} />
                      Registros
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleEdit(player)}
                      className="flex h-auto items-center justify-center rounded-lg px-3 py-2 text-xs font-normal"
                      style={{
                        backgroundColor: "#1a2540",
                        color: "#60a5fa",
                        border: "1px solid #1a3560",
                      }}
                    >
                      <Pencil size={13} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(player.id)}
                      className="flex h-auto items-center justify-center rounded-lg px-3 py-2 text-xs font-normal"
                      style={{
                        backgroundColor: "#2e1a1a",
                        color: "#f87171",
                        border: "1px solid #4a1a1a",
                      }}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              );
            })
        )}
      </div>
      {/* Modal */}
      <ModalDialog
        jogador={editingPlayer}
        showForm={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPlayer(null);
        }}
        onSubmit={() => {
          setShowForm(false);
          setEditingPlayer(null);
        }}
      />
    </>
  );
};

export default TablePlayers;
