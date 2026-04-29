import "./globals.css";

import type { Metadata } from "next";

import { AppQueryProvider } from "@/components/providers/AppQueryProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Scout Campo Pro",
  description: "Plataforma de análise de desempenho profissional para futebol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppQueryProvider>
          {children}
          <Toaster />
        </AppQueryProvider>
      </body>
    </html>
  );
}
