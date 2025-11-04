import React, { useState, useMemo } from "react";
import { Plus, Search, Users, ArrowRight, ArrowLeft, Rocket, Filter, X, Code, Smartphone, Brain, Cloud, Shield, Palette, Star, PersonStanding, CircleUserRound, Mail, HeartHandshake } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useNavigate, createSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SexoTipo, NivelMaturidade, LideradoDashboard } from "@/types/mer";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { technicalTemplate } from "@/data/evaluationTemplates";
import { MOCK_CARGOS } from "@/data/mockData";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

const categoryIcons: Record<string, React.ElementType> = {
  "dev-web": Code,
  "dev-mobile": Smartphone,
  "data-ai": Brain,
  "cloud-devops": Cloud,
  "sec-info": Shield,
  "ux-ui": Palette,
  "Soft Skills": HeartHandshake,
  "Não Avaliado": CircleUserRound,
};

const getInitials = (name: string) => {
  if (!name) return "";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

const step1Schema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email('E-mail inválido').min(1, "E-mail é obrigatório"),
  id_cargo: z.string().min(1, "Cargo é obrigatório"),
  sexo: z.enum(["FEMININO", "MASCULINO", "NAO_BINARIO", "NAO_INFORMADO"], { required_error: "Sexo é obrigatório" }),
});

type Step1Form = z.infer<typeof step1Schema>;

