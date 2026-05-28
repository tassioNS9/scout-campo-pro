"use client";

import { useEffect, useState } from "react";
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
import { Plus, Trash2, Edit2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { Time } from "@/db/schema";
import { createTime } from "@/app/actions/create-time";
import { deleteTime } from "@/app/actions/delete-time";
import { listTimes } from "@/app/actions/list-times";
import { updateTime } from "@/app/actions/update-time";

export default function TimesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTime, setEditingTime] = useState<Time | null>(null);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<
    "Sub-13" | "Sub-15" | "Sub-17" | "Profissional"
  >("Sub-13");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [times, setTimes] = useState<Time[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadTimes = async () => {
    setIsLoading(true);
    const data = await listTimes();
    setTimes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    void loadTimes();
  }, []);

  const handleCreate = async () => {
    if (!nome) {
      toast.error("Nome do time é obrigatório");
      return;
    }
    try {
      setIsCreating(true);
      await createTime({ nome, categoria, cidade, estado });
      toast.success("Time criado com sucesso");
      setNome("");
      setCategoria("Sub-13");
      setCidade("");
      setEstado("");
      setIsOpen(false);
      await loadTimes();
    } catch {
      toast.error("Falha ao criar time");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditOpen = (time: Time) => {
    setEditingTime(time);
    setNome(time.nome);
    setCategoria(
      time.categoria as "Sub-13" | "Sub-15" | "Sub-17" | "Profissional",
    );
    setCidade(time.cidade || "");
    setEstado(time.estado || "");
    setIsEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!nome.trim()) {
      toast.error("Nome do time é obrigatório");
      return;
    }
    if (!editingTime) return;

    try {
      setIsUpdating(true);
      await updateTime({
        id: editingTime.id,
        nome,
        categoria,
        cidade,
        estado,
      });
      toast.success("Time atualizado com sucesso");
      setNome("");
      setCategoria("Sub-13");
      setCidade("");
      setEstado("");
      setEditingTime(null);
      setIsEditOpen(false);
      await loadTimes();
    } catch {
      toast.error("Falha ao atualizar time");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este time?")) {
      try {
        setDeletingId(id);
        await deleteTime(id);
        toast.success("Time deletado com sucesso");
        await loadTimes();
      } catch {
        toast.error("Falha ao deletar time");
      } finally {
        setDeletingId(null);
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
              Gerenciamento de Times
            </h1>
            <p className="mt-2 text-slate-600">
              Cadastre e organize seus times
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
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
                  disabled={isCreating}
                >
                  {isCreating ? "Criando..." : "Criar Time"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-600">
            Carregando times...
          </div>
        ) : times && times.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {times.map((time) => (
              <Card
                key={time.id}
                className="bg-gray-300 transition hover:shadow-lg"
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
                    <Dialog
                      open={isEditOpen && editingTime?.id === time.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setIsEditOpen(false);
                          setEditingTime(null);
                          setNome("");
                          setCategoria("Sub-13");
                          setCidade("");
                          setEstado("");
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditOpen(time)}
                        >
                          <Edit2 className="mr-1 h-4 w-4" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Time</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-nome">Nome do Time</Label>
                            <Input
                              id="edit-nome"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              placeholder="Ex: Esporte Clube A"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-categoria">Categoria</Label>
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
                                <SelectItem value="Profissional">
                                  Profissional
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="edit-cidade">Cidade</Label>
                            <Input
                              id="edit-cidade"
                              value={cidade}
                              onChange={(e) => setCidade(e.target.value)}
                              placeholder="Ex: São Paulo"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-estado">Estado (UF)</Label>
                            <Input
                              id="edit-estado"
                              value={estado}
                              onChange={(e) => setEstado(e.target.value)}
                              placeholder="Ex: SP"
                              maxLength={2}
                            />
                          </div>
                          <Button
                            onClick={handleEditSave}
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Salvando..." : "Salvar Alterações"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(time.id)}
                      disabled={deletingId === time.id}
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
              <p className="mb-4 text-slate-600">Nenhum time cadastrado</p>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setIsOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Time
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
