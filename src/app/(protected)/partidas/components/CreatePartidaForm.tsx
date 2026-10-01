import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createPartida } from "@/app/actions/create-partida";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Time } from "@/db/schema";

const createPartidaSchema = z.object({
  idTime: z.number().int().positive({ message: "Selecione um time" }),
  nomeTimeAdversario: z
    .string()
    .trim()
    .min(1, { message: "O time adversário é obrigatório" }),
  data: z.string().min(1, { message: "A data é obrigatória" }),
  campeonato: z
    .string()
    .trim()
    .min(1, { message: "O campeonato é obrigatório" }),
  categoria: z.enum(["Sub-17", "Sub-20", "Profissional"]),
});

type CreatePartidaFormData = z.infer<typeof createPartidaSchema>;

interface CreatePartidaFormProps {
  times: Time[];
  isOpen: boolean;
  onSuccess: () => void;
}

const CreatePartidaForm = ({ times, onSuccess }: CreatePartidaFormProps) => {
  const form = useForm<CreatePartidaFormData>({
    resolver: zodResolver(createPartidaSchema),
    defaultValues: {
      idTime: times?.[0]?.id ?? 0,
      nomeTimeAdversario: "",
      data: "",
      campeonato: "",
      categoria: "Sub-17",
    },
  });

  const handleCreatePartida = async (data: CreatePartidaFormData) => {
    try {
      await createPartida({
        idTime: data.idTime,
        nomeTimeAdversario: data.nomeTimeAdversario,
        data: new Date(data.data),
        campeonato: data.campeonato,
        categoria: data.categoria,
        status: "planejada",
        casaOuFora: "casa",
      });
      toast.success("Partida criada com sucesso");
      form.reset();
      onSuccess();
    } catch {
      toast.error("Falha ao criar partida");
    }
  };

  const handleClose = () => {
    form.reset();
    onSuccess();
  };
  return (
    <DialogContent className="bg-scout-card border-scout-border w-full max-w-90 rounded-t-2xl border p-6 md:rounded-2xl">
      <DialogHeader>
        <DialogTitle className="text-scout-text">
          Criar Nova Partida
        </DialogTitle>
        <DialogDescription className="text-scout-muted text-sm">
          Preencha os campos abaixo para criar uma nova partida.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreatePartida)}
          className="mt-2 flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="idTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-scout-muted text-xs">
                  Selecione o seu Time
                </FormLabel>
                <Select
                  value={field.value ? field.value.toString() : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger className="text-scout-muted w-full font-semibold">
                      <SelectValue placeholder="Selecione um time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-scout-bg text-scout-text">
                    {times?.map((time) => (
                      <SelectItem key={time.id} value={time.id.toString()}>
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
            name="nomeTimeAdversario"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-scout-muted text-xs">
                  Time Adversário
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
            name="data"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-scout-muted text-xs">
                  Data e Hora
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-scout-muted text-xs font-semibold"
                    type="datetime-local"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="campeonato"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-scout-muted text-xs">
                  Campeonato
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-scout-muted text-xs font-semibold"
                    placeholder="Ex: Campeonato Estadual"
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="text-scout-muted w-full font-semibold">
                      <SelectValue />
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
          <DialogFooter className="mt-6">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-scout-green w-full rounded-lg py-2 text-sm font-semibold text-black opacity-100 transition-opacity hover:opacity-85"
            >
              {form.formState.isSubmitting ? "Criando..." : "Criar Partida"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-scout-border bg-scout-card-header text-scout-muted flex-1 rounded-lg border py-2 text-sm"
              onClick={handleClose}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CreatePartidaForm;
