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
import { useState, useMemo, useEffect } from "react";
import { softSkillTemplates } from "@/data/evaluationTemplates";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper para obter o ideal score de soft skills
const getSoftSkillIdealScore = (competencyId: string, cargoId: string): number => {
  const template = softSkillTemplates.find(t => t.id_cargo === cargoId);
  return template?.competencias.find(c => c.id_competencia === competencyId)?.nota_ideal || 4.0;
};

interface RadarDataPoint {
  competency: string;
  atual: number;
  ideal: number;
  categoria?: string;
}

export default function DashboardLiderado() {
  const { profile, logout, lideradoDashboardData, loading, fetchLideradoDashboardData } = useAuth();
  const navigate = useNavigate();
  
  const hasData = !!lideradoDashboardData && !!lideradoDashboardData.ultima_avaliacao;
  
  const [activeSkillTab, setActiveSkillTab] = useState<"all" | "soft" | "hard">("all");
  const [selectedHardCategory, setSelectedHardCategory] = useState<string>("all");

  useEffect(() => {
    if (profile?.role === 'LIDERADO' && profile.id_usuario) {
      fetchLideradoDashboardData(Number(profile.id_usuario));
    }
  }, [profile?.id_usuario, profile?.role, fetchLideradoDashboardData]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const competenciasVersus = useMemo((): RadarDataPoint[] => {
    if (!hasData || !lideradoDashboardData) return [];

    const softSkillsData: RadarDataPoint[] = lideradoDashboardData.competencias
      .filter(c => c.tipo === 'COMPORTAMENTAL')
      .map(c => ({
        competency: c.nome_competencia,
        atual: c.pontuacao_1a4,
        ideal: getSoftSkillIdealScore(c.id_competencia, lideradoDashboardData.id_cargo),
      }));

    const hardSkillsData: RadarDataPoint[] = lideradoDashboardData.competencias
      .filter(c => c.tipo === 'TECNICA')
      .map(c => ({
        competency: c.nome_competencia,
        atual: c.pontuacao_1a4,
        ideal: 4.0,
        categoria: c.categoria_nome,
      }));

    let filteredData: RadarDataPoint[] = [];
    if (activeSkillTab === "soft") filteredData = softSkillsData;
    else if (activeSkillTab === "hard") {
      filteredData = selectedHardCategory === "all"
        ? hardSkillsData
        : hardSkillsData.filter(hs => hs.categoria === selectedHardCategory);
    } else {
      filteredData = [...softSkillsData, ...hardSkillsData];
    }
    
    return filteredData.filter(c => c.atual > 0 || filteredData.length === 1);
  }, [hasData, lideradoDashboardData, activeSkillTab, selectedHardCategory]);

  const categoryPerformanceData = useMemo(() => {
    if (!hasData || !lideradoDashboardData) return [];
    const hardSkills = lideradoDashboardData.competencias.filter(c => c.tipo === 'TECNICA');
    const categoryMap = new Map<string, { soma: number; count: number }>();
    hardSkills.forEach(comp => {
      if (comp.categoria_nome && comp.categoria_nome !== 'N/A') {
        const existing = categoryMap.get(comp.categoria_nome);
        if (existing) {
          existing.soma += comp.pontuacao_1a4;
          existing.count += 1;
        } else {
          categoryMap.set(comp.categoria_nome, { soma: comp.pontuacao_1a4, count: 1 });
        }
      }
    });
    return Array.from(categoryMap.entries()).map(([category, { soma, count }]) => ({
      category, atual: soma / count, ideal: 4.0,
    }));
  }, [hasData, lideradoDashboardData]);

  const availableHardCategories = useMemo(() => {
    if (!hasData || !lideradoDashboardData) return [];
    return Array.from(new Set(lideradoDashboardData.competencias
      .filter(c => c.tipo === 'TECNICA' && c.categoria_nome && c.categoria_nome !== 'N/A')
      .map(c => c.categoria_nome!)));
  }, [hasData, lideradoDashboardData]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Lightbulb className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meu Desenvolvimento</h1>
            <p className="text-sm text-muted-foreground">Bem-vindo(a), {profile?.nome || 'Liderado'}</p>
          </div>
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
          <>
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-accent" />Minha Maturidade</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-foreground">{lideradoDashboardData?.ultima_avaliacao?.maturidade_quadrante || 'N/A'}</p><p className="text-sm text-muted-foreground">{lideradoDashboardData?.cargo_nome || 'Cargo'}</p></CardContent></Card>
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-accent" />Competências</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-foreground">{lideradoDashboardData?.competencias.length || 0}</p><p className="text-sm text-muted-foreground">avaliadas</p></CardContent></Card>
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-accent" />Última Avaliação</CardTitle></CardHeader><CardContent><p className="text-xl font-bold text-foreground">{lideradoDashboardData?.ultima_avaliacao?.data_avaliacao ? formatDistanceToNow(lideradoDashboardData.ultima_avaliacao.data_avaliacao, { addSuffix: true, locale: ptBR }) : 'N/A'}</p><p className="text-sm text-muted-foreground">{lideradoDashboardData?.ultima_avaliacao?.data_avaliacao ? lideradoDashboardData.ultima_avaliacao.data_avaliacao.toLocaleDateString('pt-BR') : ''}</p></CardContent></Card>
            </div>

            <Card className="mb-8"><CardHeader><div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4"><div><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-primary" />Gráfico de Gap de Conhecimento - VERSUS</CardTitle><CardDescription>Comparação visual entre seu perfil atual e o perfil ideal do cargo</CardDescription></div><div className="flex flex-col gap-2 w-full md:w-auto"><Tabs value={activeSkillTab} onValueChange={(v: any) => { setActiveSkillTab(v); setSelectedHardCategory("all"); }} className="w-full"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="all">Todas</TabsTrigger><TabsTrigger value="soft">Comportamentais</TabsTrigger><TabsTrigger value="hard">Técnicas</TabsTrigger></TabsList></Tabs>{activeSkillTab === "hard" && availableHardCategories.length > 0 && (<Select value={selectedHardCategory} onValueChange={setSelectedHardCategory}><SelectTrigger className="w-full"><SelectValue placeholder="Filtrar por Categoria Técnica" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as Categorias Técnicas</SelectItem>{availableHardCategories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent></Select>)}</div></div></CardHeader><CardContent><ResponsiveContainer width="100%" height={500}>{competenciasVersus.length === 0 ? (<div className="flex items-center justify-center h-full bg-muted/30 rounded-lg"><p className="text-muted-foreground text-center">Nenhuma competência selecionada ou dados insuficientes.</p></div>) : (<RadarChart data={competenciasVersus}><PolarGrid stroke="hsl(var(--border))" /><PolarAngleAxis dataKey="competency" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} /><PolarRadiusAxis angle={90} domain={[0, 4]} tick={{ fill: 'hsl(var(--muted-foreground))' }} /><Radar name="Perfil Ideal" dataKey="ideal" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} /><Radar name="Meu Perfil Atual" dataKey="atual" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.4} strokeWidth={2} /><Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" /></RadarChart>)}</ResponsiveContainer><div className="mt-6 p-4 bg-muted/30 rounded-lg"><h4 className="font-semibold text-foreground mb-2">Sobre este gráfico:</h4><p className="text-sm text-muted-foreground">A área entre os dois polígonos representa os <strong>gaps de conhecimento</strong>. Quanto maior a diferença entre o ideal (azul) e seu perfil atual (laranja), maior a oportunidade de crescimento.</p></div></CardContent></Card>

            <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5 text-primary" />Desempenho por Categoria Técnica</CardTitle><CardDescription>Sua média de desempenho em cada área técnica avaliada.</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}>{categoryPerformanceData.length === 0 ? (<div className="flex items-center justify-center h-full bg-muted/30 rounded-lg"><p className="text-muted-foreground text-center">Nenhum dado de categoria para exibir.</p></div>) : (<BarChart data={categoryPerformanceData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="category" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} /><YAxis domain={[0, 4]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} /><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} /><Legend /><Bar dataKey="atual" fill="hsl(var(--accent))" name="Meu Nível" radius={[8, 8, 0, 0]} /><Bar dataKey="ideal" fill="hsl(var(--primary))" name="Nível Ideal" radius={[8, 8, 0, 0]} /></BarChart>)}</ResponsiveContainer></CardContent></Card>

            <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" />Meu Plano de Desenvolvimento</CardTitle><CardDescription>Objetivos e marcos do seu crescimento profissional</CardDescription></CardHeader><CardContent><div className="space-y-4"><div className="p-4 bg-accent/10 rounded-lg border-l-4 border-accent"><h4 className="font-semibold mb-2 text-foreground">Objetivo Atual</h4><p className="text-muted-foreground text-sm">Desenvolver habilidades de comunicação e trabalho em equipe, além de fortalecer competências técnicas em React e TypeScript</p><div className="mt-2 flex gap-2"><span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-medium">{lideradoDashboardData?.ultima_avaliacao?.maturidade_quadrante || 'N/A'} - {lideradoDashboardData?.cargo_nome || 'Cargo'}</span><span className="px-2 py-1 bg-chart-3/40 text-foreground text-xs rounded font-medium">Em Progresso</span></div></div><div className="p-4 bg-muted/30 rounded-lg"><h4 className="font-semibold mb-2 text-foreground">Próximos Passos</h4><ul className="list-disc list-inside text-muted-foreground text-sm space-y-1"><li>Participar de reuniões de equipe semanalmente</li><li>Completar curso de comunicação interpessoal</li><li>Aprimorar conhecimentos em TypeScript (gap identificado)</li><li>Desenvolver iniciativa em projetos (gap crítico)</li><li>Solicitar feedback do líder mensalmente</li></ul></div></div></CardContent></Card>
          </>
        )}
      </main>
    </div>
  );
}