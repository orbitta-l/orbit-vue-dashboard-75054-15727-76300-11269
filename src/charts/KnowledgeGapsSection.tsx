import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LideradoDashboard } from "@/types/mer"; // Usando LideradoDashboard
import { getGapColor, getGapColorClass } from "@/utils/colorUtils";

interface KnowledgeGapsSectionProps {
  teamMembers: LideradoDashboard[]; // Usando o tipo correto
  empty?: boolean;
}

export default function KnowledgeGapsSection({ teamMembers, empty = false }: KnowledgeGapsSectionProps) {
  const [expandedTecnica, setExpandedTecnica] = useState(false);
  const [expandedComportamental, setExpandedComportamental] = useState(false);

  if (empty) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Gaps de Conhecimento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-muted/20 text-center">
            <h4 className="text-md font-semibold mb-4 text-muted-foreground">Competências Comportamentais</h4>
            <p className="text-muted-foreground text-sm">Aguardando avaliações.</p>
          </Card>
          <Card className="p-6 bg-muted/20 text-center">
            <h4 className="text-md font-semibold mb-4 text-muted-foreground">Competências Técnicas</h4>
            <p className="text-muted-foreground text-sm">Aguardando avaliações.</p>
          </Card>
        </div>
      </div>
    );
  }

  const hasData = teamMembers.length > 0;

  // Corrigido: Usando 'TECNICA' e 'COMPORTAMENTAL' que são os tipos reais das competências
  const calcularGaps = (tipo: 'TECNICA' | 'COMPORTAMENTAL') => {
    if (!hasData) return [];

    const competenciasMap = new Map<string, { soma: number; count: number; competencia: LideradoDashboard['competencias'][0] }>();

    teamMembers.forEach((liderado) => {
      liderado.competencias.forEach((comp) => {
        if (comp.tipo === tipo) {
          const existing = competenciasMap.get(comp.id_competencia);
          if (existing) {
            existing.soma += comp.pontuacao_1a4;
            existing.count += 1;
          } else {
            competenciasMap.set(comp.id_competencia, {
              soma: comp.pontuacao_1a4,
              count: 1,
              competencia: comp,
            });
          }
        }
      });
    });

    return Array.from(competenciasMap.values())
      .map(({ soma, count, competencia }) => ({
        nome_competencia: competencia.nome_competencia,
        nome_categoria: competencia.categoria_nome,
        nome_especializacao: competencia.especializacao_nome,
        media_score: soma / count,
        tipo,
      }))
      .sort((a, b) => a.media_score - b.media_score);
  };

  const gapsTecnicos = calcularGaps('TECNICA');
  const gapsComportamentais = calcularGaps('COMPORTAMENTAL');

  const renderGapCard = (tipo: 'TECNICA' | 'COMPORTAMENTAL') => {
    const gaps = tipo === 'TECNICA' ? gapsTecnicos : gapsComportamentais;
    const isExpanded = tipo === 'TECNICA' ? expandedTecnica : expandedComportamental;
    const setExpanded = tipo === 'TECNICA' ? setExpandedTecnica : setExpandedComportamental;

    const pioresGaps = gaps.filter((g) => g.media_score < 2.5);
    const melhoresGaps = gaps.filter((g) => g.media_score >= 2.5);
    const top5 = gaps.slice(0, 5);

    return (
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4 text-foreground">
          Competências {tipo === 'TECNICA' ? 'Técnicas' : 'Comportamentais'}
        </h4>

        {!hasData || top5.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sem dados para exibir
          </p>
        ) : !isExpanded ? (
          <>
            <div className="space-y-3 mb-4">
              {top5.map((gap) => (
                <div key={gap.nome_competencia} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <span className={`font-medium ${getGapColorClass(gap.media_score)}`}>
                        {gap.nome_competencia}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({gap.nome_categoria}
                        {gap.nome_especializacao && gap.nome_especializacao !== gap.nome_categoria ? ` › ${gap.nome_especializacao}` : ""})
                      </span>
                    </div>
                    <span className={`font-semibold ${getGapColorClass(gap.media_score)}`}>
                      {gap.media_score.toFixed(1)}/4.0
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(gap.media_score / 4) * 100}%`,
                        backgroundColor: getGapColor(gap.media_score),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(true)}
              className="w-full"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              Ver detalhes completos
            </Button>
          </>
        ) : (
          <>
            {pioresGaps.length > 0 && (
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-foreground mb-3">
                  Piores Gaps (Áreas Críticas)
                </h5>
                <div className="space-y-3">
                  {pioresGaps.map((gap) => (
                    <div key={gap.nome_competencia} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {gap.nome_competencia}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {gap.nome_categoria}
                          {gap.nome_especializacao && gap.nome_especializacao !== gap.nome_categoria ? ` › ${gap.nome_especializacao}` : ""}
                        </p>
                      </div>
                      <span className={`font-semibold ${getGapColorClass(gap.media_score)}`}>
                        {gap.media_score.toFixed(1)}/4.0
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {melhoresGaps.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-foreground mb-3">
                  Melhores Competências (Pontos Fortes)
                </h5>
                <div className="space-y-3">
                  {melhoresGaps.reverse().map((gap) => (
                    <div key={gap.nome_competencia} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {gap.nome_competencia}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {gap.nome_categoria}
                          {gap.nome_especializacao && gap.nome_especializacao !== gap.nome_categoria ? ` › ${gap.nome_especializacao}` : ""}
                        </p>
                      </div>
                      <span className={`font-semibold ${getGapColorClass(gap.media_score)}`}>
                        {gap.media_score.toFixed(1)}/4.0
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(false)}
              className="w-full"
            >
              <ChevronUp className="w-4 h-4 mr-2" />
              Recolher
            </Button>
          </>
        )}
      </Card>
    );
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Gaps de Conhecimento</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderGapCard('COMPORTAMENTAL')}
        {renderGapCard('TECNICA')}
      </div>
    </div>
  );
}