import { useState, useMemo, useEffect } from "react";
import { Plus, Search, ChevronDown, Users, ArrowRight, ArrowLeft, Rocket, Filter, X, Code, Smartphone, Brain, Cloud, Shield, Palette, Woman, Man, User as UserIcon } from "lucide-react";
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
import { SexoTipo, NivelMaturidade, calcularFaixaEtaria } from "@/types/mer";
import { Checkbox } from "@/components/ui/checkbox";
import { technicalCategories } from "@/data/evaluationTemplates";

// Mapeamento de cargo_id para nome do cargo e cor
const cargoMap: Record<string, { name: string; colorClass: string }> = {
  "estagiario": { name: "Estagiário", colorClass: "bg-blue-500" },
  "junior": { name: "Júnior", colorClass: "bg-green-500" },
  "pleno": { name: "Pleno", colorClass: "bg-yellow-500" },
  "senior": { name: "Sênior", colorClass: "bg-red-500" },
  "especialista": { name: "Especialista", colorClass: "bg-purple-500" },
  "nao-definido": { name: "Não Definido", colorClass: "bg-gray-400" },
};

// Mapeamento de categorias técnicas para ícones Lucide
const categoryIcons: Record<string, React.ElementType> = {
  "dev-web": Code,
  "dev-mobile": Smartphone,
  "data-ai": Brain,
  "cloud-devops": Cloud,
  "sec-info": Shield,
  "ux-ui": Palette,
  "Soft Skills": Users, // Adicionado para Soft Skills, caso seja usado no filtro
};

