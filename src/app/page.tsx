"use client";

import {
  Activity,
  ArrowRight,
  BarChart2,
  ChevronRight,
  ClipboardList,
  FileText,
  Menu,
  Star,
  Swords,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  greenDeep: "#00b856",
  text: "#e5e7eb",
  muted: "#8b95b0",
  dim: "#4b5780",
};

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = to / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {count.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

// ─── Feature card ──────────────────────────────────────────────────────────────
const features = [
  {
    icon: <Activity size={22} />,
    title: "Scout ao Vivo",
    desc: "Registre eventos em tempo real com cronômetro integrado e placar automático.",
  },
  {
    icon: <BarChart2 size={22} />,
    title: "Estatísticas Avançadas",
    desc: "Análise automática de desempenho com notas por posição e heatmaps de atuação.",
  },
  {
    icon: <FileText size={22} />,
    title: "Relatórios em PDF",
    desc: "Gere relatórios profissionais com resumo de estatísticas e sugestões táticas.",
  },
  {
    icon: <Users size={22} />,
    title: "Gerenciamento de Times",
    desc: "Cadastre e organize times, jogadores e categorias com facilidade.",
  },
  {
    icon: <Zap size={22} />,
    title: "Controle de Perfis",
    desc: "Diferentes níveis de acesso para Treinador, Analista, Auxiliar e Coordenador.",
  },
  {
    icon: <Trophy size={22} />,
    title: "Dashboard Completo",
    desc: "Visualize ranking de jogadores, comparações e análises táticas em um só lugar.",
  },
];

// ─── Stats ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: 1200, suffix: "+", label: "Jogadores Cadastrados" },
  { value: 340, suffix: "+", label: "Partidas Registradas" },
  { value: 58, suffix: "+", label: "Times Ativos" },
  { value: 99, suffix: "%", label: "Satisfação dos Treinadores" },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }

  const navLinks = [
    { label: "Funcionalidades", id: "features" },
    { label: "Estatísticas", id: "stats" },
    { label: "Plataforma", id: "cta" },
  ];

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bgAlt} 100%)`,
      }}
    >
      {/* ── Navbar ── */}
      <header
        className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(19,25,43,0.95)" : "transparent",
          borderBottom: scrolled
            ? `1px solid ${C.border}`
            : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg">
              <Image
                src="/logo_scout_pro.png"
                alt="Logo"
                width={200}
                height={200}
                loading="eager"
              />
            </div>
            <span
              className="font-semibold text-white"
              style={{ fontSize: "0.95rem" }}
            >
              Scout Campo Pro
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm transition-colors"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link href="/authentication">
              <button
                className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity"
                style={{ backgroundColor: C.green, color: "#000" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Entrar
              </button>
            </Link>
            <button
              className="rounded-lg p-2 md:hidden"
              style={{ color: C.muted }}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-1 px-4 pb-4 md:hidden"
            style={{
              backgroundColor: "rgba(19,25,43,0.98)",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="rounded-lg px-3 py-2.5 text-left text-sm"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-16 text-center">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(0,230,118,0.07) 0%, transparent 70%)",
          }}
        />
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              backgroundColor: C.greenDim,
              border: `1px solid ${C.greenBorder}`,
            }}
          >
            <Star size={12} style={{ color: C.green }} />
            <span style={{ color: C.green, fontSize: "0.75rem" }}>
              Plataforma líder em scout de futebol
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-5 leading-tight text-white"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 700 }}
          >
            Análise de Desempenho{" "}
            <span style={{ color: C.green }}>Profissional</span> para Futebol
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              color: C.muted,
              fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
              lineHeight: 1.7,
            }}
            className="mx-auto mb-8 max-w-xl"
          >
            Plataforma sofisticada de scout e análise estatística em tempo real
            para comissões técnicas que buscam excelência.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/authentication">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all sm:w-auto"
                style={{
                  backgroundColor: C.green,
                  color: "#000",
                  boxShadow: `0 0 24px rgba(0,230,118,0.35)`,
                }}
              >
                Começar Agora
                <ArrowRight size={16} />
              </button>
            </Link>
            <button
              onClick={() => scrollTo("features")}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm transition-all sm:w-auto"
              style={{
                backgroundColor: C.card,
                color: C.text,
                border: `1px solid ${C.border}`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = C.borderLight)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = C.border)
              }
            >
              Ver funcionalidades
              <ChevronRight size={16} />
            </button>
          </motion.div>

          {/* Mini stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6"
          >
            {[
              { icon: <Users size={14} />, label: "1.2k+ jogadores" },
              { icon: <Swords size={14} />, label: "340+ partidas" },
              { icon: <ClipboardList size={14} />, label: "Relatórios PDF" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span style={{ color: C.green }}>{item.icon}</span>
                <span style={{ color: C.muted, fontSize: "0.8rem" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <div
            className="mx-auto h-10 w-px"
            style={{
              background: `linear-gradient(to bottom, ${C.green}, transparent)`,
            }}
          />
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <span
              className="mb-4 inline-block rounded-full px-3 py-1 text-xs"
              style={{
                backgroundColor: C.greenDim,
                color: C.green,
                border: `1px solid ${C.greenBorder}`,
              }}
            >
              Funcionalidades
            </span>
            <h2
              className="mb-3 text-white"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                fontWeight: 700,
              }}
            >
              Tudo que sua comissão técnica precisa
            </h2>
            <p
              style={{
                color: C.muted,
                fontSize: "0.95rem",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Ferramentas profissionais integradas em uma única plataforma
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group flex cursor-default flex-col gap-4 rounded-xl p-6 transition-all duration-200"
                style={{
                  backgroundColor: C.card,
                  border: `1px solid ${C.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.greenBorder;
                  e.currentTarget.style.backgroundColor = C.cardHover;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.backgroundColor = C.card;
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors"
                  style={{
                    backgroundColor: C.greenDim,
                    color: C.green,
                    border: `1px solid ${C.greenBorder}`,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3
                    className="mb-2 text-white"
                    style={{ fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      color: C.muted,
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <span style={{ color: C.green, fontSize: "0.78rem" }}>
                    Saiba mais
                  </span>
                  <ChevronRight size={12} style={{ color: C.green }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="px-4 py-20">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl p-10 md:p-16"
          style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
        >
          {/* bg glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,230,118,0.04) 0%, transparent 70%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mb-12 text-center"
          >
            <h2
              className="mb-2 text-white"
              style={{
                fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                fontWeight: 700,
              }}
            >
              Resultados que falam por si
            </h2>
            <p style={{ color: C.muted, fontSize: "0.9rem" }}>
              Números da plataforma em tempo real
            </p>
          </motion.div>

          <div className="relative grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl p-4 text-center"
                style={{
                  backgroundColor: C.cardHeader,
                  border: `1px solid ${C.border}`,
                }}
              >
                <p
                  className="mb-1"
                  style={{
                    color: C.green,
                    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p
                  style={{
                    color: C.muted,
                    fontSize: "0.78rem",
                    lineHeight: 1.4,
                  }}
                >
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <span
              className="mb-4 inline-block rounded-full px-3 py-1 text-xs"
              style={{
                backgroundColor: C.greenDim,
                color: C.green,
                border: `1px solid ${C.greenBorder}`,
              }}
            >
              Como funciona
            </span>
            <h2
              className="text-white"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                fontWeight: 700,
              }}
            >
              Simples, rápido e poderoso
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Cadastre seu time",
                desc: "Adicione jogadores, defina posições e monte o elenco completo.",
                icon: <Users size={20} />,
              },
              {
                step: "02",
                title: "Registre as partidas",
                desc: "Scout ao vivo com cronômetro, eventos e placar automático.",
                icon: <Swords size={20} />,
              },
              {
                step: "03",
                title: "Analise e evolua",
                desc: "Relatórios detalhados, ranking de jogadores e sugestões táticas.",
                icon: <BarChart2 size={20} />,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative rounded-xl p-6"
                style={{
                  backgroundColor: C.card,
                  border: `1px solid ${C.border}`,
                }}
              >
                {/* Step number */}
                <span
                  className="absolute top-5 right-5 text-xs"
                  style={{
                    color: C.dim,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.step}
                </span>
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: C.greenDim,
                    color: C.green,
                    border: `1px solid ${C.greenBorder}`,
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  className="mb-2 text-white"
                  style={{ fontSize: "0.95rem", fontWeight: 600 }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: C.muted,
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>

                {/* connector arrow (hidden on last) */}
                {i < 2 && (
                  <div className="absolute top-1/2 -right-3.5 z-10 hidden -translate-y-1/2 md:block">
                    <ChevronRight size={20} style={{ color: C.dim }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section id="cta" className="px-4 py-16 pb-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl p-10 text-center md:p-14"
            style={{ backgroundColor: C.green }}
          >
            {/* subtle pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative">
              <h2
                className="mb-3"
                style={{
                  color: "#000",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  fontWeight: 700,
                }}
              >
                Pronto para elevar sua análise?
              </h2>
              <p
                className="mb-8"
                style={{ color: "rgba(0,0,0,0.65)", fontSize: "0.95rem" }}
              >
                Acesse a plataforma e comece a scouts seus jogadores agora
              </p>
              <Link href="/authentication">
                <button
                  className="inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold transition-all"
                  style={{ backgroundColor: "#fff", color: "#000" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Entrar na Plataforma
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-4 py-6 text-center"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        <div className="mb-2 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md">
            <Image
              src="/logo_scout_pro.png"
              alt="Logo"
              width={200}
              height={200}
              loading="eager"
            />
          </div>
          <span className="text-sm font-medium text-white">
            Scout Campo Pro
          </span>
        </div>
        <p style={{ color: C.dim, fontSize: "0.78rem" }}>
          © 2026 Scout Campo Pro. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
