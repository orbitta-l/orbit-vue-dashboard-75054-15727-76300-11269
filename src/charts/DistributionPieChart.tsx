import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { LideradoDashboard, PieChartFilterType, NivelMaturidade } from "@/types/mer";
import { cn } from "@/lib/utils"; // Importando cn

interface DistributionPieChartProps {
  teamMembers: LideradoDashboard[];
  empty?: boolean;
}

// Mapeamento específico para o filtro de Maturidade (usado para ordenação e cores específicas)
const MATURITY_COLORS_MAP: Record<NivelMaturidade | 'Não Avaliado', string> = {
  M4: "hsl(var(--primary))",
  M3: "hsl(var(--primary-dark))",
  M2: "hsl(var(--color-m2-weak))", // Amarelo Fraco
  M1: "hsl(var(--color-m1-weak))", // Vermelho Fraco
  'Não Avaliado': "hsl(var(--muted-foreground))",
};

// Paleta de cores baseada na Maturidade, usada sequencialmente para outros filtros
const BASE_COLORS = [
  MATURITY_COLORS_MAP.M4,
  MATURITY_COLORS_MAP.M3,
  MATURITY_COLORS_MAP.M2,
  MATURITY_COLORS_MAP.M1,
  MATURITY_COLORS_MAP['Não Avaliado'],
];

// Helper para classificar a idade em faixas
const getAgeRange = (idade?: number | null): string => {
  if (!idade) {
    return "Idade não informada";
  }
  if (idade <= 25) return "Até 25 anos";
  if (idade <= 35) return "26-35 anos";
  if (idade <= 45) return "36-45 anos";
  return "Acima de 45 anos";
};

// Helper para formatar o gênero
const formatGender = (gender: string): string => {
    if (gender === "NAO_INFORMADO") return "Não informado";
    if (gender === "NAO_BINARIO") return "Não Binário";
    // Capitaliza a primeira letra e coloca o resto em minúsculo
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
};

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
          key = member.ultima_avaliacao?.maturidade_quadrante || "Não Avaliado";
          break;
        case "categoria":
          key = member.categoria_dominante || "Não definida";
          break;
        case "sexo":
          // Aplica a formatação de gênero
          key = formatGender(member.sexo);
          break;
        case "faixaEtaria":
          key = getAgeRange(member.idade);
          break;
        default:
          key = "Outros";
      }

      counts[key] = (counts[key] || 0) + 1;
    });

    let data = Object.entries(counts).map(([name, value]) => ({ name, value }));

    // Ordena as faixas etárias para uma visualização consistente
    if (filter === 'faixaEtaria') {
      const order = ["Até 25 anos", "26-35 anos", "36-45 anos", "Acima de 45 anos", "Idade não informada"];
      data.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
    }
    
    // Ordena Maturidade para garantir que as cores M1-M4 sejam aplicadas corretamente
    if (filter === 'maturidade') {
        const order = ["M4", "M3", "M2", "M1", "Não Avaliado"];
        data.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
    }

    return data;
  };

  const chartData = getChartData();

  const placeholderColor = "var(--color-muted)";

  const getDescription = () => {
    switch (filter) {
      case "maturidade":
        return "Distribuição dos membros da equipe por nível de maturidade (M1 a M4).";
      case "categoria":
        return "Distribuição dos membros por categoria técnica dominante.";
      case "sexo":
        return "Distribuição da equipe por gênero declarado.";
      case "faixaEtaria":
        return "Distribuição dos membros por faixa etária.";
      default:
        return "Visão geral da composição da equipe.";
    }
  };
  
  // Função para obter a cor correta
  const getColor = (entryName: string, index: number) => {
      if (filter === 'maturidade') {
          return MATURITY_COLORS_MAP[entryName as keyof typeof MATURITY_COLORS_MAP] || BASE_COLORS[index % BASE_COLORS.length];
      }
      // Para outros filtros, usa a paleta BASE_COLORS sequencialmente
      return BASE_COLORS[index % BASE_COLORS.length];
  };

  // Custom Label para mostrar apenas a porcentagem
  const renderCustomLabel = ({ percent }: { percent: number }) => {
    if (!hasData) return "Sem dados";
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Distribuição da Equipe</h3>
          <p className="text-sm text-muted-foreground">{getDescription()}</p>
        </div>
      </div>

      <div className={cn("flex flex-col md:flex-row gap-6", !hasData && "justify-center items-center")}>
        
        {/* Filtros Verticais (Esquerda) */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as PieChartFilterType)} orientation="vertical" className="w-full md:w-40 flex-shrink-0">
          <TabsList className="flex flex-col h-auto p-1 space-y-1 bg-muted/50">
            <TabsTrigger value="maturidade" className="w-full justify-start">Maturidade</TabsTrigger>
            <TabsTrigger value="categoria" className="w-full justify-start">Categoria</TabsTrigger>
            <TabsTrigger value="sexo" className="w-full justify-start">Gênero</TabsTrigger>
            <TabsTrigger value="faixaEtaria" className="w-full justify-start">Faixa Etária</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Gráfico de Pizza (Direita) */}
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel} // Usando o custom label
                outerRadius={100}
                fill={hasData ? undefined : placeholderColor}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={hasData ? getColor(entry.name, index) : placeholderColor}
                    opacity={hasData ? 1 : 0.3}
                  />
                ))}
              </Pie>
              {hasData && <Tooltip />}
              {/* Alterado para iconType="circle" */}
              {hasData && <Legend iconType="circle" />} 
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {!hasData && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Sem dados disponíveis
        </p>
      )}
    </Card>
  );
}