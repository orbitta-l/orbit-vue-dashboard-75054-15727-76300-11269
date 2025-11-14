import { useState, useMemo, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, ReferenceArea } from 'recharts';
import { NivelMaturidade } from "@/types/mer";
import { Button } from "@/components/ui/button"; 
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { MemberPopover } from "@/components/MemberPopover";

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

const QUADRANT_COLORS: Record<NivelMaturidade, string> = {
  M1: "hsl(var(--destructive))",
  M2: "hsl(var(--accent))",
  M3: "hsl(var(--primary-dark))",
  M4: "hsl(var(--primary))",
};

const QUADRANT_LABELS: Record<NivelMaturidade, string> = {
  M1: "Básico",
  M2: "Intermediário",
  M3: "Avançado",
  M4: "Expect",
};

const getTextColor = (maturity: NivelMaturidade) => 'text-white';
const getCountTextColor = (maturity: NivelMaturidade) => 'text-white';
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const CustomDot = (props: any) => {
  const { cx, cy, payload, selectedMemberId } = props;
  if (!payload.nivel_maturidade || payload.nivel_maturidade === 'N/A') return null;
  
  const isSelected = payload.id_liderado === selectedMemberId;
  const color = QUADRANT_COLORS[payload.nivel_maturidade as NivelMaturidade];
  const radius = isSelected ? 8 : 6; // Aumenta o raio quando selecionado

  return (
    <g filter={isSelected ? "url(#white-glow)" : undefined}>
      <circle
        cx={cx}
        cy={cy}
        r={radius} // Raio dinâmico
        fill={color}
        stroke={color}
        strokeWidth={isSelected ? 2 : 1} // Aumenta o stroke para 2 quando selecionado
        style={{ transition: 'all 0.5s ease', cursor: 'pointer' }} // Transição mais suave e longa
      />
    </g>
  );
};

