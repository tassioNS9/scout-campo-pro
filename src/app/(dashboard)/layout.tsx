import {
  BarChart3,
  FileText,
  Grid3x3,
  Handshake,
  HardDrive,
  Users,
  Zap,
} from "lucide-react";
import { redirect } from "next/dist/client/components/navigation";
import { headers } from "next/dist/server/request/headers";
import Link from "next/link";
import React from "react";

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
import { auth } from "@/lib/auth";

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
    icon: HardDrive,
    label: "Dashboard",
    href: "/dashboard",
    iconClassName: "text-red-400",
  },
  {
    icon: Handshake,
    label: "Partidas",
    href: "/partidas",
    iconClassName: "text-green-600",
  },
];

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const data = await auth.api.getSession({
    headers: await headers(),
  });
  if (!data?.user) {
    redirect("/");
  }
  return (
    <div className="min-h-screen text-white">
      <SidebarProvider defaultOpen className="home-app-bg text-foreground">
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
            </div>
          </header>

          <div className="flex-1 overflow-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default layout;
