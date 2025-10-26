import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Save, PlusCircle } from "lucide-react";
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
import { calcularNivelMaturidade } from "@/types/mer";
import EvaluationRadarChart from "@/components/EvaluationRadarChart";
import TechnicalEvaluationBlock from "@/components/TechnicalEvaluationBlock";

interface TechnicalBlockState {
  id: number;
  categoryId: string | null;
  scores: Record<string, number>;
}

let nextId = 0;

export default function Evaluation() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { profile, liderados, addAvaliacao } = useAuth();

  const [member, setMember] = useState<Liderado | undefined>(undefined);
  const [softTemplate, setSoftTemplate] = useState<SoftSkillTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  // Scores
  const [softScores, setSoftScores] = useState<Record<string, number>>({});
  const [technicalBlocks, setTechnicalBlocks] = useState<TechnicalBlockState[]>([]);

  useEffect(() => {
    const currentMember = liderados.find((l) => l.id === memberId);
    if (!currentMember) {
      toast({ variant: "destructive", title: "Liderado não encontrado" });
      navigate("/team", { replace: true });
      return;
    }
    setMember(currentMember);

    const template = softSkillTemplates.find(t => t.cargo_id === currentMember.cargo_id);
    setSoftTemplate(template || null);
    if (template) {
      const initialScores = template.competencias.reduce((acc, skill) => {
        acc[skill.id] = 1;
        return acc;
      }, {} as Record<string, number>);
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

    const techData = technicalBlocks.flatMap(block => {
      const category = technicalCategories.find(c => c.id === block.categoryId);
      if (!category) return [];
      
      return Object.entries(block.scores).map(([competencyId, score]) => {
        const competency = category.especializacoes
          .flatMap(s => s.competencias)
          .find(c => c.id === competencyId);
        
        return {
          competency: competency?.name || 'Desconhecida',
          atual: score,
          ideal: 4.0, // Ideal para hard skills é sempre 4
        };
      });
    });

    return [...softData, ...techData];
  }, [softScores, technicalBlocks, softTemplate]);

  const handleAddTechnicalBlock = () => {
    setTechnicalBlocks(prev => [...prev, { id: nextId++, categoryId: null, scores: {} }]);
  };

  const handleRemoveTechnicalBlock = (blockId: number) => {
    setTechnicalBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  const handleTechnicalScoresChange = (blockId: number, categoryId: string, scores: Record<string, number>) => {
    setTechnicalBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, categoryId, scores } : block
    ));
  };

  const handleCategoryChange = (blockId: number, newCategoryId: string | null) => {
     setTechnicalBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, categoryId: newCategoryId, scores: {} } : block
    ));
  };

  const availableCategoriesForNewBlock = useMemo(() => {
    const usedCategoryIds = new Set(technicalBlocks.map(b => b.categoryId).filter(Boolean));
    return technicalCategories.filter(c => !usedCategoryIds.has(c.id));
  }, [technicalBlocks]);

  const handleSaveEvaluation = () => {
    const allSoftScores = Object.values(softScores);
    const allTechScores = technicalBlocks.flatMap(b => Object.values(b.scores));

    if (allSoftScores.length === 0 && allTechScores.length === 0) {
      toast({ variant: "destructive", title: "Erro", description: "Nenhuma competência foi avaliada." });
      return;
    }

    const eixoY = allSoftScores.length > 0 ? allSoftScores.reduce((a, b) => a + b, 0) / allSoftScores.length : 0;
    const eixoX = allTechScores.length > 0 ? allTechScores.reduce((a, b) => a + b, 0) / allTechScores.length : 0;
    const nivel_maturidade = calcularNivelMaturidade(eixoY, eixoX);

    const novaAvaliacao = {
      id: `av-${Date.now()}`,
      id_lider: profile!.id,
      id_liderado: memberId!,
      eixo_x: parseFloat(eixoX.toFixed(2)),
      eixo_y: parseFloat(eixoY.toFixed(2)),
      nivel: nivel_maturidade,
      data: new Date().toISOString(),
    };

    addAvaliacao(novaAvaliacao);
    toast({ title: "Avaliação salva!", description: `A avaliação de ${member?.nome} foi concluída.` });
    navigate("/home");
  };

  if (loading) {
    return <div className="p-8 space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-96 w-full" /></div>;
  }

  if (!member) return null;

  return (
    <div className="p-8">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /> Voltar</Button>
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold">Avaliação de {member.nome}</h1>
        <p className="text-muted-foreground">Cargo: {softTemplate?.cargo_nome || member.cargo_id}</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competências Comportamentais</CardTitle>
              <CardDescription>Modelo ideal para {softTemplate?.cargo_nome}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {softTemplate?.competencias.map(skill => (
                <div key={skill.id}>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor={skill.id}>{skill.name} (Peso {skill.peso})</Label>
                    <Badge variant="outline">{softScores[skill.id]}</Badge>
                  </div>
                  <Slider id={skill.id} min={1} max={4} step={0.5} value={[softScores[skill.id] || 1]} onValueChange={([val]) => setSoftScores(prev => ({ ...prev, [skill.id]: val }))} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Radar de Competências</CardTitle>
              <CardDescription>Visualização em tempo real do perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <EvaluationRadarChart data={radarData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Competências Técnicas</CardTitle>
              <CardDescription>Adicione e avalie categorias técnicas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {technicalBlocks.map(block => (
                <TechnicalEvaluationBlock
                  key={block.id}
                  id={block.id}
                  availableCategories={availableCategoriesForNewBlock}
                  onScoresChange={handleTechnicalScoresChange}
                  onRemove={handleRemoveTechnicalBlock}
                  onCategoryChange={handleCategoryChange}
                />
              ))}
              {availableCategoriesForNewBlock.length > 0 && (
                <Button variant="outline" className="w-full gap-2" onClick={handleAddTechnicalBlock}>
                  <PlusCircle className="w-4 h-4" /> Adicionar Categoria Técnica
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveEvaluation} className="gap-2">
          <Save className="w-4 h-4" /> Salvar Avaliação Completa
        </Button>
      </div>
    </div>
  );
}