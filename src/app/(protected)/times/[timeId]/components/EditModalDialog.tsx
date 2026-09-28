"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateJogador } from "@/app/actions/update-jogador";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Jogador } from "@/db/schema";
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const POSICAOJOGADOR = {
  GOLEIRO: "Goleiro",
  ZAGUEIRO: "Zagueiro",
  LATERAL: "Lateral",
  VOLANTE: "Volante",
  MEIA: "Meia",
  ATACANTE: "Atacante",
} as const;

export const posicaoJogadorOptions = Object.entries(POSICAOJOGADOR).map(
  ([, value]) => ({
    value,
    label: value,
  }),
);

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const jogadorSchema = z.object({
  id: z.number(),
  numero: z
    .number()
    .min(1, "Número da camisa é obrigatório")
    .refine((v) => Number(v) >= 1 && Number(v) <= 99, {
      message: "Número deve estar entre 1 e 99",
    }),
  nome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(60, "Nome deve ter no máximo 60 caracteres"),
  idade: z
    .number()
    .min(1, "Idade é obrigatória")
    .refine((v) => v >= 10 && v <= 50, {
      message: "Idade deve estar entre 10 e 50 anos",
    }),
  posicao: z.enum(
    ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Atacante"],
    {
      error: "Posição é obrigatória",
    },
  ),
});

type JogadorFormData = z.infer<typeof jogadorSchema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EditModalDialogProps {
  jogador?: Jogador | null;
  showForm: boolean;
  isEditing?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const EditModalDialog = ({
  jogador,
  showForm,
  isEditing = false,
  onClose,
  onSuccess,
}: EditModalDialogProps) => {
  const form = useForm<JogadorFormData>({
    resolver: zodResolver(jogadorSchema),
    defaultValues: {
      id: jogador?.id ?? 0,
      numero: jogador?.numero ?? 0,
      nome: jogador?.nome ?? "",
      idade: jogador?.idade ?? 0,
      posicao: jogador?.posicao ?? undefined,
    },
  });

  useEffect(() => {
    if (showForm && jogador) {
      form.reset({
        id: jogador.id,
        numero: jogador.numero,
        nome: jogador.nome,
        idade: jogador.idade,
        posicao: jogador.posicao,
      });
    }
  }, [showForm, form, jogador]);

  //const posicaoValue = form.watch("posicao");

  const onSubmit = (data: JogadorFormData) => {
    // Aqui você pode adicionar a lógica para salvar os dados do jogador
    updateJogador({
      id: data?.id,
      nome: data.nome,
      numero: data.numero,
      idade: data.idade,
      posicao: data.posicao,
    });
    onSuccess();

    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!jogador) return null;
  return (
    <Dialog open={showForm} onOpenChange={handleClose}>
      <DialogContent className="border-scout-border bg-scout-card w-full max-w-95 rounded-t-2xl border p-8 md:rounded-2xl">
        <DialogTrigger asChild></DialogTrigger>
        <DialogHeader>
          <DialogTitle className="text-scout-text">
            {isEditing ? "Editar Jogador" : "Novo Jogador"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="jogador-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-2 flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="posicao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-scout-muted text-xs">
                      Posição
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-scout-muted w-full font-semibold">
                          <SelectValue
                            className="text-scout-text"
                            placeholder="Selecione uma Posição"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-scout-bg text-scout-text">
                        {posicaoJogadorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-scout-muted text-xs">
                      Número da camisa
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-scout-muted text-xs font-semibold"
                        placeholder="Ex: 10"
                        {...field}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-scout-muted text-xs">
                      Nome
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-scout-muted text-xs font-semibold"
                        placeholder="Ex: João Silva"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-scout-muted text-xs">
                      Idade
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-scout-muted text-xs font-semibold"
                        placeholder="Ex: 17"
                        {...field}
                        type="number"
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
                className="border-scout-border bg-scout-card-header text-scout-muted flex-1 rounded-lg border py-2 text-sm"
                onClick={handleClose}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                form="jogador-form"
                disabled={form.formState.isSubmitting}
                className="bg-scout-green hover:bg-scout-green/90 flex-1 rounded-lg py-2 text-sm font-semibold text-black opacity-100 transition-opacity hover:opacity-85"
              >
                {isEditing ? "Salvar alterações" : "Adicionar jogador"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModalDialog;
