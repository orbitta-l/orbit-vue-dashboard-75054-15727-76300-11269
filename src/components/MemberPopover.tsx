import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { LideradoDashboard } from '@/types/mer';
import { getGapColorClass } from '@/utils/colorUtils';

interface CompetencyInfo {
  nome_competencia: string;
  pontuacao_1a4: number;
}

interface MemberPopoverProps {
  member: LideradoDashboard;
  competencyAnalysis: {
    best: CompetencyInfo | null;
    worst: CompetencyInfo | null;
  };
  position: { x: number; y: number };
  onClose: () => void;
  onNavigate: () => void;
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const MemberPopover: React.FC<MemberPopoverProps> = ({ member, competencyAnalysis, position, onClose, onNavigate }) => {
  if (!member || !position || !member.ultima_avaliacao) return null;

  return (
    <div
      className="absolute z-20 p-3 bg-card rounded-lg shadow-2xl border w-72 flex flex-col gap-2 animate-in fade-in-50 zoom-in-95"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-20px)',
      }}
    >
      <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
            {getInitials(member.nome)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base text-foreground truncate">{member.nome}</p>
          <p className="text-xs text-muted-foreground truncate">{member.cargo_nome}</p>
        </div>
        <Badge className="text-sm">{member.ultima_avaliacao.maturidade_quadrante}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center border-t pt-2">
        <div>
          <p className="text-xs text-muted-foreground">Soft Skills</p>
          <p className="font-semibold text-sm">{member.ultima_avaliacao.media_comportamental_1a4.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Hard Skills</p>
          <p className="font-semibold text-sm">{member.ultima_avaliacao.media_tecnica_1a4.toFixed(1)}</p>
        </div>
      </div>

      {competencyAnalysis.best && competencyAnalysis.worst && (
        <div className="space-y-1 border-t pt-2 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">Melhor:</span>
            <span className={`font-semibold truncate ${getGapColorClass(competencyAnalysis.best.pontuacao_1a4)}`}>
              {competencyAnalysis.best.nome_competencia} ({competencyAnalysis.best.pontuacao_1a4.toFixed(1)})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-muted-foreground">A melhorar:</span>
            <span className={`font-semibold truncate ${getGapColorClass(competencyAnalysis.worst.pontuacao_1a4)}`}>
              {competencyAnalysis.worst.nome_competencia} ({competencyAnalysis.worst.pontuacao_1a4.toFixed(1)})
            </span>
          </div>
        </div>
      )}

      <Button onClick={onNavigate} size="sm" className="w-full gap-2 mt-1">
        Ver Perfil Completo <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};