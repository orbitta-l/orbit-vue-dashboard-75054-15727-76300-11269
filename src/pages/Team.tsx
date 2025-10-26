import { useState } from "react";
import { Plus, Check, Search, ChevronDown, Users, Trash2 } from "lucide-react";
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
import { MOCK_PERFORMANCE, MOCK_CATEGORIAS, MOCK_ESPECIALIZACOES, MOCK_COMPETENCIAS } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const allAreas = Array.from(new Set(MOCK_CATEGORIAS.filter(c => c.tipo === 'TECNICA').map(c => c.nome_categoria)));
const allSpecializations = MOCK_ESPECIALIZACOES.map(e => e.nome);
const allCompetencies = MOCK_COMPETENCIAS.filter(c => c.tipo === 'TECNICA').map(c => c.nome);

export default function Team() {
  const navigate = useNavigate();
  const { liderados, addLiderado } = useAuth();

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchName, setSearchName] = useState("");
  const [filterMaturityLevel, setFilterMaturityLevel] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterSpecialization, setFilterSpecialization] = useState<string>("all");
  const [filterCompetency, setFilterCompetency] = useState<string>("all");
  const [members, setMembers] = useState(liderados);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "" });

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

  const handleAddMember = () => {
    const password = Math.random().toString(36).slice(-8);
    setTempPassword(password);
    setIsAddDialogOpen(false);
    setIsSuccessDialogOpen(true);
    // Cria objeto Liderado simplificado
    const novoLiderado = {
      id: `lid-${Date.now()}`,
      nome: newMember.name,
      cargo_id: newMember.role, // usando role como cargo_id simplificado
    };
    addLiderado(novoLiderado);
    setMembers((prev) => [...prev, novoLiderado]);
    setNewMember({ name: "", email: "", role: "" });
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    toast({
      title: "Senha copiada!",
      description: "A senha temporária foi copiada para a área de transferência.",
    });
  };

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
    toast({
      title: "Liderado adicionado!",
      description: "O novo membro foi adicionado à equipe com sucesso.",
    });
  };

  const handleDeleteMember = (memberId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMembers(prev => prev.filter(m => m.id !== memberId));
    toast({
      title: "Liderado removido!",
      description: "O membro foi removido da equipe com sucesso.",
    });
  };

  const filteredMembers = members.filter(member => {
    if (searchName && !member.name.toLowerCase().includes(searchName.toLowerCase())) {
      return false;
    }
    
    if (filterMaturityLevel !== "all" && member.maturityLevel !== filterMaturityLevel) {
      return false;
    }

    if (filterArea !== "all" && !member.areas?.some(area => area === filterArea)) {
      return false;
    }
    
    if (filterSpecialization !== "all" && member.especializacaoDominante !== filterSpecialization) {
      return false;
    }
    
    if (filterCompetency !== "all") {
      const liderado = MOCK_PERFORMANCE.find(p => p.id_liderado === member.id);
      if (!liderado || !liderado.competencias.some(c => c.nome_competencia === filterCompetency)) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar de Filtros */}
      <aside className="w-80 bg-card border-r border-border p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3 uppercase text-sm">Buscar</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-accent" />
              <Input
                placeholder="Buscar liderado..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h3 className="font-semibold text-foreground uppercase text-sm">Maturidade Geral</h3>
              <ChevronDown className="w-4 h-4 text-muted-foreground dark:text-accent" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              <Select value={filterMaturityLevel} onValueChange={setFilterMaturityLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
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
              <ChevronDown className="w-4 h-4 text-muted-foreground dark:text-accent" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              <Select value={filterArea} onValueChange={setFilterArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as áreas</SelectItem>
                  {allAreas.map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h3 className="font-semibold text-foreground uppercase text-sm">Especialização</h3>
              <ChevronDown className="w-4 h-4 text-muted-foreground dark:text-accent" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma especialização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas especializações</SelectItem>
                  {allSpecializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h3 className="font-semibold text-foreground uppercase text-sm">Competência</h3>
              <ChevronDown className="w-4 h-4 text-muted-foreground dark:text-accent" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              <Select value={filterCompetency} onValueChange={setFilterCompetency}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma competência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas competências</SelectItem>
                  {allCompetencies.map((comp) => (
                    <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Liderado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Liderado</DialogTitle>
                <DialogDescription>
                  Preencha as informações do novo membro da equipe
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="joao.silva@orbitta.com"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Cargo</Label>
                  <Select value={newMember.role} onValueChange={(value) => setNewMember({ ...newMember, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estagiario">Estagiário</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="pleno">Pleno</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="especialista">Especialista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleAddMember} 
                  className="w-full"
                  disabled={!newMember.name || !newMember.email || !newMember.role}
                >
                  Adicionar Liderado
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary dark:text-accent" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Liderados</h1>
            </div>
            <p className="text-muted-foreground">
              {filteredMembers.length} {filteredMembers.length === 1 ? 'liderado encontrado' : 'liderados encontrados'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card 
              key={member.id} 
              className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/team/${member.id}`)}
            >
              {/* Botões de Ação */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                {/* Botão Deletar */}
                <div 
                  onClick={(e) => handleDeleteMember(member.id, e)}
                  className="w-10 h-10 rounded-full bg-background border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center cursor-pointer transition-all"
                  title="Remover liderado"
                >
                  <Trash2 className="w-4 h-4" />
                </div>

                {/* Botão Comparar */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMemberSelection(member.id);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                    selectedMembers.includes(member.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border-2 border-primary text-primary hover:bg-primary/10'
                  }`}
                  title="Adicionar para comparação"
                >
                  {selectedMembers.includes(member.id) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
              </div>

              <div className="p-6 pt-20">
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="w-16 h-16 mb-3">
                    <AvatarFallback className="bg-accent/20 text-accent-foreground font-semibold text-lg">
                      {member.nome?.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg text-foreground mb-1">{member.nome}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {member.role}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {member.maturityLevel}
                  </Badge>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center mb-2">{member.email}</p>
                  <div className="space-y-1">
                    {member.areas?.map((area) => (
                      <div key={area} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                        <span className="truncate">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum liderado encontrado com os filtros selecionados.</p>
          </div>
        )}
      </main>

      {/* Botão Flutuante de Comparação */}
      {selectedMembers.length >= 2 && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button 
            size="lg" 
            className="shadow-lg gap-2"
            onClick={handleCompare}
          >
            Comparar {selectedMembers.length} liderados
          </Button>
        </div>
      )}

      {/* Modal de Sucesso */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Liderado Adicionado com Sucesso!</DialogTitle>
            <DialogDescription>
              Guarde a senha temporária abaixo. O liderado deverá usar esta senha no primeiro acesso.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-muted rounded-lg">
              <Label className="text-sm font-medium mb-2 block">Senha Temporária</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-lg font-mono bg-background p-3 rounded border border-border">
                  {tempPassword}
                </code>
                <Button onClick={handleCopyPassword} size="sm">
                  Copiar
                </Button>
              </div>
            </div>
            <Button onClick={handleSuccessDialogClose} className="w-full">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}