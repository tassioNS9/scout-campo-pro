import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createPartida } from "@/app/actions/create-partida";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
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
  return (
    <DialogContent className="w-[90%]">
      <DialogHeader>
        <DialogTitle>Criar Nova Partida</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreatePartida)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="idTime"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Selecione o seu Time</FormLabel>
                <Select
                  value={field.value ? field.value.toString() : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Time Adversário</FormLabel>
                <FormControl>
                  <Input
                    className="w-40"
                    placeholder="Selecione um time"
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
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Data e Hora</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="campeonato"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Campeonato</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Campeonato Estadual" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Categoria</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sub-17">Sub-17</SelectItem>
                    <SelectItem value="Sub-20">Sub-20</SelectItem>
                    <SelectItem value="Profissional">Profissional</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Criando..." : "Criar Partida"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CreatePartidaForm;
