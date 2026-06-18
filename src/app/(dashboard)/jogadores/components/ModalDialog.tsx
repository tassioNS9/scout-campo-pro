"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SelectItem } from "@radix-ui/react-select";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { C } from "@/constants/Colors";
import { Jogador } from "@/db/schema";
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const POSICOES = [
  "Goleiro",
  "Zagueiro",
  "Lateral",
  "Volante",
  "Meia",
  "Atacante",
] as const;

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const jogadorSchema = z.object({
  numero: z
    .string()
    .min(1, "Número da camisa é obrigatório")
    .refine((v) => Number(v) >= 1 && Number(v) <= 99, {
      message: "Número deve estar entre 1 e 99",
    }),
  nome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(60, "Nome deve ter no máximo 60 caracteres"),
  idade: z
    .string()
    .min(1, "Idade é obrigatória")
    .refine((v) => Number(v) >= 10 && Number(v) <= 50, {
      message: "Idade deve estar entre 10 e 50 anos",
    }),
  posicao: z.enum(POSICOES),
});

type JogadorFormData = z.infer<typeof jogadorSchema>;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface FieldErrorProps {
  message?: string;
}

const FieldError = ({ message }: FieldErrorProps) =>
  message ? (
    <span className="text-xs" style={{ color: "#f87171" }}>
      {message}
    </span>
  ) : null;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ModalDialogProps {
  jogador: Jogador | null;
  showForm: boolean;
  isEditing?: boolean;
  onClose: () => void;
  onSubmit: (data: JogadorFormData) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TEXT_FIELDS = [
  {
    key: "numero" as const,
    label: "Número da camisa",
    type: "number",
    placeholder: "Ex: 10",
  },
  {
    key: "nome" as const,
    label: "Nome completo",
    type: "text",
    placeholder: "Ex: João Silva",
  },
  {
    key: "idade" as const,
    label: "Idade",
    type: "number",
    placeholder: "Ex: 17",
  },
];
const ModalDialog = ({
  jogador,
  showForm,
  isEditing = false,
  onClose,
  onSubmit,
}: ModalDialogProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JogadorFormData>({
    resolver: zodResolver(jogadorSchema),
    defaultValues: {
      numero: "",
      nome: "",
      idade: "",
      posicao: undefined,
    },
  });

  const posicaoValue = watch("posicao");

  const handleFormSubmit = (data: JogadorFormData) => {
    // Aqui você pode adicionar a lógica para salvar os dados do jogador
    onSubmit(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Populate form when editing an existing player
  useEffect(() => {
    if (isEditing && jogador) {
      reset({
        numero: String(jogador.numero ?? ""),
        nome: jogador.nome ?? "",
        idade: String(jogador.idade ?? ""),
        posicao: (jogador.posicao as (typeof POSICOES)[number]) ?? undefined,
      });
    } else {
      reset();
    }
  }, [isEditing, jogador, reset]);

  if (!jogador) return null;
  return (
    <div>
      {showForm && (
        <Dialog open={showForm} onOpenChange={handleClose}>
          <DialogContent
            className="w-full max-w-md rounded-t-2xl p-6 md:rounded-2xl"
            style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
          >
            <DialogHeader>
              <DialogTitle className="text-white">
                {isEditing ? "Editar Jogador" : "Novo Jogador"}
              </DialogTitle>
            </DialogHeader>

            <form
              id="jogador-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="mt-2 flex flex-col gap-4"
              noValidate
            >
              {TEXT_FIELDS.map(({ key, label, type, placeholder }) => (
                <div key={key} className="flex flex-col gap-1">
                  <Label style={{ color: C.muted }} className="text-xs">
                    {label}
                  </Label>
                  <Input
                    type={type}
                    placeholder={placeholder}
                    {...register(key)}
                    className="rounded-lg border px-4 py-2 outline-none focus-visible:ring-0"
                    style={{
                      backgroundColor: C.cardHeader,
                      color: C.text,
                      borderColor: errors[key] ? "#f87171" : C.borderLight,
                    }}
                  />
                  <FieldError message={errors[key]?.message} />
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <Label style={{ color: C.muted }} className="text-xs">
                  Posição
                </Label>
                <Select
                  value={posicaoValue}
                  onValueChange={(value) =>
                    setValue("posicao", value as (typeof POSICOES)[number], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger
                    className="rounded-lg border px-4 py-2 outline-none focus:ring-0"
                    style={{
                      backgroundColor: C.cardHeader,
                      color: C.text,
                      borderColor: errors.posicao ? "#f87171" : C.borderLight,
                    }}
                  >
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent
                    style={{ backgroundColor: C.card, borderColor: C.border }}
                  >
                    {POSICOES.map((p) => (
                      <SelectItem
                        key={p}
                        value={p}
                        className="cursor-pointer"
                        style={{ color: C.text }}
                      >
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.posicao?.message} />
              </div>
            </form>

            <DialogFooter className="mt-6 flex gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-lg py-2 text-sm"
                style={{
                  backgroundColor: C.cardHeader,
                  color: C.muted,
                  borderColor: C.border,
                }}
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="jogador-form"
                disabled={isSubmitting}
                className="flex-1 rounded-lg py-2 text-sm font-semibold opacity-100 transition-opacity hover:opacity-85"
                style={{ backgroundColor: C.green, color: "#000" }}
              >
                {isEditing ? "Salvar alterações" : "Adicionar jogador"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ModalDialog;
