import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';
import { NivelMaturidade } from '@/types/mer';

interface MemberData {
  id_liderado: string;
  nome_liderado: string;
  cargo: string;
  eixo_x_tecnico_geral: number; // Hard Skills
  eixo_y_comportamental: number; // Soft Skills
  nivel_maturidade: NivelMaturidade | 'N/A';
}

interface MemberPopoverProps {
  member: MemberData;
  position: { x: number; y: number };
  onClose: () => void;
  onNavigate: () => void;
}

const QUADRANT_COLORS: Record<NivelMaturidade, string> = {
  M1: "hsl(var(--destructive))",
  M2: "hsl(var(--accent))",
  M3: "hsl(var(--primary-dark))",
  M4: "hsl(var(--primary))",
};

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const MemberPopover: React.FC<MemberPopoverProps> = ({ member, position, onClose, onNavigate }) => {
  if (!member || !position || member.nivel_maturidade === 'N/A') return null;

  const maturityColor = QUADRANT_COLORS[member.nivel_maturidade];

  return (
    <div
      className="absolute z-20 p-3 bg-card rounded-lg shadow-2xl border w-64 flex flex-col gap-2 animate-in fade-in-50 zoom-in-95"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-15px)', // Posiciona acima do ponto
      }}
    >
      <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
      
      {/* Top Section: Profile & Maturity Level */}
      <div className="flex justify-between items-start pt-1 pb-2">
        {/* LEFT: Profile, Name, Cargo */}
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarFallback className="text-md bg-primary/10 text-primary font-semibold">
              {getInitials(member.nome_liderado)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center min-w-0 pt-0.5">
            <p className="font-semibold text-base text-foreground leading-tight truncate">{member.nome_liderado}</p>
            <p className="text-xs text-muted-foreground opacity-80 leading-tight truncate">{member.cargo}</p>
          </div>
        </div>

        {/* RIGHT: Maturity Level (Colored) */}
        <div className="flex flex-col items-end justify-center h-full">
          <span 
            className="text-xl font-medium leading-none"
            style={{ color: maturityColor }}
          >
            {member.nivel_maturidade}
          </span>
        </div>
      </div>

      {/* Middle Section: Hard/Soft Skills Scores (Compact and Neutral) */}
      <div className="flex flex-col gap-1 border-t border-border pt-2 pb-1">
        
        {/* Técnico (Hard Skills) */}
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-foreground">Técnico</span>
          <span className="font-bold text-foreground">{member.eixo_x_tecnico_geral.toFixed(1)}<span className="text-xs text-muted-foreground font-normal">/4.0</span></span>
        </div>

        {/* Comportamental (Soft Skills) */}
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-foreground">Comportamental</span>
          <span className="font-bold text-foreground">{member.eixo_y_comportamental.toFixed(1)}<span className="text-xs text-muted-foreground font-normal">/4.0</span></span>
        </div>
      </div>

      {/* Navigation Button */}
      <Button onClick={onNavigate} className="w-full gap-2 mt-1 h-8 text-sm">
        Ver Perfil <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};