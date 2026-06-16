import {
  Activity,
  ArrowLeft,
  Bookmark,
  Shield,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { useState } from "react";

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

interface PlayerRecordsProps {
  player: Player;
  onBack: () => void;
}

const tabs = ["GERAL", "ESTATÍSTICAS", "HISTÓRICO"];

export function PlayerRecords({ player, onBack }: PlayerRecordsProps) {
  const [activeTab, setActiveTab] = useState("GERAL");
  const stars = Math.round(player.rating / 2);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bgAlt} 100%)`,
      }}
    >
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <div
          className="rounded-2xl p-4 md:p-8"
          style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
        >
          {/* Header row */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={onBack}
              style={{ color: C.muted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              <ArrowLeft size={20} />
            </button>
            <Bookmark size={20} style={{ color: C.muted, cursor: "pointer" }} />
          </div>

          {/* Player hero — stacked on mobile, row on desktop */}
          <div className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:gap-8">
            {/* Avatar + name (always together) */}
            <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-0">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full md:h-28 md:w-28"
                style={{
                  background: `linear-gradient(135deg, ${C.cardHeader}, ${C.bgAlt})`,
                  border: `3px solid ${C.green}`,
                  boxShadow: `0 0 24px rgba(0,230,118,0.25)`,
                }}
              >
                <span style={{ color: C.green, fontSize: "1.2rem" }}>
                  #{player.number}
                </span>
              </div>

              {/* Name block — shown inline on mobile */}
              <div className="md:hidden">
                <h1 className="text-white" style={{ fontSize: "1.3rem" }}>
                  {player.name}
                </h1>
                <p
                  style={{ color: C.muted, fontSize: "0.82rem" }}
                  className="mb-2"
                >
                  {player.name.split(" ")[0]} | {player.team}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-xs"
                    style={{
                      backgroundColor: C.greenDim,
                      color: C.green,
                      border: `1px solid ${C.greenBorder}`,
                    }}
                  >
                    {player.position}
                  </span>
                </div>
              </div>
            </div>

            {/* Name block — desktop only */}
            <div className="hidden flex-1 md:block">
              <h1 className="mb-1 text-white" style={{ fontSize: "1.8rem" }}>
                {player.name}
              </h1>
              <p
                style={{ color: C.muted, fontSize: "0.9rem" }}
                className="mb-2"
              >
                {player.name.split(" ")[0]} | {player.team}
              </p>
              <div className="mb-3 flex gap-2">
                {[player.position, player.position].map((pos, i) => (
                  <span
                    key={i}
                    className="rounded-full px-3 py-1 text-sm"
                    style={{
                      backgroundColor: C.greenDim,
                      color: C.green,
                      border: `1px solid ${C.greenBorder}`,
                    }}
                  >
                    {pos}
                  </span>
                ))}
              </div>
              <p style={{ color: C.muted, fontSize: "0.85rem" }}>
                Idade: {player.age} anos | Número: {player.number} |{" "}
                {player.team}
              </p>
            </div>

            {/* Stat cards — 2×2 on mobile, 4×1 on desktop */}
            <div className="grid grid-cols-2 gap-2 md:flex-1 md:grid-cols-4 md:gap-3">
              {[
                {
                  label: "Nota Média",
                  value: player.rating.toFixed(1),
                  hasStars: true,
                },
                { label: "Gols", value: player.goals },
                { label: "Assistências", value: player.assists },
                { label: "Jogos", value: player.games },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl p-3 md:p-4"
                  style={{
                    backgroundColor: C.cardHeader,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <p
                    style={{ color: C.muted, fontSize: "0.72rem" }}
                    className="mb-1"
                  >
                    {stat.label}
                  </p>
                  <p className="text-white" style={{ fontSize: "1.4rem" }}>
                    {stat.value}
                  </p>
                  {stat.hasStars && (
                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          fill={i < stars ? "#f59e0b" : "none"}
                          style={{ color: i < stars ? "#f59e0b" : C.dim }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tabs — scrollable on mobile */}
          <div
            className="mb-5 overflow-x-auto"
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            <div className="flex min-w-max gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="pb-3 text-sm whitespace-nowrap"
                  style={{
                    color: activeTab === tab ? C.text : C.muted,
                    borderBottom:
                      activeTab === tab
                        ? `2px solid ${C.green}`
                        : "2px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* GERAL */}
          {activeTab === "GERAL" && (
            <div>
              <p
                style={{ color: C.dim, fontSize: "0.75rem" }}
                className="mb-3 tracking-wide uppercase"
              >
                Variáveis
              </p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
                {[
                  { label: "Cartões", isCards: true },
                  { label: "Assistências", value: player.assists },
                  { label: "Finalizações", value: player.shots },
                  { label: "Escanteios", value: player.corners },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl p-3"
                    style={{
                      backgroundColor: C.cardHeader,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <span style={{ color: C.text, fontSize: "0.85rem" }}>
                      {item.label}
                    </span>
                    {item.isCards ? (
                      <div className="flex items-center gap-1">
                        <span
                          className="h-4 w-3 rounded-sm"
                          style={{
                            backgroundColor: "#f59e0b",
                            display: "inline-block",
                          }}
                        />
                        <span style={{ color: C.text, fontSize: "0.85rem" }}>
                          {player.yellowCards}
                        </span>
                        <span
                          className="h-4 w-3 rounded-sm"
                          style={{
                            backgroundColor: "#ef4444",
                            display: "inline-block",
                          }}
                        />
                        <span style={{ color: C.text, fontSize: "0.85rem" }}>
                          {player.redCards}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: C.text }}>{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ESTATÍSTICAS */}
          {activeTab === "ESTATÍSTICAS" && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {[
                {
                  icon: <Target size={18} />,
                  label: "Gols por jogo",
                  value: (player.goals / Math.max(player.games, 1)).toFixed(2),
                },
                {
                  icon: <Zap size={18} />,
                  label: "Assistências por jogo",
                  value: (player.assists / Math.max(player.games, 1)).toFixed(
                    2,
                  ),
                },
                {
                  icon: <Shield size={18} />,
                  label: "Nota média geral",
                  value: player.rating.toFixed(1),
                },
                {
                  icon: <Activity size={18} />,
                  label: "Finalizações por jogo",
                  value: (player.shots / Math.max(player.games, 1)).toFixed(1),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-xl p-4"
                  style={{
                    backgroundColor: C.cardHeader,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    className="shrink-0 rounded-lg p-2"
                    style={{ backgroundColor: C.greenDim, color: C.green }}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p style={{ color: C.muted, fontSize: "0.8rem" }}>
                      {stat.label}
                    </p>
                    <p className="text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* HISTÓRICO */}
          {activeTab === "HISTÓRICO" && (
            <div className="py-10 text-center" style={{ color: C.muted }}>
              <Activity size={40} className="mx-auto mb-3 opacity-30" />
              <p>Nenhum histórico disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
