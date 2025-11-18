import { useState, useMemo, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, ReferenceArea, Cell } from 'recharts';
import { NivelMaturidade } from "@/types/mer";
import { Button } from "@/components/ui/button"; 
import { cn } from "@/lib/utils";

interface MemberData {
  id_liderado: string;
  nome_liderado: string;
  cargo: string;
  eixo_x_tecnico_geral: number;
  eixo_y_comportamental: number;
  nivel_maturidade: NivelMaturidade | 'N/A';
}

interface CompetencyQuadrantChartProps {
  teamMembers: MemberData[];
  empty?: boolean;
}

// Mapeamento de cores e rótulos (Atualizado para usar cores fracas)
const QUADRANT_COLORS: Record<NivelMaturidade | 'N/A', string> = {
  M1: "hsl(var(--color-m1-weak))",      // Vermelho Fraco
  M2: "hsl(var(--color-m2-weak))",      // Amarelo Fraco
  M3: "hsl(var(--primary-dark))",     // Azul Escuro
  M4: "hsl(var(--primary))",          // Azul Primário
  'N/A': "hsl(var(--muted-foreground) / 0.5)", // Não Avaliado
};

const QUADRANT_LABELS: Record<NivelMaturidade | 'N/A', string> = {
  M1: "Básico",
  M2: "Intermediário",
  M3: "Avançado",
  M4: "Expect",
  'N/A': "Não Avaliado",
};

// Helper para determinar a cor do texto do badge (preto ou branco)
const getTextColor = (maturity: NivelMaturidade | 'N/A') => {
    // M1 (Vermelho Fraco) e M2 (Amarelo Fraco) precisam de texto escuro para contraste
    if (maturity === 'M1' || maturity === 'M2') {
        return 'text-foreground'; 
    }
    // M3 (Azul Escuro) e M4 (Azul Primário) usam texto branco
    return 'text-white';
};

// Helper para determinar a cor do texto da CONTAGEM
const getCountTextColor = (maturity: NivelMaturidade | 'N/A') => {
    // M1 e M2 usam texto escuro
    if (maturity === 'M1' || maturity === 'M2') {
        return 'text-foreground'; 
    }
    // Outros quadrantes (M3, M4) têm fundos escuros, então usamos branco
    return 'text-white';
};

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

