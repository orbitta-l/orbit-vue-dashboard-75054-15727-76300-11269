import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Code, HeartHandshake } from 'lucide-react';
import { NivelMaturidade } from '@/types/mer';
import { cn } from '@/lib/utils'; // Importando cn para combinar classes

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
  // Alterado o tipo para aceitar string ou number
  position: { x: string | number; y: string | number };
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
  
  // Converte coordenadas para string CSS (adiciona 'px' se for número)
  const xPos = typeof position.x === 'number' ? `${position.x}px` : position.x;
  const yPos = typeof position.y === 'number' ? `${position.y}px` : position.y;

  // Se a posição for centralizada ('50%'), a seta não deve aparecer, pois não está ancorada a um ponto específico.
  const isCentered = xPos === '50%' && yPos === '50%';

  return (
    <div
      className="absolute z-20 p-4 bg-card rounded-lg shadow-2xl border w-60 flex flex-col animate-in fade-in-50 zoom-in-95"
      style={{
        left: xPos,
        top: yPos,
        // Se for centralizado, move 50% para cima e 50% para a esquerda (para centralizar o popover)
        // Se for ancorado a um ponto, move 50% para a esquerda, 100% para cima e mais 5px de offset.
        transform: isCentered 
          ? 'translate(-50%, -50%)' 
          : 'translate(-50%, -100%) translateY(-5px)', 
      }}
    >
      {/* Seta Conectora - Oculta se estiver centralizado */}
      {!isCentered && (
        <div 
          className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 translate-y-full"
          style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderTop: 'none',
          }}
        >
          {/* Borda da Seta (para simular a borda do popover) */}
          <div 
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              backgroundColor: 'hsl(var(--border))',
              transform: 'scale(1.1)',
              zIndex: -1,
            }}
          />
        </div>
      )}
      
      {/* Top Section: Profile & Maturity Level */}
      <div className="flex justify-between items-center pb-3 border-b border-border/50">
        {/* LEFT: Profile, Name, Cargo */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarFallback className="text-md bg-primary/10 text-primary font-semibold">
              {getInitials(member.nome_liderado)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center min-w-0">
            <p className="font-semibold text-base text-foreground leading-tight truncate">{member.nome_liderado}</p>
            <p className="text-xs text-muted-foreground opacity-80 leading-tight truncate">{member.cargo}</p>
          </div>
        </div>

        {/* RIGHT: Maturity Level (Colored) */}
        <div>
          <span 
            className="text-xl font-semibold leading-none"
            style={{ color: maturityColor }}
          >
            {member.nivel_maturidade}
          </span>
        </div>
      </div>

      {/* Middle Section: Hard/Soft Skills Scores */}
      <div className="flex flex-col pt-3 pb-4 space-y-1">
        
        {/* Técnico (Hard Skills) */}
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-foreground flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-muted-foreground" />
            Técnico
          </span>
          <span className="font-bold text-foreground">{member.eixo_x_tecnico_geral.toFixed(1)}<span className="text-xs text-muted-foreground font-normal">/4.0</span></span>
        </div>

        {/* Comportamental (Soft Skills) */}
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-foreground flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-muted-foreground" />
            Comportamental
          </span>
          <span className="font-bold text-foreground">{member.eixo_y_comportamental.toFixed(1)}<span className="text-xs text-muted-foreground font-normal">/4.0</span></span>
        </div>
      </div>

      {/* Bottom Section: Actions */}
      <div className="flex justify-between gap-2 pt-3 border-t border-border/50">
        {/* Botão Fechar (Ghost, Menor Largura, Mesma Altura) */}
        <Button 
          onClick={onClose} 
          variant="ghost" 
          size="sm" // Usando sm como base
          className={cn(
            "w-1/3 text-xs h-8 px-2", // Forçando h-8 e largura menor
            "text-muted-foreground hover:bg-muted/50"
          )}
        >
          Fechar
        </Button>
        
        {/* Botão Ver Perfil (Filled, Maior, Destaque) */}
        <Button 
          onClick={onNavigate} 
          className="flex-1 gap-1 h-8 text-sm font-semibold" // Mantendo h-8
        >
          Ver Perfil <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};