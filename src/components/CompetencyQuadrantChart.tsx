import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { NivelMaturidade } from "@/types/mer";

interface MemberData {
  id_liderado: string;
  nome_liderado: string;
  cargo: string;
  eixo_x_tecnico_geral: number;
  eixo_y_comportamental: number;
  nivel_maturidade: NivelMaturidade;
}

interface CompetencyQuadrantChartProps {
  teamMembers: MemberData[];
  empty?: boolean;
}

const QUADRANT_COLORS: Record<NivelMaturidade, string> = {
  M1: "hsl(var(--chart-2))", // Baixo T, Baixo C
  M2: "hsl(var(--chart-1))", // Baixo T, Alto C
  M3: "hsl(var(--chart-3))", // Alto T, Baixo C
  M4: "hsl(var(--chart-4))", // Alto T, Alto C
};

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export default function CompetencyQuadrantChart({ teamMembers, empty = false }: CompetencyQuadrantChartProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const filteredMembers = useMemo(() => 
    teamMembers.filter(member =>
      member.nome_liderado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    ), [teamMembers, searchTerm]);

  const radarData = useMemo(() => {
    const axes = [
      { axis: 'Alto Comportamental' },
      { axis: 'Alto Técnico' },
      { axis: 'Baixo Comportamental' },
      { axis: 'Baixo Técnico' },
    ];

    const populatedData = axes.map(ax => {
      const dataPoint: { axis: string; [key: string]: any } = { axis: ax.axis };
      teamMembers.forEach(member => {
        const techScore = member.eixo_x_tecnico_geral;
        const softScore = member.eixo_y_comportamental;
        
        // A pontuação "baixa" é o inverso da "alta" na escala de 1-4. (5 - score)
        switch (ax.axis) {
          case 'Alto Comportamental': dataPoint[member.id_liderado] = softScore; break;
          case 'Alto Técnico': dataPoint[member.id_liderado] = techScore; break;
          case 'Baixo Comportamental': dataPoint[member.id_liderado] = 5 - softScore; break;
          case 'Baixo Técnico': dataPoint[member.id_liderado] = 5 - techScore; break;
        }
      });
      return dataPoint;
    });
    return populatedData;
  }, [teamMembers]);

  const quadrantCounts = useMemo(() => {
    return teamMembers.reduce((acc, member) => {
      acc[member.nivel_maturidade] = (acc[member.nivel_maturidade] || 0) + 1;
      return acc;
    }, {} as Record<NivelMaturidade, number>);
  }, [teamMembers]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const memberId = payload[0].dataKey;
      const member = teamMembers.find(m => m.id_liderado === memberId);
      if (!member) return null;
      
      return (
        <div className="p-3 bg-card border rounded-lg shadow-lg">
          <p className="font-bold text-foreground">{member.nome_liderado}</p>
          <p className="text-sm text-muted-foreground">{member.cargo}</p>
          <p className="text-xs mt-2 pt-2 border-t">
            Maturidade: <span className="font-semibold" style={{ color: QUADRANT_COLORS[member.nivel_maturidade] }}>{member.nivel_maturidade}</span>
          </p>
          <p className="text-xs">Técnico: {member.eixo_x_tecnico_geral.toFixed(1)} | Comportamental: {member.eixo_y_comportamental.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-foreground">Bússola de Competências</h3>
          <p className="text-sm text-muted-foreground mb-4">Distribuição da equipe por perfil técnico e comportamental</p>
          
          {empty ? (
            <div className="h-[400px] flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Faça a primeira avaliação para popular este gráfico.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={45} domain={[1, 4]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<CustomTooltip />} />
                
                {filteredMembers.map((member) => (
                  <Radar
                    key={member.id_liderado}
                    name={member.nome_liderado}
                    dataKey={member.id_liderado}
                    stroke={QUADRANT_COLORS[member.nivel_maturidade]}
                    fill={QUADRANT_COLORS[member.nivel_maturidade]}
                    fillOpacity={selectedMemberId === null ? 0.3 : (selectedMemberId === member.id_liderado ? 0.7 : 0.1)}
                    strokeWidth={selectedMemberId === member.id_liderado ? 3 : 1.5}
                    className="transition-all duration-300"
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="space-y-4 flex flex-col">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Quadrantes</h4>
            <div className="grid grid-cols-2 gap-2 text-center">
              {(['M2', 'M4', 'M1', 'M3'] as NivelMaturidade[]).map(q => (
                <div key={q} className="p-2 rounded-md" style={{ backgroundColor: `${QUADRANT_COLORS[q]}20` }}>
                  <p className="font-bold text-lg" style={{ color: QUADRANT_COLORS[q] }}>{quadrantCounts[q] || 0}</p>
                  <p className="text-xs font-semibold" style={{ color: QUADRANT_COLORS[q] }}>{q}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col flex-1 min-h-0">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={empty}
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 pr-2">
              {filteredMembers.map(member => (
                <div 
                  key={member.id_liderado}
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${selectedMemberId === member.id_liderado ? 'bg-muted' : 'hover:bg-muted/50'}`}
                  onMouseEnter={() => setSelectedMemberId(member.id_liderado)}
                  onMouseLeave={() => setSelectedMemberId(null)}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback style={{ backgroundColor: `${QUADRANT_COLORS[member.nivel_maturidade]}40`, color: QUADRANT_COLORS[member.nivel_maturidade] }}>
                      {getInitials(member.nome_liderado)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{member.nome_liderado}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.cargo}</p>
                  </div>
                </div>
              ))}
               {filteredMembers.length === 0 && !empty && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum resultado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}