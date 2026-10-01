// features/times/components/criar-time-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createTime } from "@/app/actions/create-time";
import { createTimeSchema } from "@/app/actions/create-time/schema";
import { CreateTimeFormValues } from "@/app/actions/create-time/schema";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// theme tokens used from globals.css
import { timesTable } from "@/db/schema";

interface AddTimeFormProps {
  time?: typeof timesTable.$inferSelect;
  onSuccess?: () => void;
}

export default function AddTimeFormTeste({
  onSuccess,
  time,
}: AddTimeFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateTimeFormValues>({
    resolver: zodResolver(createTimeSchema),
    defaultValues: {
      nome: time?.nome ?? "",
      categoria: time?.categoria ?? "Sub-17",
      cidade: time?.cidade ?? "",
      estado: time?.estado ?? "",
    },
  });

  function handleEscudoSelecionado(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue("escudo", file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(values: CreateTimeFormValues) {
    const formData = new FormData();
    formData.append("nome", values.nome);
    formData.append("categoria", values.categoria);
    formData.append("cidade", values.cidade);
    formData.append("estado", values.estado);
    if (values.escudo) formData.append("escudo", values.escudo);

    try {
      const result = await createTime(formData);

      if (!result?.sucesso) {
        toast.error("Verifique os campos do formulário.");
        return;
      }
      if (result.avisoEscudo) {
        toast.warning(result.avisoEscudo);
      } else {
        toast.success("Time criado com sucesso!");
        handleClose();
      }
    } catch (error) {
      console.error("Erro ao processar os dados do formulário:", error);
      toast.error("Erro ao criar o time.");
    }
    // redirecionar ou resetar form aqui, se quiser
  }

  const handleClose = () => {
    form.reset();
    form.setValue("escudo", undefined);
    setPreview(null);
    onSuccess?.();
  };

  return (
    <DialogContent className="bg-scout-card border-scout-border w-full max-w-90 rounded-t-2xl border p-6 md:rounded-2xl">
      <DialogHeader>
        <DialogTitle className="text-scout-text">Criar Novo Time</DialogTitle>
        <DialogDescription className="text-scout-muted text-sm">
          Preencha os campos abaixo para criar um novo time.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          id="time-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-2 flex flex-col gap-4"
          noValidate
        >
          <div>
            <Label className="text-red-50">Escudo do time (opcional)</Label>
            <div className="flex items-center gap-4">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview do escudo"
                  className="h-30 w-30 rounded-lg object-cover"
                  width={120}
                  height={120}
                />
              ) : (
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="mt-4 h-20 w-20 cursor-pointer rounded-lg bg-slate-800 text-center text-sm text-slate-400"
                >
                  Clique para selecionar o escudo
                </div>
              )}
              <input
                className="hidden px-3 text-red-100"
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleEscudoSelecionado}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-scout-muted text-xs">
                    Nome do Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-scout-muted text-xs font-semibold"
                      placeholder="Ex: Esporte Clube A"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-scout-muted text-xs">
                    Categoria
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-scout-muted w-full font-semibold">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-scout-bg text-scout-text">
                      <SelectItem value="Sub-17">Sub-17</SelectItem>
                      <SelectItem value="Sub-20">Sub-20</SelectItem>
                      <SelectItem value="Profissional">Profissional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-scout-muted text-xs">
                    Cidade
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-scout-muted text-xs font-semibold"
                      placeholder="Ex: São Paulo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-scout-muted text-xs">
                    Estado (UF)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-scout-muted text-xs font-semibold"
                      placeholder="Ex: SP"
                      maxLength={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="mt-6 flex gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="bg-scout-card-header text-scout-muted border-scout-border flex-1 rounded-lg border py-2 text-sm"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="time-form"
              disabled={form.formState.isSubmitting}
              className="bg-scout-green flex-1 rounded-lg py-2 text-sm font-semibold text-black opacity-100 transition-opacity hover:opacity-85"
            >
              {form.formState.isSubmitting ? "Criando..." : "Criar Time"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
