import { useState, useEffect } from "react";
import { ArrowLeft, Target, Plus, Trash2, Save, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useNavigate } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { toast } from "@/hooks/use-toast";
import { technicalTemplates, type TechnicalCategoryTemplate } from "./EvaluationTemplates";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const teamMembers = [
  { id: "1", name: "Ana Silva", role: "Estagiário", maturityLevel: "M2", initials: "AS" },
  { id: "2", name: "Pedro Santos", role: "Especialista I", maturityLevel: "M3", initials: "PS" },
  { id: "3", name: "Mariana Costa", role: "Senior", maturityLevel: "M4", initials: "MC" },
  { id: "4", name: "Roberto Lima", role: "Pleno", maturityLevel: "M3", initials: "RL" },
];

const behavioralCompetencies = [
  { id: 1, name: "Comunicação", weight: 2, max: 5 },
  { id: 2, name: "Trabalho em Equipe", weight: 3, max: 5 },
  { id: 3, name: "Capacidade de Aprendizado", weight: 3, max: 5 },
  { id: 4, name: "Iniciativa", weight: 1, max: 5 },
  { id: 5, name: "Adaptabilidade", weight: 2, max: 5 },
];

const idealScores: Record<number, number> = {
  1: 5, 2: 5, 3: 5, 4: 4, 5: 5
};

interface TechnicalSkill {
  id: string;
  name: string;
  score: number;
}

interface TechnicalCategory {
  id: string;
  name: string;
  skills: TechnicalSkill[];
  completed?: boolean;
}

