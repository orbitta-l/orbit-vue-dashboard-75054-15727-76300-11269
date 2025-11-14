import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { NivelMaturidade, LideradoDashboard } from '@/types/mer'; // Importa LideradoDashboard
import { getGapColorClass } from '@/utils/colorUtils'; // Importa utilitário de cor

interface MemberPopoverProps {
  member: LideradoDashboard; // Agora recebe o objeto LideradoDashboard completo
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
  if (!member || !position || !member.ultima_avaliacao || member.ultima_avaliacao.maturidade_quadrante === 'N/A') return null;

  const maturityLabel = QUADRANT_LABELS[member.ultima_avaliacao.maturidade_quadrante] || 'N/A';

  // Encontrar a melhor e a pior competência
  const evaluatedCompetencies = member.competencias.filter(c => c.pontuacao_1a4 > 0);
  const bestCompetency = evaluatedCompetencies.reduce((prev, current) => (prev.pontuacao_1a4 > current.pontuacao_1a4 ? prev : current), evaluatedCompetencies[0]);
  const worstCompetency = evaluatedCompetencies.reduce((prev, current) => (prev.pontuacao_1a4 < current.pontuacao_1a4 ? prev : current), evaluatedCompetencies[0]);

  return (
    <div
      className="absolute z-20 p-3 bg-card rounded-lg shadow-2xl border w-64 flex flex-col gap-2 animate-in fade-in-50 zoom-in-95" // w-64 para ser mais compacto
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-15px)', // Posiciona acima do ponto, ajuste de Y
      }}
    >
      <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-3 mb-1">
        <Avatar className="w-12 h-12"> {/* Avatar um pouco menor */}
          <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
            {getInitials(member.nome)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-bold text-base text-foreground leading-tight">{member.nome}</p> {/* Nome em destaque */}
          <p className="text-xs text-muted-foreground leading-tight">{member.cargo_nome}</p> {/* Cargo menor */}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm mb-1">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Maturidade</p>
          <Badge className="text-sm mt-1">{member.ultima_avaliacao.maturidade_quadrante}</Badge>
          <p className="text-xs text-muted-foreground mt-1">{maturityLabel}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Hard Skills</p>
          <Badge className={`text-sm mt-1 ${getGapColorClass(member.ultima_avaliacao.media_tecnica_1a4)}`}>
            {member.ultima_avaliacao.media_tecnica_1a4.toFixed(1)}
          </Badge>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Soft Skills</p>
          <Badge className={`text-sm mt-1 ${getGapColorClass(member.ultima_avaliacao.media_comportamental_1a4)}`}>
            {member.ultima_avaliacao.media_comportamental_1a4.toFixed(1)}
          </Badge>
        </div>
      </div>

      {evaluatedCompetencies.length > 0 && (
        <div className="space-y-1 text-xs">
          {bestCompetency && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-good" />
              <span className="font-medium text-foreground">Melhor:</span>
              <span className={`truncate ${getGapColorClass(bestCompetency.pontuacao_1a4)}`}>
                {bestCompetency.nome_competencia} ({bestCompetency.pontuacao_1a4.toFixed(1)})
              </span>
            </div>
          )}
          {worstCompetency && (
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-destructive" />
              <span className="font-medium text-foreground">Pior:</span>
              <span className={`truncate ${getGapColorClass(worstCompetency.pontuacao_1a4)}`}>
                {worstCompetency.nome_competencia} ({worstCompetency.pontuacao_1a4.toFixed(1)})
              </span>
            </div>
          )}
        </div>
      )}

      <Button onClick={onNavigate} className="w-full gap-2 mt-2">
        Ver mais <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};