import { Users as UsersIcon, Award, BarChart3, ClipboardList, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CompetencyQuadrantChart from "@/components/CompetencyQuadrantChart";
import DistributionPieChart from "@/components/DistributionPieChart";
import KnowledgeGapsSection from "@/components/KnowledgeGapsSection";
import RecentEvaluationsSection from "@/components/RecentEvaluationsSection";
import { LideradoPerformance } from "@/types/mer";

export default function Home() {
  const navigate = useNavigate();
  const {
    profile,
    isPrimeiroAcesso,
    liderados,
    avaliacoes,
  } = useAuth();

  // Transformar os dados do contexto nos formatos esperados pelos componentes
  const quadranteData: Array<{ id: string; nome: string; x: number; y: number; nivel: string }> = isPrimeiroAcesso
    ? []
    : liderados.map((l) => {
        // Busca avaliação correspondente (se houver)
        const av = avaliacoes.find((a) => a.id_liderado === l.id);
        return {
          id: l.id,
          nome: l.nome,
          x: av?.eixo_x ?? 0,
          y: av?.eixo_y ?? 0,
          nivel: av?.nivel ?? "M1",
        };
      });

  const pizzaData = isPrimeiroAcesso
    ? []
    : liderados.reduce<Record<string, number>>((acc, l) => {
        const av = avaliacoes.find((a) => a.id_liderado === l.id);
        const nivel = av?.nivel ?? "M1";
        acc[nivel] = (acc[nivel] ?? 0) + 1;
        return acc;
      }, {});

  const pizzaArray = Object.entries(pizzaData).map(([label, value]) => ({
    label,
    value,
  }));

  const gapsData = isPrimeiroAcesso
    ? undefined
    : {
        tecnicas: [], // aqui você pode agregar a partir das avaliações se desejar
        comportamentais: [], // idem
      };

  const recentesData = isPrimeiroAcesso
    ? []
    : avaliacoes
        .slice(-3)
        .map((av) => ({
          avaliacaoId: av.id,
          nome: liderados.find((l) => l.id === av.id_liderado)?.nome ?? "Desconhecido",
          data: av.data,
        }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard da Equipe</h1>
        <p className="text-muted-foreground">Visão geral do desempenho e métricas da sua equipe</p>
      </div>

      {/* Mensagens orientativas quando for primeiro acesso */}
      {isPrimeiroAcesso && (
        <Card className="p-6 mb-8 bg-muted/20 text-center">
          <p className="text-muted-foreground mb-4">
            Bem‑vindo! Para começar, cadastre seu primeiro liderado e realize a primeira avaliação.
          </p>
          <Button onClick={() => navigate("/team")} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Adicionar Liderado
          </Button>
        </Card>
      )}

      {/* Quadrante */}
      <CompetencyQuadrantChart
        empty={isPrimeiroAcesso}
        teamMembers={isPrimeiroAcesso ? [] : (liderados as unknown as LideradoPerformance[])}
      />

      {/* Pizza */}
      <DistributionPieChart
        empty={isPrimeiroAcesso}
        teamMembers={isPrimeiroAcesso ? [] : (liderados as unknown as LideradoPerformance[])}
      />

      {/* Gaps */}
      <KnowledgeGapsSection
        empty={isPrimeiroAcesso}
        teamMembers={isPrimeiroAcesso ? [] : (liderados as unknown as LideradoPerformance[])}
      />

      {/* Avaliações recentes */}
      <RecentEvaluationsSection
        empty={isPrimeiroAcesso}
        evaluations={recentesData}
        onEvaluationClick={(id) => navigate(`/evaluation/${id}`)}
      />
    </div>
  );
}