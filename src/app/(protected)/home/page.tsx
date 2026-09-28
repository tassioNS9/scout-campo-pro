"use client";

import {
  BarChart3,
  CloudUpload,
  FileText,
  Grid3x3,
  ShieldHalf,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const cards = [
  {
    title: "Times",
    description: "Cadastre e gerencie seus times",
    icon: ShieldHalf,
    href: "/times",
    colorClassName: "from-green-600 to-green-700",
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
    href: "/registros",
    colorClassName: "from-pink-600 to-pink-700",
  },
  {
    title: "Análise Tática",
    description: "Análise automática de formações",
    icon: Grid3x3,
    href: "/campo-tatico",
    colorClassName: "ffrom-teal-600 to-teal-700",
  },
  {
    title: "Backup",
    description: "Guarde e restaure seus dados",
    icon: CloudUpload,
    href: "/backup",
    colorClassName: "ffrom-blue-600 to-blue-700",
  },
];

export const Homepage = () => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 lg:p-8">
        <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
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

                <div className="relative z-10 flex h-full flex-col items-center p-6">
                  <card.icon className="text-primary-foreground size-18" />

                  <h3 className="text-primary-foreground mb-2 text-sm font-bold">
                    {card.title}
                  </h3>
                  <p className="text-primary-foreground/85 hidden text-sm md:block">
                    {card.description}
                  </p>
                </div>

                <div className="bg-primary-foreground/15 absolute -top-10 -right-10 h-20 w-20 rounded-full transition-transform duration-300 group-hover:scale-150" />
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