export default function Team() {
  const navigate = useNavigate();
  const { profile, teamData, fetchTeamData } = useAuth();

  const [searchName, setSearchName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [tempPassword, setTempPassword] = useState("");
  const [provisionedData, setProvisionedData] = useState<Step1Form | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [selectedMembersForComparison, setSelectedMembersForComparison] = useState<string[]>([]);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  
  const { register, control, formState: { errors }, trigger, getValues, reset } = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    mode: "onBlur",
  });

  const handleNextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      const values = getValues();
      if (teamData.some(m => m.email === values.email)) {
        toast({ variant: "destructive", title: "E-mail já cadastrado", description: "Este e-mail já pertence a um membro da equipe." });
        return;
      }
      setProvisionedData(values);
      setModalStep(2);
    }
  };

  const handleConclude = async () => {
    if (!provisionedData || !profile) return;
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-liderado', {
        body: {
          ...provisionedData,
          lider_id: profile.id,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
      
      setTempPassword(data.temporaryPassword);
      toast({ title: "Liderado provisionado!", description: "Compartilhe a senha temporária com o novo membro." });
      await fetchTeamData(); // Atualiza a lista de liderados
      setModalStep(3); // Avança para a tela de sucesso com a senha

    } catch (err: any) {
      const errorMessage = err.message.includes("already registered") 
        ? "Este e-mail já está em uso."
        : "Ocorreu um erro ao criar o liderado.";
      toast({ variant: "destructive", title: "Erro no cadastro", description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setIsAddDialogOpen(false);
    setTimeout(() => {
      setModalStep(1);
      setTempPassword("");
      setProvisionedData(null);
      reset();
    }, 300);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    toast({ title: "Senha copiada!" });
  };

  const filteredMembers = useMemo(() => {
    return teamData.filter(member =>
      member.nome.toLowerCase().includes(searchName.toLowerCase())
    );
  }, [teamData, searchName]);

  // ... (lógica de comparação e filtros permanece a mesma)

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8 max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>
              <h1 className="text-3xl font-bold text-foreground">Liderados</h1>
            </div>
            <p className="text-muted-foreground mt-1">Gerencie e compare o desempenho dos membros da sua equipe.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="w-4 h-4" /> Adicionar Liderado</Button>
              </DialogTrigger>
              <DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>
                    {modalStep === 1 && "Adicionar novo liderado"}
                    {modalStep === 2 && "Confirmar dados"}
                    {modalStep === 3 && "Liderado criado com sucesso!"}
                  </DialogTitle>
                  <DialogDescription>
                    {modalStep === 1 && "Preencha os dados para criar o acesso do novo membro."}
                    {modalStep === 2 && "Revise os dados antes de confirmar a criação."}
                    {modalStep === 3 && "Compartilhe a senha de acesso com o novo membro."}
                  </DialogDescription>
                </DialogHeader>
                <Progress value={modalStep * 33.3} className="w-full my-4" />
                
                {modalStep === 1 && (
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
                        <Label htmlFor="id_cargo">Cargo</Label>
                        <Controller name="id_cargo" control={control} render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>
                              {MOCK_CARGOS.filter(c => c.ativo).map(cargo => (
                                <SelectItem key={cargo.id_cargo} value={cargo.id_cargo}>{cargo.nome_cargo}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )} />
                        {errors.id_cargo && <p className="text-sm text-destructive mt-1">{errors.id_cargo.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="sexo">Sexo</Label>
                        <Controller name="sexo" control={control} render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FEMININO">Feminino</SelectItem>
                              <SelectItem value="MASCULINO">Masculino</SelectItem>
                              <SelectItem value="NAO_BINARIO">Não Binário</SelectItem>
                              <SelectItem value="NAO_INFORMADO">Não Informado</SelectItem>
                            </SelectContent>
                          </Select>
                        )} />
                        {errors.sexo && <p className="text-sm text-destructive mt-1">{errors.sexo.message}</p>}
                      </div>
                    </div>
                    <Button onClick={handleNextStep} className="w-full gap-2">Avançar <ArrowRight className="w-4 h-4" /></Button>
                  </div>
                )}

                {modalStep === 2 && provisionedData && (
                  <div className="space-y-4 mt-4">
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <p><strong>Nome:</strong> {provisionedData.nome}</p>
                      <p><strong>Email:</strong> {provisionedData.email}</p>
                      <p><strong>Cargo:</strong> {MOCK_CARGOS.find(c => c.id_cargo === provisionedData.id_cargo)?.nome_cargo}</p>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setModalStep(1)} className="gap-2"><ArrowLeft className="w-4 h-4" /> Voltar</Button>
                      <Button onClick={handleConclude} disabled={isSubmitting}>
                        {isSubmitting ? "Criando..." : "Confirmar e Criar"}
                      </Button>
                    </div>
                  </div>
                )}

                {modalStep === 3 && (
                  <div className="space-y-4 mt-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <Label className="text-sm font-medium mb-2 block">Senha Temporária</Label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-lg font-mono bg-background p-3 rounded border border-border">{tempPassword}</code>
                        <Button onClick={handleCopyPassword} size="sm">Copiar</Button>
                      </div>
                    </div>
                    <Button onClick={resetModal} className="w-full">Fechar</Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <Card 
              key={member.id} 
              className="relative overflow-hidden w-full max-w-[280px] mx-auto p-4 rounded-xl shadow-md transition-all duration-300 group cursor-pointer hover:shadow-lg hover:-translate-y-1"
              onClick={() => navigate(`/team/${member.id}`)}
            >
              <div className="flex flex-col items-center text-center mb-4">
                <Avatar className="w-16 h-16 mb-3">
                  <AvatarFallback className="bg-accent/20 text-accent-foreground font-semibold text-lg">
                    {getInitials(member.nome)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg text-foreground">{member.nome}</h3>
                <p className="text-sm text-muted-foreground mb-2">{member.email}</p>
                <Badge className="bg-primary/10 text-primary text-sm font-semibold mb-2">
                  {member.ultima_avaliacao?.maturidade_quadrante || 'N/A'}
                </Badge>
              </div>
              {/* ... (resto do card) ... */}
            </Card>
          ))}
        </div>
        {filteredMembers.length === 0 && (<div className="text-center py-12"><p className="text-muted-foreground">Nenhum liderado encontrado.</p></div>)}
      </main>
    </div>
  );
}