// Custom Hook for debouncing
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function CompetencyQuadrantChart({ teamMembers, empty = false }: CompetencyQuadrantChartProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const listRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredMembers = useMemo(() => 
    teamMembers.filter(member =>
      member.nome_liderado.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      member.cargo.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ), [teamMembers, debouncedSearchTerm]);

  const quadrantCounts = useMemo(() => {
    return filteredMembers.reduce((acc, member) => {
      const key = member.nivel_maturidade;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<NivelMaturidade | 'N/A', number>);
  }, [filteredMembers]);

  useEffect(() => {
    if (selectedMemberId && listRefs.current[selectedMemberId]) {
      listRefs.current[selectedMemberId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedMemberId]);

  const handlePointClick = (data: any) => {
    setSelectedMemberId(data.id_liderado);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const maturidadeLabel = QUADRANT_LABELS[data.nivel_maturidade as NivelMaturidade | 'N/A'] || 'N/A';
      const maturidadeColor = QUADRANT_COLORS[data.nivel_maturidade as NivelMaturidade | 'N/A'] || 'hsl(var(--foreground))';
      
      return (
        <div className="p-3 bg-card border rounded-lg shadow-lg text-sm">
          <p className="font-bold text-foreground">{data.nome_liderado}</p>
          <p className="text-muted-foreground">{data.cargo}</p>
          <p className="text-xs mt-2 pt-2 border-t">
            Maturidade: <span className="font-semibold" style={{ color: maturidadeColor }}>{maturidadeLabel} ({data.nivel_maturidade})</span>
          </p>
          <p className="text-xs">Comportamental: {data.eixo_y_comportamental.toFixed(1)} | Técnico: {data.eixo_x_tecnico_geral.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  // Definindo o ponto central para 2.5 (Padrão MER 4.0)
  const CENTER_POINT = 2.5;

  return (
    <Card className="p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        <div className="md:col-span-7">
          <h3 className="text-lg font-semibold text-foreground">Matriz de Maturidade</h3>
          <p className="text-sm text-muted-foreground mb-4">Posicionamento do time com base na média de desempenho técnico vs. comportamental.</p>
          
          <div className="relative w-full h-[480px]">
            {empty && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-lg z-10">
                <p className="text-muted-foreground text-center">
                  Sem avaliações ainda.<br/>Faça a primeira avaliação para popular este gráfico.
                </p>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 50, right: 50, bottom: 50, left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="eixo_y_comportamental" 
                  name="Comportamental" 
                  domain={[1, 4]} 
                  ticks={[1, 2, CENTER_POINT, 3, 4]} // Usando CENTER_POINT
                  label={{ 
                    value: "Média Comportamental (SOFT)", 
                    position: 'insideBottom', 
                    offset: -5, 
                    fill: 'hsl(var(--foreground))',
                    style: { fontSize: '16px', fontWeight: 600 }
                  }}
                  stroke="hsl(var(--foreground))"
                />
                <YAxis 
                  type="number" 
                  dataKey="eixo_x_tecnico_geral" 
                  name="Técnico" 
                  domain={[1, 4]} 
                  ticks={[1, 2, CENTER_POINT, 3, 4]} // Usando CENTER_POINT
                  label={{ 
                    value: "Média Técnica (HARD)", 
                    angle: -90, 
                    position: 'insideLeft', 
                    offset: -5, 
                    fill: 'hsl(var(--foreground))',
                    style: { fontSize: '16px', fontWeight: 600 }
                  }}
                  stroke="hsl(var(--foreground))"
                />
                
                {/* Linhas centrais destacadas no 2.5 */}
                <ReferenceLine x={CENTER_POINT} stroke="hsl(var(--foreground))" strokeDasharray="4 4" strokeWidth={3} opacity={0.8} />
                <ReferenceLine y={CENTER_POINT} stroke="hsl(var(--foreground))" strokeDasharray="4 4" strokeWidth={3} opacity={0.8} />

                {/* M1: Básico (Inferior Esquerdo) - X: 1-2.5, Y: 1-2.5 */}
                <ReferenceArea x1={1} x2={CENTER_POINT} y1={1} y2={CENTER_POINT} fill={QUADRANT_COLORS.M1 as string} fillOpacity={0.2} />
                
                {/* M2: Intermediário (Inferior Direito) - X: 2.5-4, Y: 1-2.5 */}
                <ReferenceArea x1={CENTER_POINT} x2={4} y1={1} y2={CENTER_POINT} fill={QUADRANT_COLORS.M2 as string} fillOpacity={0.2} />
                
                {/* M3: Avançado (Superior Esquerdo) - X: 1-2.5, Y: 2.5-4 */}
                <ReferenceArea x1={1} x2={CENTER_POINT} y1={CENTER_POINT} y2={4} fill={QUADRANT_COLORS.M3 as string} fillOpacity={0.2} />
                
                {/* M4: Expect (Superior Direito) - X: 2.5-4, Y: 2.5-4 */}
                <ReferenceArea x1={CENTER_POINT} x2={4} y1={CENTER_POINT} y2={4} fill={QUADRANT_COLORS.M4 as string} fillOpacity={0.2} />

                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                
                {!empty && (
                  <Scatter name="Liderados" data={filteredMembers} onClick={handlePointClick}>
                    {filteredMembers.map((entry) => (
                      <Cell 
                        key={`cell-${entry.id_liderado}`} 
                        fill={QUADRANT_COLORS[entry.nivel_maturidade as NivelMaturidade]}
                        stroke="#fff"
                        strokeWidth={selectedMemberId === entry.id_liderado ? 3 : 1}
                        className="transition-all duration-300"
                      />
                    ))}
                  </Scatter>
                )}
              </ScatterChart>
            </ResponsiveContainer>
            
            {/* Rótulos dos Quadrantes - Corrigindo a posição dos rótulos M3 e M4 */}
            
            {/* M4: Expect (Superior Direito) */}
            <div className="absolute top-0 right-0 translate-x-[10px] translate-y-[-10px] text-center">
              <div className={cn("px-3 py-1 rounded-md font-semibold text-sm", getTextColor('M4'))} style={{ backgroundColor: QUADRANT_COLORS.M4 }}>
                {QUADRANT_LABELS.M4} <span className={cn("ml-1 font-bold", getCountTextColor('M4'))}>{quadrantCounts.M4 || 0}</span>
              </div>
            </div>
            
            {/* M3: Avançado (Superior Esquerdo) */}
            <div className="absolute top-0 left-0 translate-x-[-10px] translate-y-[-10px] text-center">
              <div className={cn("px-3 py-1 rounded-md font-semibold text-sm", getTextColor('M3'))} style={{ backgroundColor: QUADRANT_COLORS.M3 }}>
                {QUADRANT_LABELS.M3} <span className={cn("ml-1 font-bold", getCountTextColor('M3'))}>{quadrantCounts.M3 || 0}</span>
              </div>
            </div>
            
            {/* M1: Básico (Inferior Esquerdo) - Mantido */}
            <div className="absolute bottom-0 left-0 translate-x-[-10px] translate-y-[10px] text-center">
              <div className={cn("px-3 py-1 rounded-md font-semibold text-sm", getTextColor('M1'))} style={{ backgroundColor: QUADRANT_COLORS.M1 }}>
                {QUADRANT_LABELS.M1} <span className={cn("ml-1 font-bold", getCountTextColor('M1'))}>{quadrantCounts.M1 || 0}</span>
              </div>
            </div>
            
            {/* M2: Intermediário (Inferior Direito) - Mantido */}
            <div className="absolute bottom-0 right-0 translate-x-[10px] translate-y-[10px] text-center">
              <div className={cn("px-3 py-1 rounded-md font-semibold text-sm", getTextColor('M2'))} style={{ backgroundColor: QUADRANT_COLORS.M2 }}>
                {QUADRANT_LABELS.M2} <span className={cn("ml-1 font-bold", getCountTextColor('M2'))}>{quadrantCounts.M2 || 0}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3 space-y-4 flex flex-col">
          <div className="flex flex-col flex-1 min-h-0">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 pr-2">
              {filteredMembers.map(member => (
                <div 
                  key={member.id_liderado}
                  ref={(el) => (listRefs.current[member.id_liderado] = el)}
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${selectedMemberId === member.id_liderado ? 'bg-muted' : 'hover:bg-muted/50'}`}
                  onClick={() => setSelectedMemberId(member.id_liderado)}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback style={{ backgroundColor: `${QUADRANT_COLORS[member.nivel_maturidade as NivelMaturidade]}40`, color: QUADRANT_COLORS[member.nivel_maturidade as NivelMaturidade] }}>
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
      </Card>
    );
}