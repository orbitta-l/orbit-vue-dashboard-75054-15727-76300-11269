import { useMemo } from "react";
import { UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CompetencyQuadrantChart from "@/components/CompetencyQuadrantChart";
import DistributionPieChart from "@/components/DistributionPieChart";
import KnowledgeGapsSection from "@/components/KnowledgeGapsSection";
import RecentEvaluationsSection from "@/components/RecentEvaluationsSection";
import CompetencyBarsChart from "@/components/CompetencyBarsChart";
import { MOCK_PERFORMANCE } from "@/data/mockData";

export default function Home() {
  const navigate = useNavigate();
  const { isPrimeiroAcesso, liderados, avaliacoes } = useAuth();

  const dashboardData = useMemo(() => {
    if (isPrimeiroAcesso) return { quadrante: [], barras: [], pizza: [], gaps: undefined, recentes: [] };

    const teamPerformance = liderados.map(liderado => {
      const avaliacao = avaliacoes.find(av => av.id_liderado === liderado.id);
      const mockData = MOCK_PERFORMANCE.find(p => p.id_liderado === liderado.id);
      const eixo_x = avaliacao?.eixo_x ?? mockData?.quadrantX ?? 0;
      const eixo_y = avaliacao?.eixo_y ?? mockData?.quadrantY ?? 0;
      return {
        id_liderado: liderado.id,
        nome_liderado: liderado.nome,
        cargo: liderado.cargo_id || '',
        nivel_maturidade: avaliacao?.nivel || mockData?.nivel_maturidade || 'M1',
        eixo_x_tecnico_geral: eixo_x,
        eixo_y_comportamental: eixo_y,
        categoria_dominante: mockData?.categoria_dominante || 'N/A',
        especializacao_dominante: mockData?.especializacao_dominante || 'N/A',
        competencias: mockData?.competencias || [],
        sexo: mockData?.sexo || 'NAO_INFORMADO',
        idade: mockData?.idade || 0,
      };
    });

    const allCompetencies = teamPerformance.flatMap(p => p.competencias);
    const competencyMap = new Map<string, { soma: number; count: number; tipo: 'TECNICA' | 'COMPORTAMENTAL' }>();
    allCompetencies.forEach(c => {
      const existing = competencyMap.get(c.nome_competencia);
      if (existing) {
        existing.soma += c.media_pontuacao;
        existing.count++;
      } else {
        competencyMap.set(c.nome_competencia, { soma: c.media_pontuacao, count: 1, tipo: c.tipo });
      }
    });

    const barras = Array.from(competencyMap.entries()).map(([key, value]) => ({
      competencia: key,
      media: value.soma / value.count,
      tipo: value.tipo,
    }));

    const recentes = avaliacoes.slice(-3).map(av => ({
      id: av.id,
      nome_liderado: liderados.find(l => l.id === av.id_liderado)?.nome ?? "Desconhecido",
      data_avaliacao: new Date(av.data),
    }));

    return {
      quadrante: teamPerformance,
      barras,
      pizza: teamPerformance, // Pizza component will process this
      gaps: teamPerformance, // Gaps component will process this
      recentes,
    };
  }, [isPrimeiroAcesso, liderados, avaliacoes]);

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
        teamMembers={dashboardData.quadrante}
      />
      
      <CompetencyBarsChart
        empty={isPrimeiroAcesso}
        data={dashboardData.barras}
      />

      <DistributionPieChart
        empty={isPrimeiroAcesso}
        teamMembers={dashboardData.pizza as any}
      />

      <KnowledgeGapsSection
        empty={isPrimeiroAcesso}
        teamMembers={dashboardData.gaps as any}
      />

      <RecentEvaluationsSection
        empty={isPrimeiroAcesso}
        evaluations={dashboardData.recentes}
        onEvaluationClick={(id) => navigate(`/evaluation/${id}`)}
      />
    </div>
  );
}