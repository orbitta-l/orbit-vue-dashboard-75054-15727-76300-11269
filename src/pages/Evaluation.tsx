import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth, Liderado } from "@/contexts/AuthContext";
import { technicalTemplates, TechnicalCategoryTemplate } from "./EvaluationTemplates";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calcularNivelMaturidade } from "@/types/mer";
import { Badge } from "@/components/ui/badge";

const softSkillsTemplate = [
  { id: "comunicacao", name: "Comunicação" },
  { id: "trabalho-equipe", name: "Trabalho em Equipe" },
  { id: "lideranca", name: "Liderança" },
  { id: "resolucao-problemas", name: "Resolução de Problemas" },
];

export default function Evaluation() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { profile, liderados, addAvaliacao } = useAuth();

  const [member, setMember] = useState<Liderado | undefined>(undefined);
  const [cargoDefinido, setCargoDefinido] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(true);
  const [template, setTemplate] = useState<TechnicalCategoryTemplate | null>(null);
  
  const [softScores, setSoftScores] = useState<Record<string, number>>({});
  const [technicalScores, setTechnicalScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const initialScores = softSkillsTemplate.reduce((acc, skill) => {
      acc[skill.id] = 1;
      return acc;
    }, {} as Record<string, number>);
    setSoftScores(initialScores);
  }, []);

  useEffect(() => {
    const currentMember = liderados.find((l) => l.id === memberId);
    if (!currentMember) {
      toast({
        variant: "destructive",
        title: "Liderado não encontrado",
        description: "Selecione um liderado válido antes de avaliar.",
      });
      navigate("/team", { replace: true });
    } else {
      setMember(currentMember);
      setCargoDefinido(!!currentMember.cargo_id);
    }
  }, [memberId, liderados, navigate]);

  useEffect(() => {
    if (member && cargoDefinido) {
      setTemplateLoading(true);
      setTimeout(() => {
        const foundTemplate = technicalTemplates[1]; // Mock: find template for cargo
        setTemplate(foundTemplate);
        if (foundTemplate) {
          const initialScores = foundTemplate.skills.reduce((acc, skill) => {
            acc[skill.id] = 1;
            return acc;
          }, {} as Record<string, number>);
          setTechnicalScores(initialScores);
        }
        setTemplateLoading(false);
      }, 800);
    } else {
      setTemplateLoading(false);
    }
  }, [member, cargoDefinido]);

  const handleSaveEvaluation = () => {
    const allSoftScores = Object.values(softScores);
    const allTechScores = Object.values(technicalScores);

    if (allSoftScores.length === 0 || allTechScores.length === 0) {
        toast({ variant: "destructive", title: "Erro", description: "Avalie todas as competências." });
        return;
    }

    const eixoY = allSoftScores.reduce((a, b) => a + b, 0) / allSoftScores.length;
    const eixoX = allTechScores.reduce((a, b) => a + b, 0) / allTechScores.length;

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

    toast({
      title: "Avaliação salva!",
      description: `A avaliação de ${member?.nome} foi concluída.`,
    });
    navigate("/home");
  };

  if (!member) return null;

  if (!cargoDefinido) {
    return (
      <div className="p-8">
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Defina o cargo do liderado</h2>
          <p className="text-muted-foreground mb-4">
            Antes de iniciar a avaliação, é necessário informar o cargo do colaborador.
          </p>
          <Button onClick={() => navigate(`/team`)} className="gap-2">
            <Edit className="w-4 h-4" /> Ir para a tela de equipe
          </Button>
        </Card>
      </div>
    );
  }

  if (templateLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!template) {
    return <div className="p-8">Template de avaliação não encontrado para este cargo.</div>;
  }

  return (
    <div className="p-8">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Button>
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold">Avaliação de {member.nome}</h1>
        <p className="text-muted-foreground">Cargo: {member.cargo_id}</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Competências Comportamentais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {softSkillsTemplate.map(skill => (
              <div key={skill.id}>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor={skill.id}>{skill.name}</Label>
                  <Badge variant="outline">{softScores[skill.id]}</Badge>
                </div>
                <Slider
                  id={skill.id}
                  min={1} max={4} step={0.5}
                  value={[softScores[skill.id]]}
                  onValueChange={([val]) => setSoftScores(prev => ({ ...prev, [skill.id]: val }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Competências Técnicas - {template.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {template.skills.map(skill => (
              <div key={skill.id}>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor={skill.id}>{skill.name}</Label>
                  <Badge variant="outline">{technicalScores[skill.id]}</Badge>
                </div>
                <Slider
                  id={skill.id}
                  min={1} max={4} step={0.5}
                  value={[technicalScores[skill.id]]}
                  onValueChange={([val]) => setTechnicalScores(prev => ({ ...prev, [skill.id]: val }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveEvaluation} className="gap-2">
          <Save className="w-4 h-4" /> Salvar Avaliação
        </Button>
      </div>
    </div>
  );
}