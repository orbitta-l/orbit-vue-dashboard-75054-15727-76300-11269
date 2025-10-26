import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Save, PlusCircle } from "lucide-react";
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
  TechnicalSpecialization,
  TechnicalCompetency
} from "@/data/evaluationTemplates";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { calcularNivelMaturidade } from "@/types/mer";

export default function Evaluation() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { profile, liderados, addAvaliacao } = useAuth();

  const [member, setMember] = useState<Liderado | undefined>(undefined);
  const [softTemplate, setSoftTemplate] = useState<SoftSkillTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  const [softScores, setSoftScores] = useState<Record<string, number>>({});
  const [technicalScores, setTechnicalScores] = useState<Record<string, number>>({});
  const [selectedTechCompetencies, setSelectedTechCompetencies] = useState<TechnicalCompetency[]>([]);

  // State for the "Add Technical Competency" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<TechnicalCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TechnicalCategory | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<TechnicalSpecialization | null>(null);
  const [competenciesToAdd, setCompetenciesToAdd] = useState<Record<string, boolean>>({});

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

  const handleAddCompetencies = () => {
    if (!selectedSpecialization) return;
    
    const newCompetencies = selectedSpecialization.competencias.filter(
      c => competenciesToAdd[c.id] && !selectedTechCompetencies.some(stc => stc.id === c.id)
    );

    setSelectedTechCompetencies(prev => [...prev, ...newCompetencies]);
    
    const initialScores = newCompetencies.reduce((acc, skill) => {
      acc[skill.id] = 1;
      return acc;
    }, {} as Record<string, number>);
    setTechnicalScores(prev => ({ ...prev, ...initialScores }));

    // Reset modal state
    setIsModalOpen(false);
    setSelectedCategory(null);
    setSelectedSpecialization(null);
    setCompetenciesToAdd({});
  };

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
    toast({ title: "Avaliação salva!", description: `A avaliação de ${member?.nome} foi concluída.` });
    navigate("/home");
  };

  if (loading) {
    return <div className="p-8 space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-96 w-full" /></div>;
  }

  if (!member) return null;

  if (!member.cargo_id) {
    return (
      <div className="p-8">
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /> Voltar</Button>
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Defina o cargo do liderado</h2>
          <p className="text-muted-foreground mb-4">Antes de iniciar a avaliação, é necessário informar o cargo do colaborador.</p>
          <Button onClick={() => navigate(`/team`)} className="gap-2"><Edit className="w-4 h-4" /> Ir para a tela de equipe</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
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
            <CardDescription>Adicione categorias e avalie as competências técnicas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedTechCompetencies.map(skill => (
              <div key={skill.id}>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor={skill.id}>{skill.name}</Label>
                  <Badge variant="outline">{technicalScores[skill.id]}</Badge>
                </div>
                <Slider id={skill.id} min={1} max={4} step={0.5} value={[technicalScores[skill.id] || 1]} onValueChange={([val]) => setTechnicalScores(prev => ({ ...prev, [skill.id]: val }))} />
              </div>
            ))}
             <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2"><PlusCircle className="w-4 h-4" /> Adicionar Categoria Técnica</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Competências Técnicas</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Select onValueChange={(val) => setSelectedCategory(availableCategories.find(c => c.id === val) || null)}>
                    <SelectTrigger><SelectValue placeholder="1. Selecione uma Categoria" /></SelectTrigger>
                    <SelectContent>{availableCategories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent>
                  </Select>
                  {selectedCategory && (
                    <Select onValueChange={(val) => setSelectedSpecialization(selectedCategory.especializacoes.find(s => s.id === val) || null)}>
                      <SelectTrigger><SelectValue placeholder="2. Selecione uma Especialização" /></SelectTrigger>
                      <SelectContent>{selectedCategory.especializacoes.map(spec => <SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>)}</SelectContent>
                    </Select>
                  )}
                  {selectedSpecialization && (
                    <div className="space-y-2 p-2 border rounded-md">
                      <h4 className="font-semibold text-sm">3. Selecione as Competências</h4>
                      {selectedSpecialization.competencias.map(comp => (
                        <div key={comp.id} className="flex items-center space-x-2">
                          <Checkbox id={comp.id} checked={!!competenciesToAdd[comp.id]} onCheckedChange={(checked) => setCompetenciesToAdd(prev => ({ ...prev, [comp.id]: !!checked }))} />
                          <label htmlFor={comp.id} className="text-sm font-medium">{comp.name}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={handleAddCompetencies} disabled={!selectedSpecialization}>Adicionar</Button>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveEvaluation} className="gap-2"><Save className="w-4 h-4" /> Salvar Avaliação</Button>
      </div>
    </div>
  );
}