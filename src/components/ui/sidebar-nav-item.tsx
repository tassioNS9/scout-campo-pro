"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type Props = {
  href: string;
  label: string;
  children: React.ReactNode; // o ícone chega por aqui
};

export function SidebarNavItem({ href, label, children }: Props) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={label}
        isActive={isActive}
        className="hover:bg-sidebar-primary/20 hover:text-sidebar-primary data-[active=true]:bg-sidebar-primary/25 data-[active=true]:text-sidebar-primary h-auto rounded-lg px-4 py-3 text-white/80 [&>svg]:size-5"
      >
        <Link href={href} onClick={() => setOpenMobile(false)}>
          {children}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}