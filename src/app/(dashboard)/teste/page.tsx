"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ClipboardList,
  Users,
  Search,
  Shield,
} from "lucide-react";
import { PlayerRecords } from "./components/PlayerRecords";

const C = {
  bg: "#13192b",
  bgAlt: "#0f1422",
  card: "#1c2438",
  cardHover: "#212b42",
  cardHeader: "#161e30",
  border: "#252f4a",
  borderLight: "#2a3554",
  green: "#00e676",
  greenDim: "#1a3b2a",
  greenBorder: "#1a4d30",
  text: "#e5e7eb",
  muted: "#8b95b0",
  dim: "#4b5780",
};

interface Player {
  id: number;
  number: number;
  name: string;
  team: string;
  position: string;
  age: number;
  rating: number;
  goals: number;
  assists: number;
  games: number;
  yellowCards: number;
  redCards: number;
  shots: number;
  corners: number;
}

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

const teams = ["Academia Sub-17 Bahia", "Time B", "Time C"];

const initialPlayers: Player[] = [
  {
    id: 1,
    number: 1,
    name: "Kaique Moreira",
    team: "Academia Sub-17 Bahia",
    position: "Goleiro",
    age: 16,
    rating: 7.8,
    goals: 0,
    assists: 0,
    games: 18,
    yellowCards: 1,
    redCards: 0,
    shots: 0,
    corners: 0,
  },
  {
    id: 2,
    number: 4,
    name: "Davi Lopes",
    team: "Academia Sub-17 Bahia",
    position: "Zagueiro",
    age: 17,
    rating: 8.1,
    goals: 2,
    assists: 1,
    games: 20,
    yellowCards: 3,
    redCards: 0,
    shots: 5,
    corners: 0,
  },
  {
    id: 3,
    number: 7,
    name: "Yuri Batista",
    team: "Academia Sub-17 Bahia",
    position: "Atacante",
    age: 16,
    rating: 8.6,
    goals: 12,
    assists: 5,
    games: 20,
    yellowCards: 2,
    redCards: 0,
    shots: 34,
    corners: 3,
  },
  {
    id: 4,
    number: 9,
    name: "Nathan Freitas",
    team: "Academia Sub-17 Bahia",
    position: "Atacante",
    age: 16,
    rating: 8.3,
    goals: 9,
    assists: 4,
    games: 19,
    yellowCards: 1,
    redCards: 1,
    shots: 28,
    corners: 1,
  },
  {
    id: 5,
    number: 10,
    name: "Cauã Ribeiro",
    team: "Academia Sub-17 Bahia",
    position: "Meia",
    age: 17,
    rating: 9.0,
    goals: 5,
    assists: 11,
    games: 21,
    yellowCards: 2,
    redCards: 0,
    shots: 19,
    corners: 13,
  },
  {
    id: 6,
    number: 6,
    name: "Lucas Andrade",
    team: "Academia Sub-17 Bahia",
    position: "Volante",
    age: 17,
    rating: 7.9,
    goals: 1,
    assists: 3,
    games: 18,
    yellowCards: 4,
    redCards: 0,
    shots: 7,
    corners: 0,
  },
  {
    id: 7,
    number: 3,
    name: "Bruno Mendes",
    team: "Academia Sub-17 Bahia",
    position: "Lateral",
    age: 16,
    rating: 7.5,
    goals: 0,
    assists: 5,
    games: 17,
    yellowCards: 2,
    redCards: 0,
    shots: 3,
    corners: 8,
  },
];

