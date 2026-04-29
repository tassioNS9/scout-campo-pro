"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A donut chart";

type ChartPieDonutData = {
  gols: number;
  assistencias: number;
  finalizacoes: number;
  desarmes: number;
};

const chartConfig = {
  value: {
    label: "Quantidade",
  },
  gols: {
    label: "Gols",
    color: "var(--chart-1)",
  },
  assistencias: {
    label: "Assistências",
    color: "var(--chart-2)",
  },
  finalizacoes: {
    label: "Finalizações",
    color: "var(--chart-3)",
  },
  desarmes: {
    label: "Desarmes",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

type ChartPieDonutProps = {
  data: ChartPieDonutData;
};

export function ChartPieDonut({ data }: ChartPieDonutProps) {
  const chartData = [
    { category: "gols", value: data.gols, fill: "var(--chart-1)" },
    {
      category: "assistencias",
      value: data.assistencias,
      fill: "var(--chart-2)",
    },
    {
      category: "finalizacoes",
      value: data.finalizacoes,
      fill: "var(--chart-3)",
    },
    { category: "desarmes", value: data.desarmes, fill: "var(--chart-4)" },
  ];

  return (
    <Card className="flex flex-col border-0 bg-transparent">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62 w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Distribuição de eventos por categoria
        </div>
      </CardFooter>
    </Card>
  );
}
