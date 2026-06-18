"use client";

import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  NavySelect,
  NavySelectContent,
  NavySelectItem,
  NavySelectTrigger,
  NavySelectValue,
} from "@/components/ui/navy-select";
import { C } from "@/constants/Colors";
import type { Time } from "@/db/schema";

interface PropsSelectTimes {
  times: Time[];
  timeIdSelecionado?: string;
}

const SelectTimes = ({ times, timeIdSelecionado }: PropsSelectTimes) => {
  const router = useRouter();
  function handleValueChange(timeId: string) {
    router.push(
      timeId ? `/jogadores?timeId=${timeId}` : "/jogadores?timeId=17",
    );
  }

  return (
    <NavySelect
      value={timeIdSelecionado ?? ""}
      onValueChange={(value) => handleValueChange(value)}
    >
      <NavySelectTrigger>
        <Users size={14} style={{ color: C.green }} />
        <NavySelectValue placeholder="Selecione um time" />
      </NavySelectTrigger>
      <NavySelectContent>
        {times.map((t) => (
          <NavySelectItem key={t.id} value={t.id.toString()}>
            {t.nome}
          </NavySelectItem>
        ))}
      </NavySelectContent>
    </NavySelect>
  );
};

export default SelectTimes;
