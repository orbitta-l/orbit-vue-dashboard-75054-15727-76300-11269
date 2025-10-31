import { ArrowLeft, Filter, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { Command, CommandEmpty, CommandGroup, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CommandInputWithClear } from "@/components/CommandInputWithClear";
import { toast } from "@/hooks/use-toast";
import { softSkillTemplates, technicalCategories } from "@/data/evaluationTemplates";

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberIds = searchParams.get("members")?.split(",") || [];
  const { liderados } = useAuth();

  // Comparison Mode states
  // Initialize with max 4 members from URL params
  const [selectedMembersForComparison, setSelectedMembersForComparison] = useState<string[]>(memberIds.slice(0, 4));

  // New states for filters
  const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>([]);
  const [selectedHardSkills, setSelectedHardSkills] = useState<string[]>([]);
  const [isSoftSkillSelectOpen, setIsSoftSkillSelectOpen] = useState(false);
  const [isHardSkillSelectOpen, setIsHardSkillSelectOpen] = useState(false);
  const [softSkillSearch, setSoftSkillSearch] = useState("");
  const [hardSkillSearch, setHardSkillSearch] = useState("");

  const selectedMembers = useMemo(() => 
    liderados.filter(m => selectedMembersForComparison.includes(m.id_liderado)), 
    [liderados, selectedMembersForComparison]
  );

  // All available soft skill competencies
  const allSoftSkillCompetencies = useMemo(() => {
    const competencies = new Set<string>();
    softSkillTemplates.forEach(template => {
      template.competencias.forEach(comp => competencies.add(comp.name));
    });
    return Array.from(competencies).sort();
  }, []);

  // All available hard skill competencies
  const allHardSkillCompetencies = useMemo(() => {
    const competencies = new Set<string>();
    technicalCategories.forEach(category => {
      category.especializacoes.forEach(spec => {
        spec.competencias.forEach(comp => competencies.add(comp.name));
      });
    });
    return Array.from(competencies).sort();
  }, []);

  const handleToggleMemberForComparison = (memberId: string) => {
    setSelectedMembersForComparison(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        if (prev.length >= 4) {
          toast({
            variant: "destructive",
            title: "Limite de comparação atingido",
            description: "Você pode comparar no máximo 4 liderados por vez.",
          });
          return prev; // Don't add the new member
        }
        return [...prev, memberId];
      }
    });
  };

  const handleToggleSoftSkill = (skill: string) => {
    setSelectedSoftSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleToggleHardSkill = (skill: string) => {
    setSelectedHardSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const getRadarChartData = () => {
    if (selectedMembers.length < 1) return [];

    const combinedSelectedCompetencies = [...selectedSoftSkills, ...selectedHardSkills];
    if (combinedSelectedCompetencies.length === 0) {
      return []; // Return empty if no competencies are selected
    }

    const radarDataMap: Record<string, any> = {}; // Key: competency name

    combinedSelectedCompetencies.forEach(compName => {
      radarDataMap[compName] = { subject: compName, PerfilIdeal: 4.0, fullMark: 4 };

      selectedMembers.forEach(member => {
        const memberCompetency = member.competencias.find(c => c.nome_competencia === compName);
        radarDataMap[compName][member.nome_liderado] = memberCompetency ? parseFloat(memberCompetency.media_pontuacao.toFixed(1)) : 0;
      });
    });

    return Object.values(radarDataMap);
  };

  const radarData = getRadarChartData();

  // Cores: Azul Primário, Laranja, Cinza, Roxo
  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  // If no members are selected, show a message
  if (selectedMembers.length === 0) {
    return (
      <div className="p-8">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2"
          onClick={() => navigate("/team")}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Liderados
        </Button>
        <p className="text-muted-foreground">Selecione pelo menos 1 membro na página de "Time" para iniciar a comparação.</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-8">
      <Button 
        variant="ghost" 
        className="mb-6 gap-2"
        onClick={() => navigate("/team")}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Liderados
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Comparação de Liderados</h1>
        <p className="text-muted-foreground">
          {selectedMembers.length} colaborador(es) selecionado(s) para comparação
        </p>
      </div>

      {/* Cards de Informação dos Membros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {selectedMembers.map((member, index) => (
          <Card key={member.id_liderado} className="p-4 border-l-4" style={{ borderColor: colors[index % colors.length] }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-md font-bold text-foreground">{getInitials(member.nome_liderado)}</span>
              </div>
              <div>
                <h3 className="text-md font-semibold text-foreground">{member.nome_liderado}</h3>
                <Badge variant="secondary" className="text-xs">{member.cargo}</Badge>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <p>Maturidade: <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{member.nivel_maturidade}</Badge></p>
              <p>Dominante: {member.categoria_dominante}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Gráfico de Radar e Filtros */}
      <Card className="p-6 bg-gradient-to-br from-card to-card/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Análise de Gaps - VERSUS Ideal
            </h2>
            <p className="text-sm text-muted-foreground">
              O polígono externo (Ideal) representa a nota máxima (4.0) esperada em cada competência.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Soft Skills Filter */}
            <Popover open={isSoftSkillSelectOpen} onOpenChange={setIsSoftSkillSelectOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Soft Skills ({selectedSoftSkills.length})
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInputWithClear
                    placeholder="Buscar Soft Skill..."
                    value={softSkillSearch}
                    onValueChange={setSoftSkillSearch}
                  />
                  <CommandList>
                    <CommandEmpty>Nenhuma Soft Skill encontrada.</CommandEmpty>
                    <CommandGroup>
                      {allSoftSkillCompetencies
                        .filter(skill => skill.toLowerCase().includes(softSkillSearch.toLowerCase()))
                        .map(skill => (
                          <CommandItem
                            key={skill}
                            onSelect={() => handleToggleSoftSkill(skill)}
                          >
                            <Checkbox
                              checked={selectedSoftSkills.includes(skill)}
                              onCheckedChange={() => handleToggleSoftSkill(skill)}
                              className="mr-2"
                            />
                            {skill}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Hard Skills Filter */}
            <Popover open={isHardSkillSelectOpen} onOpenChange={setIsHardSkillSelectOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Hard Skills ({selectedHardSkills.length})
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInputWithClear
                    placeholder="Buscar Hard Skill..."
                    value={hardSkillSearch}
                    onValueChange={setHardSkillSearch}
                  />
                  <CommandList>
                    <CommandEmpty>Nenhuma Hard Skill encontrada.</CommandEmpty>
                    <CommandGroup>
                      {allHardSkillCompetencies
                        .filter(skill => skill.toLowerCase().includes(hardSkillSearch.toLowerCase()))
                        .map(skill => (
                          <CommandItem
                            key={skill}
                            onSelect={() => handleToggleHardSkill(skill)}
                          >
                            <Checkbox
                              checked={selectedHardSkills.includes(skill)}
                              onCheckedChange={() => handleToggleHardSkill(skill)}
                              className="mr-2"
                            />
                            {skill}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={500}>
          <RadarChart data={radarData}>
            <PolarGrid 
              stroke="hsl(var(--muted-foreground) / 0.3)" 
              strokeWidth={1}
            />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 500 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 4]} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              stroke="hsl(var(--muted-foreground) / 0.3)"
            />
            
            {/* Perfil Ideal (4.0) - Linha de Referência */}
            <Radar
              name="Perfil Ideal"
              dataKey="PerfilIdeal"
              stroke="hsl(var(--primary-dark))"
              fill="hsl(var(--primary-dark))"
              fillOpacity={0} // Changed to 0 for "empty pentagon"
              strokeWidth={3}
              strokeDasharray="5 5"
            />

            {/* Liderados Selecionados */}
            {selectedMembers.map((member, index) => (
              <Radar
                key={member.id_liderado}
                name={member.nome_liderado}
                dataKey={member.nome_liderado}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.4}
                strokeWidth={2}
              />
            ))}
            <Legend 
              wrapperStyle={{ paddingTop: '30px' }}
              iconType="circle"
              iconSize={12}
            />
          </RadarChart>
        </ResponsiveContainer>
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold text-foreground mb-2">Interpretação de Gaps:</h4>
          <p className="text-sm text-muted-foreground">
            O espaço entre o polígono de cada liderado e o polígono tracejado (Perfil Ideal 4.0) representa o <strong>Gap de Conhecimento</strong>. Quanto maior o espaço, maior a necessidade de desenvolvimento naquela competência.
          </p>
        </div>
      </Card>
    </div>
  );
}