export default function Evaluation() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const member = teamMembers.find(m => m.id === memberId);
  
  const [scores, setScores] = useState<Record<number, number>>({
    1: 3, 2: 3, 3: 3, 4: 3, 5: 3
  });
  
  const [technicalCategories, setTechnicalCategories] = useState<TechnicalCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  const handleScoreChange = (id: number, value: number[]) => {
    setScores({ ...scores, [id]: value[0] });
  };

  const handleTechnicalScoreChange = (categoryId: string, skillId: string, value: number[]) => {
    setTechnicalCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId
          ? {
              ...cat,
              skills: cat.skills.map(skill =>
                skill.id === skillId ? { ...skill, score: value[0] } : skill
              )
            }
          : cat
      )
    );
  };

  const handleAddTemplateCategory = (template: TechnicalCategoryTemplate) => {
    const newCategory: TechnicalCategory = {
      id: Date.now().toString(),
      name: template.name,
      skills: template.skills.map(skill => ({
        id: Date.now().toString() + Math.random(),
        name: skill.name,
        score: 2,
      })),
      completed: false,
    };
    setTechnicalCategories([...technicalCategories, newCategory]);
    setActiveCategoryId(newCategory.id);
    setIsTemplateDialogOpen(false);
    toast({
      title: "Template adicionado!",
      description: `A categoria "${template.name}" foi adicionada com sucesso.`,
    });
  };

  const handleSaveCategoryBlock = (categoryId: string) => {
    setTechnicalCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, completed: true } : cat
      )
    );
    toast({
      title: "Bloco salvo!",
      description: "As avaliações desta categoria foram salvas.",
    });
  };

  const handleSaveEvaluation = () => {
    const incompleteCategoriesCount = technicalCategories.filter(cat => !cat.completed).length;
    
    if (incompleteCategoriesCount > 0) {
      toast({
        title: "Atenção!",
        description: `Existem ${incompleteCategoriesCount} categoria(s) técnica(s) não salva(s). Salve todos os blocos antes de finalizar.`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Avaliação completa salva!",
      description: "Todas as avaliações foram salvas com sucesso.",
    });
    navigate("/evaluation");
  };

  if (!member) {
    return <div className="p-8">Membro não encontrado</div>;
  }

  // Dados do gráfico radar - Atualiza em tempo real
  const radarData = behavioralCompetencies.map(comp => ({
    competency: comp.name,
    atual: scores[comp.id] || 0,
    ideal: idealScores[comp.id] || 5
  }));

  // Adiciona skills técnicas da categoria ativa ao gráfico radar
  const activeCategory = technicalCategories.find(cat => cat.id === activeCategoryId);
  if (activeCategory) {
    activeCategory.skills.forEach(skill => {
      radarData.push({
        competency: skill.name,
        atual: skill.score,
        ideal: 4,
      });
    });
  }

  return (
    <div className="p-8">
      <Button 
        variant="ghost" 
        className="mb-6 gap-2"
        onClick={() => navigate("/evaluation")}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a Equipe
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-accent/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-primary dark:text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Avaliação de Competências</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-foreground font-medium">{member.name}</span>
          <Badge variant="secondary">{member.role}</Badge>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {member.maturityLevel}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Competências Comportamentais */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Competências Comportamentais</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Avalie as habilidades comportamentais de {member.name}
            </p>

            <div className="space-y-6">
              {behavioralCompetencies.map((competency) => (
                <div key={competency.id}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">{competency.name}</p>
                      <p className="text-sm text-muted-foreground">Peso: {competency.weight}</p>
                    </div>
                    <span className="text-lg font-semibold text-foreground">
                      {scores[competency.id] || 0}/{competency.max}
                    </span>
                  </div>
                  <Slider
                    value={[scores[competency.id] || 0]}
                    onValueChange={(value) => handleScoreChange(competency.id, value)}
                    max={competency.max}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Gráfico Radar com atualização em tempo real */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              Competências - Atual vs Ideal
            </h2>
            
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--muted-foreground) / 0.2)" />
                <PolarAngleAxis 
                  dataKey="competency" 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 5]} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                />
                <Radar
                  name="Avaliação Atual"
                  dataKey="atual"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.5}
                />
                <Radar
                  name="Meta Ideal"
                  dataKey="ideal"
                  stroke="hsl(var(--accent))"
                  fill="transparent"
                  strokeDasharray="5 5"
                  fillOpacity={0}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Avaliação Técnica - Sistema de Blocos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Avaliação Técnica por Categoria</h2>
              <p className="text-sm text-muted-foreground">
                Selecione ou adicione categorias técnicas usando templates pré-definidos. Avalie e salve cada bloco individualmente (Escala 1-4)
              </p>
            </div>
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Categoria
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Selecione um Template de Categoria Técnica</DialogTitle>
                  <DialogDescription>
                    Escolha uma categoria com competências pré-definidas
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-h-96 overflow-y-auto">
                  {technicalTemplates.map((template) => (
                    <Card 
                      key={template.id}
                      className="p-4 hover:border-primary cursor-pointer transition-all"
                      onClick={() => handleAddTemplateCategory(template)}
                    >
                      <h3 className="font-semibold text-foreground mb-2">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-foreground">Competências incluídas:</p>
                        {template.skills.slice(0, 3).map((skill) => (
                          <p key={skill.id} className="text-xs text-muted-foreground">• {skill.name}</p>
                        ))}
                        {template.skills.length > 3 && (
                          <p className="text-xs text-muted-foreground">+ {template.skills.length - 3} mais...</p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabs de Categorias */}
          {technicalCategories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma categoria técnica adicionada ainda.</p>
              <p className="text-sm mt-2">Clique em "Adicionar Categoria" para começar usando templates.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Lista de Categorias como Tabs */}
              <div className="flex gap-2 flex-wrap border-b border-border pb-2">
                {technicalCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategoryId === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategoryId(category.id)}
                    className="gap-2"
                  >
                    {category.name}
                    {category.completed && <Check className="w-3 h-3" />}
                  </Button>
                ))}
              </div>

              {/* Conteúdo da Categoria Ativa */}
              {activeCategory && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground text-lg">{activeCategory.name}</h3>
                    <Badge variant={activeCategory.completed ? "default" : "secondary"}>
                      {activeCategory.completed ? "Salvo" : "Não salvo"}
                    </Badge>
                  </div>

                  {/* Skills da categoria ativa */}
                  <div className="space-y-4">
                    {activeCategory.skills.map((skill) => (
                      <div key={skill.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-medium text-foreground">{skill.name}</p>
                          <span className="text-lg font-semibold text-foreground">
                            {skill.score}/4
                          </span>
                        </div>
                        <Slider
                          value={[skill.score]}
                          onValueChange={(value) => handleTechnicalScoreChange(activeCategory.id, skill.id, value)}
                          max={4}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Botão Salvar Bloco */}
                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button 
                      onClick={() => handleSaveCategoryBlock(activeCategory.id)}
                      variant={activeCategory.completed ? "outline" : "default"}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {activeCategory.completed ? "Atualizar Bloco" : "Salvar Bloco"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSaveEvaluation} 
          size="lg" 
          className="px-8 gap-2"
          disabled={technicalCategories.length > 0 && technicalCategories.some(cat => !cat.completed)}
        >
          <Save className="w-4 h-4" />
          Salvar Avaliação Completa
        </Button>
      </div>
    </div>
  );
}