export default function MaturityQuadrantChart({ teamMembers, empty = false }: CompetencyQuadrantChartProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  // Alterado o tipo para aceitar string (para porcentagens)
  const [selectedPointPosition, setSelectedPointPosition] = useState<{ x: string | number; y: string | number } | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const listRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navigate = useNavigate();

  const evaluatedMembers = useMemo(() => teamMembers.filter(member => member.nivel_maturidade !== 'N/A'), [teamMembers]);
  const filteredMembers = useMemo(() => evaluatedMembers.filter(member => member.nome_liderado.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || member.cargo.toLowerCase().includes(debouncedSearchTerm.toLowerCase())), [evaluatedMembers, debouncedSearchTerm]);
  const quadrantCounts = useMemo(() => filteredMembers.reduce((acc, member) => {
    const key = member.nivel_maturidade;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<NivelMaturidade, number>), [filteredMembers]);

  useEffect(() => {
    if (selectedMemberId && listRefs.current[selectedMemberId]) {
      listRefs.current[selectedMemberId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedMemberId]);

  const handlePointClick = (data: any) => {
    const { id_liderado, cx, cy } = data;
    if (selectedMemberId === id_liderado) {
      setSelectedMemberId(null);
      setSelectedPointPosition(null);
    } else {
      setSelectedMemberId(id_liderado);
      setSelectedPointPosition({ x: cx, y: cy });
    }
  };

  const handleListClick = (memberId: string) => {
    if (selectedMemberId === memberId) {
      setSelectedMemberId(null);
      setSelectedPointPosition(null);
    } else {
      setSelectedMemberId(memberId);
      // Posição de fallback: 5% da largura (margem esquerda) e 50% da altura (centro vertical)
      setSelectedPointPosition({ x: '5%', y: '50%' }); 
    }
  };

  const selectedMemberData = useMemo(() => {
    if (!selectedMemberId) return null;
    return filteredMembers.find(m => m.id_liderado === selectedMemberId);
  }, [selectedMemberId, filteredMembers]);

  const CENTER_POINT = 2.5;
  const hasEvaluatedMembers = evaluatedMembers.length > 0;
  const labelStyle = { fontSize: '14px', fontWeight: 600, fill: 'hsl(var(--muted-foreground) / 0.8)' };
  const tickStyle = { fill: 'hsl(var(--foreground) / 0.6)', fontSize: '12px' };

  return (
    <Card className="p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        <div className="md:col-span-7">
          <h3 className="text-lg font-semibold text-foreground">Matriz de Competências</h3>
          <p className="text-sm text-muted-foreground mb-8">Posicionamento do time com base na média de desempenho técnico vs. comportamental.</p>
          
          <div className="relative w-full h-[480px]">
            {/* Renderiza o popover APENAS se houver um ponto selecionado (cx, cy) */}
            {selectedMemberData && selectedPointPosition && (
              <MemberPopover
                member={selectedMemberData}
                position={selectedPointPosition}
                onClose={() => { setSelectedMemberId(null); setSelectedPointPosition(null); }}
                onNavigate={() => navigate(`/team/${selectedMemberId}`)}
              />
            )}

            {empty || !hasEvaluatedMembers ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-lg z-10">
                <p className="text-muted-foreground text-center">Sem avaliações ainda.<br/>Faça a primeira avaliação para popular este gráfico.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 40, right: 20, bottom: 40, left: 20 }}>
                  <defs>
                    {/* DEFINIÇÃO DO FILTRO SVG RESTAURADA */}
                    <filter id="white-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="white" floodOpacity="1" />
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="eixo_y_comportamental" name="Comportamental" domain={[1, 4]} ticks={[1, 2, CENTER_POINT, 3, 4]} label={{ value: "Soft Skills", position: 'bottom', offset: 30, style: labelStyle }} stroke="hsl(var(--foreground))" tick={tickStyle} />
                  <YAxis type="number" dataKey="eixo_x_tecnico_geral" name="Técnico" domain={[1, 4]} ticks={[1, 2, CENTER_POINT, 3, 4]} label={{ value: "Hard Skills", angle: -90, position: 'left', offset: -10, style: labelStyle }} stroke="hsl(var(--foreground))" tick={tickStyle} />
                  <ReferenceLine x={CENTER_POINT} stroke="hsl(var(--foreground))" strokeDasharray="4 4" strokeWidth={3} opacity={0.8} />
                  <ReferenceLine y={CENTER_POINT} stroke="hsl(var(--foreground))" strokeDasharray="4 4" strokeWidth={3} opacity={0.8} />
                  <ReferenceArea x1={1} x2={CENTER_POINT} y1={1} y2={CENTER_POINT} fill={QUADRANT_COLORS.M1} fillOpacity={0.2} />
                  <ReferenceArea x1={CENTER_POINT} x2={4} y1={1} y2={CENTER_POINT} fill={QUADRANT_COLORS.M2} fillOpacity={0.2} />
                  <ReferenceArea x1={CENTER_POINT} x2={4} y1={CENTER_POINT} y2={4} fill={QUADRANT_COLORS.M3} fillOpacity={0.2} />
                  <ReferenceArea x1={1} x2={CENTER_POINT} y1={CENTER_POINT} y2={4} fill={QUADRANT_COLORS.M4} fillOpacity={0.2} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={() => null} />
                  <Scatter name="Liderados" data={filteredMembers} onClick={handlePointClick} shape={<CustomDot selectedMemberId={selectedMemberId} />} />
                </ScatterChart>
              </ResponsiveContainer>
            )}
            
            {/* Rótulos dos Quadrantes - Ajustados para ficarem mais próximos */}
            <div className="absolute top-0 left-0 -translate-x-2 -translate-y-6 text-center"><div className={cn("px-2 py-0.5 rounded-md font-semibold text-xs", getTextColor('M4'))} style={{ backgroundColor: QUADRANT_COLORS.M4 }}>{QUADRANT_LABELS.M4} <span className={cn("ml-1 font-bold", getCountTextColor('M4'))}>{quadrantCounts.M4 || 0}</span></div></div>
            <div className="absolute top-0 right-0 translate-x-2 -translate-y-6 text-center"><div className={cn("px-2 py-0.5 rounded-md font-semibold text-xs", getTextColor('M3'))} style={{ backgroundColor: QUADRANT_COLORS.M3 }}>{QUADRANT_LABELS.M3} <span className={cn("ml-1 font-bold", getCountTextColor('M3'))}>{quadrantCounts.M3 || 0}</span></div></div>
            <div className="absolute bottom-0 left-0 -translate-x-2 translate-y-2 text-center"><div className={cn("px-2 py-0.5 rounded-md font-semibold text-xs", getTextColor('M1'))} style={{ backgroundColor: QUADRANT_COLORS.M1 }}>{QUADRANT_LABELS.M1} <span className={cn("ml-1 font-bold", getCountTextColor('M1'))}>{quadrantCounts.M1 || 0}</span></div></div>
            <div className="absolute bottom-0 right-0 translate-x-2 translate-y-2 text-center"><div className={cn("px-2 py-0.5 rounded-md font-semibold text-xs", getTextColor('M2'))} style={{ backgroundColor: QUADRANT_COLORS.M2 }}>{QUADRANT_LABELS.M2} <span className="ml-1 font-bold" style={{ color: 'white' }}>{quadrantCounts.M2 || 0}</span></div></div>
          </div>
        </div>
        
        <div className="md:col-span-3 space-y-4 flex flex-col h-[400px]">
          <div className="flex flex-col flex-1 min-h-0">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou cargo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              {searchTerm && <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent" onClick={() => setSearchTerm("")}><X className="w-4 h-4 text-muted-foreground" /></Button>}
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 pr-2">
              {filteredMembers.map(member => (
                <div key={member.id_liderado} ref={(el) => (listRefs.current[member.id_liderado] = el)} className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${selectedMemberId === member.id_liderado ? 'bg-muted' : 'hover:bg-muted/50'}`} onClick={() => handleListClick(member.id_liderado)}>
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="text-sm bg-primary/10 text-primary font-semibold">
                      {getInitials(member.nome_liderado)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{member.nome_liderado}</p><p className="text-xs text-muted-foreground truncate">{member.cargo}</p></div>
                </div>
              ))}
               {filteredMembers.length === 0 && !empty && <p className="text-sm text-muted-foreground text-center py-4">Nenhum resultado.</p>}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}