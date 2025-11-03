import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Save, Plus, Target, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { softSkillTemplates, technicalTemplate } from "@/data/evaluationTemplates";
import { MOCK_COMPETENCIAS, MOCK_CARGOS } from "@/data/mockData";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calcularNivelMaturidade, PontuacaoAvaliacao, Avaliacao, Usuario } from "@/types/mer";
import EvaluationRadarChart from "@/charts/EvaluationRadarChart";
import SpecializationSelectionModal from "@/components/SpecializationSelectionModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TechBlock {
  categoria_id: string;
  especializacao_id: string;
  scores: Record<string, number>;
  completed: boolean;
}

// Helper para buscar a descrição da competência
const getCompetencyDescription = (id: string) => {
  return MOCK_COMPETENCIAS.find(c => c.id_competencia === id)?.descricao || "Descrição não disponível.";
};

export default function Evaluation() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { profile, liderados, addAvaliacao, avaliacoes } = useAuth();

  const [member, setMember] = useState<Usuario | undefined>(undefined);
  const [softTemplate, setSoftTemplate] = useState<(typeof softSkillTemplates)[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [softScores, setSoftScores] = useState<Record<string, number>>({});
  const [techBlocks, setTechBlocks] = useState<TechBlock[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  const lastEvaluation = useMemo(() => {
    return avaliacoes
      .filter(a => a.liderado_id === memberId)
      .sort((a, b) => new Date(b.data_avaliacao).getTime() - new Date(a.data_avaliacao).getTime())[0];
  }, [avaliacoes, memberId]);

  useEffect(() => {
    const currentMember = liderados.find((l) => l.id_usuario === memberId);
    if (!currentMember) {
      toast({ variant: "destructive", title: "Liderado não encontrado" });
      navigate("/evaluation", { replace: true });
      return;
    }
    setMember(currentMember);

    const template = softSkillTemplates.find(t => t.id_cargo === currentMember.id_cargo);
    setSoftTemplate(template || null);
    if (template) {
      const initialScores = template.competencias.reduce((acc, skill) => ({ ...acc, [skill.id_competencia]: 1 }), {});
      setSoftScores(initialScores);
    }
    setLoading(false);
  }, [memberId, liderados, navigate]);

  const radarData = useMemo(() => {
    const softData = softTemplate?.competencias.map(skill => ({
      competency: MOCK_COMPETENCIAS.find(c => c.id_competencia === skill.id_competencia)?.nome_competencia || 'N/A',
      atual: softScores[skill.id_competencia] || 0,
      ideal: skill.nota_ideal,
    })) || [];

    const techData = techBlocks.flatMap(block => {
      const category = technicalTemplate.find(c => c.id_categoria === block.categoria_id);
      if (!category) return [];
      
      const specialization = category.especializacoes.find(s => s.id_especializacao === block.especializacao_id);
      return specialization?.competencias.map(comp => ({
        competency: comp.nome_competencia,
        atual: block.scores[comp.id_competencia] || 0,
        ideal: 4.0,
      })) || [];
    });

    return [...softData, ...techData];
  }, [softScores, techBlocks, softTemplate]);

  const selectedSpecializationIds = useMemo(() => techBlocks.map(b => b.especializacao_id), [techBlocks]);
  const allSpecializationIds = useMemo(() => technicalTemplate.flatMap(c => c.especializacoes.map(s => s.id_especializacao)), []);
  const canAddMore = selectedSpecializationIds.length < allSpecializationIds.length;

  const handleAddSpecialization = (categoryId: string, specializationId: string) => {
    const category = technicalTemplate.find(c => c.id_categoria === categoryId);
    const specialization = category?.especializacoes.find(s => s.id_especializacao === specializationId);
    const initialScores = specialization?.competencias.reduce((acc, comp) => ({ ...acc, [comp.id_competencia]: 1 }), {}) || {};

    setTechBlocks(prev => [...prev, { 
      categoria_id: categoryId, 
      especializacao_id: specializationId,
      scores: initialScores, 
      completed: false 
    }]);
    setActiveTab(specializationId);
  };

  const handleScoreChange = (specializationId: string, competencyId: string, value: number) => {
    setTechBlocks(prev => prev.map(b => 
      b.especializacao_id === specializationId ? { ...b, scores: { ...b.scores, [competencyId]: value }, completed: false } : b
    ));
  };

  const handleSaveBlock = (specializationId: string) => {
    setTechBlocks(prev => prev.map(b => 
      b.especializacao_id === specializationId ? { ...b, completed: true } : b
    ));
    toast({ title: "Bloco salvo!", description: "As notas desta especialização foram salvas localmente." });
  };

  const isFinalSaveEnabled = techBlocks.length > 0 && techBlocks.every(b => b.completed);

  const handleSaveEvaluation = () => {
    if (!isFinalSaveEnabled || !member) {
      toast({ variant: "destructive", title: "Ação necessária", description: "Adicione e salve pelo menos uma avaliação técnica." });
      return;
    }

    const allSoftScores = Object.values(softScores);
    const allTechScores = techBlocks.flatMap(b => Object.values(b.scores));

    const media_comportamental_1a4 = allSoftScores.length > 0 ? allSoftScores.reduce((a, b) => a + b, 0) / allSoftScores.length : 0;
    const media_tecnica_1a4 = allTechScores.length > 0 ? allTechScores.reduce((a, b) => a + b, 0) / allTechScores.length : 0;
    const maturidade_quadrante = calcularNivelMaturidade(media_tecnica_1a4, media_comportamental_1a4);

    const newEvaluation: Avaliacao = {
      id_avaliacao: `av-${Date.now()}`,
      lider_id: profile!.id_usuario,
      liderado_id: memberId!,
      id_cargo: member.id_cargo,
      media_tecnica_1a4: parseFloat(media_tecnica_1a4.toFixed(2)),
      media_comportamental_1a4: parseFloat(media_comportamental_1a4.toFixed(2)),
      maturidade_quadrante,
      data_avaliacao: new Date().toISOString(),
      status: 'CONCLUIDA',
      observacoes: ''
    };

    const newPontuacoes: PontuacaoAvaliacao[] = [
      ...(softTemplate?.competencias.map(skill => ({
        id_avaliacao: newEvaluation.id_avaliacao,
        id_competencia: skill.id_competencia,
        pontuacao_1a4: softScores[skill.id_competencia] || 0,
        peso_aplicado: skill.peso,
      })) || []),
      ...techBlocks.flatMap(block => {
        const specialization = technicalTemplate
          .flatMap(c => c.especializacoes)
          .find(s => s.id_especializacao === block.especializacao_id);
        return specialization?.competencias.map(comp => ({
          id_avaliacao: newEvaluation.id_avaliacao,
          id_competencia: comp.id_competencia,
          pontuacao_1a4: block.scores[comp.id_competencia] || 0,
          peso_aplicado: null,
        })) || [];
      }),
    ];

    addAvaliacao(newEvaluation, newPontuacoes);

    toast({ title: "Avaliação completa salva!", description: `A avaliação de ${member?.nome} foi concluída com sucesso.` });
    navigate("/evaluation");
  };

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-96 w-full" /></div>;
  if (!member) return null;

  const activeBlock = techBlocks.find(b => b.especializacao_id === activeTab);
  const activeCategory = technicalTemplate.find(c => c.id_categoria === activeBlock?.categoria_id);
  const activeSpecialization = activeCategory?.especializacoes.find(s => s.id_especializacao === activeBlock?.especializacao_id);

  return (
    <div className="p-8">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate("/evaluation")}><ArrowLeft className="w-4 h-4" /> Voltar para a Equipe</Button>
      
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Target className="w-6 h-6 text-primary" /></div>
          <h1 className="text-3xl font-bold text-foreground">Avaliação de Competências</h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xl font-semibold text-foreground">{member.nome}</p>
          <Badge variant="secondary" className="capitalize">{MOCK_CARGOS.find(c => c.id_cargo === member.id_cargo)?.nome_cargo || "Não definido"}</Badge>
          {lastEvaluation && <Badge className="bg-primary/10 text-primary">{lastEvaluation.maturidade_quadrante}</Badge>}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competências Comportamentais</CardTitle>
              <CardDescription>Avalie as habilidades de {member.nome}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {softTemplate?.competencias.map(skill => {
                const competencyDetails = MOCK_COMPETENCIAS.find(c => c.id_competencia === skill.id_competencia);
                return (
                  <div key={skill.id_competencia}>
                    <div className="flex justify-between items-center mb-2">
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Label htmlFor={skill.id_competencia} className="cursor-help hover:text-primary transition-colors">
                            {competencyDetails?.nome_competencia} (Peso {skill.peso})
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-semibold mb-1">{competencyDetails?.nome_competencia}</p>
                          <p className="text-sm">{getCompetencyDescription(skill.id_competencia)}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Badge variant="outline">{softScores[skill.id_competencia]}/4</Badge>
                    </div>
                    <Slider id={skill.id_competencia} min={1} max={4} step={0.5} value={[softScores[skill.id_competencia] || 1]} onValueChange={([val]) => setSoftScores(prev => ({ ...prev, [skill.id_competencia]: val }))} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Competências — Atual vs Ideal</CardTitle>
            </CardHeader>
            <CardContent>
              <EvaluationRadarChart data={radarData} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Avaliação Técnica por Especialização</CardTitle>
              <CardDescription>Adicione as especializações técnicas que deseja avaliar.</CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)} disabled={!canAddMore}><Plus className="w-4 h-4 mr-2" /> Adicionar Avaliação Técnica</Button>
          </div>
        </CardHeader>
        <CardContent>
          {techBlocks.length > 0 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex flex-wrap h-auto">
                {techBlocks.map(block => {
                  const category = technicalTemplate.find(c => c.id_categoria === block.categoria_id);
                  const specialization = category?.especializacoes.find(s => s.id_especializacao === block.especializacao_id);
                  return (
                    <TabsTrigger key={block.especializacao_id} value={block.especializacao_id} className="gap-2">
                      {specialization?.nome_especializacao}
                      {block.completed && <Check className="w-4 h-4 text-primary" />}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {techBlocks.map(block => (
                <TabsContent key={block.especializacao_id} value={block.especializacao_id} className="pt-4">
                  <div className="flex justify-between items-center mb-4 p-3 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold">{activeCategory?.nome_categoria} &gt; {activeSpecialization?.nome_especializacao}</h3>
                    <Badge variant={block.completed ? "default" : "secondary"}>{block.completed ? "Salvo" : "Não salvo"}</Badge>
                  </div>
                  {activeSpecialization && (
                    <div className="space-y-4">
                      {activeSpecialization.competencias.map(comp => (
                        <div key={comp.id_competencia}>
                          <div className="flex justify-between items-center mb-2">
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger asChild>
                                <Label className="cursor-help hover:text-primary transition-colors">
                                  {comp.nome_competencia}
                                </Label>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="font-semibold mb-1">{comp.nome_competencia}</p>
                                <p className="text-sm">{getCompetencyDescription(comp.id_competencia)}</p>
                              </TooltipContent>
                            </Tooltip>
                            <Badge variant="outline">{block.scores[comp.id_competencia] || "N/A"}/4</Badge>
                          </div>
                          <Slider min={1} max={4} step={0.5} value={[block.scores[comp.id_competencia] || 1]} onValueChange={([val]) => handleScoreChange(block.especializacao_id, comp.id_competencia, val)} />
                        </div>
                      ))}
                      <div className="flex justify-end">
                        <Button onClick={() => handleSaveBlock(block.especializacao_id)}>Salvar Bloco</Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Adicione uma avaliação técnica para começar.</div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={handleSaveEvaluation} disabled={!isFinalSaveEnabled} className="gap-2">
          <Save className="w-4 h-4" /> Salvar Avaliação Completa
        </Button>
      </div>

      <SpecializationSelectionModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        alreadySelected={selectedSpecializationIds}
        onSelectSpecialization={handleAddSpecialization}
      />
    </div>
  );
}