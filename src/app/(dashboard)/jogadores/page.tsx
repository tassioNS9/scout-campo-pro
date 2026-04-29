"use client";

import { ArrowLeft, Edit2, Plus, Trash2 } from "lucide-react";
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

const POSICOES = [
  "Goleiro",
  "Zagueiro",
  "Lateral",
  "Volante",
  "Meia",
  "Atacante",
];

export default function JogadoresPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [idTime, setIdTime] = useState("");
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [posicao, setPosicao] = useState("Meia");
  const [idade, setIdade] = useState("");

  const { data: times } = api.times.list.useQuery();
  const { data: jogadores, refetch } = api.jogadores.listByTime.useQuery(
    { idTime: parseInt(idTime) || 0 },
    { enabled: !!idTime },
  );
  const createMutation = api.jogadores.create.useMutation();
  const deleteMutation = api.jogadores.delete.useMutation();

  const handleCreate = async () => {
    if (!nome || !numero || !idTime) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    try {
      await createMutation.mutateAsync({
        nome,
        numero: parseInt(numero),
        posicao: posicao as
          | "Goleiro"
          | "Zagueiro"
          | "Lateral"
          | "Volante"
          | "Meia"
          | "Atacante",
        idade: idade ? parseInt(idade) : undefined,
        idTime: parseInt(idTime),
      });
      toast.success("Jogador criado com sucesso");
      setNome("");
      setNumero("");
      setPosicao("Meia");
      setIdade("");
      setIsOpen(false);
      refetch();
    } catch {
      toast.error("Falha ao criar jogador");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este jogador?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Jogador deletado com sucesso");
        refetch();
      } catch {
        toast.error("Falha ao deletar jogador");
      }
    }
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
              Gerenciamento de Jogadores
            </h1>
            <p className="mt-2 text-slate-600">
              Cadastre e organize seus jogadores
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Novo Jogador
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Jogador</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Select value={idTime} onValueChange={setIdTime}>
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
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    type="number"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="Ex: 10"
                    min="1"
                    max="99"
                  />
                </div>
                <div>
                  <Label htmlFor="posicao">Posição</Label>
                  <Select value={posicao} onValueChange={setPosicao}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POSICOES.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="idade">Idade (opcional)</Label>
                  <Input
                    id="idade"
                    type="number"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    placeholder="Ex: 25"
                    min="1"
                    max="50"
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Criando..." : "Criar Jogador"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Seleção de Time */}
        <div className="mb-8 max-w-xs">
          <Label htmlFor="timeSelect">
            Selecione um time para visualizar jogadores
          </Label>
          <Select value={idTime} onValueChange={setIdTime}>
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

        {!idTime ? (
          <Card className="py-12 text-center">
            <CardContent>
              <p className="text-slate-600">
                Selecione um time para visualizar seus jogadores
              </p>
            </CardContent>
          </Card>
        ) : jogadores && jogadores.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {jogadores.map((jogador) => (
              <Card key={jogador.id} className="transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">
                    #{jogador.numero} - {jogador.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-slate-600">
                    <strong>Posição:</strong> {jogador.posicao}
                  </p>
                  {jogador.idade && (
                    <p className="text-sm text-slate-600">
                      <strong>Idade:</strong> {jogador.idade} anos
                    </p>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit2 className="mr-1 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(jogador.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-12 text-center">
            <CardContent>
              <p className="mb-4 text-slate-600">
                Nenhum jogador cadastrado para este time
              </p>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setIsOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Jogador
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
