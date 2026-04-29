"use client";

import { ArrowLeft, Calendar, Plus, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api-client";

const FORMACOES = [
  "4-4-2",
  "4-3-3",
  "3-5-2",
  "4-2-3-1",
  "5-3-2",
  "4-1-4-1",
  "3-4-3",
];

export default function PartidasPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeA, setTimeA] = useState("");
  const [timeB, setTimeB] = useState("");
  const [data, setData] = useState("");
  const [campeonato, setCampeonato] = useState("");
  const [categoria, setCategoria] = useState<
    "Sub-13" | "Sub-15" | "Sub-17" | "Profissional"
  >("Sub-13");
  const [formacao, setFormacao] = useState("4-4-2");

  const { data: partidas, isLoading, refetch } = api.partidas.list.useQuery();
  const { data: times } = api.times.list.useQuery();
  const createMutation = api.partidas.create.useMutation();

  const handleCreate = async () => {
    if (!timeA || !timeB || !data) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    try {
      await createMutation.mutateAsync({
        timeA: parseInt(timeA),
        timeB: parseInt(timeB),
        data: new Date(data),
        campeonato,
        categoria,
        formacao,
      });
      toast.success("Partida criada com sucesso");
      setTimeA("");
      setTimeB("");
      setData("");
      setCampeonato("");
      setFormacao("4-4-2");
      setIsOpen(false);
      refetch();
    } catch {
      toast.error("Falha ao criar partida");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      planejada: "bg-blue-100 text-blue-700",
      em_andamento: "bg-emerald-100 text-emerald-700",
      finalizada: "bg-slate-100 text-slate-700",
    };
    const labels: Record<string, string> = {
      planejada: "Planejada",
      em_andamento: "Em Andamento",
      finalizada: "Finalizada",
    };
    const s = status ?? "planejada";
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${styles[s] ?? styles.planejada}`}
      >
        {labels[s] ?? "Planejada"}
      </span>
    );
  };

  const getTimeName = (id: number) => {
    return times?.find((t) => t.id === id)?.nome ?? `Time #${id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gerenciamento de Partidas
            </h1>
            <p className="mt-2 text-slate-600">
              Crie e acompanhe suas partidas
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Nova Partida
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Nova Partida</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="timeA">Time A</Label>
                  <Select value={timeA} onValueChange={setTimeA}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um time" />
                    </SelectTrigger>
                    <SelectContent>
                      {times?.map((time) => (
                        <SelectItem key={time.id} value={time.id.toString()}>
                          {time.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeB">Time B</Label>
                  <Select value={timeB} onValueChange={setTimeB}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um time" />
                    </SelectTrigger>
                    <SelectContent>
                      {times?.map((time) => (
                        <SelectItem key={time.id} value={time.id.toString()}>
                          {time.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="data">Data e Hora</Label>
                  <Input
                    id="data"
                    type="datetime-local"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="campeonato">Campeonato</Label>
                  <Input
                    id="campeonato"
                    value={campeonato}
                    onChange={(e) => setCampeonato(e.target.value)}
                    placeholder="Ex: Campeonato Estadual"
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={categoria}
                    onValueChange={(value: typeof categoria) =>
                      setCategoria(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sub-13">Sub-13</SelectItem>
                      <SelectItem value="Sub-15">Sub-15</SelectItem>
                      <SelectItem value="Sub-17">Sub-17</SelectItem>
                      <SelectItem value="Profissional">Profissional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="formacao">Formação Tática</Label>
                  <Select value={formacao} onValueChange={setFormacao}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMACOES.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreate}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Criando..." : "Criar Partida"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-600">
            Carregando partidas...
          </div>
        ) : partidas && partidas.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {partidas.map((partida) => (
              <Card key={partida.id} className="transition hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Partida #{partida.id}
                    </CardTitle>
                    {getStatusBadge(partida.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <div className="flex-1 text-center">
                      <p className="text-sm font-semibold text-slate-900">
                        {getTimeName(partida.timeA)}
                      </p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {partida.placarTimeA ?? 0}
                      </p>
                    </div>
                    <div className="px-2 font-bold text-slate-400">×</div>
                    <div className="flex-1 text-center">
                      <p className="text-sm font-semibold text-slate-900">
                        {getTimeName(partida.timeB)}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {partida.placarTimeB ?? 0}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(partida.data)}</span>
                    </div>
                    {partida.campeonato && (
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        <span>{partida.campeonato}</span>
                      </div>
                    )}
                    <p>
                      <strong>Categoria:</strong> {partida.categoria}
                    </p>
                    {partida.formacao && (
                      <p>
                        <strong>Formação:</strong> {partida.formacao}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/dashboard?partida=${partida.id}`}>
                      <Button size="sm" variant="outline">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-12 text-center">
            <CardContent>
              <p className="mb-4 text-slate-600">Nenhuma partida cadastrada</p>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setIsOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Partida
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
