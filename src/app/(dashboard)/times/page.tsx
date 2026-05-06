"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api-client";
import { Plus, Trash2, Edit2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function TimesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<
    "Sub-13" | "Sub-15" | "Sub-17" | "Profissional"
  >("Sub-13");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const { data: times, isLoading, refetch } = api.times.list.useQuery();
  const createMutation = api.times.create.useMutation();
  const deleteMutation = api.times.delete.useMutation();

  const handleCreate = async () => {
    if (!nome) {
      toast.error("Nome do time é obrigatório");
      return;
    }
    try {
      await createMutation.mutateAsync({ nome, categoria, cidade, estado });
      toast.success("Time criado com sucesso");
      setNome("");
      setCategoria("Sub-13");
      setCidade("");
      setEstado("");
      setIsOpen(false);
      refetch();
    } catch {
      toast.error("Falha ao criar time");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este time?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Time deletado com sucesso");
        refetch();
      } catch {
        toast.error("Falha ao deletar time");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gerenciamento de Times
            </h1>
            <p className="text-slate-600 mt-2">
              Cadastre e organize seus times
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Time
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Time</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Time</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Esporte Clube A"
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
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Ex: São Paulo"
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado (UF)</Label>
                  <Input
                    id="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    placeholder="Ex: SP"
                    maxLength={2}
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Criando..." : "Criar Time"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-600">
            Carregando times...
          </div>
        ) : times && times.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {times.map((time) => (
              <Card
                key={time.id}
                className="hover:shadow-lg transition bg-gray-300"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{time.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-slate-600">
                    <strong>Categoria:</strong> {time.categoria}
                  </p>
                  {time.cidade && (
                    <p className="text-sm text-slate-600">
                      <strong>Cidade:</strong> {time.cidade}
                      {time.estado ? `, ${time.estado}` : ""}
                    </p>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit2 className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(time.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-600 mb-4">Nenhum time cadastrado</p>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setIsOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Time
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
