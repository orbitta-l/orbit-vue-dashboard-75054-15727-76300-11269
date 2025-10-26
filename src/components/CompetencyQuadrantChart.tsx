import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LideradoPerformance, NivelMaturidade } from "@/types/mer";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, ReferenceLine, Cell } from 'recharts';
import { Avatar, AvatarFallback } from "./ui/avatar";

interface CompetencyQuadrantChartProps {
  teamMembers: LideradoPerformance[];
  empty?: boolean;
}

const QUADRANT_COLORS: Record<NivelMaturidade, string> = {
  M1: "hsl(var(--color-accent))",
  M2: "hsl(var(--color-critical))",
  M3: "hsl(var(--color-mid))",
  M4: "hsl(var(--color-brand))",
};

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export default function CompetencyQuadrantChart({ teamMembers, empty = false }: CompetencyQuadrantChartProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const filteredMembers = teamMembers.filter((member) =>
    member.nome_liderado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const quadrantCounts = teamMembers.reduce((acc, member) => {
    acc[member.nivel_maturidade] = (acc[member.nivel_maturidade] || 0) + 1;
    return acc;
  }, {} as Record<NivelMaturidade, number>);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-card border rounded-md shadow-lg">
          <p className="font-bold">{data.nome_liderado}</p>
          <p className="text-sm text-muted-foreground">{data.cargo}</p>
          <p className="text-xs mt-1">Maturidade: <span className="font-semibold">{data.nivel_maturidade}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold text-foreground">Matriz de Competências</h3>
        <p className="text-sm text-muted-foreground mb-4">Distribuição da equipe por eixos técnico e comportamental</p>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={empty ? "hsl(var(--muted) / 0.2)" : "hsl(var(--border))"} />
            
            <XAxis type="number" dataKey="eixo_x_tecnico_geral" name="Técnico" domain={[1, 4]} ticks={[1, 2, 2.5, 3, 4]} stroke={empty ? "hsl(var(--muted) / 0.5)" : "hsl(var(--foreground))"}>
              <Label value="Competências Técnicas" offset={-25} position="insideBottom" />
            </XAxis>
            <YAxis type="number" dataKey="eixo_y_comportamental" name="Comportamental" domain={[1, 4]} ticks={[1, 2, 2.5, 3, 4]} stroke={empty ? "hsl(var(--muted) / 0.5)" : "hsl(var(--foreground))"}>
              <Label value="Competências Comportamentais" angle={-90} offset={-10} position="insideLeft" style={{ textAnchor: 'middle' }} />
            </YAxis>
            
            <ReferenceLine x={2.5} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <ReferenceLine y={2.5} stroke="hsl(var(--border))" strokeDasharray="3 3" />

            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <ZAxis type="number" dataKey="z" range={[100, 400]} name="size" />
            
            <Scatter data={filteredMembers} fill="hsl(var(--color-brand))">
              {filteredMembers.map((entry) => (
                <Cell 
                  key={`cell-${entry.id_liderado}`} 
                  fill={empty ? "hsl(var(--color-muted))" : QUADRANT_COLORS[entry.nivel_maturidade]}
                  opacity={selectedMemberId === null || selectedMemberId === entry.id_liderado ? 1 : 0.3}
                  className="transition-opacity"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Quadrantes</h4>
          <div className="grid grid-cols-2 gap-2 text-center">
            {(['M1', 'M2', 'M3', 'M4'] as NivelMaturidade[]).map(q => (
              <div key={q} className="p-2 rounded-md" style={{ backgroundColor: empty ? 'hsl(var(--muted) / 0.2)' : `${QUADRANT_COLORS[q]}20` }}>
                <p className="font-bold text-lg" style={{ color: empty ? 'hsl(var(--muted-foreground))' : QUADRANT_COLORS[q] }}>{quadrantCounts[q] || 0}</p>
                <p className="text-xs font-semibold" style={{ color: empty ? 'hsl(var(--muted-foreground))' : QUADRANT_COLORS[q] }}>{q}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar liderado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={empty}
            />
          </div>
          <div className="mt-2 max-h-60 overflow-y-auto space-y-1 pr-2">
            {filteredMembers.map(member => (
              <div 
                key={member.id_liderado}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${selectedMemberId === member.id_liderado ? 'bg-muted' : 'hover:bg-muted/50'}`}
                onMouseEnter={() => setSelectedMemberId(member.id_liderado)}
                onMouseLeave={() => setSelectedMemberId(null)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback style={{ backgroundColor: empty ? 'hsl(var(--muted))' : `${QUADRANT_COLORS[member.nivel_maturidade]}40`, color: empty ? 'hsl(var(--muted-foreground))' : QUADRANT_COLORS[member.nivel_maturidade] }}>
                    {getInitials(member.nome_liderado)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground truncate">{member.nome_liderado}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}