// Mapeamento de sexo para ícones Lucide
const sexIcons: Record<SexoTipo, React.ElementType> = {
  "FEMININO": Woman,
  "MASCULINO": Man,
  "NAO_BINARIO": UserIcon,
  "NAO_INFORMADO": UserIcon,
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
  const [filterMaturityLevel, setFilterMaturityLevel] = useState<string[]>([]);
  const [filterArea, setFilterArea] = useState<string[]>([]);
  const [filterSpecialization, setFilterSpecialization] = useState<string[]>([]);
  const [filterCompetency, setFilterCompetency] = useState<string[]>([]);
  const [filterAgeRange, setFilterAgeRange] = useState<string[]>([]);
  const [filterSex, setFilterSex] = useState<string[]>([]);

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
      cargo: cargoMap[provisionedData.cargo_id]?.name || "Não definido",
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
    setFilterMaturityLevel([]);
    setFilterArea([]);
    setFilterSpecialization([]);
    setFilterCompetency([]);
    setFilterAgeRange([]);
    setFilterSex([]);
  };

  const allTechnicalCategories = useMemo(() => technicalCategories.map(cat => ({ id: cat.id, name: cat.name })), []);
  
  const availableSpecializations = useMemo(() => {
    if (filterArea.length === 0) return [];
    const selectedCategory = technicalCategories.find(cat => cat.id === filterArea[0]); // Assuming single selection for cascading
    return selectedCategory ? selectedCategory.especializacoes.map(spec => ({ id: spec.id, name: spec.name })) : [];
  }, [filterArea]);

  const availableCompetencies = useMemo(() => {
    if (filterSpecialization.length === 0) return [];
    const selectedCategory = technicalCategories.find(cat => cat.id === filterArea[0]);
    const selectedSpecialization = selectedCategory?.especializacoes.find(spec => spec.id === filterSpecialization[0]); // Assuming single selection
    return selectedSpecialization ? selectedSpecialization.competencias.map(comp => ({ id: comp.id, name: comp.name })) : [];
  }, [filterArea, filterSpecialization]);

  const ageRanges = ["<21", "21-29", "30-39", "40+"];
  const sexOptions: { id: SexoTipo; name: string; icon: React.ElementType }[] = [
    { id: "FEMININO", name: "Feminino", icon: Woman },
    { id: "MASCULINO", name: "Masculino", icon: Man },
    { id: "NAO_BINARIO", name: "Não Binário", icon: UserIcon },
    { id: "NAO_INFORMADO", name: "Não Informado", icon: UserIcon },
  ];

  const filteredMembers = useMemo(() => {
    let members = liderados.filter(member =>
      member.nome_liderado.toLowerCase().includes(searchName.toLowerCase())
    );

    if (filterMaturityLevel.length > 0) {
      members = members.filter(member => filterMaturityLevel.includes(member.nivel_maturidade));
    }

    if (filterArea.length > 0) {
      members = members.filter(member => member.competencias?.some(comp => filterArea.includes(comp.id_categoria)));
    }

    if (filterSpecialization.length > 0) {
      members = members.filter(member => member.competencias?.some(comp => comp.id_especializacao && filterSpecialization.includes(comp.id_especializacao)));
    }

    if (filterCompetency.length > 0) {
      members = members.filter(member => member.competencias?.some(c => filterCompetency.includes(c.id_competencia)));
    }

    if (filterAgeRange.length > 0) {
      members = members.filter(member => {
        const memberAgeRange = calcularFaixaEtaria(member.idade);
        return filterAgeRange.includes(memberAgeRange);
      });
    }

    if (filterSex.length > 0) {
      members = members.filter(member => filterSex.includes(member.sexo));
    }

    return members;
  }, [liderados, searchName, filterMaturityLevel, filterArea, filterSpecialization, filterCompetency, filterAgeRange, filterSex]);

  const talentMemberId = useMemo(() => {
    if (filterCompetency.length === 0 || filteredMembers.length === 0) return null;

    let bestScore = -1;
    let talentId: string | null = null;

    filteredMembers.forEach(member => {
      const competencyScore = member.competencias.find(c => filterCompetency.includes(c.id_competencia))?.media_pontuacao || 0;
      if (competencyScore > bestScore) {
        bestScore = competencyScore;
        talentId = member.id_liderado;
      }
    });
    return talentId;
  }, [filteredMembers, filterCompetency]);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string, isMulti: boolean = false) => {
    setter(prev => {
      if (isMulti) {
        return prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value];
      } else {
        return prev[0] === value ? [] : [value]; // Toggle single selection
      }
    });
  };

  return (
    <div className="grid grid-cols-[280px_1fr] min-h-screen bg-background text-foreground">
      {/* Fixed Filter Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[280px] bg-card border-r border-border p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Filtros</h2>
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="ml-auto text-muted-foreground hover:text-primary">Limpar</Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Maturidade Geral */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold uppercase text-muted-foreground hover:text-foreground transition-colors">
              Maturidade Geral
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {['M1', 'M2', 'M3', 'M4'].map(level => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`maturity-${level}`}
                    checked={filterMaturityLevel.includes(level)}
                    onCheckedChange={() => handleFilterChange(setFilterMaturityLevel, level, true)}
                  />
                  <label htmlFor={`maturity-${level}`} className="text-sm font-medium leading-none cursor-pointer">
                    {level}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Área Específica */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold uppercase text-muted-foreground hover:text-foreground transition-colors">
              Área Específica
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              <Select value={filterArea[0] || ""} onValueChange={(value) => {
                handleFilterChange(setFilterArea, value);
                setFilterSpecialization([]);
                setFilterCompetency([]);
              }}>
                <SelectTrigger className="flex items-center gap-2">
                  {filterArea[0] && categoryIcons[filterArea[0]] && React.createElement(categoryIcons[filterArea[0]], { className: "w-4 h-4" })}
                  <SelectValue placeholder="Selecione uma área" />
                </SelectTrigger>
                <SelectContent>
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

          {/* Especialização */}
          {filterArea.length > 0 && (
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold uppercase text-muted-foreground hover:text-foreground transition-colors">
                Especialização
                <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <Select value={filterSpecialization[0] || ""} onValueChange={(value) => {
                  handleFilterChange(setFilterSpecialization, value);
                  setFilterCompetency([]);
                }} disabled={availableSpecializations.length === 0}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma especialização" /></SelectTrigger>
                  <SelectContent>
                    {availableSpecializations.map((spec) => (<SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Competência */}
          {filterSpecialization.length > 0 && (
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold uppercase text-muted-foreground hover:text-foreground transition-colors">
                Competência
                <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <Select value={filterCompetency[0] || ""} onValueChange={(value) => handleFilterChange(setFilterCompetency, value)} disabled={availableCompetencies.length === 0}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma competência" /></SelectTrigger>
                  <SelectContent>
                    {availableCompetencies.map((comp) => (<SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Idade */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold uppercase text-muted-foreground hover:text-foreground transition-colors">
              Idade
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {ageRanges.map(range => (
                <div key={range} className="flex items-center space-x-2">
                  <Checkbox
                    id={`age-${range}`}
                    checked={filterAgeRange.includes(range)}
                    onCheckedChange={() => handleFilterChange(setFilterAgeRange, range, true)}
                  />
                  <label htmlFor={`age-${range}`} className="text-sm font-medium leading-none cursor-pointer">
                    {range}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Sexo */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold uppercase text-muted-foreground hover:text-foreground transition-colors">
              Sexo
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {sexOptions.map(sex => {
                const Icon = sex.icon;
                return (
                  <div key={sex.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sex-${sex.id}`}
                      checked={filterSex.includes(sex.id)}
                      onCheckedChange={() => handleFilterChange(setFilterSex, sex.id, true)}
                    />
                    <label htmlFor={`sex-${sex.id}`} className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer">
                      <Icon className="w-4 h-4 text-muted-foreground" /> {sex.name}
                    </label>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[280px] p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Liderados</h1>
            <p className="text-muted-foreground">{filteredMembers.length} {filteredMembers.length === 1 ? 'liderado encontrado' : 'liderados encontrados'}</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar liderado..." value={searchName} onChange={(e) => setSearchName(e.target.value)} className="pl-9 w-64" />
            </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMembers.map((member) => {
            const CategoryIcon = member.categoria_dominante && categoryIcons[member.categoria_dominante.toLowerCase().replace(/\s/g, '-')];
            return (
              <Card 
                key={member.id_liderado} 
                className="relative overflow-hidden w-full max-w-[240px] mx-auto p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1" 
                onClick={() => navigate(`/team/${member.id_liderado}`)}
              >
                {talentMemberId === member.id_liderado && (
                  <Badge className="absolute top-3 right-3 z-10 bg-transparent text-yellow-600 font-bold text-xs px-0 py-0 flex items-center gap-1">
                    <Rocket className="w-3 h-3" /> TALENTO
                  </Badge>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-accent/20 text-accent-foreground font-semibold text-sm">
                      {getInitials(member.nome_liderado)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-foreground truncate">{member.nome_liderado}</h3>
                    {member.cargo_id && (
                      <Badge className={`${cargoMap[member.cargo_id]?.colorClass || 'bg-gray-400'} text-white text-xs font-medium`}>
                        {cargoMap[member.cargo_id]?.name || member.cargo}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Maturidade: <span className="font-medium text-foreground">{member.nivel_maturidade || 'N/A'}</span></span>
                  </div>
                  {member.categoria_dominante && member.categoria_dominante !== "Não Avaliado" && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {CategoryIcon ? <CategoryIcon className="w-3 h-3" /> : <Code className="w-3 h-3" />}
                      <span>Área: <span className="font-medium text-foreground truncate">{member.categoria_dominante}</span></span>
                    </div>
                  )}
                  {member.especializacao_dominante && member.especializacao_dominante !== "Não Avaliado" && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Brain className="w-3 h-3" />
                      <span>Espec.: <span className="font-medium text-foreground truncate">{member.especializacao_dominante}</span></span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
        {filteredMembers.length === 0 && (<div className="text-center py-12"><p className="text-muted-foreground">Nenhum liderado encontrado com os filtros selecionados.</p></div>)}
      </main>
    </div>
  );
}