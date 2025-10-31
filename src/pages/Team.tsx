import { useState, useMemo } from "react";
import { Plus, Check, Search, ChevronDown, Users, Rocket, Filter, X, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SexoTipo } from "@/types/mer";
import { technicalCategories } from "@/data/evaluationTemplates";
import { Checkbox } from "@/components/ui/checkbox";

const step1Schema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email('E-mail inválido').min(1, "E-mail é obrigatório"),
  sexo: z.enum(["FEMININO", "MASCULINO", "NAO_BINARIO", "NAO_INFORMADO"], { required_error: "Sexo é obrigatório" }),
  data_nascimento: z.string().min(1, "Data de nascimento é obrigatória").refine((val) => {
    const birthDate = new Date(val);
    const today = new Date();
    birthDate.setMinutes(birthDate.getMinutes() + birthDate.getTimezoneOffset());
    if (birthDate > today) return false;
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 14;
  }, "A data não pode ser futura e a idade mínima é 14 anos."),
});

type Step1Form = z.infer<typeof step1Schema>;

// Mapeamento de cores para cargos (exemplo, pode ser expandido)
const CARGO_COLORS: Record<string, string> = {
  "Desenvolvedor Junior": "bg-blue-500",
  "Desenvolvedor Pleno": "bg-green-500",
  "Designer Sênior": "bg-purple-500",
  "Product Manager": "bg-yellow-500",
  "Não definido": "bg-gray-500",
  "estagiario": "bg-indigo-500",
  "junior": "bg-blue-500",
  "pleno": "bg-green-500",
  "senior": "bg-purple-500",
  "especialista": "bg-red-500",
};

