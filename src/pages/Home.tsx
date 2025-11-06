import { useMemo } from "react";
import { UserPlus, Users, TrendingUp, ClipboardCheck, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import CompetencyQuadrantChart from "@/charts/CompetencyQuadrantChart";
import DistributionPieChart from "@/charts/DistributionPieChart";
import KnowledgeGapsSection from "@/charts/KnowledgeGapsSection";
import RecentEvaluationsSection from "@/charts/RecentEvaluationsSection";
import CompetencyBarsChart from "@/charts/CompetencyBarsChart";
import { MetricCard } from "@/components/MetricCard";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { softSkillTemplates, technicalTemplate } from "@/data/evaluationTemplates";
import { LideradoDashboard } from "@/types/mer";
import { MOCK_COMPETENCIAS } from "@/data/mockData";

export default function Home() {
  const navigate = useNavigate();
  const { profile, isPrimeiroAcesso, liderados, avaliacoes, teamData } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const currentDate = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  const metrics = useMemo(() => {
    if (isPrimeiroAcesso) {
      return {
        teamMembers: 0,
        avgMaturity: "N/A",
        evalsThisMonth: 0,
        lastEval: "Nenhuma",
      };
    }

    // CORREÇÃO: Ordenar avaliações por data (mais recente primeiro) antes de processar
    const sortedAvaliacoes = [...avaliacoes].sort((a, b) => 
      new Date(b.data_avaliacao).getTime() - new Date(a.data_avaliacao).getTime()
    );

    const evalsThisMonth = sortedAvaliacoes.filter(av => {
      const evalDate = new Date(av.data_avaliacao);
      const today = new Date();
      return evalDate.getMonth() === today.getMonth() && evalDate.getFullYear() === today.getFullYear();
    }).length;

    const lastEval = sortedAvaliacoes.length > 0
      ? formatDistanceToNow(new Date(sortedAvaliacoes[0].data_avaliacao), { addSuffix: true, locale: ptBR })
      : "Nenhuma";

    const maturityMap: { [key: string]: number } = { M1: 1, M2: 2, M3: 3, M4: 4 };
    const totalMaturity = teamData.reduce((sum, liderado) => sum + (maturityMap[liderado.ultima_avaliacao?.maturidade_quadrante || ''] || 0), 0);
    const avgMaturity = teamData.length > 0 ? `M${(totalMaturity / teamData.length).toFixed(1)}` : "N/A";

    return {
      teamMembers: liderados.length,
      avgMaturity,
      evalsThisMonth,
      lastEval,
    };
  }, [isPrimeiroAcesso, liderados, avaliacoes, teamData]);

  const dashboardData = useMemo(() => {
    if (isPrimeiroAcesso) return { quadrante: [], barras: [], pizza: [], gaps: [], recentes: [] };

    const teamPerformance = teamData.map(liderado => {
      return {
        id_liderado: liderado.id_usuario,
        nome_liderado: liderado.nome,
        cargo: liderado.cargo_nome,
        nivel_maturidade: liderado.ultima_avaliacao?.maturidade_quadrante || 'N/A',
        eixo_x_tecnico_geral: liderado.ultima_avaliacao?.media_tecnica_1a4 || 0,
        eixo_y_comportamental: liderado.ultima_avaliacao?.media_comportamental_1a4 || 0,
        competencias: liderado.competencias,
        sexo: liderado.sexo,
        idade: liderado.idade,
        categoria_dominante: liderado.categoria_dominante,
      };
    });

    const allEvaluatedCompetencies = teamPerformance.flatMap(p => p.competencias);
    
    const competencyMap = new Map<string, { soma: number; count: number; }>();
    
    allEvaluatedCompetencies.forEach(c => {
      const existing = competencyMap.get(c.nome_competencia);
      if (existing) {
        existing.soma += c.pontuacao_1a4;
        existing.count++;
      } else {
        competencyMap.set(c.nome_competencia, { soma: c.pontuacao_1a4, count: 1 });
      }
    });

    const allTemplateCompetencies = [
      ...softSkillTemplates.flatMap(t => t.competencias.map(c => {
        const compDetails = MOCK_COMPETENCIAS.find(mc => mc.id_competencia === c.id_competencia);
        return {
          competencia: compDetails?.nome_competencia || c.id_competencia,
          tipo: 'COMPORTAMENTAL' as const,
          categoria: 'Soft Skills',
          especializacao: null
        };
      })),
      ...technicalTemplate.flatMap(cat => 
        cat.especializacoes.flatMap(spec => 
          spec.competencias.map(comp => ({
            competencia: comp.nome_competencia,
            tipo: 'TECNICA' as const,
            categoria: cat.nome_categoria,
            especializacao: spec.nome_especializacao
          }))
        )
      )
    ];
    
    const uniqueTemplateCompetencies = Array.from(new Map(allTemplateCompetencies.map(item => [item.competencia, item])).values());

    const barras = uniqueTemplateCompetencies.map(templateComp => {
      const evaluatedData = competencyMap.get(templateComp.competencia);
      const media = evaluatedData ? evaluatedData.soma / evaluatedData.count : 0;
      
      return { 
        competencia: templateComp.competencia,
        media,
        tipo: templateComp.tipo,
        categoria: templateComp.categoria,
        especializacao: templateComp.especializacao
      };
    }).filter(b => b.media > 0);

    // CORREÇÃO: Ordenar avaliações por data (mais recente primeiro) antes de pegar as 3 últimas
    const sortedAvaliacoes = [...avaliacoes].sort((a, b) => 
      new Date(b.data_avaliacao).getTime() - new Date(a.data_avaliacao).getTime()
    );
    
    const recentes = sortedAvaliacoes.slice(0, 3).map(av => ({
      evaluationId: av.id_avaliacao,
      lideradoId: av.liderado_id,
      nome_liderado: liderados.find(l => l.id_usuario === av.liderado_id)?.nome ?? "Desconhecido",
      data_avaliacao: new Date(av.data_avaliacao),
    }));

    return {
      quadrante: teamPerformance,
      barras,
      pizza: teamData,
      gaps: teamData,
      recentes,
    };
  }, [isPrimeiroAcesso, liderados, avaliacoes, teamData]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getGreeting()}, {profile?.nome || "Usuário"}!
          </h1>
          <p className="text-muted-foreground">Acompanhe a evolução das competências da sua equipe.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{currentDate}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard title="Membros da Equipe" value={metrics.teamMembers} icon={<Users className="w-5 h-5" />} />
        <MetricCard title="Maturidade Média" value={metrics.avgMaturity} icon={<TrendingUp className="w-5 h-5" />} />
        <MetricCard title="Avaliações no Mês" value={metrics.evalsThisMonth} icon={<ClipboardCheck className="w-5 h-5" />} />
        <MetricCard title="Última Avaliação" value={metrics.lastEval} icon={<Calendar className="w-5 h-5" />} />
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
        teamMembers={dashboardData.pizza}
      />

      <KnowledgeGapsSection
        empty={isPrimeiroAcesso}
        teamMembers={dashboardData.gaps}
      />

      <RecentEvaluationsSection
        empty={isPrimeiroAcesso}
        evaluations={dashboardData.recentes}
        onEvaluationClick={(lideradoId) => navigate(`/team/${lideradoId}`)}
      />
    </div>
  );
}