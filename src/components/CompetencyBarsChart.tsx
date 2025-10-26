import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { useState } from "react";

type BarItem = { competencia: string; media: number; tipo: 'TECNICA' | 'COMPORTAMENTAL' };

interface CompetencyBarsChartProps {
  empty?: boolean;
  data: BarItem[];
  defaultMode?: 'TECNICA' | 'COMPORTAMENTAL';
}

export default function CompetencyBarsChart({ empty = false, data, defaultMode = "TECNICA" }: CompetencyBarsChartProps) {
  const [mode, setMode] = useState<'TECNICA' | 'COMPORTAMENTAL'>(defaultMode);

  const filteredData = empty ? 
    [{ competencia: 'Placeholder 1', media: 1.5 }, { competencia: 'Placeholder 2', media: 2.8 }, { competencia: 'Placeholder 3', media: 3.5 }]
    : data.filter(item => item.tipo === mode);

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Desempenho por Competência</h3>
          <p className="text-sm text-muted-foreground">Média da equipe em cada competência</p>
        </div>
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList>
            <TabsTrigger value="TECNICA">Técnicas</TabsTrigger>
            <TabsTrigger value="COMPORTAMENTAL">Comportamentais</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="w-full overflow-x-auto">
        <div style={{ width: `${Math.max(filteredData.length * 80, 500)}px`, height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={empty ? "hsl(var(--muted) / 0.2)" : "hsl(var(--border))"} />
              <XAxis type="number" domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} stroke={empty ? "hsl(var(--muted) / 0.5)" : "hsl(var(--foreground))"} />
              <YAxis type="category" dataKey="competencia" width={150} tick={{ fontSize: 12 }} stroke={empty ? "hsl(var(--muted) / 0.5)" : "hsl(var(--foreground))"} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted) / 0.2)' }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
              />
              <ReferenceLine x={2.0} stroke="hsl(var(--color-accent))" strokeDasharray="4 4" />
              <Bar dataKey="media" fill={empty ? "hsl(var(--color-muted))" : "hsl(var(--color-brand))"} barSize={30}>
                <LabelList dataKey="media" position="right" formatter={(value: number) => value.toFixed(1)} fill={empty ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))"} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}