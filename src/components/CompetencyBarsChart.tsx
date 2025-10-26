import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { Label } from "./ui/label";

type BarItem = { 
  competencia: string; 
  media: number; 
  tipo: 'TECNICA' | 'COMPORTAMENTAL';
  categoria?: string;
  especializacao?: string | null;
};

interface CompetencyBarsChartProps {
  empty?: boolean;
  data: BarItem[];
  defaultMode?: 'TECNICA' | 'COMPORTAMENTAL';
}

export default function CompetencyBarsChart({ empty = false, data, defaultMode = "TECNICA" }: CompetencyBarsChartProps) {
  const [mode, setMode] = useState<'TECNICA' | 'COMPORTAMENTAL'>(defaultMode);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");

  const availableCategories = useMemo(() => {
    if (empty) return [];
    const categories = new Set(data.filter(d => d.tipo === 'TECNICA').map(d => d.categoria).filter(Boolean as (value: string | undefined) => value is string));
    return ["all", ...Array.from(categories)];
  }, [data, empty]);

  const availableSpecializations = useMemo(() => {
    if (empty) return [];
    const specializations = new Set(data
        .filter(d => d.tipo === 'TECNICA' && (selectedCategory === 'all' || d.categoria === selectedCategory))
        .map(d => d.especializacao)
        .filter(Boolean as (value: string | null | undefined) => value is string)
    );
    return ["all", ...Array.from(specializations)];
  }, [data, empty, selectedCategory]);

  useEffect(() => {
    setSelectedSpecialization("all");
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedCategory("all");
    setSelectedSpecialization("all");
  }, [mode]);

  const filteredData = useMemo(() => {
    if (empty) {
      return [{ competencia: 'Placeholder 1', media: 1.5 }, { competencia: 'Placeholder 2', media: 2.8 }, { competencia: 'Placeholder 3', media: 3.5 }];
    }
    return data.filter(item => {
      if (item.tipo !== mode) return false;
      if (mode === 'TECNICA') {
        if (selectedCategory !== 'all' && item.categoria !== selectedCategory) return false;
        if (selectedSpecialization !== 'all' && item.especializacao !== selectedSpecialization) return false;
      }
      return true;
    });
  }, [data, empty, mode, selectedCategory, selectedSpecialization]);

  return (
    <Card className="p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
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

      {mode === 'TECNICA' && !empty && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded-lg bg-muted/20">
          <div>
            <Label className="text-sm font-medium mb-2 block">Filtrar por Categoria</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={availableCategories.length <= 1}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as Categorias" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat === 'all' ? 'Todas as Categorias' : cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Filtrar por Especialização</Label>
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization} disabled={availableSpecializations.length <= 1}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as Especializações" />
              </SelectTrigger>
              <SelectContent>
                {availableSpecializations.map(spec => (
                  <SelectItem key={spec} value={spec}>{spec === 'all' ? 'Todas as Especializações' : spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <div style={{ width: `${Math.max(filteredData.length * 80, 500)}px`, height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={empty ? "hsl(var(--muted) / 0.2)" : "hsl(var(--border))"} />
              <XAxis type="number" dataKey="media" domain={[0, 4]} ticks={[0, 1, 2, 2.5, 3, 4]} stroke={empty ? "hsl(var(--muted) / 0.5)" : "hsl(var(--foreground))"} />
              <YAxis type="category" dataKey="competencia" width={150} tick={{ fontSize: 12 }} stroke={empty ? "hsl(var(--muted) / 0.5)" : "hsl(var(--foreground))"} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted) / 0.2)' }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
              />
              <ReferenceLine x={2.5} stroke="hsl(var(--color-accent))" strokeDasharray="4 4" />
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