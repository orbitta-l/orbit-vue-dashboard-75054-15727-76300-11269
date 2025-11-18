import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Code, HeartHandshake, TrendingDown, TrendingUp } from "lucide-react";
import { LideradoDashboard } from "@/types/mer";
import { getGapColor, getGapColorClass } from "@/utils/colorUtils";

interface KnowledgeGapsSectionProps {
  teamMembers: LideradoDashboard[];
  empty?: boolean;
}

const DISPLAY_LIMIT = 3;

export default function KnowledgeGapsSection({ teamMembers, empty = false }: KnowledgeGapsSectionProps) {
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  if (empty) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-1 text-foreground">Gaps de Conhecimento</h3>
        <p className="text-sm text-muted-foreground mb-4">Análise das competências mais críticas e mais fortes da equipe.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-muted/20 text-center h-full">
            <h4 className="text-md font-semibold mb-4 text-muted-foreground">Competências Comportamentais</h4>
            <p className="text-muted-foreground text-sm">Aguardando avaliações.</p>
          </Card>
          <Card className="p-6 bg-muted/20 text-center h-full">
            <h4 className="text-md font-semibold mb-4 text-muted-foreground">Competências Técnicas</h4>
            <p className="text-muted-foreground text-sm">Aguardando avaliações.</p>
          </Card>
        </div>
      </div>
    );
  }

  const hasData = teamMembers.length > 0;

  const calcularGaps = (tipo: 'TECNICA' | 'COMPORTAMENTAL') => {
    if (!hasData) return [];
    const competenciasMap = new Map<string, { soma: number; count: number; competencia: LideradoDashboard['competencias'][0] }>();
    teamMembers.forEach((liderado) => {
      liderado.competencias.forEach((comp) => {
        if (comp.tipo === tipo) {
          const existing = competenciasMap.get(comp.id_competencia);
          if (existing) {
            existing.soma += comp.pontuacao_1a4;
            existing.count++;
          } else {
            competenciasMap.set(comp.id_competencia, { soma: comp.pontuacao_1a4, count: 1, competencia: comp });
          }
        }
      });
    });
    return Array.from(competenciasMap.values())
      .map(({ soma, count, competencia }) => ({
        nome_competencia: competencia.nome_competencia,
        nome_categoria: competencia.categoria_nome,
        media_score: soma / count,
        tipo,
      }))
      .sort((a, b) => a.media_score - b.media_score);
  };

  const gapsTecnicos = calcularGaps('TECNICA');
  const gapsComportamentais = calcularGaps('COMPORTAMENTAL');

  const renderGapItem = (gap: ReturnType<typeof calcularGaps>[0]) => (
    <div key={gap.nome_competencia} className="space-y-1.5 p-2 rounded-md transition-colors hover:bg-muted/50">
      <div className="flex items-center justify-between text-sm">
        <div className="flex-1 min-w-0">
          <span className={`font-medium text-foreground truncate`}>{gap.nome_competencia}</span>
          {gap.tipo === 'TECNICA' && gap.nome_categoria && (
            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline-block truncate">({gap.nome_categoria})</span>
          )}
        </div>
        <span className={`font-semibold text-sm ${getGapColorClass(gap.media_score)}`}>
          {gap.media_score.toFixed(1)}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(gap.media_score / 4) * 100}%`, backgroundColor: getGapColor(gap.media_score) }} />
      </div>
    </div>
  );

  const renderGapCard = (tipo: 'TECNICA' | 'COMPORTAMENTAL') => {
    const gaps = tipo === 'TECNICA' ? gapsTecnicos : gapsComportamentais;
    const Icon = tipo === 'TECNICA' ? Code : HeartHandshake;

    if (!hasData || gaps.length === 0) {
      return (
        <Card className="p-6 bg-muted/20 text-center h-full">
          <h4 className="text-md font-semibold mb-4 text-muted-foreground flex items-center justify-center gap-2"><Icon className="w-5 h-5" />Competências {tipo === 'TECNICA' ? 'Técnicas' : 'Comportamentais'}</h4>
          <p className="text-sm text-muted-foreground py-8">Sem dados para exibir</p>
        </Card>
      );
    }

    const worstGaps = gaps.slice(0, DISPLAY_LIMIT);
    const bestGaps = gaps.slice(-DISPLAY_LIMIT).reverse();
    const fullList = gaps;

    return (
      <Card className="p-6 h-full flex flex-col">
        <h4 className="text-md font-semibold text-foreground flex items-center gap-2 mb-4"><Icon className="w-5 h-5" />Competências {tipo === 'TECNICA' ? 'Técnicas' : 'Comportamentais'}</h4>

        <div className="flex-1 flex flex-col">
          {!isAllExpanded ? (
            <>
              <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-destructive" />Áreas Críticas</h5>
              <div className="space-y-1 mb-4">{worstGaps.map(renderGapItem)}</div>
              <div className="border-t border-dashed border-border my-4"></div>
              <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Destaques</h5>
              <div className="space-y-1">{bestGaps.map(renderGapItem)}</div>
            </>
          ) : (
            <div className="space-y-1 overflow-y-auto flex-1 pr-2">{fullList.map(renderGapItem)}</div>
          )}
        </div>
      </Card>
    );
  };

  const showExpandButton = hasData && (gapsTecnicos.length > DISPLAY_LIMIT * 2 || gapsComportamentais.length > DISPLAY_LIMIT * 2);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-1 text-foreground">Gaps de Conhecimento</h3>
      <p className="text-sm text-muted-foreground mb-4">Análise das competências mais críticas e mais fortes da equipe.</p>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {renderGapCard('COMPORTAMENTAL')}
          {renderGapCard('TECNICA')}
        </div>
        <div className="hidden md:block absolute inset-y-0 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="h-full w-px bg-border opacity-50"></div>
        </div>
      </div>
      {showExpandButton && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm" onClick={() => setIsAllExpanded(!isAllExpanded)} className="w-full max-w-xs gap-1">
            {isAllExpanded ? "Recolher listas" : "Ver listas completas"}
            {isAllExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}