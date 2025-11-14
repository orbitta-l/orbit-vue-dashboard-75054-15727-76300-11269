import { useMemo, useState } from "react";
import { UserPlus, Users, TrendingUp, ClipboardCheck, Calendar, Briefcase, Check, Filter, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MaturityQuadrantChart from "@/charts/MaturityQuadrantChart";
import DistributionPieChart from "@/charts/DistributionPieChart";
import KnowledgeGapsSection from "@/charts/KnowledgeGapsSection";
import RecentEvaluationsSection from "@/charts/RecentEvaluationsSection";
import CompetencyBarsChart from "@/charts/CompetencyBarsChart";
import { MetricCard } from "@/components/MetricCard";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { softSkillTemplates, technicalTemplate } from "@/data/evaluationTemplates";
import { LideradoDashboard } from "@/types/mer";
import { MOCK_COMPETENCIAS, MOCK_CARGOS } from "@/data/mockData";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Home() {
  const navigate = useNavigate();
  const { isPrimeiroAcesso, liderados, avaliacoes, teamData } = useAuth();
  const [selectedCargos, setSelectedCargos] = useState<string[]>([]);

  const activeCargos = useMemo(() => MOCK_CARGOS.filter(c => c.ativo), []);

  const handleCargoChange = (cargoId: string) => {
    setSelectedCargos(prev => 
      prev.includes(cargoId) ? prev.filter(id => id !== cargoId) : [...prev, cargoId]
    );
  };

  const filteredTeamData = useMemo(() => {
    if (selectedCargos.length === 0) {
      return teamData;
    }
    return teamData.filter(member => selectedCargos.includes(member.id_cargo));
  }, [teamData, selectedCargos]);

  const metrics = useMemo(() => {
    const dataToUse = filteredTeamData;
    if (isPrimeiroAcesso) {
      return { teamMembers: 0, avgMaturity: "N/A", evalsThisMonth: 0, lastEval: "Nenhuma" };
    }
    const sortedAvaliacoes = [...avaliacoes]
      .filter(av => dataToUse.some(l => l.id_usuario === av.liderado_id))
      .sort((a, b) => b.data_avaliacao.getTime() - a.data_avaliacao.getTime());
    const evalsThisMonth = sortedAvaliacoes.filter(av => {
      const evalDate = av.data_avaliacao;
      const today = new Date();
      return evalDate.getMonth() === today.getMonth() && evalDate.getFullYear() === today.getFullYear();
    }).length;
    const lastEval = sortedAvaliacoes.length > 0 ? formatDistanceToNow(sortedAvaliacoes[0].data_avaliacao, { addSuffix: true, locale: ptBR }) : "Nenhuma";
    const maturityMap: { [key: string]: number } = { M1: 1, M2: 2, M3: 3, M4: 4 };
    const evaluatedMembers = dataToUse.filter(l => l.ultima_avaliacao);
    const totalMaturity = evaluatedMembers.reduce((sum, l) => sum + (maturityMap[l.ultima_avaliacao!.maturidade_quadrante] || 0), 0);
    const avgMaturity = evaluatedMembers.length > 0 ? `M${(totalMaturity / evaluatedMembers.length).toFixed(1)}` : "N/A";
    return { teamMembers: dataToUse.length, avgMaturity, evalsThisMonth, lastEval };
  }, [isPrimeiroAcesso, avaliacoes, filteredTeamData]);

  const dashboardData = useMemo(() => {
    const dataToUse = filteredTeamData;
    if (isPrimeiroAcesso || dataToUse.length === 0) return { quadrante: [], barras: [], pizza: [], gaps: [], recentes: [] };

    const teamPerformance = dataToUse.map(liderado => ({
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
    }));

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

    const uniqueTemplateCompetencies = Array.from(new Map([...softSkillTemplates.flatMap(t => t.competencias.map(c => {
      const compDetails = MOCK_COMPETENCIAS.find(mc => mc.id_competencia === c.id_competencia);
      return { competencia: compDetails?.nome_competencia || c.id_competencia, tipo: 'COMPORTAMENTAL' as const, categoria: 'Soft Skills', especializacao: null };
    })), ...technicalTemplate.flatMap(cat => cat.especializacoes.flatMap(spec => spec.competencias.map(comp => ({ competencia: comp.nome_competencia, tipo: 'TECNICA' as const, categoria: cat.nome_categoria, especializacao: spec.nome_especializacao })))].map(item => [item.competencia, item])).values());

    const barras = uniqueTemplateCompetencies.map(templateComp => {
      const evaluatedData = competencyMap.get(templateComp.competencia);
      return { ...templateComp, media: evaluatedData ? evaluatedData.soma / evaluatedData.count : 0 };
    }).filter(b => b.media > 0);

    const sortedAvaliacoes = [...avaliacoes].filter(av => dataToUse.some(l => l.id_usuario === av.liderado_id)).sort((a, b) => b.data_avaliacao.getTime() - a.data_avaliacao.getTime());
    const recentes = sortedAvaliacoes.slice(0, 3).map(av => ({
      evaluationId: av.id_avaliacao,
      lideradoId: av.liderado_id,
      nome_liderado: liderados.find(l => l.id_usuario === av.liderado_id)?.nome ?? "Desconhecido",
      data_avaliacao: av.data_avaliacao,
    }));

    return { quadrante: teamPerformance, barras, pizza: dataToUse, gaps: dataToUse, recentes };
  }, [isPrimeiroAcesso, liderados, avaliacoes, filteredTeamData]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <DashboardHeader />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricCard title="Membros da Equipe" value={metrics.teamMembers} icon={<Users className="w-5 h-5" />} />
        <MetricCard title="Maturidade Média" value={metrics.avgMaturity} icon={<TrendingUp className="w-5 h-5" />} />
        <MetricCard title="Avaliações no Mês" value={metrics.evalsThisMonth} icon={<ClipboardCheck className="w-5 h-5" />} />
        <MetricCard title="Última Avaliação" value={metrics.lastEval} icon={<Calendar className="w-5 h-5" />} />
      </div>

      <Card className="p-4 mb-8 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-primary" />
          <p className="font-semibold text-foreground">Filtros do Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="relative gap-2">
                <Briefcase className="w-4 h-4" />
                Cargo
                {selectedCargos.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {selectedCargos.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filtrar por Cargo</DialogTitle>
                <DialogDescription>Selecione um ou mais cargos para visualizar no dashboard.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                {activeCargos.map((cargo) => {
                  const isSelected = selectedCargos.includes(cargo.id_cargo);
                  return (
                    <button
                      key={cargo.id_cargo}
                      onClick={() => handleCargoChange(cargo.id_cargo)}
                      className={cn("p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all relative", isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-muted/50")}
                    >
                      <Briefcase className={cn("w-6 h-6", isSelected ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-sm font-medium text-center", isSelected ? "text-primary" : "text-foreground")}>{cargo.nome_cargo}</span>
                      {isSelected && <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-primary-foreground" /></div>}
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
          {selectedCargos.length > 0 && (
            <Button variant="ghost" className="gap-2 text-destructive hover:bg-destructive/10" onClick={() => setSelectedCargos([])}>
              <X className="w-4 h-4" />
              Limpar Filtro
            </Button>
          )}
        </div>
      </Card>

      {isPrimeiroAcesso && (
        <Card className="p-6 mb-8 bg-muted/20 text-center">
          <p className="text-muted-foreground mb-4">Bem‑vindo! Para começar, cadastre seu primeiro liderado e realize a primeira avaliação.</p>
          <Button onClick={() => navigate("/team")} className="gap-2"><UserPlus className="w-4 h-4" />Adicionar Liderado</Button>
        </Card>
      )}

      <MaturityQuadrantChart empty={isPrimeiroAcesso || filteredTeamData.length === 0} teamMembers={dashboardData.quadrante as any} />
      <CompetencyBarsChart empty={isPrimeiroAcesso || filteredTeamData.length === 0} data={dashboardData.barras} />
      <DistributionPieChart empty={isPrimeiroAcesso || filteredTeamData.length === 0} teamMembers={dashboardData.pizza} />
      <KnowledgeGapsSection empty={isPrimeiroAcesso || filteredTeamData.length === 0} teamMembers={dashboardData.gaps} />
      <RecentEvaluationsSection empty={isPrimeiroAcesso || filteredTeamData.length === 0} evaluations={dashboardData.recentes} onEvaluationClick={(lideradoId) => navigate(`/team/${lideradoId}`)} />
    </div>
  );
}