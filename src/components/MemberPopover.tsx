import React, { useMemo } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, TrendingUp, TrendingDown, Brain, HeartHandshake } from 'lucide-react';
import { LideradoDashboard } from '@/types/mer';
import { getGapColorClass } from '@/utils/colorUtils';

interface MemberPopoverProps {
  member: LideradoDashboard;
  position: { x: number; y: number };
  onClose: () => void;
  onNavigate: () => void;
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const MemberPopover: React.FC<MemberPopoverProps> = ({ member, position, onClose, onNavigate }) => {
  const { bestCompetency, worstCompetency } = useMemo(() => {
    if (!member.competencias || member.competencias.length === 0) {
      return { bestCompetency: null, worstCompetency: null };
    }
    const sorted = [...member.competencias].sort((a, b) => a.pontuacao_1a4 - b.pontuacao_1a4);
    return {
      worstCompetency: sorted[0],
      bestCompetency: sorted[sorted.length - 1],
    };
  }, [member.competencias]);

  if (!member || !position || member.ultima_avaliacao?.maturidade_quadrante === 'N/A') return null;

  return (
    <div
      className="absolute z-20 p-3 bg-card rounded-lg shadow-2xl border w-72 flex flex-col gap-3 animate-in fade-in-50 zoom-in-95"
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

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-t pt-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary/80" />
          <span className="text-muted-foreground">Hard Skills:</span>
          <span className="font-semibold text-foreground">{member.ultima_avaliacao.media_tecnica_1a4.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-accent/80" />
          <span className="text-muted-foreground">Soft Skills:</span>
          <span className="font-semibold text-foreground">{member.ultima_avaliacao.media_comportamental_1a4.toFixed(1)}</span>
        </div>
        {bestCompetency && (
          <div className="flex items-center gap-2 col-span-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground truncate">Destaque:</span>
            <span className={`font-semibold text-foreground truncate ${getGapColorClass(bestCompetency.pontuacao_1a4)}`}>{bestCompetency.nome_competencia}</span>
          </div>
        )}
        {worstCompetency && (
          <div className="flex items-center gap-2 col-span-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-muted-foreground truncate">A melhorar:</span>
            <span className={`font-semibold text-foreground truncate ${getGapColorClass(worstCompetency.pontuacao_1a4)}`}>{worstCompetency.nome_competencia}</span>
          </div>
        )}
      </div>

      <Button onClick={onNavigate} size="sm" className="w-full gap-2 mt-1">
        Ver Perfil Completo <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};