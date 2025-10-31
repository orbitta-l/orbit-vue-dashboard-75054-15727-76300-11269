import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, ChevronDown, Users, ArrowRight, ArrowLeft, Rocket, Filter, X, Code, Smartphone, Brain, Cloud, Shield, Palette, CalendarDays, HeartHandshake, PersonStanding, CircleUserRound } from "lucide-react";
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
import { SexoTipo, NivelMaturidade } from "@/types/mer";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { technicalCategories } from "@/data/evaluationTemplates";
import { cargoMap } from "@/utils/cargoUtils"; // Importando o cargoMap do utilitário

// Mapeamento de categorias técnicas para ícones Lucide
const categoryIcons: Record<string, React.ElementType> = {
  "dev-web": Code,
  "dev-mobile": Smartphone,
  "data-ai": Brain,
  "cloud-devops": Cloud,
  "sec-info": Shield,
  "ux-ui": Palette,
  "Soft Skills": HeartHandshake, // Ícone para Soft Skills
  "Não Avaliado": CircleUserRound, // Ícone para não avaliado
};

const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const step1Schema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email('E-mail inválido').min(1, "E-mail é obrigatório"),
  cargo_id: z.string().min(1, "Cargo é obrigatório"),
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

export default function Team() {
  const navigate = useNavigate();
  const { liderados, addLiderado, profile } = useAuth();

  const [searchName, setSearchName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [tempPassword, setTempPassword] = useState("");
  const [provisionedData, setProvisionedData] = useState<Step1Form | null>(null);

  // Filter states for sidebar
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filterMaturityLevel, setFilterMaturityLevel] = useState<string>("all");
  const [filterAgeRange, setFilterAgeRange] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterSpecialization, setFilterSpecialization] = useState<string>("all");
  const [filterCompetency, setFilterCompetency] = useState<string>("all");

  // Declaração de AgeRanges movida para antes do useMemo de filteredMembers
  const AgeRanges: { [key: string]: { label: string; min?: number; max?: number } } = {
    all: { label: "Todas as idades" },
    "<21": { label: "<21", max: 20 },
    "21-29": { label: "21-29", min: 21, max: 29 },
    "30-39": { label: "30-39", min: 30, max: 39 },
    "40+": { label: "40+", min: 40 },
  };

  const { register, control, formState: { errors }, trigger, getValues, reset } = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    mode: "onBlur",
    defaultValues: {
      nome: "",
      email: "",
      cargo_id: "nao-definido",
      sexo: "NAO_INFORMADO",
      data_nascimento: "",
    }
  });

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
    
    const newLiderado = {
      id_liderado: `lid-${Date.now()}`,
      nome_liderado: provisionedData.nome,
      email: provisionedData.email,
      sexo: provisionedData.sexo as SexoTipo,
      data_nascimento: provisionedData.data_nascimento,
      cargo_id: provisionedData.cargo_id,
      lider_id: profile.id,
    };
    addLiderado(newLiderado);
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
    setFilterMaturityLevel("all");
    setFilterAgeRange("all");
    setFilterGender("all");
    setFilterArea("all");
    setFilterSpecialization("all");
    setFilterCompetency("all");
  };

  const allTechnicalCategories = useMemo(() => technicalCategories.map(cat => ({ id: cat.id, name: cat.name })), []);
  const availableSpecializations = useMemo(() => {
    if (filterArea === "all") return [];
    const category = technicalCategories.find(cat => cat.id === filterArea);
    return category ? category.especializacoes.map(spec => ({ id: spec.id, name: spec.name })) : [];
  }, [filterArea]);

  const availableCompetencies = useMemo(() => {
    if (filterSpecialization === "all") return [];
    const category = technicalCategories.find(cat => cat.id === filterArea);
    const specialization = category?.especializacoes.find(spec => spec.id === filterSpecialization);
    return specialization ? specialization.competencias.map(comp => ({ id: comp.id, name: comp.name })) : [];
  }, [filterArea, filterSpecialization]);

  const filteredMembers = useMemo(() => {
    let members = liderados.filter(member =>
      member.nome_liderado.toLowerCase().includes(searchName.toLowerCase())
    );

    if (filterMaturityLevel !== "all") {
      members = members.filter(member => member.nivel_maturidade === filterMaturityLevel);
    }

    if (AgeRanges[filterAgeRange]) {
      members = members.filter(member => {
        const age = member.idade;
        const range = AgeRanges[filterAgeRange];
        if (range.min !== undefined && age < range.min) return false;
        if (range.max !== undefined && age > range.max) return false;
        return true;
      });
    }

    if (filterGender !== "all") {
      members = members.filter(member => member.sexo === filterGender);
    }

    if (filterArea !== "all") {
      members = members.filter(member => member.competencias?.some(comp => comp.id_categoria === filterArea));
    }

    if (filterSpecialization !== "all") {
      members = members.filter(member => member.competencias?.some(comp => comp.id_especializacao === filterSpecialization));
    }

    if (filterCompetency !== "all") {
      members = members.filter(member => member.competencias?.some(c => c.id_competencia === filterCompetency));
    }
    return members;
  }, [liderados, searchName, filterMaturityLevel, filterAgeRange, filterGender, filterArea, filterSpecialization, filterCompetency]);

  const talentMemberId = useMemo(() => {
    if (filterCompetency === "all" || filteredMembers.length === 0) return null;

    let bestScore = -1;
    let talentId: string | null = null;

    filteredMembers.forEach(member => {
      const competencyScore = member.competencias.find(c => c.id_competencia === filterCompetency)?.media_pontuacao || 0;
      if (competencyScore > bestScore) {
        bestScore = competencyScore;
        talentId = member.id_liderado;
      }
    });
    return talentId;
  }, [filteredMembers, filterCompetency]);

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8 max-w-7xl mx-auto"> {/* Centralized content */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>
              <h1 className="text-3xl font-bold text-foreground">Liderados</h1>
            </div>
            <p className="text-muted-foreground">{filteredMembers.length} {filteredMembers.length === 1 ? 'liderado encontrado' : 'liderados encontrados'}</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar liderado..." value={searchName} onChange={(e) => setSearchName(e.target.value)} className="pl-9 w-full md:w-64" />
            </div>
            <Button variant="outline" onClick={() => setIsFilterSidebarOpen(true)} className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="w-4 h-4" /> Adicionar Liderado</Button>
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
                    <div>
                      <Label htmlFor="cargo_id">Cargo</Label>
                      <Controller
                        name="cargo_id"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(cargoMap).map(([id, data]) => (
                                <SelectItem key={id} value={id}>{data.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.cargo_id && <p className="text-sm text-destructive mt-1">{errors.cargo_id.message}</p>}
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
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => {
            const MainIcon = categoryIcons[member.categoria_dominante] || categoryIcons["Não Avaliado"];
            return (
              <Card 
                key={member.id_liderado} 
                className={`relative overflow-hidden w-full max-w-[280px] mx-auto p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${talentMemberId === member.id_liderado ? 'talent-glow' : ''}`} 
                onClick={() => navigate(`/team/${member.id_liderado}`)}
              >
                {talentMemberId === member.id_liderado && (
                  <Badge className="absolute top-4 right-4 z-10 bg-transparent text-yellow-600 font-bold text-sm px-0 py-0 flex items-center gap-1">
                    <Rocket className="w-4 h-4" /> TALENTO
                  </Badge>
                )}
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="w-16 h-16 mb-3">
                    <AvatarFallback className="bg-accent/20 text-accent-foreground font-semibold text-lg">
                      {getInitials(member.nome_liderado)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg text-foreground mb-1">{member.nome_liderado}</h3>
                  {member.cargo_id && (
                    <Badge className={`${cargoMap[member.cargo_id]?.colorClass || 'bg-gray-400'} text-white text-xs font-medium mb-2`}>
                      {cargoMap[member.cargo_id]?.name || member.cargo}
                    </Badge>
                  )}
                </div>
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span>Maturidade</span>
                    </div>
                    <span className="font-semibold text-foreground">{member.nivel_maturidade || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MainIcon className="w-4 h-4 text-accent" />
                      <span>Área Dominante</span>
                    </div>
                    <span className="font-semibold text-foreground truncate max-w-[120px]">{member.categoria_dominante || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-secondary-foreground" />
                      <span>Idade</span>
                    </div>
                    <span className="font-semibold text-foreground">{member.idade || 'N/A'} anos</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        {filteredMembers.length === 0 && (<div className="text-center py-12"><p className="text-muted-foreground">Nenhum liderado encontrado com os filtros selecionados.</p></div>)}
      </main>

      {/* Filter Sidebar */}
      <Sheet open={isFilterSidebarOpen} onOpenChange={setIsFilterSidebarOpen}>
        <SheetContent side="left" className="w-80 sm:w-[320px] p-6 flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filtros
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-6 mt-6">
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <h3 className="font-semibold text-foreground uppercase text-sm">Maturidade Geral</h3>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 flex flex-wrap gap-2">
                {["all", "M1", "M2", "M3", "M4"].map((level) => (
                  <Badge
                    key={level}
                    variant={filterMaturityLevel === level ? "default" : "secondary"}
                    className={`cursor-pointer ${filterMaturityLevel === level ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                    onClick={() => setFilterMaturityLevel(level)}
                  >
                    {level === "all" ? "Todos" : level}
                  </Badge>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <h3 className="font-semibold text-foreground uppercase text-sm">Idade</h3>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 flex flex-wrap gap-2">
                {Object.keys(AgeRanges).map((rangeKey) => (
                  <Badge
                    key={rangeKey}
                    variant={filterAgeRange === rangeKey ? "default" : "secondary"}
                    className={`cursor-pointer ${filterAgeRange === rangeKey ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                    onClick={() => setFilterAgeRange(rangeKey)}
                  >
                    {AgeRanges[rangeKey].label}
                  </Badge>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <h3 className="font-semibold text-foreground uppercase text-sm">Gênero</h3>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 flex flex-wrap gap-2">
                {[
                  { key: "all", label: "Todos", icon: Users },
                  { key: "FEMININO", label: "Feminino", icon: PersonStanding },
                  { key: "MASCULINO", label: "Masculino", icon: PersonStanding },
                  { key: "NAO_BINARIO", label: "Não Binário", icon: PersonStanding },
                  { key: "NAO_INFORMADO", label: "Não Informado", icon: CircleUserRound },
                ].map((gender) => {
                  const Icon = gender.icon;
                  return (
                    <Badge
                      key={gender.key}
                      variant={filterGender === gender.key ? "default" : "secondary"}
                      className={`cursor-pointer flex items-center gap-1 ${filterGender === gender.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                      onClick={() => setFilterGender(gender.key)}
                    >
                      <Icon className="w-3 h-3" />
                      {gender.label}
                    </Badge>
                  );
                })}
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
                  setFilterSpecialization("all"); // Reset specialization when area changes
                  setFilterCompetency("all"); // Reset competency when area changes
                }}>
                  <SelectTrigger className="flex items-center gap-2">
                    {filterArea !== "all" && categoryIcons[filterArea] && React.createElement(categoryIcons[filterArea], { className: "w-4 h-4" })}
                    <SelectValue placeholder="Selecione uma área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as áreas</SelectItem>
                    {allTechnicalCategories.map((area) => {
                      const Icon = categoryIcons[area.id];
                      return (
                        <SelectItem key={area.id} value={area.id}>
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="w-4 h-4" />}
                            {area.name}
                          </div>
                        </SelectItem>
                      );
                    })}
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
                    setFilterCompetency("all"); // Reset competency when specialization changes
                  }} disabled={availableSpecializations.length === 0}>
                    <SelectTrigger><SelectValue placeholder="Selecione uma especialização" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas especializações</SelectItem>
                      {availableSpecializations.map((spec) => (<SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>))}
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
                  <Select value={filterCompetency} onValueChange={setFilterCompetency} disabled={availableCompetencies.length === 0}>
                    <SelectTrigger><SelectValue placeholder="Selecione uma competência" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas competências</SelectItem>
                      {availableCompetencies.map((comp) => (<SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
          <div className="mt-auto border-t pt-4">
            <Button variant="outline" onClick={handleClearFilters} className="w-full gap-2">
              <X className="w-4 h-4" />
              Limpar Filtros
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}