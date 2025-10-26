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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calcularNivelMaturidade } from "@/types/mer";
import EvaluationRadarChart from "@/components/EvaluationRadarChart";
import CategorySelectionModal from "@/components/CategorySelectionModal";

interface TechBlock {
  categoria_id: string;
  especializacao_id?: string;
  scores: Record<string, number>;
  completed: boolean;
}

export default function Evaluation() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { profile, liderados, addAvaliacao, avaliacoes } = useAuth();

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
    const currentMember = liderados.find((l) => l.id === memberId);
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
      if (!category || !block.especializacao_id) return [];
      
      const specialization = category.especializacoes.find(s => s.id === block.especializacao_id);
      return specialization?.competencias.map(comp => ({
        competency: comp.name,
        atual: block.scores[comp.id] || 0,
        ideal: 4.0,
      })) || [];
    });

    return [...softData, ...techData];
  }, [softScores, techBlocks, softTemplate]);

  const availableCategories = useMemo(() => {
    const usedCategoryIds = new Set(techBlocks.map(b => b.categoria_id));
    return technicalCategories.filter(c => !usedCategoryIds.has(c.id));
  }, [techBlocks]);

  const handleAddCategory = (categoryId: string) => {
    setTechBlocks(prev => [...prev, { categoria_id: categoryId, scores: {}, completed: false }]);
    setActiveTab(categoryId);
  };

  const handleEspecializacaoChange = (categoryId: string, especializacaoId: string) => {
    setTechBlocks(prev => prev.map(b => 
      b.categoria_id === categoryId ? { ...b, especializacao_id: especializacaoId, scores: {}, completed: false } : b
    ));
  };

  const handleScoreChange = (categoryId: string, competencyId: string, value: number) => {
    setTechBlocks(prev => prev.map(b => 
      b.categoria_id === categoryId ? { ...b, scores: { ...b.scores, [competencyId]: value }, completed: false } : b
    ));
  };

  const handleSaveBlock = (categoryId: string) => {
    setTechBlocks(prev => prev.map(b => 
      b.categoria_id === categoryId ? { ...b, completed: true } : b
    ));
    toast({ title: "Bloco salvo!", description: "As notas desta categoria foram salvas localmente." });
  };

  const isFinalSaveEnabled = techBlocks.every(b => b.completed);

  const handleSaveEvaluation = () => {
    if (!isFinalSaveEnabled) {
      const unsavedCount = techBlocks.filter(b => !b.completed).length;
      toast({ variant: "destructive", title: "Ação necessária", description: `Existem ${unsavedCount} categoria(s) técnica(s) não salva(s).` });
      return;
    }

    const allSoftScores = Object.values(softScores);
    const allTechScores = techBlocks.flatMap(b => Object.values(b.scores));

    const eixoY = allSoftScores.length > 0 ? allSoftScores.reduce((a, b) => a + b, 0) / allSoftScores.length : 0;
    const eixoX = allTechScores.length > 0 ? allTechScores.reduce((a, b) => a + b, 0) / allTechScores.length : 0;
    const nivel_maturidade = calcularNivelMaturidade(eixoY, eixoX);

    addAvaliacao({
      id: `av-${Date.now()}`,
      id_lider: profile!.id,
      id_liderado: memberId!,
      eixo_x: parseFloat(eixoX.toFixed(2)),
      eixo_y: parseFloat(eixoY.toFixed(2)),
      nivel: nivel_maturidade,
      data: new Date().toISOString(),
    });

    toast({ title: "Avaliação completa salva!", description: `A avaliação de ${member?.nome} foi concluída com sucesso.` });
    navigate("/evaluation");
  };

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-96 w-full" /></div>;
  if (!member) return null;

  const activeBlock = techBlocks.find(b => b.categoria_id === activeTab);
  const activeCategory = technicalCategories.find(c => c.id === activeTab);
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
          <p className="text-xl font-semibold text-foreground">{member.nome}</p>
          <Badge variant="secondary" className="capitalize">{member.cargo_id || "Não definido"}</Badge>
          {lastEvaluation && <Badge className="bg-primary/10 text-primary">{lastEvaluation.nivel}</Badge>}
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
              <CardTitle>Avaliação Técnica por Categoria</CardTitle>
              <CardDescription>Selecione ou adicione categorias técnicas para avaliar.</CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)} disabled={availableCategories.length === 0}><Plus className="w-4 h-4 mr-2" /> Adicionar Categoria</Button>
          </div>
        </CardHeader>
        <CardContent>
          {techBlocks.length > 0 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                {techBlocks.map(block => {
                  const category = technicalCategories.find(c => c.id === block.categoria_id);
                  return (
                    <TabsTrigger key={block.categoria_id} value={block.categoria_id} className="gap-2">
                      {category?.name}
                      {block.completed && <Check className="w-4 h-4 text-primary" />}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {techBlocks.map(block => (
                <TabsContent key={block.categoria_id} value={block.categoria_id} className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <Select onValueChange={(val) => handleEspecializacaoChange(block.categoria_id, val)} value={block.especializacao_id}>
                      <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Selecione uma Especialização" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicalCategories.find(c => c.id === block.categoria_id)?.especializacoes.map(spec => (
                          <SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                          <Slider min={1} max={4} step={0.5} value={[block.scores[comp.id] || 1]} onValueChange={([val]) => handleScoreChange(block.categoria_id, comp.id, val)} />
                        </div>
                      ))}
                      <div className="flex justify-end">
                        <Button onClick={() => handleSaveBlock(block.categoria_id)}>Salvar Bloco</Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Adicione uma categoria técnica para começar.</div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={handleSaveEvaluation} disabled={!isFinalSaveEnabled} className="gap-2">
          <Save className="w-4 h-4" /> Salvar Avaliação Completa
        </Button>
      </div>

      <CategorySelectionModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        availableCategories={availableCategories}
        onSelectCategory={handleAddCategory}
      />
    </div>
  );
}