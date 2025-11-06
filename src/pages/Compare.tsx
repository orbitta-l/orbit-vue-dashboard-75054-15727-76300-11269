import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { softSkillTemplates, technicalTemplate } from "@/data/evaluationTemplates";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AbsentHardSkillsCollapsible } from "@/components/AbsentHardSkillsCollapsible";
import { AbsentSoftSkillsCollapsible } from "@/components/AbsentSoftSkillsCollapsible";
import { LideradoDashboard } from "@/types/mer";
import { MOCK_COMPETENCIAS } from "@/data/mockData"; // Importar MOCK_COMPETENCIAS para obter nomes

// Interface para os dados de exibição dos chips de competência
export interface CompetencyChipDisplayData {
  name: string;
  hasRelevantScore: boolean;
}

// Helper para obter o nome da competência a partir do ID (necessário para Soft Skills)
const getCompetencyNameById = (id: string) => {
  return MOCK_COMPETENCIAS.find(c => c.id_competencia === id)?.nome_competencia || id;
};

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberIds = searchParams.get("members")?.split(",") || [];
  const { teamData } = useAuth();

  const [selectedMembersForComparison] = useState<string[]>(memberIds.slice(0, 4));
  
  // Estado para controlar a categoria selecionada no dropdown de Hard Skills
  const [selectedHardSkillCategory, setSelectedHardSkillCategory] = useState<string>("all");

  // Estados para controlar o estado de colapsar das seções de competências ausentes
  const [isHardSkillsAbsentCollapsed, setIsHardSkillsAbsentCollapsed] = useState(false);
  const [isSoftSkillsAbsentCollapsed, setIsSoftSkillsAbsentCollapsed] = useState(false);

  const selectedMembers = useMemo(() => 
    teamData.filter(m => selectedMembersForComparison.includes(m.id_usuario)), 
    [teamData, selectedMembersForComparison]
  );

  // Cores para os liderados no gráfico, utilizando a paleta do projeto
  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  // --- Lógica de Geração de Chips e Inicialização ---

  // Todas as Soft Skill competencies, achatadas e com categoria mock
  const allSoftSkillCompetenciesFlat = useMemo(() => {
    const competencies: Array<{ name: string; type: 'SOFT'; categoryId: string; categoryName: string }> = [];
    softSkillTemplates.forEach(template => {
      template.competencias.forEach(comp => {
        const name = getCompetencyNameById(comp.id_competencia);
        if (!competencies.some(c => c.name === name)) { // Garante unicidade
          competencies.push({ name, type: 'SOFT', categoryId: "soft-skills-category", categoryName: "Soft Skills" });
        }
      });
    });
    return competencies;
  }, []);

  // Todas as Hard Skill competencies, achatadas e com informações de categoria/especialização
  const allHardSkillCompetenciesFlat = useMemo(() => {
    return technicalTemplate.flatMap(category =>
      category.especializacoes.flatMap(spec =>
        spec.competencias.map(comp => ({
          name: comp.nome_competencia,
          type: 'HARD' as const,
          categoryId: category.id_categoria,
          categoryName: category.nome_categoria,
          specializationId: spec.id_especializacao,
          specializationName: spec.nome_especializacao,
        }))
      )
    ).filter((comp, index, self) => // Garante unicidade entre todas as hard skills
      index === self.findIndex((t) => t.name === comp.name)
    );
  }, []);

  // Função para obter e ordenar competências com base na relevância
  const getSortedCompetencies = (
    competencyList: Array<{ name: string; type: 'SOFT' | 'HARD'; categoryId?: string; categoryName?: string; specializationId?: string; specializationName?: string }>,
    members: LideradoDashboard[],
    competencyType: 'SOFT' | 'HARD'
  ): CompetencyChipDisplayData[] => {
    const competenciesWithRelevance = competencyList.map(comp => {
      const hasRelevantScore = members.some(member =>
        member.competencias.some(c =>
          c.nome_competencia === comp.name && c.pontuacao_1a4 > 0 && (competencyType === 'SOFT' ? c.tipo === 'COMPORTAMENTAL' : c.tipo === 'TECNICA')
        )
      );
      return { name: comp.name, hasRelevantScore };
    });

    return competenciesWithRelevance.sort((a, b) => {
      if (a.hasRelevantScore && !b.hasRelevantScore) return -1; // Relevantes primeiro
      if (!a.hasRelevantScore && b.hasRelevantScore) return 1;
      return a.name.localeCompare(b.name); // Depois, ordem alfabética
    });
  };

  // Chips de Soft Skills ordenados por relevância
  const sortedSoftSkillChipsData = useMemo(() => {
    return getSortedCompetencies(allSoftSkillCompetenciesFlat, selectedMembers, 'SOFT');
  }, [allSoftSkillCompetenciesFlat, selectedMembers]);

  // Chips de Hard Skills ordenados por relevância
  const sortedHardSkillChipsData = useMemo(() => {
    return getSortedCompetencies(allHardSkillCompetenciesFlat, selectedMembers, 'HARD');
  }, [allHardSkillCompetenciesFlat, selectedMembers]);

  // Separação de chips presentes e ausentes para Hard Skills
  const presentHardSkillChips = sortedHardSkillChipsData.filter(chip => chip.hasRelevantScore);
  const absentHardSkillChips = sortedHardSkillChipsData.filter(chip => !chip.hasRelevantScore);

  // Separação de chips presentes e ausentes para Soft Skills
  const presentSoftSkillChips = sortedSoftSkillChipsData.filter(chip => chip.hasRelevantScore);
  const absentSoftSkillChips = sortedSoftSkillChipsData.filter(chip => !chip.hasRelevantScore);

  // Estados de seleção de competências
  const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>([]);
  const [selectedHardSkills, setSelectedHardSkills] = useState<string[]>([]);

  // Efeito para inicializar as competências selecionadas
  useEffect(() => {
    if (selectedMembers.length > 0 && selectedSoftSkills.length === 0 && selectedHardSkills.length === 0) {
      // Seleciona as 3 primeiras soft skills presentes
      const initialSoft = presentSoftSkillChips.slice(0, 3).map(c => c.name);
      
      // Seleciona as 3 primeiras hard skills presentes
      const initialHard = presentHardSkillChips.slice(0, 3).map(c => c.name);
      
      setSelectedSoftSkills(initialSoft);
      setSelectedHardSkills(initialHard);
    }
  }, [selectedMembers, presentSoftSkillChips, presentHardSkillChips]);


  // Categorias de Hard Skills para o dropdown
  const hardSkillCategoriesForSelect = useMemo(() => {
    return technicalTemplate.map(cat => ({ id: cat.id_categoria, name: cat.nome_categoria }));
  }, []);

  // Chips de Hard Skills filtrados pela categoria selecionada no dropdown
  const filteredHardSkillChips = useMemo(() => {
    if (selectedHardSkillCategory === "all") {
      return sortedHardSkillChipsData;
    }
    const categoryCompetencies = allHardSkillCompetenciesFlat.filter(
      chip => chip.categoryId === selectedHardSkillCategory
    );
    return getSortedCompetencies(categoryCompetencies, selectedMembers, 'HARD');
  }, [sortedHardSkillChipsData, selectedHardSkillCategory, allHardSkillCompetenciesFlat, selectedMembers]);


  const handleToggleSoftSkill = (skillName: string) => {
    setSelectedSoftSkills(prev =>
      prev.includes(skillName) ? prev.filter(s => s !== skillName) : [...prev, skillName]
    );
  };

  const handleToggleHardSkill = (skillName: string) => {
    setSelectedHardSkills(prev =>
      prev.includes(skillName) ? prev.filter(s => s !== skillName) : [...prev, skillName]
    );
  };

  const getRadarChartData = () => {
    if (selectedMembers.length < 1) return [];

    const combinedSelectedCompetencies = [...selectedSoftSkills, ...selectedHardSkills];
    if (combinedSelectedCompetencies.length === 0) {
      return [];
    }

    const radarDataMap: Record<string, any> = {};

    combinedSelectedCompetencies.forEach(compName => {
      radarDataMap[compName] = { subject: compName, PerfilIdeal: 4.0, fullMark: 4 };

      selectedMembers.forEach(member => {
        // Busca a pontuação pelo nome da competência
        const memberCompetency = member.competencias.find(c => c.nome_competencia === compName);
        
        // Se for Soft Skill, o nome da competência pode estar vindo do template (ID), então tentamos buscar pelo ID também
        if (!memberCompetency) {
            const compId = MOCK_COMPETENCIAS.find(c => c.nome_competencia === compName)?.id_competencia;
            const memberCompetencyById = member.competencias.find(c => c.id_competencia === compId);
            if (memberCompetencyById) {
                radarDataMap[compName][member.nome] = parseFloat(memberCompetencyById.pontuacao_1a4.toFixed(1));
                return;
            }
        }

        radarDataMap[compName][member.nome] = memberCompetency ? parseFloat(memberCompetency.pontuacao_1a4.toFixed(1)) : 0;
      });
    });

    return Object.values(radarDataMap);
  };

  const radarData = getRadarChartData();
  const totalSelectedCompetencies = selectedSoftSkills.length + selectedHardSkills.length;
  
  const hasAnyEvaluationData = selectedMembers.some(m => m.ultima_avaliacao);

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
          <Card key={member.id_usuario} className="p-4 border-l-4" style={{ borderColor: colors[index % colors.length] }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-md font-bold text-foreground">{getInitials(member.nome)}</span>
              </div>
              <div>
                <h3 className="text-md font-semibold text-foreground">{member.nome}</h3>
                <Badge variant="secondary" className="text-xs">{member.cargo_nome}</Badge>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <p>Maturidade: <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{member.ultima_avaliacao?.maturidade_quadrante || 'N/A'}</Badge></p>
            </div>
          </Card>
        ))}
      </div>

      {/* Gráfico de Radar e Filtros de Chips */}
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
        </div>

        {totalSelectedCompetencies < 3 && hasAnyEvaluationData && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-sm">
            <p className="font-semibold">Atenção:</p>
            <p>Selecione pelo menos 3 competências (Soft ou Hard Skills) para uma visualização completa no gráfico de radar.</p>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Hard Skills Chips (Left) */}
          <div className="lg:w-1/4 flex-shrink-0">
            <h3 className="font-semibold text-foreground mb-3">Hard Skills</h3>
            <Select value={selectedHardSkillCategory} onValueChange={setSelectedHardSkillCategory}>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Todas as Categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {hardSkillCategoriesForSelect.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-4">
              {presentHardSkillChips.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-primary mb-2">Competências Presentes</p>
                  <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto pr-2">
                    {presentHardSkillChips.map(skill => (
                      <Button
                        key={skill.name}
                        onClick={() => handleToggleHardSkill(skill.name)}
                        className={cn(
                          "h-7 px-2.5 text-xs", // Smaller size
                          selectedHardSkills.includes(skill.name)
                            ? "bg-primary text-primary-foreground hover:bg-primary/90" // Selected
                            : "border-primary text-primary bg-primary/10 hover:bg-primary/20" // Present, unselected
                        )}
                      >
                        {skill.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <AbsentHardSkillsCollapsible
                absentHardSkillChips={absentHardSkillChips}
                isHardSkillsAbsentCollapsed={isHardSkillsAbsentCollapsed}
                setIsHardSkillsAbsentCollapsed={setIsHardSkillsAbsentCollapsed}
                selectedHardSkills={selectedHardSkills}
                handleToggleHardSkill={handleToggleHardSkill}
              />
            </div>
          </div>

          {/* Radar Chart (Center) */}
          <div className="flex-1 min-w-0">
            <ResponsiveContainer width="100%" height={500}>
              {radarData.length === 0 ? (
                <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground text-center">
                    {hasAnyEvaluationData 
                      ? "Selecione competências nos painéis laterais para iniciar a comparação."
                      : "Nenhum membro selecionado possui avaliações para comparação."
                    }
                  </p>
                </div>
              ) : (
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
                    fillOpacity={0}
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    // Adicionando strokeOpacity para garantir visibilidade
                    strokeOpacity={0.8} 
                  />

                  {/* Liderados Selecionados */}
                  {selectedMembers.map((member, index) => (
                    <Radar
                      key={member.id_usuario}
                      name={member.nome}
                      dataKey={member.nome}
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
              )}
            </ResponsiveContainer>
          </div>

          {/* Soft Skills Chips (Right) */}
          <div className="lg:w-1/4 flex-shrink-0">
            <h3 className="font-semibold text-foreground mb-3">Soft Skills</h3>
            <div className="space-y-4">
              {presentSoftSkillChips.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-primary mb-2">Competências Presentes</p>
                  <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto pr-2">
                    {presentSoftSkillChips.map(skill => (
                      <Button
                        key={skill.name}
                        onClick={() => handleToggleSoftSkill(skill.name)}
                        className={cn(
                          "h-7 px-2.5 text-xs", // Smaller size
                          selectedSoftSkills.includes(skill.name)
                            ? "bg-primary text-primary-foreground hover:bg-primary/90" // Selected
                            : "border-primary text-primary bg-primary/10 hover:bg-primary/20" // Present, unselected
                        )}
                      >
                        {skill.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <AbsentSoftSkillsCollapsible
                absentSoftSkillChips={absentSoftSkillChips}
                isSoftSkillsAbsentCollapsed={isSoftSkillsAbsentCollapsed}
                setIsSoftSkillsAbsentCollapsed={setIsSoftSkillsAbsentCollapsed}
                selectedSoftSkills={selectedSoftSkills}
                handleToggleSoftSkill={handleToggleSoftSkill}
              />
            </div>
          </div>
        </div>
        
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