import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { LideradoPerformance, PieChartFilterType } from "@/types/mer";

interface DistributionPieChartProps {
  teamMembers: LideradoPerformance[];
  empty?: boolean;
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export default function DistributionPieChart({ teamMembers, empty = false }: DistributionPieChartProps) {
  const [filter, setFilter] = useState<PieChartFilterType>("maturidade");

  const hasData = teamMembers.length > 0 && !empty;

  const getChartData = () => {
    if (!hasData) {
      return [{ name: "Sem dados", value: 1 }];
    }

    const counts: Record<string, number> = {};

    teamMembers.forEach((member) => {
      let key: string;

      switch (filter) {
        case "maturidade":
          key = member.nivel_maturidade;
          break;
        case "categoria":
          key = member.categoria_dominante || "Não definida";
          break;
        case "sexo":
          key = member.sexo === "NAO_INFORMADO" ? "Não informado" : member.sexo;
          break;
        case "faixaEtaria":
          // placeholder – idade ainda não está no mock
          key = "Não definido";
          break;
        default:
          key = "Outros";
      }

      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const chartData = getChartData();

  const placeholderColor = "var(--color-muted)";

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Distribuição da Equipe</h3>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as PieChartFilterType)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="maturidade">Maturidade</TabsTrigger>
            <TabsTrigger value="categoria">Categoria</TabsTrigger>
            <TabsTrigger value="sexo">Gênero</TabsTrigger>
            <TabsTrigger value="faixaEtaria">Faixa Etária</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => (hasData ? `${name}: ${(percent * 100).toFixed(0)}%` : name)}
            outerRadius={100}
            fill={hasData ? undefined : placeholderColor}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={hasData ? CHART_COLORS[index % CHART_COLORS.length] : placeholderColor}
                opacity={hasData ? 1 : 0.3}
              />
            ))}
          </Pie>
          {hasData && <Tooltip />}
          {hasData && <Legend />}
        </PieChart>
      </ResponsiveContainer>

      {!hasData && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Sem dados disponíveis
        </p>
      )}
    </Card>
  );
}