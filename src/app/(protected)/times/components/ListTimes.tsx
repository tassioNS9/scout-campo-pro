"use client";

import { ChevronRight, MapPin, Tag, Trash2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { deleteTime } from "@/app/actions/delete-time";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Time } from "@/db/schema";

import EditarTimeButton from "./EditarTimeButton";

const categoryClasses: Record<string, string> = {
  "Sub-17": "border-scout-sub17-border bg-scout-sub17-bg text-scout-sub17-text",
  "Sub-20": "border-scout-green-border bg-scout-green-dim text-scout-green",
  Profissional:
    "border-scout-profissional-border bg-scout-profissional-bg text-scout-profissional-text",
};

function categoryClassName(cat: string) {
  switch (cat) {
    case "Sub-17":
      return categoryClasses["Sub-17"];
    case "Sub-20":
      return categoryClasses["Sub-20"];
    case "Profissional":
      return categoryClasses["Profissional"];
    default:
      return "border-scout-border bg-scout-card-header text-scout-text";
  }
}

const ListTimes = ({ times }: { times: Time[] }) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este time?")) {
      try {
        setDeletingId(id);
        await deleteTime(id);
        toast.success("Time deletado com sucesso");
      } catch {
        toast.error("Falha ao deletar time");
      } finally {
        setDeletingId(null);
      }
    }
  };
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {times.map((time) => (
        <Card
          key={time.id}
          className="border-scout-border bg-scout-card flex flex-col gap-4 rounded-xl border p-5 transition-colors"
        >
          <CardHeader>
            {/* Card header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Shield icon with initial */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl text-sm">
                  {/* {time.nome.charAt(0)} */}
                  <Image
                    src={time.escudoUrl || "/ec-vitoria-logo.svg"}
                    alt="Escudo do time"
                    width={60}
                    height={60}
                    className="h-16 w-16 rounded-full"
                  />
                </div>

                <CardTitle className="text-scout-text text-lg leading-tight">
                  {time.nome}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Info */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Tag size={12} className="text-scout-dim" />
                <span className="text-scout-dim text-[0.78rem]">
                  Categoria:
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${categoryClassName(
                    time.categoria,
                  )}`}
                >
                  {time.categoria}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-scout-dim" />
                <span className="text-scout-dim text-[0.78rem]">Cidade:</span>
                <span className="text-scout-green text-[0.82rem]">
                  {time.cidade}
                  {time.estado ? `, ${time.estado}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={12} className="text-scout-dim" />
                <span className="text-scout-dim text-[0.78rem]">
                  Jogadores:
                </span>
                <span className="text-scout-text text-[0.82rem]">23</span>
              </div>
            </div>
            <div className="border-scout-border flex flex-col gap-2 border-t pt-3">
              {/* Ver jogadores — primary action */}
              <Link href={`/times/${time.id}`} className="w-full">
                <Button className="border-scout-green-border bg-scout-green-dim text-scout-green flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs transition-colors">
                  <Users size={13} />
                  Ver Jogadores
                  <ChevronRight size={12} className="ml-auto" />
                </Button>
              </Link>
              <div className="flex gap-2">
                <EditarTimeButton time={time} />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(time.id)}
                  disabled={deletingId === time.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ListTimes;
