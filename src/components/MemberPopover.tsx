import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

const QUADRANT_LABELS: Record<string, string> = {
  M1: "Básico",
  M2: "Intermediário",
  M3: "Avançado",
  M4: "Expect",
};

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const MemberPopover: React.FC<MemberPopoverProps> = ({ member, position, onClose, onNavigate }) => {
  if (!member || !position || member.nivel_maturidade === 'N/A') return null;

  const maturityLabel = QUADRANT_LABELS[member.nivel_maturidade] || 'N/A';

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
      
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
            {getInitials(member.nome_liderado)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-base text-foreground">{member.nome_liderado}</p>
          <p className="text-xs text-muted-foreground">{member.cargo}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Maturidade</p>
          <Badge className="text-sm mt-0.5">{member.nivel_maturidade}</Badge>
          <p className="text-xs text-muted-foreground mt-0.5">{maturityLabel}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Hard Skills</p>
          <Badge className="text-sm mt-0.5">{member.eixo_x_tecnico_geral.toFixed(1)}</Badge>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Soft Skills</p>
          <Badge className="text-sm mt-0.5">{member.eixo_y_comportamental.toFixed(1)}</Badge>
        </div>
      </div>

      <Button onClick={onNavigate} className="w-full gap-2 mt-2">
        Ver mais <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};