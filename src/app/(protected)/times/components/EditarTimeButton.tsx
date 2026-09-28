"use client";

import { Edit2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Time } from "@/db/schema";

import EditTimeForm from "./EditTimeForm";

const EditarTimeButton = ({ time }: { time: Time }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1">
          <Edit2 className="mr-1 h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>
      <EditTimeForm
        onSuccess={() => setIsOpen(false)}
        isOpen={isOpen}
        time={time}
      />
    </Dialog>
  );
};

export default EditarTimeButton;