export default function Team() {
  const navigate = useNavigate();
  const { liderados, addLiderado, profile } = useAuth();

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchName, setSearchName] = useState("");
  const [filterMaturityLevel, setFilterMaturityLevel] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterSpecialization, setFilterSpecialization] = useState<string>("all");
  const [filterCompetencies, setFilterCompetencies] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [tempPassword, setTempPassword] = useState("");
  const [provisionedData, setProvisionedData] = useState<Step1Form | null>(null);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(true); // Sidebar always open for now

  const { register, control, formState: { errors }, trigger, getValues, reset } = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    mode: "onBlur",
    defaultValues: {
      nome: "",
      email: "",
      sexo: "NAO_INFORMADO",
      data_nascimento: "",
    }
  });

  const allAreas = useMemo(() => {
    const areas = new Set<string>();
    technicalCategories.forEach(cat => areas.add(cat.name));
    return Array.from(areas).sort();
  }, []);

  const availableSpecializations = useMemo(() => {
    if (filterArea === "all") return [];
    const category = technicalCategories.find(cat => cat.name === filterArea);
    return category ? category.especializacoes.map(spec => spec.name).sort() : [];
  }, [filterArea]);

  const availableCompetencies = useMemo(() => {
    if (filterSpecialization === "all") return [];
    const category = technicalCategories.find(cat => cat.name === filterArea);
    const specialization = category?.especializacoes.find(spec => spec.name === filterSpecialization);
    return specialization ? specialization.competencias.map(comp => comp.name).sort() : [];
  }, [filterArea, filterSpecialization]);

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : prev.length < 4 ? [...prev, memberId] : prev
    );
  };

  const handleCompare = () => {
    if (selectedMembers.length >= 2) {
      navigate(`/compare?members=${selectedMembers.join(",")}`);
    }
  };

  const handleNextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      const values = getValues();
      if (liderados.some(m => m.email === values.email)) {
        toast({ variant: "destructive", title: "E-mail já cadastrado", description: "Este e-mail já pertence a um membro da equipe." });
        return;
      }
      setProvisionedData(values);
      setTempPassword(Math.random().toString(36).slice(-8));
      setModalStep(2);
    }
  };

  const handleConclude = () => {
    if (!provisionedData || !profile) return;
    
    const novoLiderado = {
      id_liderado: `lid-${Date.now()}`,
      nome_liderado: provisionedData.nome,
      email: provisionedData.email,
      sexo: provisionedData.sexo as SexoTipo,
      data_nascimento: provisionedData.data_nascimento,
      cargo: "Não definido",
      cargo_id: "nao-definido",
      lider_id: profile.id,
      nivel_maturidade: 'M1', // Default inicial
      eixo_x_tecnico_geral: 0,
      eixo_y_comportamental: 0,
      categoria_dominante: 'Não Avaliado',
      especializacao_dominante: 'Não Avaliado',
      competencias: [],
      idade: 0, // Será calculado no AuthContext
    };
    addLiderado(novoLiderado);
    toast({ title: "Liderado provisionado!", description: "Complete o perfil do liderado antes de avaliar." });
    resetModal();
  };

  const resetModal = () => {
    setIsAddDialogOpen(false);
    setModalStep(1);
    setTempPassword("");
    setProvisionedData(null);
    reset();
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    toast({ title: "Senha copiada!" });
  };

  const handleClearFilters = () => {
    setSearchName("");
    setFilterMaturityLevel("all");
    setFilterArea("all");
    setFilterSpecialization("all");
    setFilterCompetencies([]);
  };

  const filteredMembers = useMemo(() => {
    let members = liderados;

    if (searchName) {
      members = members.filter(member =>
        member.nome_liderado.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (filterMaturityLevel !== "all") {
      members = members.filter(member => member.nivel_maturidade === filterMaturityLevel);
    }

    if (filterArea !== "all") {
      members = members.filter(member =>
        member.competencias?.some(comp => comp.nome_categoria === filterArea)
      );
    }

    if (filterSpecialization !== "all") {
      members = members.filter(member =>
        member.competencias?.some(comp => comp.nome_especializacao === filterSpecialization)
      );
    }

    if (filterCompetencies.length > 0) {
      members = members.filter(member =>
        filterCompetencies.every(selectedComp =>
          member.competencias?.some(comp => comp.nome_competencia === selectedComp)
        )
      );
    }
    return members;
  }, [liderados, searchName, filterMaturityLevel, filterArea, filterSpecialization, filterCompetencies]);

  const bestTalentId = useMemo(() => {
    if (filterCompetencies.length === 1) {
      const targetCompetency = filterCompetencies[0];
      let maxScore = -1;
      let talentId: string | null = null;

      filteredMembers.forEach(member => {
        const comp = member.competencias?.find(c => c.nome_competencia === targetCompetency);
        if (comp && comp.media_pontuacao > maxScore) {
          maxScore = comp.media_pontuacao;
          talentId = member.id_liderado;
        }
      });
      return talentId;
    }
    return null;
  }, [filteredMembers, filterCompetencies]);

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar de Filtros */}
      <aside className={`w-80 bg-card border-r border-border p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${isFilterSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground uppercase text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </h3>
          {/* <Button variant="ghost" size="sm" onClick={() => setIsFilterSidebarOpen(false)} className="lg:hidden">
            <X className="w-4 h-4" />
          </Button> */}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3 uppercase text-sm">Buscar</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar liderado..." value={searchName} onChange={(e) => setSearchName(e.target.value)} className="pl-9" />
            </div>
          </div>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h3 className="font-semibold text-foreground uppercase text-sm">Maturidade Geral</h3>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              <Select value={filterMaturityLevel} onValueChange={setFilterMaturityLevel}>
                <SelectTrigger><SelectValue placeholder="Todos os níveis" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="M1">M1</SelectItem>
                  <SelectItem value="M2">M2</SelectItem>
                  <SelectItem value="M3">M3</SelectItem>
                  <SelectItem value="M4">M4</SelectItem>
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h3 className="font-semibold text-foreground uppercase text-sm">Área Específica</h3>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              <Select value={filterArea} onValueChange={(value) => {
                setFilterArea(value);
                setFilterSpecialization("all");
                setFilterCompetencies([]);
              }}>
                <SelectTrigger><SelectValue placeholder="Selecione uma área" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as áreas</SelectItem>
                  {technicalCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      <div className="flex items-center gap-2">
                        {category.icon && <category.icon className="w-4 h-4" />}
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>

          {filterArea !== "all" && (
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <h3 className="font-semibold text-foreground uppercase text-sm">Especialização</h3>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <Select value={filterSpecialization} onValueChange={(value) => {
                  setFilterSpecialization(value);
                  setFilterCompetencies([]);
                }} disabled={availableSpecializations.length === 0}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma especialização" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas especializações</SelectItem>
                    {availableSpecializations.map((spec) => (<SelectItem key={spec} value={spec}>{spec}</SelectItem>))}
                  </SelectContent>
                </Select>
              </CollapsibleContent>
            </Collapsible>
          )}

          {filterSpecialization !== "all" && (
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <h3 className="font-semibold text-foreground uppercase text-sm">Competência</h3>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                {availableCompetencies.length > 0 ? (
                  <div className="space-y-2">
                    {availableCompetencies.map((comp) => (
                      <div key={comp} className="flex items-center space-x-2">
                        <Checkbox
                          id={`comp-${comp}`}
                          checked={filterCompetencies.includes(comp)}
                          onCheckedChange={(checked) => {
                            setFilterCompetencies(prev =>
                              checked ? [...prev, comp] : prev.filter(c => c !== comp)
                            );
                          }}
                        />
                        <label
                          htmlFor={`comp-${comp}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {comp}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma competência disponível.</p>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          <Button variant="outline" onClick={handleClearFilters} className="w-full gap-2">
            <RotateCcw className="w-4 h-4" /> Limpar Filtros
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full gap-2"><Plus className="w-4 h-4" /> Adicionar Liderado</Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>{modalStep === 1 ? "Adicione o liderado" : "Senha de acesso"}</DialogTitle>
                <DialogDescription>
                  {modalStep === 1 ? "Digite os dados do liderado para gerar a senha de acesso." : "Compartilhe a senha abaixo com seu liderado."}
                </DialogDescription>
              </DialogHeader>
              <Progress value={modalStep * 50} className="w-full my-4" />
              {modalStep === 1 ? (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input id="nome" placeholder="João da Silva" {...register("nome")} />
                    {errors.nome && <p className="text-sm text-destructive mt-1">{errors.nome.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="joao.silva@orbitta.com" {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sexo">Sexo</Label>
                      <Controller
                        name="sexo"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FEMININO">Feminino</SelectItem>
                              <SelectItem value="MASCULINO">Masculino</SelectItem>
                              <SelectItem value="NAO_BINARIO">Não Binário</SelectItem>
                              <SelectItem value="NAO_INFORMADO">Não Informado</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.sexo && <p className="text-sm text-destructive mt-1">{errors.sexo.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                      <Input id="data_nascimento" type="date" {...register("data_nascimento")} />
                      {errors.data_nascimento && <p className="text-sm text-destructive mt-1">{errors.data_nascimento.message}</p>}
                    </div>
                  </div>
                  <Button onClick={handleNextStep} className="w-full gap-2">Avançar <ArrowRight className="w-4 h-4" /></Button>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <Label className="text-sm font-medium mb-2 block">Senha Temporária</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-lg font-mono bg-background p-3 rounded border border-border">{tempPassword}</code>
                      <Button onClick={handleCopyPassword} size="sm">Copiar</Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setModalStep(1)} className="gap-2"><ArrowLeft className="w-4 h-4" /> Voltar</Button>
                    <Button onClick={handleConclude}>Concluir</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>
              <h1 className="text-3xl font-bold text-foreground">Liderados</h1>
            </div>
            <p className="text-muted-foreground">{filteredMembers.length} {filteredMembers.length === 1 ? 'liderado encontrado' : 'liderados encontrados'}</p>
          </div>
          {/* <Button variant="outline" onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)} className="lg:hidden gap-2">
            <Filter className="w-4 h-4" /> Filtros
          </Button> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const isTalent = bestTalentId === member.id_liderado && filterCompetencies.length === 1;
            const cargoColorClass = CARGO_COLORS[member.cargo_id || member.cargo] || CARGO_COLORS["Não definido"];

            return (
              <Card key={member.id_liderado} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/team/${member.id_liderado}`)}>
                {isTalent && (
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    <Rocket className="w-4 h-4 fill-yellow-900" /> TALENTO
                  </div>
                )}
                <div onClick={(e) => { e.stopPropagation(); toggleMemberSelection(member.id_liderado); }} className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${selectedMembers.includes(member.id_liderado) ? 'bg-primary text-primary-foreground' : 'bg-background border-2 border-primary text-primary hover:bg-primary/10'}`} title="Adicionar para comparação">
                  {selectedMembers.includes(member.id_liderado) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div className="p-6 pt-20">
                  <div className="flex flex-col items-center text-center mb-4">
                    <Avatar className="w-16 h-16 mb-3">
                      <AvatarFallback className="bg-accent/20 text-accent-foreground font-semibold text-lg">
                        {getInitials(member.nome_liderado)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg text-foreground mb-1">{member.nome_liderado}</h3>
                    <div className={`px-3 py-1 rounded-md text-white text-sm font-medium ${cargoColorClass} mb-2`}>
                      {member.cargo || "Não definido"}
                    </div>
                    {member.nivel_maturidade && <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{member.nivel_maturidade}</Badge>}
                  </div>
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center mb-2">{member.email}</p>
                    <div className="space-y-1">
                      {member.categoria_dominante && member.categoria_dominante !== "Não Avaliado" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                          <span className="truncate">{member.categoria_dominante}</span>
                        </div>
                      )}
                      {member.especializacao_dominante && member.especializacao_dominante !== "Não Avaliado" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                          <span className="truncate">{member.especializacao_dominante}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        {filteredMembers.length === 0 && (<div className="text-center py-12"><p className="text-muted-foreground">Nenhum liderado encontrado com os filtros selecionados.</p></div>)}
      </main>
      {selectedMembers.length >= 2 && (<div className="fixed bottom-8 right-8 z-50"><Button size="lg" className="shadow-lg gap-2" onClick={handleCompare}>Comparar {selectedMembers.length} liderados</Button></div>)}
    </div>
  );
}