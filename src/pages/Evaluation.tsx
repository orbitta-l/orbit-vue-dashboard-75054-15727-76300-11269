import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Save, Plus, Target, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth, Liderado } from "@/contexts/AuthContext";
import { softSkillTemplates, technicalCategories, SoftSkillTemplate } from "@/data/evaluationTemplates";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calcularNivelMaturidade, LideradoPerformance, CompetenciaTipo } from "@/types/mer";
import EvaluationRadarChart from "@/components/EvaluationRadarChart";
import SpecializationSelectionModal from "@/components/SpecializationSelectionModal";

interface TechBlock {
  categoria_id: string;
  especializacao_id: string;
  scores: Record<string, number>;
  completed: boolean;
}

export default function Evaluation() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { profile, liderados, addAvaliacao, avaliacoes, updateLideradoPerformance } = useAuth();

  const [member, setMember] = useState<Liderado | undefined>(undefined);
  const [softTemplate, setSoftTemplate] = useState<SoftSkillTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [softScores, setSoftScores] = useState<Record<string, number>>({});
  const [techBlocks, setTechBlocks] = useState<TechBlock[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  const lastEvaluation = useMemo(() => {
    return avaliacoes
      .filter(a => a.id_liderado === memberId)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
  }, [avaliacoes, memberId]);

  useEffect(() => {
    const currentMember = liderados.find((l) => l.id_liderado === memberId); // Usar id_liderado
    if (!currentMember) {
      toast({ variant: "destructive", title: "Liderado não encontrado" });
      navigate("/evaluation", { replace: true });
      return;
    }
    setMember(currentMember);

    const template = softSkillTemplates.find(t => t.cargo_id === currentMember.cargo_id);
    setSoftTemplate(template || null);
    if (template) {
      const initialScores = template.competencias.reduce((acc, skill) => ({ ...acc, [skill.id]: 1 }), {});
      setSoftScores(initialScores);
    }
    setLoading(false);
  }, [memberId, liderados, navigate]);

  const radarData = useMemo(() => {
    const softData = softTemplate?.competencias.map(skill => ({
      competency: skill.name,
      atual: softScores[skill.id] || 0,
      ideal: skill.nivel_ideal,
    })) || [];

    const techData = techBlocks.flatMap(block => {
      const category = technicalCategories.find(c => c.id === block.categoria_id);
      if (!category) return [];
      
      const specialization = category.especializacoes.find(s => s.id === block.especializacao_id);
      return specialization?.competencias.map(comp => ({
        competency: comp.name,
        atual: block.scores[comp.id] || 0,
        ideal: 4.0,
      })) || [];
    });

    return [...softData, ...techData];
  }, [softScores, techBlocks, softTemplate]);

  const selectedSpecializationIds = useMemo(() => techBlocks.map(b => b.especializacao_id), [techBlocks]);
  const allSpecializationIds = useMemo(() => technicalCategories.flatMap(c => c.especializacoes.map(s => s.id)), []);
  const canAddMore = selectedSpecializationIds.length < allSpecializationIds.length;

  const handleAddSpecialization = (categoryId: string, specializationId: string) => {
    const category = technicalCategories.find(c => c.id === categoryId);
    const specialization = category?.especializacoes.find(s => s.id === specializationId);
    const initialScores = specialization?.competencias.reduce((acc, comp) => ({ ...acc, [comp.id]: 1 }), {}) || {};

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
    if (!isFinalSaveEnabled) {
      const unsavedCount = techBlocks.filter(b => !b.completed).length;
      const message = unsavedCount > 0 
        ? `Existem ${unsavedCount} especialização(ões) técnica(s) não salva(s).`
        : "Adicione e salve pelo menos uma avaliação técnica.";
      toast({ variant: "destructive", title: "Ação necessária", description: message });
      return;
    }

    const allSoftScores = Object.values(softScores);
    const allTechScores = techBlocks.flatMap(b => Object.values(b.scores));

    const eixoY = allSoftScores.length > 0 ? allSoftScores.reduce((a, b) => a + b, 0) / allSoftScores.length : 0;
    const eixoX = allTechScores.length > 0 ? allTechScores.reduce((a, b) => a + b, 0) / allTechScores.length : 0;
    const nivel_maturidade = calcularNivelMaturidade(eixoY, eixoX);

    const newEvaluation = {
      id: `av-${Date.now()}`,
      id_lider: profile!.id,
      id_liderado: memberId!,
      eixo_x: parseFloat(eixoX.toFixed(2)),
      eixo_y: parseFloat(eixoY.toFixed(2)),
      nivel: nivel_maturidade,
      data: new Date().toISOString(),
    };
    addAvaliacao(newEvaluation);

    // Atualizar o objeto liderado no AuthContext com os novos dados de performance
    const updatedCompetencias = [
      ...(softTemplate?.competencias.map(skill => ({
        id_competencia: skill.id,
        nome_competencia: skill.name,
        tipo: 'COMPORTAMENTAL' as CompetenciaTipo,
        id_categoria: 'soft-skills-geral', // ID genérico para soft skills
        nome_categoria: 'Soft Skills',
        id_especializacao: null,
        nome_especializacao: null,
        media_pontuacao: softScores[skill.id] || 0,
      })) || []),
      ...techBlocks.flatMap(block => {
        const category = technicalCategories.find(c => c.id === block.categoria_id);
        const specialization = category?.especializacoes.find(s => s.id === block.especializacao_id);
        return specialization?.competencias.map(comp => ({
          id_competencia: comp.id,
          nome_competencia: comp.name,
          tipo: 'TECNICA' as CompetenciaTipo,
          id_categoria: block.categoria_id,
          nome_categoria: category?.name || 'N/A',
          id_especializacao: block.especializacao_id,
          nome_especializacao: specialization?.name || 'N/A',
          media_pontuacao: block.scores[comp.id] || 0,
        })) || [];
      }),
    ];

    // Determinar categoria e especialização dominante
    let categoriaDominante = 'Não Avaliado';
    let especializacaoDominante = 'Não Avaliado';

    if (updatedCompetencias.length > 0) {
      const techCompetencias = updatedCompetencias.filter(c => c.tipo === 'TECNICA');
      if (techCompetencias.length > 0) {
        const categoriaMedias: Record<string, { soma: number, count: number }> = {};
        techCompetencias.forEach(comp => {
          if (!categoriaMedias[comp.id_categoria]) {
            categoriaMedias[comp.id_categoria] = { soma: 0, count: 0 };
          }
          categoriaMedias[comp.id_categoria].soma += comp.media_pontuacao;
          categoriaMedias[comp.id_categoria].count++;
        });

        const mediasCalculadas = Object.entries(categoriaMedias).map(([id, { soma, count }]) => ({
          id_categoria: id,
          media: soma / count,
        }));

        const melhorCategoria = mediasCalculadas.sort((a, b) => b.media - a.media)[0];
        categoriaDominante = technicalCategories.find(c => c.id === melhorCategoria.id_categoria)?.name || 'N/A';

        const especializacaoMedias: Record<string, { soma: number, count: number }> = {};
        techCompetencias.filter(c => c.id_categoria === melhorCategoria.id_categoria && c.id_especializacao).forEach(comp => {
          if (!especializacaoMedias[comp.id_especializacao!]) {
            especializacaoMedias[comp.id_especializacao!] = { soma: 0, count: 0 };
          }
          especializacaoMedias[comp.id_especializacao!].soma += comp.media_pontuacao;
          especializacaoMedias[comp.id_especializacao!].count++;
        });

        const mediasEspecializacaoCalculadas = Object.entries(especializacaoMedias).map(([id, { soma, count }]) => ({
          id_especializacao: id,
          media: soma / count,
        }));

        const melhorEspecializacao = mediasEspecializacaoCalculadas.sort((a, b) => b.media - a.media)[0];
        const cat = technicalCategories.find(c => c.id === melhorCategoria.id_categoria);
        especializacaoDominante = cat?.especializacoes.find(s => s.id === melhorEspecializacao.id_especializacao)?.name || 'N/A';
      }
    }

    updateLideradoPerformance(memberId!, {
      eixo_x_tecnico_geral: newEvaluation.eixo_x,
      eixo_y_comportamental: newEvaluation.eixo_y,
      nivel_maturidade: newEvaluation.nivel,
      competencias: updatedCompetencias,
      categoria_dominante: categoriaDominante,
      especializacao_dominante: especializacaoDominante,
    });

    toast({ title: "Avaliação completa salva!", description: `A avaliação de ${member?.nome_liderado} foi concluída com sucesso.` });
    navigate("/evaluation");
  };

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-96 w-full" /></div>;
  if (!member) return null;

  const activeBlock = techBlocks.find(b => b.especializacao_id === activeTab);
  const activeCategory = technicalCategories.find(c => c.id === activeBlock?.categoria_id);
  const activeSpecialization = activeCategory?.especializacoes.find(s => s.id === activeBlock?.especializacao_id);

  return (
    <div className="p-8">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate("/evaluation")}><ArrowLeft className="w-4 h-4" /> Voltar para a Equipe</Button>
      
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Target className="w-6 h-6 text-primary" /></div>
          <h1 className="text-3xl font-bold text-foreground">Avaliação de Competências</h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xl font-semibold text-foreground">{member.nome_liderado}</p>
          <Badge variant="secondary" className="capitalize">{member.cargo || "Não definido"}</Badge>
          {lastEvaluation && <Badge className="bg-primary/10 text-primary">{lastEvaluation.nivel}</Badge>}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competências Comportamentais</CardTitle>
              <CardDescription>Avalie as habilidades de {member.nome_liderado}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {softTemplate?.competencias.map(skill => (
                <div key={skill.id}>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor={skill.id}>{skill.name} (Peso {skill.peso})</Label>
                    <Badge variant="outline">{softScores[skill.id]}/4</Badge>
                  </div>
                  <Slider id={skill.id} min={1} max={4} step={0.5} value={[softScores[skill.id] || 1]} onValueChange={([val]) => setSoftScores(prev => ({ ...prev, [skill.id]: val }))} />
                </div>
              ))}
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
                  const category = technicalCategories.find(c => c.id === block.categoria_id);
                  const specialization = category?.especializacoes.find(s => s.id === block.especializacao_id);
                  return (
                    <TabsTrigger key={block.especializacao_id} value={block.especializacao_id} className="gap-2">
                      {specialization?.name}
                      {block.completed && <Check className="w-4 h-4 text-primary" />}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {techBlocks.map(block => (
                <TabsContent key={block.especializacao_id} value={block.especializacao_id} className="pt-4">
                  <div className="flex justify-between items-center mb-4 p-3 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold">{activeCategory?.name} &gt; {activeSpecialization?.name}</h3>
                    <Badge variant={block.completed ? "default" : "secondary"}>{block.completed ? "Salvo" : "Não salvo"}</Badge>
                  </div>
                  {activeSpecialization && (
                    <div className="space-y-4">
                      {activeSpecialization.competencias.map(comp => (
                        <div key={comp.id}>
                          <div className="flex justify-between items-center mb-2">
                            <Label>{comp.name}</Label>
                            <Badge variant="outline">{block.scores[comp.id] || "N/A"}/4</Badge>
                          </div>
                          <Slider min={1} max={4} step={0.5} value={[block.scores[comp.id] || 1]} onValueChange={([val]) => handleScoreChange(block.especializacao_id, comp.id, val)} />
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