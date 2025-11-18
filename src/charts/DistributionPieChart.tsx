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

  // Subtítulo fixo
  const fixedDescription = "Visão geral da composição da equipe por diferentes critérios.";
  
  // Função para obter a cor correta
  const getColor = (entryName: string, index: number) => {
      if (filter === 'maturidade') {
          return MATURITY_COLORS_MAP[entryName as keyof typeof MATURITY_COLORS_MAP] || BASE_COLORS[index % BASE_COLORS.length];
      }
      // Para outros filtros, usa a paleta BASE_COLORS sequencialmente
      return BASE_COLORS[index % BASE_COLORS.length];
  };

  // Custom Label para mostrar apenas a porcentagem
  const renderCustomLabel = ({ percent, x, y, midAngle, outerRadius, innerRadius }: any) => {
    if (!hasData || percent < 0.05) return null; // Oculta rótulos muito pequenos (menos de 5%)
    
    // Calcula o raio no meio da espessura do donut
    const radius = (innerRadius + outerRadius) / 2; 
    const RADIAN = Math.PI / 180;
    const ex = x + radius * Math.cos(-midAngle * RADIAN);
    const ey = y + radius * Math.sin(-midAngle * RADIAN);
    
    // Estilos explícitos para SVG
    const textStyle = {
        fill: 'hsl(var(--foreground))',
        fontWeight: 600, // bold
        opacity: 0.6, // 60% de opacidade
        fontSize: 14, // Tamanho da fonte
    };

    return (
      <text
        x={ex}
        y={ey}
        textAnchor="middle" // Centraliza o texto no ponto calculado
        dominantBaseline="central"
        style={textStyle}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="p-6 mb-8 h-full"> {/* Adicionado h-full */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Distribuição da Equipe</h3>
          <p className="text-sm text-muted-foreground">{fixedDescription}</p>
        </div>
      </div>

      <div className={cn("flex flex-col md:flex-row gap-10 items-center h-[300px]", !hasData && "justify-center")}> {/* Altura fixa de 300px para o conteúdo do gráfico */}
        
        {/* Filtros Verticais (Esquerda) - Centralizado verticalmente */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as PieChartFilterType)} orientation="vertical" className="w-full md:w-40 flex-shrink-0 flex items-center justify-center">
          <TabsList className="flex flex-col h-auto p-3 space-y-4 bg-muted/50">
            <TabsTrigger value="maturidade" className="w-full justify-start">Maturidade</TabsTrigger>
            <TabsTrigger value="categoria" className="w-full justify-start">Área</TabsTrigger>
            <TabsTrigger value="sexo" className="w-full justify-start">Gênero</TabsTrigger>
            <TabsTrigger value="faixaEtaria" className="w-full justify-start">Faixa Etária</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Gráfico de Pizza (Direita) - Centralizado no espaço restante */}
        <div className="flex-1 h-full flex items-center justify-center"> {/* Adicionado flex items-center justify-center */}
          <ResponsiveContainer width="100%" height="100%"> {/* height="100%" para usar a altura do pai */}
            <PieChart>
              <Pie
                data={chartData}
                cx="50%" // Centralizado
                cy="50%" // Centralizado
                labelLine={false} // Remove a linha de conexão
                label={renderCustomLabel} // Usa o rótulo customizado
                innerRadius={60} // Adicionado innerRadius para criar o efeito donut
                outerRadius={100} // Reduzido de 120 para 100 para ser mais compacto
                fill={hasData ? undefined : placeholderColor}
                dataKey="value"
                isAnimationActive={true}
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
              {/* Legenda na parte inferior, horizontal e centralizada */}
              {hasData && <Legend 
                iconType="circle" 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center" 
                wrapperStyle={{ paddingTop: '20px' }}
              />} 
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