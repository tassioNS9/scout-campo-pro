"use client";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import AddTimeForm from "./AddTimeForm";
const AddTimeButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Novo Time
        </Button>
      </DialogTrigger>

      <AddTimeForm onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default AddTimeButton;
