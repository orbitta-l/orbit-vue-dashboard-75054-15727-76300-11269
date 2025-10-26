import { useMemo } from "react";
import { Users as UsersIcon, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CompetencyQuadrantChart from "@/components/CompetencyQuadrantChart";
import DistributionPieChart from "@/components/DistributionPieChart";
import KnowledgeGapsSection from "@/components/KnowledgeGapsSection";
import RecentEvaluationsSection from "@/components/RecentEvaluationsSection";
import { MOCK_PERFORMANCE } from "@/data/mockData";

export default function Home() {
  const navigate = useNavigate();
  const {
    isPrimeiroAcesso,
    liderados,
    avaliacoes,
  } = useAuth();

  // Combine data from different sources into a single, consistent structure for the charts.
  const teamDataForCharts = useMemo(() => {
    if (isPrimeiroAcesso) return [];
    
    return liderados.map(liderado => {
      const avaliacao = avaliacoes.find(av => av.id_liderado === liderado.id);
      // Fallback to mock data for fields not present in a new evaluation (e.g., competencias)
      const mockData = MOCK_PERFORMANCE.find(p => p.id_liderado === liderado.id);

      const eixo_x = avaliacao?.eixo_x ?? mockData?.quadrantX ?? 0;
      const eixo_y = avaliacao?.eixo_y ?? mockData?.quadrantY ?? 0;

      return {
        id_liderado: liderado.id,
        nome_liderado: liderado.nome,
        cargo: liderado.cargo_id || '',
        nivel_maturidade: avaliacao?.nivel || mockData?.nivel_maturidade || 'M1',
        
        // Provide both property name variants for component compatibility
        quadrantX: eixo_x,
        quadrantY: eixo_y,
        eixo_x_tecnico_geral: eixo_x,
        eixo_y_comportamental: eixo_y,

        // Add other fields required by the components
        categoria_dominante: mockData?.categoria_dominante || '',
        especializacao_dominante: mockData?.especializacao_dominante || '',
        competencias: mockData?.competencias || [],
        sexo: mockData?.sexo || 'NAO_INFORMADO',
        idade: mockData?.idade || 0,
      };
    });
  }, [isPrimeiroAcesso, liderados, avaliacoes]);

  // Format data for the recent evaluations section
  const recentesData = isPrimeiroAcesso
    ? []
    : avaliacoes
        .slice(-3)
        .map((av) => ({
          id: av.id,
          nome_liderado: liderados.find((l) => l.id === av.id_liderado)?.nome ?? "Desconhecido",
          data_avaliacao: new Date(av.data),
        }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard da Equipe</h1>
        <p className="text-muted-foreground">Visão geral do desempenho e métricas da sua equipe</p>
      </div>

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

      <CompetencyQuadrantChart
        empty={isPrimeiroAcesso}
        teamMembers={teamDataForCharts}
      />

      <DistributionPieChart
        empty={isPrimeiroAcesso}
        teamMembers={teamDataForCharts as any}
      />

      <KnowledgeGapsSection
        empty={isPrimeiroAcesso}
        teamMembers={teamDataForCharts as any}
      />

      <RecentEvaluationsSection
        empty={isPrimeiroAcesso}
        evaluations={recentesData}
        onEvaluationClick={(id) => navigate(`/evaluation/${id}`)}
      />
    </div>
  );
}