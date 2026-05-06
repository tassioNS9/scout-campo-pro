"use client";

import {
  Activity,
  BarChart3,
  Bell,
  FileText,
  Grid3x3,
  Handshake,
  LogOut,
  Trophy,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/auth-client";

const menuItems = [
  {
    icon: Zap,
    label: "Scout ao vivo",
    href: "/scout",
    iconClassName: "text-purple-400",
  },
  {
    icon: BarChart3,
    label: "Estatísticas completas",
    href: "/dashboard",
    iconClassName: "text-green-400",
  },
  {
    icon: Grid3x3,
    label: "Análise tática",
    href: "/campo-tatico",
    iconClassName: "text-blue-400",
  },
  {
    icon: FileText,
    label: "Relatórios em PDF",
    href: "/relatorios",
    iconClassName: "text-pink-400",
  },
  {
    icon: Users,
    label: "Múltiplos times",
    href: "/times",
    iconClassName: "text-yellow-400",
  },
  {
    icon: Handshake,
    label: "Partidas",
    href: "/partidas",
    iconClassName: "text-green-600",
  },
];

const cards = [
  {
    title: "Times",
    description: "Cadastre e gerencie seus times",
    icon: Users,
    href: "/times",
    colorClassName: "from-green-600 to-green-700",
  },
  {
    title: "Jogadores",
    description: "Gerencie jogadores por time",
    icon: UserCheck,
    href: "/jogadores",
    colorClassName: "from-blue-600 to-blue-700",
  },
  {
    title: "Scout ao Vivo",
    description: "Registre eventos em tempo real",
    icon: Zap,
    href: "/scout",
    colorClassName: "from-purple-600 to-purple-700",
  },
  {
    title: "Dashboard",
    description: "Visualize estatísticas e análises",
    icon: BarChart3,
    href: "/dashboard",
    colorClassName: "from-orange-600 to-orange-700",
  },
  {
    title: "Relatórios",
    description: "Gere e exporte relatórios",
    icon: FileText,
    href: "/relatorios",
    colorClassName: "from-pink-600 to-pink-700",
  },
  {
    title: "Análise Tática",
    description: "Análise automática de formações",
    icon: Grid3x3,
    href: "/campo-tatico",
    colorClassName: "ffrom-teal-600 to-teal-700",
  },
];

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const user = session?.user;
  const isAuthenticated = Boolean(user);

  const handleLogout = async () => {
    await signOut();
    router.refresh();
  };

  if (isPending) {
    return (
      <div className="home-loading-bg flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-foreground min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black">
        <nav className="border-border/60 bg-card/70 border-b backdrop-blur">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="from-primary to-sidebar-primary flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br">
                <span className="text-lg font-bold">⚽</span>
              </div>
              <h1 className="text-background text-xl font-bold">
                Scout Campo Pro
              </h1>
            </div>
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <h1 className="text-background mb-6 text-5xl leading-tight font-black">
              Análise de Desempenho Profissional para Futebol
            </h1>
            <p className="text-muted-foreground mb-8 text-xl">
              Plataforma sofisticada de scout e análise estatística em tempo
              real para comissões técnicas
            </p>
            <Button asChild size="lg">
              <Link href="/login">Começar Agora</Link>
            </Button>
          </div>

          <div className="mb-20 grid gap-6 md:grid-cols-3">
            <Card className="home-feature-card">
              <CardHeader>
                <Activity className="text-primary mb-2 h-8 w-8" />
                <CardTitle>Scout ao Vivo</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Registre eventos em tempo real com cronômetro integrado e placar
                automático
              </CardContent>
            </Card>
            <Card className="home-feature-card">
              <CardHeader>
                <BarChart3 className="text-primary mb-2 h-8 w-8" />
                <CardTitle>Estatísticas Avançadas</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Análise automática de desempenho com notas por posição e
                heatmaps de atuação
              </CardContent>
            </Card>
            <Card className="home-feature-card">
              <CardHeader>
                <FileText className="text-primary mb-2 h-8 w-8" />
                <CardTitle>Relatórios em PDF</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Gere relatórios profissionais com resumo de estatísticas e
                sugestões táticas
              </CardContent>
            </Card>
            <Card className="home-feature-card">
              <CardHeader>
                <Users className="text-primary mb-2 h-8 w-8" />
                <CardTitle>Gerenciamento de Times</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Cadastre e organize times, jogadores e categorias com facilidade
              </CardContent>
            </Card>
            <Card className="home-feature-card">
              <CardHeader>
                <Zap className="text-primary mb-2 h-8 w-8" />
                <CardTitle>Controle de Perfis</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Diferentes níveis de acesso para Treinador, Analista, Auxiliar e
                Coordenador
              </CardContent>
            </Card>
            <Card className="home-feature-card">
              <CardHeader>
                <Trophy className="text-primary mb-2 h-8 w-8" />
                <CardTitle>Dashboard Completo</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Visualize ranking de jogadores, comparações e análises táticas
                em um só lugar
              </CardContent>
            </Card>
          </div>

          <div className="home-cta-bg rounded-lg p-12 text-center">
            <h2 className="text-primary-foreground mb-4 text-3xl">
              Pronto para elevar sua análise?
            </h2>
            <p className="text-primary-foreground/85 mb-6">
              Acesse a plataforma e comece a scouts seus jogadores agora
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/login">Entrar na Plataforma</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <SidebarProvider
        defaultOpen
        className="text-foreground bg-linear-to-br from-slate-900 via-slate-800 to-black"
      >
        <Sidebar collapsible="offcanvas" className="">
          <SidebarHeader className="px-6 pt-6 pb-2">
            <div className="hidden pb-6 text-center lg:block">
              <div className="border-sidebar-primary/80 from-primary to-sidebar-primary text-primary-foreground mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-2 bg-linear-to-br text-4xl">
                <span aria-hidden>⚽</span>
              </div>
              <h2 className="text-2xl leading-tight font-black">
                <span className="text-sidebar-foreground">SCOUT</span>
                <br />
                <span className="text-sidebar-primary">CAMPO</span>
                <br />
                <span className="text-sidebar-foreground">PRO</span>
              </h2>
              <p className="text-muted-foreground mt-2 text-xs">
                Análise Profissional
              </p>
            </div>
          </SidebarHeader>

          <SidebarSeparator className="bg-sidebar-primary/30 mx-auto" />

          <SidebarContent className="px-2 pt-2">
            <SidebarGroup className="px-4">
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      className="text-sidebar-foreground/80 hover:bg-sidebar-primary/20 hover:text-sidebar-primary data-[active=true]:bg-sidebar-primary/25 data-[active=true]:text-sidebar-primary h-auto rounded-lg px-4 py-3 [&>svg]:size-5"
                    >
                      <Link href={item.href}>
                        <item.icon
                          className={`h-5 w-5 ${item.iconClassName}`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="px-6 pb-6">
            <Separator className="bg-sidebar-primary/30 mb-6" />
            <div className="border-sidebar-primary/35 bg-sidebar-primary/15 rounded-lg border px-4 py-4 text-center">
              <p className="text-sidebar-primary mb-2 text-sm font-semibold">
                DESENVOLVIDO PARA
              </p>
              <p className="text-muted-foreground text-xs">
                TREINADORES QUE FAZEM A DIFERENÇA!
              </p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-transparent">
          <header className="sticky top-0 z-50 border-b border-green-900 bg-black">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-primary hover:text-primary lg:hidden" />
                <div className="flex items-center gap-2">
                  <div className="from-primary to-sidebar-primary flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br">
                    <span className="text-lg font-bold">⚽</span>
                  </div>
                  <h1 className="text-background text-xl font-bold">
                    Scout Campo Pro
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative rounded-lg p-2 transition hover:bg-slate-800">
                  <Bell className="h-5 w-5 text-green-500" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
                  <div className="text-right">
                    <p className="text-background text-sm font-semibold">
                      {user?.name.split(" ")[0] || "Usuário"}
                    </p>
                    <p className="text-xs text-slate-400">Treinador</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-500"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <div className="p-6 lg:p-8">
              <div className="mb-12">
                <h2 className="text-background mb-2 text-4xl">
                  Página Inicial
                </h2>
                <p className="text-muted-foreground">
                  Acesse as funcionalidades da plataforma
                </p>
              </div>
              <Separator className="bg-border/60 mb-8" />

              <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                  <Button
                    key={card.title}
                    asChild
                    variant="ghost"
                    className="group border-border/40 hover:border-primary/50 relative h-auto overflow-hidden rounded-xl border p-0 text-left shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Link href={card.href}>
                      <div
                        className={`absolute inset-0 bg-linear-to-br ${card.colorClassName} opacity-90 transition group-hover:opacity-100`}
                      />

                      <div className="relative z-10 flex h-full flex-col items-start p-6">
                        <div className="bg-primary-foreground/20 group-hover:bg-primary-foreground/30 mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition">
                          <card.icon className="text-primary-foreground h-6 w-6" />
                        </div>
                        <h3 className="text-primary-foreground mb-2 text-xl font-bold">
                          {card.title}
                        </h3>
                        <p className="text-primary-foreground/85 text-sm">
                          {card.description}
                        </p>
                      </div>

                      <div className="bg-primary-foreground/15 absolute -top-10 -right-10 h-20 w-20 rounded-full transition-transform duration-300 group-hover:scale-150" />
                    </Link>
                  </Button>
                ))}
              </div>

              <div className="border-border/80 rounded-xl border p-8 shadow-sm">
                <h3 className="text-background mb-6 text-xl">
                  Estatísticas Gerais
                </h3>
                <Separator className="bg-border/70 mb-6" />
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div className="text-center">
                    <p className="text-primary mb-2 text-3xl font-bold">8</p>
                    <p className="text-muted-foreground text-sm">Jogos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-chart-2 mb-2 text-3xl font-bold">5</p>
                    <p className="text-muted-foreground text-sm">Vitórias</p>
                  </div>
                  <div className="text-center">
                    <p className="text-chart-4 mb-2 text-3xl font-bold">2</p>
                    <p className="text-muted-foreground text-sm">Empates</p>
                  </div>
                  <div className="text-center">
                    <p className="text-destructive mb-2 text-3xl font-bold">
                      1
                    </p>
                    <p className="text-muted-foreground text-sm">Derrotas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
