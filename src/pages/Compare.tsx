import { ArrowLeft, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { softSkillTemplates, technicalTemplate } from "@/data/evaluationTemplates";
import { LideradoDashboard } from "@/types/mer";
import { MOCK_COMPETENCIAS } from "@/data/mockData";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const getCompetencyNameById = (id: string) => {
  return MOCK_COMPETENCIAS.find(c => c.id_competencia === id)?.nome_competencia || id;
};

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberIds = searchParams.get("members")?.split(",") || [];
  const { teamData } = useAuth();

  const [selectedMembersForComparison] = useState<string[]>(memberIds.slice(0, 4));
  
  // State for the new top-down filter
  const [selectedTheme, setSelectedTheme] = useState<string>("soft-skills");
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);

  const selectedMembers = useMemo(() => 
    teamData.filter(m => selectedMembersForComparison.includes(m.id_usuario)), 
    [teamData, selectedMembersForComparison]
  );

  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  // Create a unified list of themes for the main dropdown
  const analysisThemes = useMemo(() => {
    const hardSkillThemes = technicalTemplate.map(category => ({
      id: category.id_categoria,
      name: category.nome_categoria,
    }));
    return [
      { id: "soft-skills", name: "Soft Skills" },
      ...hardSkillThemes,
    ];
  }, []);

  // Get the list of competencies based on the selected theme
  const competenciesForSelectedTheme = useMemo(() => {
    if (selectedTheme === "soft-skills") {
      const allSoftSkills = new Set<string>();
      softSkillTemplates.forEach(template => {
        template.competencias.forEach(comp => {
          allSoftSkills.add(getCompetencyNameById(comp.id_competencia));
        });
      });
      return Array.from(allSoftSkills).map(name => ({ name }));
    }
    
    const category = technicalTemplate.find(c => c.id_categoria === selectedTheme);
    if (!category) return [];
    
    return category.especializacoes.flatMap(spec => 
      spec.competencias.map(comp => ({ name: comp.nome_competencia }))
    );
  }, [selectedTheme]);

  // EFFECT: Auto-populate the chart and checkboxes when the theme changes
  useEffect(() => {
    const allCompetencyNames = competenciesForSelectedTheme.map(c => c.name);
    setSelectedCompetencies(allCompetencyNames);
  }, [competenciesForSelectedTheme]);

  const handleToggleAllCompetencies = (checked: boolean) => {
    if (checked) {
      setSelectedCompetencies(competenciesForSelectedTheme.map(c => c.name));
    } else {
      setSelectedCompetencies([]);
    }
  };

  const handleToggleCompetency = (competencyName: string) => {
    setSelectedCompetencies(prev => 
      prev.includes(competencyName) 
        ? prev.filter(name => name !== competencyName) 
        : [...prev, competencyName]
    );
  };

  const getRadarChartData = () => {
    if (selectedMembers.length < 1 || selectedCompetencies.length === 0) return [];

    const radarDataMap: Record<string, any> = {};
    selectedCompetencies.forEach(compName => {
      radarDataMap[compName] = { subject: compName, PerfilIdeal: 4.0, fullMark: 4 };
      selectedMembers.forEach(member => {
        const memberCompetency = member.competencias.find(c => c.nome_competencia === compName);
        radarDataMap[compName][member.nome] = memberCompetency ? parseFloat(memberCompetency.pontuacao_1a4.toFixed(1)) : 0;
      });
    });
    return Object.values(radarDataMap);
  };

  const radarData = getRadarChartData();
  const hasAnyEvaluationData = selectedMembers.some(m => m.ultima_avaliacao);

  if (selectedMembers.length === 0) {
    return (
      <div className="p-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate("/team")}>
          <ArrowLeft className="w-4 h-4" /> Voltar para Liderados
        </Button>
        <p className="text-muted-foreground">Selecione pelo menos 1 membro na página de "Time" para iniciar a comparação.</p>
      </div>
    );
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const areAllSelected = selectedCompetencies.length === competenciesForSelectedTheme.length && competenciesForSelectedTheme.length > 0;

  return (
    <div className="p-8">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate("/team")}>
        <ArrowLeft className="w-4 h-4" /> Voltar para Liderados
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Comparação de Liderados</h1>
        <p className="text-muted-foreground">{selectedMembers.length} colaborador(es) selecionado(s) para comparação</p>
      </div>

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

      <Card className="p-6 bg-gradient-to-br from-card to-card/50">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Coluna de Filtros Consolidada */}
          <div className="lg:w-1/3 flex-shrink-0 space-y-6">
            <div>
              <Label className="font-semibold text-foreground mb-2 block">Analisar Competências de:</Label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um tema" />
                </SelectTrigger>
                <SelectContent>
                  {analysisThemes.map(theme => (
                    <SelectItem key={theme.id} value={theme.id}>{theme.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between pb-3 border-b mb-3">
                <Label htmlFor="select-all" className="font-semibold flex items-center gap-2">
                  <Checkbox 
                    id="select-all" 
                    checked={areAllSelected}
                    onCheckedChange={handleToggleAllCompetencies}
                  />
                  Competências ({selectedCompetencies.length}/{competenciesForSelectedTheme.length})
                </Label>
              </div>
              <ScrollArea className="h-96">
                <div className="space-y-2 pr-4">
                  {competenciesForSelectedTheme.map(comp => (
                    <div key={comp.name} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                      <Checkbox 
                        id={comp.name}
                        checked={selectedCompetencies.includes(comp.name)}
                        onCheckedChange={() => handleToggleCompetency(comp.name)}
                      />
                      <Label htmlFor={comp.name} className="flex-1 cursor-pointer">{comp.name}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Coluna do Gráfico */}
          <div className="lg:w-2/3">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Análise de Gaps - VERSUS Ideal</h2>
                <p className="text-sm text-muted-foreground">O polígono externo (Ideal) representa a nota máxima (4.0) esperada em cada competência.</p>
              </div>
            </div>
            {selectedCompetencies.length < 3 && hasAnyEvaluationData && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-sm">
                <p className="font-semibold">Atenção:</p>
                <p>Selecione pelo menos 3 competências para uma visualização completa no gráfico de radar.</p>
              </div>
            )}
            <ResponsiveContainer width="100%" height={500}>
              {radarData.length === 0 ? (
                <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground text-center">
                    {hasAnyEvaluationData ? "Selecione competências no painel de filtros para iniciar a comparação." : "Nenhum membro selecionado possui avaliações para comparação."}
                  </p>
                </div>
              ) : (
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth={1} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 4]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} stroke="hsl(var(--muted-foreground) / 0.3)" />
                  <Radar name="Perfil Ideal" dataKey="PerfilIdeal" stroke="hsl(var(--primary-dark))" fill="hsl(var(--primary-dark))" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" strokeOpacity={0.8} />
                  {selectedMembers.map((member, index) => (
                    <Radar key={member.id_usuario} name={member.nome} dataKey={member.nome} stroke={colors[index % colors.length]} fill={colors[index % colors.length]} fillOpacity={0.4} strokeWidth={2} />
                  ))}
                  <Legend wrapperStyle={{ paddingTop: '30px' }} iconType="circle" iconSize={12} />
                </RadarChart>
              )}
            </ResponsiveContainer>
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Interpretação de Gaps:</h4>
              <p className="text-sm text-muted-foreground">O espaço entre o polígono de cada liderado e o polígono tracejado (Perfil Ideal 4.0) representa o <strong>Gap de Conhecimento</strong>. Quanto maior o espaço, maior a necessidade de desenvolvimento naquela competência.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}