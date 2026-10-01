"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createJogador } from "@/app/actions/create-jogador";
import {
  CreateJogadorFormInput,
  CreateJogadorFormValues,
  createJogadorSchema,
} from "@/app/actions/create-jogador/schema";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Time } from "@/db/schema";

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

interface CreateJogadorFormProps {
  times: Time[];
  onSuccess: () => void;
}

const CreateJogadorForm = ({ times, onSuccess }: CreateJogadorFormProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<
    CreateJogadorFormInput,
    unknown,
    CreateJogadorFormValues
  >({
    resolver: zodResolver(createJogadorSchema),
    defaultValues: {
      idTime: times[0]?.id ?? 0,
      numero: 0,
      nome: "",
      idade: 0,
      posicao: "Goleiro",
    },
  });

  function handleFotoJogadorSelecionado(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue("foto", file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  }

  const onSubmit = async (data: CreateJogadorFormValues) => {
    const formData = new FormData();
    formData.append("idTime", data.idTime.toString());
    formData.append("numero", data.numero.toString());
    formData.append("nome", data.nome);
    formData.append("idade", data.idade.toString());
    formData.append("posicao", data.posicao);
    if (data.foto) {
      formData.append("foto", data.foto);
    }
    try {
      const result = await createJogador(formData);

      if (!result?.sucesso) {
        toast.error("Verifique os campos do formulário.");
        return;
      }

      if (result.avisoFoto) {
        toast.warning(result.avisoFoto);
      } else {
        toast.success("Jogador criado com sucesso!");
        handleClose();
      }
    } catch {
      toast.error("Erro ao criar o jogador.");
    }
  };

  const handleClose = () => {
    form.reset();
    form.setValue("foto", undefined);
    setPreview(null);
    onSuccess?.();
  };
  return (
    <DialogContent className="border-scout-border bg-scout-card w-full max-w-95 rounded-t-2xl border p-8 md:rounded-2xl">
      <DialogTrigger asChild>
        <DialogDescription className="text-scout-text">
          Preencha os campos abaixo para criar um novo jogador.
        </DialogDescription>
      </DialogTrigger>
      <DialogHeader>
        <DialogTitle className="text-scout-text">Novo Jogador</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          id="jogador-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-2 flex flex-col gap-4"
          noValidate
        >
          <div>
            <Label className="text-scout-text">
              Foto do jogador (opcional)
            </Label>
            <div className="flex items-center gap-4">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview da foto do jogador"
                  className="h-30 w-30 rounded-lg object-cover"
                  width={120}
                  height={120}
                />
              ) : (
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-scout-border bg-scout-card-header text-scout-muted mt-4 flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border p-2 text-center text-sm"
                >
                  Clique para selecionar a foto
                </div>
              )}
              <input
                className="hidden"
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFotoJogadorSelecionado}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <FormField
              control={form.control}
              name="idTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-scout-muted text-xs">
                    Time
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={
                      field.value !== undefined && field.value !== null
                        ? String(field.value)
                        : undefined
                    }
                    disabled={times.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="text-scout-muted w-full font-semibold">
                        <SelectValue
                          className="text-scout-text"
                          placeholder={
                            times.length === 0
                              ? "Nenhum time cadastrado"
                              : "Selecione um Time"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-scout-bg text-scout-text">
                      {times.map((time) => (
                        <SelectItem key={time.id} value={String(time.id)}>
                          {time.nome}
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
                      value={field.value as number}
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
                      value={field.value as number}
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
              className="bg-scout-green text-scout-bg hover:bg-scout-green/90 flex-1 rounded-lg py-2 text-sm font-semibold opacity-100 transition-opacity hover:opacity-85"
            >
              {form.formState.isSubmitting ? "Criando..." : "Criar Jogador"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CreateJogadorForm;
