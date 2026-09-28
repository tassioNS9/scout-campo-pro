import React from "react";
import { toast } from "sonner";

import { updateTime } from "@/app/actions/update-time";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
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
// theme tokens used from globals.css
import { Time } from "@/db/schema";

interface EditTimeFormProps {
  onSuccess?: () => void;
  isOpen: boolean;
  time: Time;
}

const EditTimeForm = ({ onSuccess, isOpen, time }: EditTimeFormProps) => {
  const [nome, setNome] = React.useState(time?.nome ?? "");
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [, setIsEditOpen] = React.useState(isOpen);
  const [categoria, setCategoria] = React.useState<"Sub-17" | "Profissional">(
    "Sub-17",
  );
  const [cidade, setCidade] = React.useState(time?.cidade ?? "");
  const [estado, setEstado] = React.useState(time?.estado ?? "");

  const handleEditSave = async () => {
    if (!nome.trim()) {
      toast.error("Nome do time é obrigatório");
      return;
    }

    try {
      setIsUpdating(true);
      await updateTime({
        id: time.id,
        nome,
        categoria,
        cidade,
        estado,
      });
      toast.success("Time atualizado com sucesso");
      setNome("");
      setCategoria("Profissional");
      setCidade("");
      setEstado("");
      setIsEditOpen(false);
      onSuccess?.();
    } catch {
      toast.error("Falha ao atualizar time");
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <DialogContent className="bg-scout-card border-scout-border w-full max-w-md rounded-t-2xl border p-6 md:rounded-2xl">
      <DialogHeader>
        <DialogTitle className="text-scout-text">Editar Time</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label className="text-scout-text font-semibold" htmlFor="edit-nome">
            Nome do Time
          </Label>
          <Input
            className="text-scout-muted font-semibold"
            id="edit-nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Esporte Clube A"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label
            className="text-scout-text font-semibold"
            htmlFor="edit-categoria"
          >
            Categoria
          </Label>
          <Select
            value={categoria}
            onValueChange={(value: typeof categoria) => setCategoria(value)}
          >
            <SelectTrigger className="text-scout-muted w-full font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-scout-bg text-scout-text">
              <SelectItem value="Sub-17">Sub-17</SelectItem>
              <SelectItem value="Sub-20">Sub-20</SelectItem>
              <SelectItem value="Profissional">Profissional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label
            className="text-scout-text font-semibold"
            htmlFor="edit-cidade"
          >
            Cidade
          </Label>
          <Input
            id="edit-cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Ex: São Paulo"
            className="text-scout-muted font-semibold"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label
            className="text-scout-text font-semibold"
            htmlFor="edit-estado"
          >
            Estado (UF)
          </Label>
          <Input
            id="edit-estado"
            className="text-scout-muted font-semibold"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            placeholder="Ex: SP"
            maxLength={2}
          />
        </div>
        <Button
          onClick={handleEditSave}
          className="bg-scout-green hover:bg-scout-green/90 w-full text-black"
          disabled={isUpdating}
        >
          {isUpdating ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </DialogContent>
  );
};

export default EditTimeForm;
