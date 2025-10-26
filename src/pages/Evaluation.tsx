import { useState, useEffect } from "react";
import { ArrowLeft, Save, PlusCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth, Liderado } from "@/contexts/AuthContext";
import { 
  softSkillTemplates, 
  technicalCategories, 
  cargoToCategoryMapping,
  SoftSkillTemplate,
  TechnicalCategory,
} from "@/data/evaluationTemplates";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { calcularNivelMaturidade } from "@/types/mer";

export default function Evaluation() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { profile, liderados, addAvaliacao } = useAuth();

  const [member, setMember] = useState<Liderado | undefined>(undefined);
  const [softTemplate, setSoftTemplate] = useState<SoftSkillTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  // Scores
  const [softScores, setSoftScores] = useState<Record<string, number>>({});
  const [technicalScores, setTechnicalScores] = useState<Record<string, number>>({});

  // Hard Skills Evaluation State
  const [availableCategories, setAvailableCategories] = useState<TechnicalCategory[]>([]);
  const [selectedTechCategory, setSelectedTechCategory] = useState<TechnicalCategory | null>(null);
  const [isCategoryLocked, setIsCategoryLocked] = useState(false);
  
  // State for category change confirmation
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const currentMember = liderados.find((l) => l.id === memberId);
    if (!currentMember) {
      toast({ variant: "destructive", title: "Liderado não encontrado" });
      navigate("/team", { replace: true });
      return;
    }
    setMember(currentMember);

    if (!currentMember.cargo_id) {
      setLoading(false);
      return;
    }

    const template = softSkillTemplates.find(t => t.cargo_id === currentMember.cargo_id);
    setSoftTemplate(template || null);
    if (template) {
      const initialScores = template.competencias.reduce((acc, skill) => {
        acc[skill.id] = 1;
        return acc;
      }, {} as Record<string, number>);
      setSoftScores(initialScores);
    }
    
    const allowedCategoryIds = cargoToCategoryMapping[currentMember.cargo_id] || [];
    const filteredCategories = technicalCategories.filter(cat => allowedCategoryIds.includes(cat.id));
    setAvailableCategories(filteredCategories);

    setLoading(false);
  }, [memberId, liderados, navigate]);

  const handleCategorySelect = (categoryId: string) => {
    if (Object.keys(technicalScores).length > 0) {
      setPendingCategoryId(categoryId);
      setIsConfirmModalOpen(true);
    } else {
      applyCategoryChange(categoryId);
    }
  };

  const applyCategoryChange = (categoryId: string) => {
    const newCategory = availableCategories.find(c => c.id === categoryId);
    if (newCategory) {
      setSelectedTechCategory(newCategory);
      setTechnicalScores({}); // Clear previous scores
      setIsCategoryLocked(true);
    }
    setIsConfirmModalOpen(false);
    setPendingCategoryId(null);
  };

  const handleConfirmCategoryChange = () => {
    if (pendingCategoryId) {
      applyCategoryChange(pendingCategoryId);
    }
  };

  const handleUnlockCategory = () => {
    if (Object.keys(technicalScores).length > 0) {
      setPendingCategoryId(null); // Indicate we want to clear, not change
      setIsConfirmModalOpen(true);
    } else {
      setIsCategoryLocked(false);
      setSelectedTechCategory(null);
    }
  };

  const handleSaveEvaluation = () => {
    const allSoftScores = Object.values(softScores);
    const allTechScores = Object.values(technicalScores);

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
      <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Ação</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação descartará todas as notas técnicas atuais. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingCategoryId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCategoryChange}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /> Voltar</Button>
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold">Avaliação de {member.nome}</h1>
        <p className="text-muted-foreground">Cargo: {softTemplate?.cargo_nome || member.cargo_id}</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Competências Comportamentais</CardTitle>
            <CardDescription>Modelo ideal para {softTemplate?.cargo_nome}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {softTemplate?.competencias.map(skill => (
              <div key={skill.id}>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor={skill.id}>{skill.name}</Label>
                  <Badge variant="outline">{softScores[skill.id]}</Badge>
                </div>
                <Slider id={skill.id} min={1} max={4} step={0.5} value={[softScores[skill.id] || 1]} onValueChange={([val]) => setSoftScores(prev => ({ ...prev, [skill.id]: val }))} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Competências Técnicas</CardTitle>
            <CardDescription>Selecione uma categoria e avalie as especializações.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Categoria Técnica (única por avaliação)</Label>
              <div className="flex gap-2">
                <Select onValueChange={handleCategorySelect} disabled={isCategoryLocked}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma Categoria" />
                  </SelectTrigger>
                  <SelectContent>{availableCategories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent>
                </Select>
                {isCategoryLocked && (
                  <Button variant="outline" size="sm" onClick={handleUnlockCategory}>Trocar</Button>
                )}
              </div>
            </div>

            {!selectedTechCategory ? (
              <div className="text-center text-muted-foreground p-4 border-dashed border-2 rounded-lg">
                <p>Selecione uma categoria para iniciar a avaliação técnica.</p>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {selectedTechCategory.especializacoes.map(spec => (
                  <AccordionItem value={spec.id} key={spec.id}>
                    <AccordionTrigger>{spec.name}</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {spec.competencias.map(comp => (
                        <div key={comp.id}>
                          <div className="flex justify-between items-center mb-2">
                            <Label htmlFor={comp.id}>{comp.name}</Label>
                            <Badge variant="outline">{technicalScores[comp.id] || "N/A"}</Badge>
                          </div>
                          <Slider id={comp.id} min={1} max={4} step={0.5} value={[technicalScores[comp.id] || 1]} onValueChange={([val]) => setTechnicalScores(prev => ({ ...prev, [comp.id]: val }))} />
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSaveEvaluation} 
          className="gap-2"
          disabled={Object.keys(softScores).length === 0 && Object.keys(technicalScores).length === 0}
        >
          <Save className="w-4 h-4" /> Salvar Avaliação Completa
        </Button>
      </div>
    </div>
  );
}