export default function Teste() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    position: "Atacante",
    age: "",
  });

  const filteredPlayers = players.filter(
    (p) =>
      p.team === selectedTeam &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.position.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  function handleDelete(id: number) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }

  function handleEdit(player: Player) {
    setEditingPlayer(player);
    setFormData({
      number: String(player.number),
      name: player.name,
      position: player.position,
      age: String(player.age),
    });
    setShowForm(true);
  }

  function handleSave() {
    if (!formData.name || !formData.number) return;
    if (editingPlayer) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === editingPlayer.id
            ? {
                ...p,
                number: Number(formData.number),
                name: formData.name,
                position: formData.position,
                age: Number(formData.age),
              }
            : p,
        ),
      );
    } else {
      const newPlayer: Player = {
        id: Date.now(),
        number: Number(formData.number),
        name: formData.name,
        team: selectedTeam,
        position: formData.position,
        age: Number(formData.age),
        rating: 7.0,
        goals: 0,
        assists: 0,
        games: 0,
        yellowCards: 0,
        redCards: 0,
        shots: 0,
        corners: 0,
      };
      setPlayers((prev) => [...prev, newPlayer]);
    }
    setShowForm(false);
    setEditingPlayer(null);
    setFormData({ number: "", name: "", position: "Atacante", age: "" });
  }

  if (selectedPlayer) {
    return (
      <PlayerRecords
        player={selectedPlayer}
        onBack={() => setSelectedPlayer(null)}
      />
    );
  }

  const positionGroups = [
    "Goleiro",
    "Zagueiro",
    "Lateral",
    "Volante",
    "Meia",
    "Atacante",
  ];

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bgAlt} 100%)`,
      }}
    >
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2"
              style={{
                backgroundColor: C.card,
                color: C.muted,
                border: `1px solid ${C.border}`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              <ArrowLeft size={16} />
              <span className="text-sm">Voltar</span>
            </button>
            <div className="flex items-center gap-2">
              <div
                className="shrink-0 rounded-lg p-2"
                style={{
                  backgroundColor: C.greenDim,
                  border: `1px solid ${C.greenBorder}`,
                }}
              >
                <Shield size={18} style={{ color: C.green }} />
              </div>
              <div>
                <h1
                  className="leading-tight text-white"
                  style={{ fontSize: "clamp(1rem, 4vw, 1.4rem)" }}
                >
                  Gerenciamento de Jogadores
                </h1>
                <p style={{ color: C.muted, fontSize: "0.78rem" }}>
                  Cadastre e organize seus jogadores
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                filteredPlayers[0] && setSelectedPlayer(filteredPlayers[0])
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 md:flex-none"
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
                e.currentTarget.style.backgroundColor = C.greenDim;
                e.currentTarget.style.color = C.green;
              }}
            >
              <ClipboardList size={15} />
              <span className="text-sm">Registros</span>
            </button>
            <button
              onClick={() => {
                setEditingPlayer(null);
                setFormData({
                  number: "",
                  name: "",
                  position: "Atacante",
                  age: "",
                });
                setShowForm(true);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 md:flex-none"
              style={{ backgroundColor: C.green, color: "#000" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Plus size={15} />
              <span className="text-sm">Novo Jogador</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 md:mb-6 md:flex-row md:items-end md:gap-4">
          {/* Team selector */}
          <div className="relative md:shrink-0">
            <p style={{ color: C.muted, fontSize: "0.75rem" }} className="mb-1">
              Selecione um time
            </p>
            <button
              onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2 md:w-auto"
              style={{
                backgroundColor: C.card,
                color: C.text,
                border: `1px solid ${C.border}`,
                minWidth: "200px",
              }}
            >
              <Users size={14} style={{ color: C.green }} />
              <span className="flex-1 text-left text-sm">{selectedTeam}</span>
              <ChevronDown size={14} style={{ color: C.dim }} />
            </button>
            {teamDropdownOpen && (
              <div
                className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-lg"
                style={{
                  backgroundColor: C.card,
                  border: `1px solid ${C.border}`,
                }}
              >
                {teams.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTeam(t);
                      setTeamDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm"
                    style={{ color: t === selectedTeam ? C.green : C.text }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = C.cardHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2"
              style={{ color: C.dim }}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar jogador ou posição..."
              className="w-full rounded-lg py-2 pr-4 pl-9 text-sm outline-none"
              style={{
                backgroundColor: C.card,
                color: C.text,
                border: `1px solid ${C.border}`,
              }}
            />
          </div>

          {/* Stats summary */}
          <div
            className="flex shrink-0 items-center gap-0 overflow-hidden rounded-lg"
            style={{ border: `1px solid ${C.border}` }}
          >
            {[
              { label: "Jogadores", value: filteredPlayers.length },
              {
                label: "Gols",
                value: filteredPlayers.reduce((s, p) => s + p.goals, 0),
              },
              {
                label: "Média",
                value:
                  filteredPlayers.length > 0
                    ? (
                        filteredPlayers.reduce((s, p) => s + p.rating, 0) /
                        filteredPlayers.length
                      ).toFixed(1)
                    : "—",
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
                <p style={{ color: C.green, fontSize: "1rem" }}>{stat.value}</p>
                <p style={{ color: C.dim, fontSize: "0.65rem" }}>
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
            {filteredPlayers.length === 0 ? (
              <div className="py-16 text-center" style={{ color: C.muted }}>
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p>Nenhum jogador encontrado</p>
              </div>
            ) : (
              filteredPlayers
                .sort((a, b) => a.number - b.number)
                .map((player) => {
                  const posStyle = positionColors[player.position] ?? {
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
                          {player.number}
                        </span>
                        <div className="min-w-0 flex-1">
                          <button
                            onClick={() => setSelectedPlayer(player)}
                            className="w-full text-left"
                          >
                            <p
                              className="truncate text-white"
                              style={{ fontSize: "0.95rem" }}
                            >
                              {player.name}
                            </p>
                          </button>
                          <p style={{ color: C.muted, fontSize: "0.78rem" }}>
                            {player.age} anos
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
                          {player.position}
                        </span>
                      </div>

                      <div className="mb-3 grid grid-cols-3 gap-2">
                        {[
                          {
                            label: "Nota",
                            value: player.rating.toFixed(1),
                            highlight: player.rating >= 8.5,
                          },
                          { label: "Gols", value: player.goals },
                          { label: "Assist.", value: player.assists },
                        ].map((s) => (
                          <div
                            key={s.label}
                            className="rounded-lg p-2 text-center"
                            style={{ backgroundColor: C.cardHeader }}
                          >
                            <p
                              style={{
                                color: (s as any).highlight ? C.green : C.text,
                                fontSize: "1rem",
                              }}
                            >
                              {s.value}
                            </p>
                            <p style={{ color: C.dim, fontSize: "0.65rem" }}>
                              {s.label}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedPlayer(player)}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs"
                          style={{
                            backgroundColor: C.greenDim,
                            color: C.green,
                            border: `1px solid ${C.greenBorder}`,
                          }}
                        >
                          <ClipboardList size={13} />
                          Registros
                        </button>
                        <button
                          onClick={() => handleEdit(player)}
                          className="flex items-center justify-center rounded-lg px-3 py-2 text-xs"
                          style={{
                            backgroundColor: "#1a2540",
                            color: "#60a5fa",
                            border: "1px solid #1a3560",
                          }}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(player.id)}
                          className="flex items-center justify-center rounded-lg px-3 py-2 text-xs"
                          style={{
                            backgroundColor: "#2e1a1a",
                            color: "#f87171",
                            border: "1px solid #4a1a1a",
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {/* Desktop: table */}
          <div
            className="hidden overflow-hidden rounded-xl md:block"
            style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
          >
            <div
              className="grid px-6 py-3"
              style={{
                gridTemplateColumns: "60px 1fr 140px 80px 80px 80px 80px 120px",
                backgroundColor: C.cardHeader,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {[
                "Nº",
                "Jogador",
                "Posição",
                "Idade",
                "Nota",
                "Gols",
                "Assist.",
                "Ações",
              ].map((h) => (
                <span
                  key={h}
                  style={{ color: C.dim, fontSize: "0.75rem" }}
                  className="tracking-wide uppercase"
                >
                  {h}
                </span>
              ))}
            </div>

            {filteredPlayers.length === 0 ? (
              <div className="py-16 text-center" style={{ color: C.muted }}>
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p>Nenhum jogador encontrado</p>
              </div>
            ) : (
              filteredPlayers
                .sort((a, b) => a.number - b.number)
                .map((player, idx) => {
                  const posStyle = positionColors[player.position] ?? {
                    bg: C.card,
                    text: C.text,
                    border: C.border,
                  };
                  return (
                    <div
                      key={player.id}
                      className="grid items-center px-6 py-4 transition-colors"
                      style={{
                        gridTemplateColumns:
                          "60px 1fr 140px 80px 80px 80px 80px 120px",
                        borderBottom:
                          idx < filteredPlayers.length - 1
                            ? `1px solid ${C.border}`
                            : "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = C.cardHover)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full text-sm"
                        style={{
                          backgroundColor: C.greenDim,
                          color: C.green,
                          border: `1px solid ${C.greenBorder}`,
                        }}
                      >
                        {player.number}
                      </span>
                      <button
                        onClick={() => setSelectedPlayer(player)}
                        className="group text-left"
                      >
                        <span
                          className="text-white group-hover:underline"
                          style={{ fontSize: "0.95rem" }}
                        >
                          {player.name}
                        </span>
                      </button>
                      <span>
                        <span
                          className="rounded-full px-2 py-1 text-xs"
                          style={{
                            backgroundColor: posStyle.bg,
                            color: posStyle.text,
                            border: `1px solid ${posStyle.border}`,
                          }}
                        >
                          {player.position}
                        </span>
                      </span>
                      <span style={{ color: C.muted, fontSize: "0.9rem" }}>
                        {player.age} anos
                      </span>
                      <span
                        style={{
                          color:
                            player.rating >= 8.5
                              ? C.green
                              : player.rating >= 7.5
                                ? "#f59e0b"
                                : C.muted,
                          fontSize: "0.95rem",
                        }}
                      >
                        {player.rating.toFixed(1)}
                      </span>
                      <span style={{ color: C.text, fontSize: "0.9rem" }}>
                        {player.goals}
                      </span>
                      <span style={{ color: C.text, fontSize: "0.9rem" }}>
                        {player.assists}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPlayer(player)}
                          className="rounded-lg px-2 py-1 text-xs"
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
                            e.currentTarget.style.backgroundColor = C.greenDim;
                            e.currentTarget.style.color = C.green;
                          }}
                          title="Ver registros"
                        >
                          <ClipboardList size={12} />
                        </button>
                        <button
                          onClick={() => handleEdit(player)}
                          className="rounded-lg px-2 py-1 text-xs"
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
                        </button>
                        <button
                          onClick={() => handleDelete(player.id)}
                          className="rounded-lg px-2 py-1 text-xs"
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
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </>

        {/* Position legend */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {positionGroups.map((pos) => {
            const style = positionColors[pos] ?? {
              bg: C.card,
              text: C.text,
              border: C.border,
            };
            return (
              <span
                key={pos}
                className="rounded-full px-2 py-1 text-xs"
                style={{
                  backgroundColor: style.bg,
                  color: style.text,
                  border: `1px solid ${style.border}`,
                }}
              >
                {pos}
              </span>
            );
          })}
        </div>
      </div>

      {/* Modal form */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
        >
          <div
            className="w-full rounded-t-2xl p-6 md:max-w-md md:rounded-2xl"
            style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
          >
            <h2 className="mb-5 text-white">
              {editingPlayer ? "Editar Jogador" : "Novo Jogador"}
            </h2>
            <div className="flex flex-col gap-4">
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
                <div key={field.key}>
                  <label
                    className="mb-1 block"
                    style={{ color: C.muted, fontSize: "0.8rem" }}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={(formData as any)[field.key]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg px-4 py-2 outline-none"
                    style={{
                      backgroundColor: C.cardHeader,
                      color: C.text,
                      border: `1px solid ${C.borderLight}`,
                    }}
                  />
                </div>
              ))}
              <div>
                <label
                  className="mb-1 block"
                  style={{ color: C.muted, fontSize: "0.8rem" }}
                >
                  Posição
                </label>
                <select
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg px-4 py-2 outline-none"
                  style={{
                    backgroundColor: C.cardHeader,
                    color: C.text,
                    border: `1px solid ${C.borderLight}`,
                  }}
                >
                  {[
                    "Goleiro",
                    "Zagueiro",
                    "Lateral",
                    "Volante",
                    "Meia",
                    "Atacante",
                  ].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPlayer(null);
                }}
                className="flex-1 rounded-lg py-2 text-sm"
                style={{
                  backgroundColor: C.cardHeader,
                  color: C.muted,
                  border: `1px solid ${C.border}`,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-lg py-2 text-sm"
                style={{ backgroundColor: C.green, color: "#000" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {editingPlayer ? "Salvar alterações" : "Adicionar jogador"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
