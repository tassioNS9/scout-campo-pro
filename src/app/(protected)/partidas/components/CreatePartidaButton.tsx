"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Time } from "@/db/schema";

import CreatePartidaForm from "./CreatePartidaForm";

interface CreatePartidaButtonProps {
  times: Time[];
}

const CreatePartidaButton = ({ times }: CreatePartidaButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="max-w-full bg-emerald-600 hover:bg-emerald-700 md:mx-0"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Partida
        </Button>
      </DialogTrigger>
      <CreatePartidaForm
        times={times}
        isOpen={isOpen}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  );
};

export default CreatePartidaButton;
