import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LideradoDashboard } from "@/types/mer";
import { cn } from "@/lib/utils";

interface AgeGenderPyramidChartProps {
  teamMembers: LideradoDashboard[];
  empty?: boolean;
}

// Faixas etárias para o gráfico
const AGE_RANGES = [
  "18-25",
  "26-35",
  "36-45",
  "46-55",
  "56+",
];

// Helper para determinar a faixa etária
const getAgeRange = (age: number): string => {
  if (age >= 18 && age <= 25) return "18-25";
  if (age >= 26 && age <= 35) return "26-35";
  if (age >= 36 && age <= 45) return "36-45";
  if (age >= 46 && age <= 55) return "46-55";
  if (age >= 56) return "56+";
  return "Outros";
};

export default function AgeGenderPyramidChart({ teamMembers, empty = false }: AgeGenderPyramidChartProps) {
  
  const chartData = useMemo(() => {
    if (empty) {
      return AGE_RANGES.map(range => ({
        ageRange: range,
        MASCULINO: 0,
        FEMININO: 0,
      }));
    }

    const counts: Record<string, { MASCULINO: number; FEMININO: number }> = {};

    // Inicializa contadores
    AGE_RANGES.forEach(range => {
      counts[range] = { MASCULINO: 0, FEMININO: 0 };
    });

    teamMembers.forEach(member => {
      const range = getAgeRange(member.idade);
      if (counts[range]) {
        if (member.sexo === 'MASCULINO') {
          counts[range].MASCULINO += 1;
        } else if (member.sexo === 'FEMININO') {
          counts[range].FEMININO += 1;
        }
      }
    });

    // Converte para o formato do Recharts, usando valores negativos para MASCULINO
    return AGE_RANGES.map(range => ({
      ageRange: range,
      MASCULINO: -counts[range].MASCULINO, // Negativo para a esquerda
      FEMININO: counts[range].FEMININO, // Positivo para a direita
    }));
  }, [teamMembers, empty]);

  const maxCount = useMemo(() => {
    if (empty) return 1;
    const allCounts = chartData.flatMap(d => [Math.abs(d.MASCULINO), d.FEMININO]);
    return Math.max(...allCounts, 1);
  }, [chartData, empty]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const maleValue = Math.abs(payload.find((p: any) => p.dataKey === 'MASCULINO')?.value || 0);
      const femaleValue = payload.find((p: any) => p.dataKey === 'FEMININO')?.value || 0;
      
      return (
        <div className="p-3 bg-card border rounded-lg shadow-lg text-sm">
          <p className="font-bold text-foreground mb-1">Faixa Etária: {label}</p>
          <p className="text-muted-foreground">
            Masculino: <span className="font-semibold text-primary">{maleValue}</span>
          </p>
          <p className="text-muted-foreground">
            Feminino: <span className="font-semibold text-accent">{femaleValue}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (empty) {
    return (
      <Card className="p-6 bg-muted/20 h-full">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-lg font-semibold text-muted-foreground">Distribuição por Idade e Gênero</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Aguardando dados de liderados para exibir a pirâmide.</CardDescription>
        </CardHeader>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Sem dados para exibir.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-8">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Distribuição por Idade e Gênero</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Visão da composição demográfica da equipe.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            layout="vertical"
            data={chartData}
            stackOffset="sign"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            
            {/* Eixo X (Contagem) - Centralizado em 0 */}
            <XAxis 
              type="number" 
              domain={[-maxCount, maxCount]} 
              tickFormatter={(value) => Math.abs(value).toString()} // Exibe valores absolutos
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            />
            
            {/* Eixo Y (Faixa Etária) */}
            <YAxis 
              dataKey="ageRange" 
              type="category" 
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }} 
              iconType="circle" 
              formatter={(value) => value === 'MASCULINO' ? 'Masculino' : 'Feminino'}
            />
            
            {/* Barras Masculino (Esquerda) - Cor Primária (Azul) */}
            <Bar 
              dataKey="MASCULINO" 
              fill="hsl(var(--primary))" 
              name="Masculino" 
              radius={[0, 8, 8, 0]} // Arredondamento à esquerda
            />
            
            {/* Barras Feminino (Direita) - Cor Accent (Laranja) */}
            <Bar 
              dataKey="FEMININO" 
              fill="hsl(var(--accent))" 
              name="Feminino" 
              radius={[8, 0, 0, 8]} // Arredondamento à direita
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}