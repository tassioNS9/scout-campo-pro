"use client";

import { Dialog } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Time } from "@/db/schema";

import CreateJogadorForm from "./CreateJogadorForm";

const CreateJogadorButton = ({ times }: { times: Time[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Jogador
        </Button>
      </DialogTrigger>
      <CreateJogadorForm times={times} onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default CreateJogadorButton;
