import { useState, useMemo } from "react";
import { ArrowLeft, Mail, Briefcase, Filter, Trash2, ClipboardCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, useNavigate } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { getGapColor, getGapColorClass } from "@/utils/colorUtils";
import { toast } from "@/hooks/use-toast";
import { softSkillTemplates } from "@/data/evaluationTemplates";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabaseClient"; // Importar o cliente Supabase

export default function MemberDetail() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { teamData, fetchTeamData } = useAuth(); // Adicionado fetchTeamData para atualizar a lista
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedEspecializacao, setSelectedEspecializacao] = useState<string>("all");
  const [radarViewMode, setRadarViewMode] = useState<"all" | "soft" | "custom">("all");
  const [selectedHardCategories, setSelectedHardCategories] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false); // Estado para o loading do botão de exclusão
  
  const liderado = teamData.find(m => m.id_usuario === memberId);

  if (!liderado) {
    return (
      <div className="p-8">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <p className="text-muted-foreground">Membro não encontrado</p>
      </div>
    );
  }

  const softSkills = liderado.competencias.filter(c => c.tipo === 'COMPORTAMENTAL');
  const hardSkills = liderado.competencias.filter(c => c.tipo === 'TECNICA');
  
  const availableCategories = Array.from(new Set(hardSkills.map(c => c.categoria_nome).filter(Boolean))) as string[];
  const availableEspecializacoes = Array.from(
    new Set(hardSkills.filter(c => c.especializacao_nome).map(c => c.especializacao_nome!))
  );

  const cargoTemplate = useMemo(
    () => softSkillTemplates.find((t) => t.id_cargo === liderado.id_cargo),
    [liderado.id_cargo],
  );

  const weightMap = useMemo(
    () => new Map(cargoTemplate?.competencias.map((c) => [c.id_competencia, c.peso ?? 0]) || []),
    [cargoTemplate],
  );

  const softSkillsRadarData = softSkills
    .filter((c) => (weightMap.get(c.id_competencia) || 0) > 0)
    .map(c => ({
    competency: c.nome_competencia,
    atual: c.pontuacao_1a4,
    ideal: 4.0,
    tipo: 'SOFT' as const,
  }));

  const hardSkillsRadarData = hardSkills.map(c => ({
    competency: c.nome_competencia,
    atual: c.pontuacao_1a4,
    ideal: 4.0,
    tipo: 'HARD' as const,
    categoria: c.categoria_nome,
  }));

  const getRadarData = () => {
    if (radarViewMode === "soft") return softSkillsRadarData;
    if (radarViewMode === "custom") {
      const filteredHard = hardSkillsRadarData.filter(hs => 
        selectedHardCategories.includes(hs.categoria!)
      );
      return [...softSkillsRadarData, ...filteredHard];
    }
    return [...softSkillsRadarData, ...hardSkillsRadarData];
  };

  const toggleHardCategory = (category: string) => {
    setSelectedHardCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const categoryPerformance = Array.from(
    hardSkills.reduce((acc, comp) => {
      const cat = comp.categoria_nome!;
      if (!acc.has(cat)) {
        acc.set(cat, { soma: 0, count: 0 });
      }
      const existing = acc.get(cat)!;
      existing.soma += comp.pontuacao_1a4;
      existing.count += 1;
      return acc;
    }, new Map<string, { soma: number; count: number }>())
  ).map(([cat, { soma, count }]) => ({
    category: cat,
    atual: soma / count,
    ideal: 4.0,
  }));

  const especializacaoPerformance = selectedCategory !== "all"
    ? Array.from(
        hardSkills
          .filter(c => c.categoria_nome === selectedCategory && c.especializacao_nome)
          .reduce((acc, comp) => {
            const esp = comp.especializacao_nome!;
            if (!acc.has(esp)) {
              acc.set(esp, { soma: 0, count: 0 });
            }
            const existing = acc.get(esp)!;
            existing.soma += comp.pontuacao_1a4;
            existing.count += 1;
            return acc;
          }, new Map<string, { soma: number; count: number }>())
      ).map(([esp, { soma, count }]) => ({
        especializacao: esp,
        atual: soma / count,
        ideal: 4.0,
      }))
    : [];

  const competenciaPerformance = selectedEspecializacao !== "all"
    ? hardSkills
        .filter(c => c.especializacao_nome === selectedEspecializacao)
        .map(c => ({
          competencia: c.nome_competencia,
          atual: c.pontuacao_1a4,
          ideal: 4.0,
        }))
    : [];

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-liderado', {
        body: { liderado_id: Number(memberId) },
        method: 'POST',
      });

      if (error) {
        throw new Error(error.message || "Erro desconhecido ao deletar liderado.");
      }
      
      if (data && (data as any).ok) {
        toast({
          title: "Liderado excluído!",
          description: `${liderado.nome} foi removido com sucesso da sua equipe.`,
        });
        await fetchTeamData(); // Atualiza os dados da equipe no contexto
        navigate("/team", { replace: true }); // Redireciona para a página da equipe
      } else {
        throw new Error((data as any)?.error || "Resposta inesperada da função de exclusão.");
      }
    } catch (err: any) {
      console.error("Erro ao deletar liderado:", err);
      toast({
        title: "Erro ao excluir liderado",
        description: err.message || "Não foi possível remover o liderado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEvaluateMember = () => {
    navigate(`/evaluation/${liderado.id_usuario}`);
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <Button onClick={() => navigate(-1)} variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleEvaluateMember} className="gap-2">
            <ClipboardCheck className="w-4 h-4" />
            Avaliar Competências
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2" disabled={isDeleting}>
                {isDeleting ? "Excluindo..." : <><Trash2 className="w-4 h-4" /> Excluir Liderado</>}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja excluir {liderado.nome}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação é irreversível. Todos os dados de perfil, avaliações e pontuações de {liderado.nome} serão permanentemente removidos do sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
                  {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-foreground">
              {liderado.nome.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-2">{liderado.nome}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Mail className="w-4 h-4" />
              <span>{liderado.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Briefcase className="w-4 h-4" />
              <span>{liderado.cargo_nome}</span>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="default" className="text-sm">
                  {liderado.ultima_avaliacao?.maturidade_quadrante || 'N/A'}
                </Badge>
                {liderado.categoria_dominante && liderado.categoria_dominante !== "Não Avaliado" && (
                  <Badge variant="secondary" className="text-sm bg-accent/20 text-accent-foreground">
                    {liderado.categoria_dominante}
                  </Badge>
                )}
                {liderado.especializacao_dominante && liderado.especializacao_dominante !== "Não Avaliado" && liderado.especializacao_dominante !== liderado.categoria_dominante && (
                  <Badge variant="secondary" className="text-sm bg-accent/10 text-accent-foreground">
                    {liderado.especializacao_dominante}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Gráfico de Gap de Conhecimento - VERSUS
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Comparação entre perfil atual e ideal
            </p>
          </div>
          <Select value={radarViewMode} onValueChange={(v: any) => setRadarViewMode(v)}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Competências</SelectItem>
              <SelectItem value="soft">Apenas Soft Skills</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {radarViewMode === "custom" && (
          <div className="mb-4 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium mb-3 text-foreground">Selecione Categorias Técnicas:</p>
            <div className="flex flex-wrap gap-3">
              {availableCategories.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox id={`cat-${cat}`} checked={selectedHardCategories.includes(cat)} onCheckedChange={() => toggleHardCategory(cat)} />
                  <label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">{cat}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={getRadarData()}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="competency" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 4]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Radar name="Perfil Atual" dataKey="atual" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
            <Radar name="Perfil Ideal" dataKey="ideal" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Análise de Competências</h3>
        <div className="space-y-3">
          {getRadarData().map((item) => (
            <div key={item.competency} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="font-medium text-foreground">{item.competency}</span>
              <div className="flex items-center gap-4">
                <span className={`text-sm ${getGapColorClass(item.atual)}`}>Atual: {item.atual.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">Ideal: {item.ideal.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Desempenho Detalhado (Drill-Down)</h3>
            <p className="text-sm text-muted-foreground mt-1">Filtre por categoria → especialização → competência</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Selecione Categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {availableCategories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
              </SelectContent>
            </Select>
            {selectedCategory !== "all" && especializacaoPerformance.length > 0 && (
              <Select value={selectedEspecializacao} onValueChange={setSelectedEspecializacao}>
                <SelectTrigger className="w-64"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Selecione Especialização" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Especializações</SelectItem>
                  {availableEspecializacoes.filter(esp => hardSkills.some(c => c.categoria_nome === selectedCategory && c.especializacao_nome === esp)).map(esp => (<SelectItem key={esp} value={esp}>{esp}</SelectItem>))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={selectedEspecializacao !== "all" ? competenciaPerformance : selectedCategory !== "all" ? especializacaoPerformance : categoryPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={selectedEspecializacao !== "all" ? "competencia" : selectedCategory !== "all" ? "especializacao" : "category"} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} angle={-15} textAnchor="end" height={80} />
            <YAxis domain={[0, 4]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="atual" fill="hsl(var(--primary))" name="Pontuação Atual" />
            <Bar dataKey="ideal" fill="hsl(var(--accent))" name="Pontuação Ideal" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>{selectedEspecializacao !== "all" ? `Exibindo competências da especialização "${selectedEspecializacao}"` : selectedCategory !== "all" ? `Exibindo especializações da categoria "${selectedCategory}"` : "Exibindo todas as categorias técnicas"}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Competências Técnicas por Categoria</h3>
        <div className="space-y-4">
          {Array.from(
            hardSkills.reduce((acc, comp) => {
              const cat = comp.categoria_nome!;
              if (!acc.has(cat)) {
                acc.set(cat, []);
              }
              acc.get(cat)!.push(comp);
              return acc;
            }, new Map<string, typeof hardSkills>())
          ).map(([categoria, competencias]) => (
            <div key={categoria}>
              <h4 className="font-semibold text-sm text-primary mb-2">{categoria}</h4>
              <div className="flex flex-wrap gap-2">
                {competencias.map((comp) => (
                  <Badge key={comp.id_competencia} variant="secondary" className="text-xs" style={{ backgroundColor: getGapColor(comp.pontuacao_1a4), color: comp.pontuacao_1a4 >= 3.5 ? '#fff' : '#000' }}>
                    {comp.nome_competencia} ({comp.pontuacao_1a4.toFixed(1)})
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
