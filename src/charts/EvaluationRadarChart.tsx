import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

interface RadarDataPoint {
  competency: string;
  atual: number;
  ideal: number;
}

interface EvaluationRadarChartProps {
  data: RadarDataPoint[];
}

export default function EvaluationRadarChart({ data }: EvaluationRadarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Aguardando avaliação para exibir o gráfico.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="competency" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
        <PolarRadiusAxis angle={90} domain={[0, 4]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <Radar 
          name="Perfil Ideal" 
          dataKey="ideal" 
          stroke="hsl(var(--accent))" 
          fill="hsl(var(--accent))" 
          fillOpacity={0.3} 
        />
        <Radar 
          name="Avaliação Atual" 
          dataKey="atual" 
          stroke="hsl(var(--primary))" 
          fill="hsl(var(--primary))" 
          fillOpacity={0.6} 
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}