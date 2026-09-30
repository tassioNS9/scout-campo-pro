import {
  BarChart3,
  FileText,
  Grid3x3,
  Handshake,
  Users,
  Zap,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Logout } from "@/components/Logout";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNavItem } from "@/components/ui/sidebar-nav-item";
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
    label: "Dashboard",
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
    href: "/registros",
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

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const data = await auth.api.getSession({
    headers: await headers(),
  });
  if (!data?.user) {
    redirect("/");
  }
  
  return (
    <div className="min-h-screen text-white">
      <SidebarProvider defaultOpen className="home-app-bg text-foreground">
        <Sidebar collapsible="offcanvas">
          <SidebarHeader className="flex items-center px-6 pt-6 pb-2">
            <Link href="/home" className="flex items-center gap-2">
              <div className="pb-6 text-center lg:block">
                <Image
                  src="/logo_scout_pro.png"
                  alt="Logo"
                  width={140}
                  height={140}
                  loading="eager"
                />
                <h2 className="text-2xl leading-tight font-black">
                  <span className="text-white">SCOUT</span>
                  <br />
                  <span className="text-sidebar-primary">CAMPO</span>
                  <br />
                  <span className="text-white">PRO</span>
                </h2>
                <p className="text-muted-foreground mt-2 text-xs">
                  Análise Profissional
                </p>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarSeparator className="bg-sidebar-primary/30 mx-auto" />

          <SidebarContent className="px-2 pt-2">
            <SidebarGroup className="px-4">
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarNavItem key={item.href} href={item.href} label={item.label}>
                  <item.icon className={`h-5 w-5 ${item.iconClassName}`} />
                  </SidebarNavItem>
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
                  <Image
                    src="/logo_scout_pro.png"
                    alt="Logo"
                    width={50}
                    height={50}
                  />
                  <h2 className="text-background text-sm font-bold">
                    SCOUT CAMPO PRO
                  </h2>
                </div>
              </div>
              <Logout />
            </div>
          </header>

          <div className="flex-1 overflow-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
