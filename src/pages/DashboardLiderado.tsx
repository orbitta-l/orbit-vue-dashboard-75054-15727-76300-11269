import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Target, BookOpen, Filter, ClipboardCheck, Lightbulb, Calendar as CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateMaturitySummary } from "@/utils/summaryUtils";
import { StrategicSummaryCard } from "@/components/StrategicSummaryCard";
import { QuickInsights } from "@/components/QuickInsights";

export default function DashboardLiderado() {
  const { profile, logout, lideradoDashboardData, loading } = useAuth();
  const navigate = useNavigate();
  
  const hasData = !!lideradoDashboardData && !!lideradoDashboardData.ultima_avaliacao;
  
  const [activeSkillTab, setActiveSkillTab] = useState<"all" | "soft" | "hard">("all");
  const [selectedHardCategory, setSelectedHardCategory] = useState<string>("all");

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const dashboardInsights = useMemo(() => {
    if (!hasData || !lideradoDashboardData || !lideradoDashboardData.ultima_avaliacao) {
      return {
        competenciasVersus: [],
        categoryPerformanceData: [],
        availableHardCategories: [],
        greatestStrength: null,
        biggestImprovementArea: null,
        strategicSummary: generateMaturitySummary('N/A'),
        maturityLevel: 'N/A' as const,
        behavioralAnalysis: "Aguardando avaliação",
      };
    }

    // Lógica para Gráficos
    const softSkillsData = lideradoDashboardData.competencias.filter(c => c.tipo === 'COMPORTAMENTAL').map(c => ({ competency: c.nome_competencia, atual: c.pontuacao_1a4, ideal: c.nota_ideal || 4.0 }));
    const hardSkillsData = lideradoDashboardData.competencias.filter(c => c.tipo === 'TECNICA').map(c => ({ competency: c.nome_competencia, atual: c.pontuacao_1a4, ideal: c.nota_ideal || 4.0, categoria: c.categoria_nome }));
    let filteredData = [];
    if (activeSkillTab === "soft") filteredData = softSkillsData;
    else if (activeSkillTab === "hard") filteredData = selectedHardCategory === "all" ? hardSkillsData : hardSkillsData.filter(hs => hs.categoria === selectedHardCategory);
    else filteredData = [...softSkillsData, ...hardSkillsData];
    const competenciasVersus = filteredData.filter(c => c.atual > 0 || filteredData.length === 1);

    const categoryMap = new Map<string, { soma: number; count: number }>();
    hardSkillsData.forEach(comp => {
      if (comp.categoria) {
        const existing = categoryMap.get(comp.categoria);
        if (existing) {
          existing.soma += comp.atual;
          existing.count += 1;
        } else {
          categoryMap.set(comp.categoria, { soma: comp.atual, count: 1 });
        }
      }
    });
    const categoryPerformanceData = Array.from(categoryMap.entries()).map(([category, { soma, count }]) => ({ category, atual: soma / count, ideal: 4.0 }));
    const availableHardCategories = Array.from(new Set(hardSkillsData.map(c => c.categoria!)));

    // Lógica para Insights Rápidos
    let greatestStrength: string | null = null;
    let biggestImprovementArea: string | null = null;
    if (lideradoDashboardData.competencias.length > 0) {
      const sortedByScore = [...lideradoDashboardData.competencias].sort((a, b) => b.pontuacao_1a4 - a.pontuacao_1a4);
      greatestStrength = sortedByScore[0].nome_competencia;
      const sortedByGap = [...lideradoDashboardData.competencias].map(c => ({ ...c, gap: (c.nota_ideal || 4.0) - c.pontuacao_1a4 })).sort((a, b) => b.gap - a.gap);
      biggestImprovementArea = sortedByGap[0].nome_competencia;
    }

    let behavioralAnalysis: string = "N/A";
    if (softSkillsData.length > 0) {
      const avgActual = softSkillsData.reduce((sum, s) => sum + s.atual, 0) / softSkillsData.length;
      const avgIdeal = softSkillsData.reduce((sum, s) => sum + s.ideal, 0) / softSkillsData.length;
      if (avgActual >= avgIdeal) behavioralAnalysis = "Acima ou na média do ideal";
      else if (avgActual >= 2.5) behavioralAnalysis = "Em bom desenvolvimento";
      else behavioralAnalysis = "Abaixo da média do ideal";
    }

    const maturityLevel = lideradoDashboardData.ultima_avaliacao.maturidade_quadrante;
    const strategicSummary = generateMaturitySummary(maturityLevel);

    return {
      competenciasVersus,
      categoryPerformanceData,
      availableHardCategories,
      greatestStrength,
      biggestImprovementArea,
      strategicSummary,
      maturityLevel,
      behavioralAnalysis,
    };
  }, [hasData, lideradoDashboardData, activeSkillTab, selectedHardCategory]);

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center bg-background"><Lightbulb className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div><h1 className="text-2xl font-bold text-foreground">Meu Desenvolvimento</h1><p className="text-sm text-muted-foreground">Bem-vindo(a), {profile?.nome || 'Liderado'}</p></div>
          <Button onClick={handleLogout} variant="outline"><LogOut className="w-4 h-4 mr-2" />Sair</Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {!hasData ? (
          <Card className="p-8 text-center bg-muted/20">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"><ClipboardCheck className="w-12 h-12 text-primary" /></div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Você ainda não possui avaliações</h2>
              <p className="text-muted-foreground mb-8 text-lg">Aguarde seu líder realizar a primeira avaliação para visualizar seu progresso e plano de desenvolvimento.</p>
              <Card className="p-6 text-left bg-card mb-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-accent" />Como funciona a Metodologia Orbitta</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-3"><span className="font-bold text-primary">1.</span><p>Seu líder realiza uma avaliação abrangente das suas competências técnicas e comportamentais</p></div>
                  <div className="flex gap-3"><span className="font-bold text-primary">2.</span><p>Você recebe um perfil de maturidade (M1 a M4) baseado no desempenho geral</p></div>
                  <div className="flex gap-3"><span className="font-bold text-primary">3.</span><p>Visualize gaps de conhecimento comparando seu perfil atual com o ideal do cargo</p></div>
                  <div className="flex gap-3"><span className="font-bold text-primary">4.</span><p>Acompanhe seu plano de desenvolvimento personalizado com objetivos claros</p></div>
                </div>
              </Card>
              <Button variant="outline" onClick={() => navigate('/')} className="gap-2">Voltar ao Início</Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-accent" />Minha Maturidade</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-foreground">{lideradoDashboardData?.ultima_avaliacao?.maturidade_quadrante || 'N/A'}</p><p className="text-sm text-muted-foreground">{lideradoDashboardData?.cargo_nome || 'Cargo'}</p></CardContent></Card>
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-accent" />Competências</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-foreground">{lideradoDashboardData?.competencias.length || 0}</p><p className="text-sm text-muted-foreground">avaliadas</p></CardContent></Card>
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-accent" />Última Avaliação</CardTitle></CardHeader><CardContent><p className="text-xl font-bold text-foreground">{lideradoDashboardData?.ultima_avaliacao?.data_avaliacao ? formatDistanceToNow(lideradoDashboardData.ultima_avaliacao.data_avaliacao, { addSuffix: true, locale: ptBR }) : 'N/A'}</p><p className="text-sm text-muted-foreground">{lideradoDashboardData?.ultima_avaliacao?.data_avaliacao ? lideradoDashboardData.ultima_avaliacao.data_avaliacao.toLocaleDateString('pt-BR') : ''}</p></CardContent></Card>
            </div>

            <StrategicSummaryCard summaryText={dashboardInsights.strategicSummary} />
            <QuickInsights maturity={dashboardInsights.maturityLevel} behavioralAnalysis={dashboardInsights.behavioralAnalysis} strength={dashboardInsights.greatestStrength} improvementArea={dashboardInsights.biggestImprovementArea} />

            <Card><CardHeader><div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4"><div><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-primary" />Gráfico de Gap de Conhecimento - VERSUS</CardTitle><CardDescription>Comparação visual entre seu perfil atual e o perfil ideal do cargo</CardDescription></div><div className="flex flex-col gap-2 w-full md:w-auto"><Tabs value={activeSkillTab} onValueChange={(v: any) => { setActiveSkillTab(v); setSelectedHardCategory("all"); }} className="w-full"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="all">Todas</TabsTrigger><TabsTrigger value="soft">Comportamentais</TabsTrigger><TabsTrigger value="hard">Técnicas</TabsTrigger></TabsList></Tabs>{activeSkillTab === "hard" && dashboardInsights.availableHardCategories.length > 0 && (<Select value={selectedHardCategory} onValueChange={setSelectedHardCategory}><SelectTrigger className="w-full"><SelectValue placeholder="Filtrar por Categoria Técnica" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as Categorias Técnicas</SelectItem>{dashboardInsights.availableHardCategories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent></Select>)}</div></div></CardHeader><CardContent><ResponsiveContainer width="100%" height={500}>{dashboardInsights.competenciasVersus.length === 0 ? (<div className="flex items-center justify-center h-full bg-muted/30 rounded-lg"><p className="text-muted-foreground text-center">Nenhuma competência selecionada ou dados insuficientes.</p></div>) : (<RadarChart data={dashboardInsights.competenciasVersus}><PolarGrid stroke="hsl(var(--border))" /><PolarAngleAxis dataKey="competency" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} /><PolarRadiusAxis angle={90} domain={[0, 4]} tick={{ fill: 'hsl(var(--muted-foreground))' }} /><Radar name="Perfil Ideal" dataKey="ideal" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} /><Radar name="Meu Perfil Atual" dataKey="atual" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.4} strokeWidth={2} /><Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" /></RadarChart>)}</ResponsiveContainer><div className="mt-6 p-4 bg-muted/30 rounded-lg"><h4 className="font-semibold text-foreground mb-2">Sobre este gráfico:</h4><p className="text-sm text-muted-foreground">A área entre os dois polígonos representa os <strong>gaps de conhecimento</strong>. Quanto maior a diferença entre o ideal (azul) e seu perfil atual (laranja), maior a oportunidade de crescimento.</p></div></CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5 text-primary" />Desempenho por Categoria Técnica</CardTitle><CardDescription>Sua média de desempenho em cada área técnica avaliada.</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}>{dashboardInsights.categoryPerformanceData.length === 0 ? (<div className="flex items-center justify-center h-full bg-muted/30 rounded-lg"><p className="text-muted-foreground text-center">Nenhum dado de categoria para exibir.</p></div>) : (<BarChart data={dashboardInsights.categoryPerformanceData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="category" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} /><YAxis domain={[0, 4]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} /><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} /><Legend /><Bar dataKey="atual" fill="hsl(var(--accent))" name="Meu Nível" radius={[8, 8, 0, 0]} /><Bar dataKey="ideal" fill="hsl(var(--primary))" name="Nível Ideal" radius={[8, 8, 0, 0]} /></BarChart>)}</ResponsiveContainer></CardContent></Card>
          </div>
        )}
      </main>
    </div>
  );
}