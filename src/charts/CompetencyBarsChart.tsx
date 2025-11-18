import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, LabelList, Cell } from 'recharts';
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

// Cores
const COLOR_DEFAULT = "hsl(var(--color-brand))"; // Azul Principal
const COLOR_CLICKED = "hsl(var(--accent))"; // Laranja

export default function CompetencyBarsChart({ empty = false, data, defaultMode = "TECNICA" }: CompetencyBarsChartProps) {
  const [mode, setMode] = useState<'TECNICA' | 'COMPORTAMENTAL'>(defaultMode);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [clickedIndex, setClickedIndex] = useState<number | null>(null); // Estado para rastrear a barra clicada
  const [clickedData, setClickedData] = useState<{ name: string, media: number } | null>(null); // Dados da barra clicada

  const availableCategories = useMemo(() => {
    if (empty) return [];
    const categories = new Set(data.filter(d => d.tipo === 'TECNICA').map(d => d.categoria).filter(Boolean));
    return ["all", ...Array.from(categories)];
  }, [data, empty]);

  const availableSpecializations = useMemo(() => {
    if (empty) return [];
    const specializations = new Set(data
        .filter(d => d.tipo === 'TECNICA' && (selectedCategory === 'all' || d.categoria === selectedCategory))
        .map(d => d.especializacao)
        .filter(Boolean)
    );
    return ["all", ...Array.from(specializations)];
  }, [data, empty, selectedCategory]);

  useEffect(() => {
    setSelectedSpecialization("all");
    setClickedIndex(null);
    setClickedData(null);
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedCategory("all");
    setSelectedSpecialization("all");
    setClickedIndex(null);
    setClickedData(null);
  }, [mode]);

  const chartData = useMemo(() => {
    if (empty) {
      return {
        data: [{ name: 'Categoria A', media: 1.5 }, { name: 'Categoria B', media: 2.8 }, { name: 'Categoria C', media: 3.5 }],
        dataKey: 'name'
      };
    }

    const relevantData = data.filter(item => item.tipo === mode);

    // Level 3: Competency view
    if (selectedSpecialization !== 'all') {
      return {
        data: relevantData
          .filter(item => item.especializacao === selectedSpecialization)
          .map(item => ({ name: item.competencia, media: item.media })),
        dataKey: 'name'
      };
    }

    // Level 2: Specialization view
    if (selectedCategory !== 'all') {
      const groupedBySpec = relevantData
        .filter(item => item.categoria === selectedCategory && item.especializacao)
        .reduce((acc, item) => {
          const key = item.especializacao!;
          if (!acc[key]) {
            acc[key] = { soma: 0, count: 0 };
          }
          acc[key].soma += item.media;
          acc[key].count++;
          return acc;
        }, {} as Record<string, { soma: number, count: number }>);

      return {
        data: Object.entries(groupedBySpec).map(([name, { soma, count }]) => ({
          name,
          media: soma / count
        })),
        dataKey: 'name'
      };
    }

    // Level 1: Category view (for Technical)
    if (mode === 'TECNICA') {
      const groupedByCat = relevantData
        .filter(item => item.categoria)
        .reduce((acc, item) => {
          const key = item.categoria!;
          if (!acc[key]) {
            acc[key] = { soma: 0, count: 0 };
          }
          acc[key].soma += item.media;
          acc[key].count++;
          return acc;
        }, {} as Record<string, { soma: number, count: number }>);

      return {
        data: Object.entries(groupedByCat).map(([name, { soma, count }]) => ({
          name,
          media: soma / count
        })),
        dataKey: 'name'
      };
    }

    // Default for Comportamental (no hierarchy, just show competencies)
    return {
      data: relevantData.map(item => ({ name: item.competencia, media: item.media })),
      dataKey: 'name'
    };

  }, [data, empty, mode, selectedCategory, selectedSpecialization]);

  const handleBarClick = (data: { name: string, media: number }, index: number) => {
    if (clickedIndex === index) {
      setClickedIndex(null);
      setClickedData(null);
    } else {
      setClickedIndex(index);
      setClickedData(data);
    }
  };

  const CustomPopover = () => {
    if (!clickedData) return null;

    return (
      <div className="p-3 bg-card border border-accent rounded-lg shadow-xl text-sm mb-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-foreground mb-1">{clickedData.name}</p>
          <p className="text-muted-foreground">Média da Equipe: <span className="font-semibold text-accent">{clickedData.media.toFixed(1)}/4.0</span></p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { setClickedIndex(null); setClickedData(null); }} className="p-1 h-auto">
          <X className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    );
  };

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
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization} disabled={availableSpecializations.length <= 1 || selectedCategory === 'all'}>
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
      
      <CustomPopover /> {/* Renderiza o balão customizado aqui */}

      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={chartData.data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={empty ? "hsl(var(--muted) / 0.2)" : "hsl(var(--border))"} />
          <XAxis 
            dataKey={chartData.dataKey} 
            tick={{ fontSize: 12 }} 
            stroke={empty ? "hsl(var(--muted) / 0.5)" : "hsl(var(--foreground))"}
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis 
            type="number" 
            domain={[0, 4]} 
            ticks={[0, 1, 2, 2.5, 3, 4]} 
            stroke={empty ? "hsl(var(--muted) / 0.5)" : "hsl(var(--foreground))"} 
          />
          {/* Removido o Tooltip do Recharts */}
          
          {/* Linha de referência no 2.5 usando --color-accent (Laranja) */}
          <ReferenceLine y={2.5} stroke="hsl(var(--color-accent))" strokeDasharray="4 4" />
          <Bar 
            dataKey="media" 
            barSize={40} 
            radius={[8, 8, 0, 0]} // Arredondamento no topo
            fillOpacity={0.7} // Opacidade padrão
          >
            {chartData.data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={
                  empty 
                    ? "hsl(var(--color-muted))" 
                    : index === clickedIndex 
                      ? COLOR_CLICKED // Laranja no clique
                      : entry.media > 0 
                        ? COLOR_DEFAULT // Azul padrão
                        : "hsl(var(--muted))"
                } 
                className="transition-all duration-200 cursor-pointer"
                onClick={() => handleBarClick(entry, index)} // Adiciona o manipulador de clique
              />
            ))}
            <LabelList 
              dataKey="media" 
              position="top" 
              formatter={(value: number) => (value > 0 ? value.toFixed(1) : '')} 
              fill={empty ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))"} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}