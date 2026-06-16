"use client";

import {
  ArrowLeft,
  ClipboardList,
  Pencil,
  Plus,
  Shield,
  Swords,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { createJogador } from "@/app/actions/create-jogador";
import { deleteJogador } from "@/app/actions/delete-jogador";
import { listJogadoresByTime } from "@/app/actions/list-jogadores-by-time";
import { listTimes } from "@/app/actions/list-times";
import { updateJogador } from "@/app/actions/update-jogador";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Jogador, Time } from "@/db/schema";

import SearchFilter from "./components/SearchFilter";
import { C } from "@/constants/Colors";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const positionStyles: Record<string, string> = {
  Goleiro: "bg-green-500/20 text-green-400 border-green-500/30",
  Zagueiro: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Lateral: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Meia: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Atacante: "bg-red-500/20 text-red-400 border-red-500/30",
  Volante: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

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

const positionGroups = [
  "Goleiro",
  "Zagueiro",
  "Lateral",
  "Volante",
  "Meia",
  "Atacante",
];

export default function JogadoresPage() {
  const [times, setTimes] = useState<Time[]>([]);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Time | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Jogador | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingJogadores, setIsLoadingJogadores] = useState(true);

  const [formData, setFormData] = useState({
    numero: "",
    nome: "",
    posicao: "Atacante",
    idade: "",
  });

  useEffect(() => {
    let isMounted = true;
    listTimes().then((data) => {
      if (isMounted) {
        setTimes(data);
        if (data.length > 0) {
          setSelectedTeam(data[0]);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!selectedTeam?.id) {
      setJogadores([]);
      setIsLoadingJogadores(false);
      return;
    }
    setIsLoadingJogadores(true);
    listJogadoresByTime(selectedTeam.id)
      .then((data) => {
        if (isMounted) {
          setJogadores(data);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingJogadores(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [selectedTeam?.id]);

  const filteredPlayers = jogadores.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.posicao.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este jogador?")) {
      try {
        await deleteJogador(id);
        setJogadores((prev) => prev.filter((p) => p.id !== id));
        toast.success("Jogador apagado com sucesso");
      } catch (err) {
        toast.error("Erro ao apagar jogador!");
      }
    }
  };

  const handleEdit = (player: Jogador) => {
    setEditingPlayer(player);
    setFormData({
      numero: String(player.numero),
      nome: player.nome,
      posicao: player.posicao,
      idade: player.idade ? String(player.idade) : "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.numero || !selectedTeam) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    try {
      setIsCreating(true);
      if (editingPlayer) {
        await updateJogador({
          id: editingPlayer.id,
          nome: formData.nome,
          numero: Number(formData.numero),
          posicao: formData.posicao as any,
          idade: Number(formData.idade) || undefined,
        });
        toast.success("Jogador atualizado com sucesso!");
      } else {
        await createJogador({
          nome: formData.nome,
          numero: Number(formData.numero),
          posicao: formData.posicao as any,
          idade: Number(formData.idade),
          idTime: selectedTeam.id,
        });
        toast.success("Jogador adicionado com sucesso!");
      }
      const data = await listJogadoresByTime(selectedTeam.id);
      setJogadores(data);
      setShowForm(false);
      setEditingPlayer(null);
      setFormData({ numero: "", nome: "", posicao: "Atacante", idade: "" });
    } catch (error) {
      toast.error("Erro ao salvar jogador");
    } finally {
      setIsCreating(false);
    }
  };

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
            <Button
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
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 md:mb-6 md:flex-row md:items-end md:gap-4">
          {/* Search */}
          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {/* Stats summary */}
          <div
            className="flex shrink-0 items-center gap-0 overflow-hidden rounded-lg"
            style={{ border: `1px solid ${C.border}` }}
          >
            {[
              { label: "Jogadores", value: filteredPlayers.length },
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
        <>
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

          {/* Desktop: table */}
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
                    className="w-[60px] text-xs tracking-wide uppercase"
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
                    className="w-[140px] text-xs tracking-wide uppercase"
                  >
                    Posição
                  </TableHead>
                  <TableHead
                    style={{ color: C.dim }}
                    className="w-[80px] text-xs tracking-wide uppercase"
                  >
                    Idade
                  </TableHead>
                  <TableHead
                    style={{ color: C.dim }}
                    className="w-[80px] text-xs tracking-wide uppercase"
                  >
                    Nota
                  </TableHead>
                  <TableHead
                    style={{ color: C.dim }}
                    className="w-[80px] text-xs tracking-wide uppercase"
                  >
                    Gols
                  </TableHead>
                  <TableHead
                    style={{ color: C.dim }}
                    className="w-[80px] text-xs tracking-wide uppercase"
                  >
                    Assist.
                  </TableHead>
                  <TableHead
                    style={{ color: C.dim }}
                    className="w-[120px] text-xs tracking-wide uppercase"
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

                          <TableCell
                            style={{ color: C.muted, fontSize: "0.9rem" }}
                          >
                            {player.idade ? `${player.idade} anos` : "—"}
                          </TableCell>

                          <TableCell
                            style={{ color: C.muted, fontSize: "0.95rem" }}
                          >
                            —
                          </TableCell>
                          <TableCell
                            style={{ color: C.text, fontSize: "0.9rem" }}
                          >
                            0
                          </TableCell>
                          <TableCell
                            style={{ color: C.text, fontSize: "0.9rem" }}
                          >
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
                                  e.currentTarget.style.backgroundColor =
                                    C.green;
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
                                  e.currentTarget.style.backgroundColor =
                                    "#2563eb";
                                  e.currentTarget.style.color = "#fff";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#1a2540";
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
                                  e.currentTarget.style.backgroundColor =
                                    "#dc2626";
                                  e.currentTarget.style.color = "#fff";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#2e1a1a";
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
        </>

        {/* Position legend */}
      </div>

      {/* Modal */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent
            className="w-full max-w-md rounded-t-2xl p-6 md:rounded-2xl"
            style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
          >
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingPlayer ? "Editar Jogador" : "Novo Jogador"}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-2 flex flex-col gap-4">
              {[
                {
                  label: "Número da camisa",
                  key: "number",
                  type: "number",
                  placeholder: "Ex: 10",
                },
                {
                  label: "Nome completo",
                  key: "name",
                  type: "text",
                  placeholder: "Ex: João Silva",
                },
                {
                  label: "Idade",
                  key: "age",
                  type: "number",
                  placeholder: "Ex: 17",
                },
              ].map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                  <Label style={{ color: C.muted }} className="text-xs">
                    {field.label}
                  </Label>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={(formData as any)[field.key]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="rounded-lg border px-4 py-2 outline-none focus-visible:ring-0"
                    style={{
                      backgroundColor: C.cardHeader,
                      color: C.text,
                      borderColor: C.borderLight,
                    }}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <Label style={{ color: C.muted }} className="text-xs">
                  Posição
                </Label>
                <Select
                  value={formData.posicao}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, posicao: value }))
                  }
                >
                  <SelectTrigger
                    className="rounded-lg border px-4 py-2 outline-none focus:ring-0"
                    style={{
                      backgroundColor: C.cardHeader,
                      color: C.text,
                      borderColor: C.borderLight,
                    }}
                  >
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent
                    style={{ backgroundColor: C.card, borderColor: C.border }}
                  >
                    {[
                      "Goleiro",
                      "Zagueiro",
                      "Lateral",
                      "Volante",
                      "Meia",
                      "Atacante",
                    ].map((p) => (
                      <SelectItem
                        key={p}
                        value={p}
                        className="cursor-pointer"
                        style={{ color: C.text }}
                      >
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="mt-6 flex gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1 rounded-lg py-2 text-sm"
                style={{
                  backgroundColor: C.cardHeader,
                  color: C.muted,
                  borderColor: C.border,
                }}
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 rounded-lg py-2 text-sm font-semibold opacity-100 transition-opacity hover:opacity-85"
                style={{ backgroundColor: C.green, color: "#000" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                onClick={handleSave}
              >
                {editingPlayer ? "Salvar alterações" : "Adicionar jogador"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
