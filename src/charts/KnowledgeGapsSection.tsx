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

// Limite de exibição no estado não expandido
const DISPLAY_LIMIT = 3;

export default function KnowledgeGapsSection({ teamMembers, empty = false }: KnowledgeGapsSectionProps) {
  const [expandedTecnica, setExpandedTecnica] = useState(false);
  const [expandedComportamental, setExpandedComportamental] = useState(false);

  if (empty) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Gaps de Conhecimento</h3>
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
            existing.count++;
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

    // Retorna a lista completa ordenada do pior (menor score) para o melhor (maior score)
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

  const renderGapItem = (gap: ReturnType<typeof calcularGaps>[0]) => (
    <div key={gap.nome_competencia} className="space-y-1.5"> {/* Reduzido espaço vertical */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex-1 min-w-0">
          <span className={`font-medium ${getGapColorClass(gap.media_score)} truncate`}>
            {gap.nome_competencia}
          </span>
          <span className="text-xs text-muted-foreground ml-2 hidden sm:inline-block truncate">
            ({gap.nome_categoria}
            {gap.nome_especializacao && gap.nome_especializacao !== gap.nome_categoria ? ` › ${gap.nome_especializacao}` : ""})
          </span>
        </div>
        <span className={`font-semibold text-xs px-2 py-0.5 rounded-full`} style={{ backgroundColor: getGapColor(gap.media_score), color: gap.media_score >= 3.5 ? 'white' : 'hsl(var(--foreground))' }}>
          {gap.media_score.toFixed(1)}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden"> {/* Cor de fundo mais clara */}
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(gap.media_score / 4) * 100}%`,
            backgroundColor: getGapColor(gap.media_score),
          }}
        />
      </div>
    </div>
  );

  const renderGapCard = (tipo: 'TECNICA' | 'COMPORTAMENTAL') => {
    const gaps = tipo === 'TECNICA' ? gapsTecnicos : gapsComportamentais;
    const isExpanded = tipo === 'TECNICA' ? expandedTecnica : expandedComportamental;
    const setExpanded = tipo === 'TECNICA' ? setExpandedTecnica : setExpandedComportamental;

    if (!hasData || gaps.length === 0) {
        return (
            <Card className="p-6 bg-muted/20 text-center h-full">
                <h4 className="text-md font-semibold mb-4 text-muted-foreground">
                    Competências {tipo === 'TECNICA' ? 'Técnicas' : 'Comportamentais'}
                </h4>
                <p className="text-sm text-muted-foreground py-8">Sem dados para exibir</p>
            </Card>
        );
    }

    // Os piores são os primeiros (já ordenados)
    const worstGaps = gaps.slice(0, DISPLAY_LIMIT);
    // Os melhores são os últimos (revertendo a ordem para pegar os maiores)
    const bestGaps = gaps.slice(-DISPLAY_LIMIT).reverse();
    
    // A lista completa já está ordenada do pior para o melhor
    const fullList = gaps;

    return (
      <Card className="p-6 h-full flex flex-col"> {/* Adicionado h-full e flex-col */}
        <h4 className="text-md font-semibold mb-4 text-foreground">
          Competências {tipo === 'TECNICA' ? 'Técnicas' : 'Comportamentais'}
        </h4>

        <div className="flex-1 flex flex-col"> {/* Container flexível para o conteúdo */}
          {!isExpanded ? (
            <>
              {/* Piores Gaps */}
              <h5 className="text-sm font-semibold text-destructive mb-3">
                3 Piores Gaps (Áreas Críticas)
              </h5>
              <div className="space-y-3 mb-4">
                {worstGaps.map(renderGapItem)}
              </div>

              {/* Separador */}
              <div className="border-t border-dashed border-border my-4"></div>

              {/* Melhores Gaps */}
              <h5 className="text-sm font-semibold text-primary mb-3">
                3 Melhores Competências (Pontos Fortes)
              </h5>
              <div className="space-y-3 mb-4">
                {bestGaps.map(renderGapItem)}
              </div>

              <div className="mt-auto pt-4"> {/* Empurra o botão para baixo */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpanded(true)}
                  className="w-full"
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Ver lista completa ({gaps.length} competências)
                </Button>
              </div>
            </>
          ) : (
            <>
              <h5 className="text-sm font-semibold text-foreground mb-3">
                Lista Completa (Pior para Melhor)
              </h5>
              <div className="space-y-3 mb-4 overflow-y-auto flex-1"> {/* Adicionado overflow-y-auto e flex-1 */}
                {/* Exibe a lista completa, que já está ordenada do pior para o melhor */}
                {fullList.map(renderGapItem)}
              </div>

              <div className="mt-auto pt-4"> {/* Empurra o botão para baixo */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpanded(false)}
                  className="w-full"
                >
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Recolher
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Gaps de Conhecimento</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"> {/* Adicionado items-stretch para garantir altura igual */}
        {renderGapCard('COMPORTAMENTAL')}
        {renderGapCard('TECNICA')}
      </div>
    </div>
  );
}