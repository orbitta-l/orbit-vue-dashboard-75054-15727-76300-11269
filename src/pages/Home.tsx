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
import { MOCK_PERFORMANCE } from "@/data/mockData";
import { MetricCard } from "@/components/MetricCard";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { softSkillTemplates, technicalCategories } from "@/data/evaluationTemplates";
import { calcularNivelMaturidade } from "@/types/mer";

export default function Home() {
  const navigate = useNavigate();
  const { profile, isPrimeiroAcesso, liderados, avaliacoes } = useAuth();

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

    const evalsThisMonth = avaliacoes.filter(av => {
      const evalDate = new Date(av.data);
      const today = new Date();
      return evalDate.getMonth() === today.getMonth() && evalDate.getFullYear() === today.getFullYear();
    }).length;

    const sortedEvals = [...avaliacoes].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    const lastEval = sortedEvals.length > 0
      ? formatDistanceToNow(new Date(sortedEvals[0].data), { addSuffix: true, locale: ptBR })
      : "Nenhuma";

    const maturityMap: { [key: string]: number } = { M1: 1, M2: 2, M3: 3, M4: 4 };
    const totalMaturity = avaliacoes.reduce((sum, av) => sum + (maturityMap[av.nivel] || 0), 0);
    const avgMaturity = avaliacoes.length > 0 ? `M${(totalMaturity / avaliacoes.length).toFixed(1)}` : "N/A";

    return {
      teamMembers: liderados.length,
      avgMaturity,
      evalsThisMonth,
      lastEval,
    };
  }, [isPrimeiroAcesso, liderados, avaliacoes]);

  const dashboardData = useMemo(() => {
    if (isPrimeiroAcesso) return { quadrante: [], barras: [], pizza: [], gaps: undefined, recentes: [] };

    const teamPerformance = liderados.map(liderado => {
      // Liderado do AuthContext já contém todos os dados de performance
      return {
        id_liderado: liderado.id_liderado,
        nome_liderado: liderado.nome_liderado,
        cargo: liderado.cargo,
        nivel_maturidade: liderado.nivel_maturidade,
        eixo_x_tecnico_geral: liderado.eixo_x_tecnico_geral,
        eixo_y_comportamental: liderado.eixo_y_comportamental,
        categoria_dominante: liderado.categoria_dominante,
        especializacao_dominante: liderado.especializacao_dominante,
        competencias: liderado.competencias,
        sexo: liderado.sexo,
        idade: liderado.idade,
      };
    });

    const allEvaluatedCompetencies = teamPerformance.flatMap(p => p.competencias);
    const competencyMap = new Map<string, { soma: number; count: number; }>();
    
    allEvaluatedCompetencies.forEach(c => {
      const existing = competencyMap.get(c.nome_competencia);
      if (existing) {
        existing.soma += c.media_pontuacao;
        existing.count++;
      } else {
        competencyMap.set(c.nome_competencia, { soma: c.media_pontuacao, count: 1 });
      }
    });

    const allTemplateCompetencies = [
      ...softSkillTemplates.flatMap(t => t.competencias.map(c => ({
        competencia: c.name,
        tipo: 'COMPORTAMENTAL' as const,
        categoria: 'Soft Skills',
        especializacao: null
      }))),
      ...technicalCategories.flatMap(cat => 
        cat.especializacoes.flatMap(spec => 
          spec.competencias.map(comp => ({
            competencia: comp.name,
            tipo: 'TECNICA' as const,
            categoria: cat.name,
            especializacao: spec.name
          }))
        )
      )
    ];
    
    const uniqueTemplateCompetencies = Array.from(new Map(allTemplateCompetencies.map(item => [item.competencia, item])).values());

    const barras = uniqueTemplateCompetencies.map(templateComp => {
      const evaluatedData = competencyMap.get(templateComp.competencia);
      const media = evaluatedData ? evaluatedData.soma / evaluatedData.count : 0;
      
      return { ...templateComp, media };
    });

    const recentes = avaliacoes.slice(-3).map(av => ({
      id: av.id,
      nome_liderado: liderados.find(l => l.id_liderado === av.id_liderado)?.nome_liderado ?? "Desconhecido",
      data_avaliacao: new Date(av.data),
    }));

    return {
      quadrante: teamPerformance,
      barras,
      pizza: teamPerformance,
      gaps: teamPerformance,
      recentes,
    };
  }, [isPrimeiroAcesso, liderados, avaliacoes]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getGreeting()}, {profile?.name || "Usuário"}!
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