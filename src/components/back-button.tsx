"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";

export const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      className="border-scout-border bg-scout-card text-scout-muted flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2"
    >
      <ArrowLeft size={16} />
      <span className="text-sm">Voltar</span>
    </Button>
  );
};
