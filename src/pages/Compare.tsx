import { ArrowLeft, Filter, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, Liderado } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { softSkillTemplates, technicalCategories } from "@/data/evaluationTemplates";
import { cn } from "@/lib/utils";

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberIds = searchParams.get("members")?.split(",") || [];
  const { liderados } = useAuth();

  const [selectedMembersForComparison, setSelectedMembersForComparison] = useState<string[]>(memberIds.slice(0, 4));
  const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>([]);
  const [selectedHardSkills, setSelectedHardSkills] = useState<string[]>([]);

  const selectedMembers = useMemo(() => 
    liderados.filter(m => selectedMembersForComparison.includes(m.id_liderado)), 
    [liderados, selectedMembersForComparison]
  );

  // Cores para os liderados no gráfico
  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  // Função para obter e ordenar competências
  const getSortedCompetencies = (
    competencyTemplates: Array<{ name: string; type: 'COMPORTAMENTAL' | 'TECNICA' }>,
    members: Liderado[],
    competencyType: 'COMPORTAMENTAL' | 'TECNICA'
  ) => {
    const competenciesWithRelevance = competencyTemplates.map(comp => {
      const hasRelevantScore = members.some(member =>
        member.competencias.some(c =>
          c.nome_competencia === comp.name && c.media_pontuacao > 0 && c.tipo === competencyType
        )
      );
      return { name: comp.name, hasRelevantScore };
    });

    return competenciesWithRelevance.sort((a, b) => {
      if (a.hasRelevantScore && !b.hasRelevantScore) return -1;
      if (!a.hasRelevantScore && b.hasRelevantScore) return 1;
      return a.name.localeCompare(b.name);
    });
  };

  // Todas as Soft Skills únicas dos templates
  const allUniqueSoftSkillTemplates = useMemo(() => {
    const competencies = new Map<string, { name: string; type: 'COMPORTAMENTAL' | 'TECNICA' }>();
    softSkillTemplates.forEach(template => {
      template.competencias.forEach(comp => competencies.set(comp.name, { name: comp.name, type: 'COMPORTAMENTAL' }));
    });
    return Array.from(competencies.values());
  }, []);

  // Todas as Hard Skills únicas dos templates
  const allUniqueHardSkillTemplates = useMemo(() => {
    const competencies = new Map<string, { name: string; type: 'COMPORTAMENTAL' | 'TECNICA' }>();
    technicalCategories.forEach(category => {
      category.especializacoes.forEach(spec => {
        spec.competencias.forEach(comp => competencies.set(comp.name, { name: comp.name, type: 'TECNICA' }));
      });
    });
    return Array.from(competencies.values());
  }, []);

  const sortedSoftSkillChips = useMemo(() => {
    return getSortedCompetencies(allUniqueSoftSkillTemplates, selectedMembers, 'COMPORTAMENTAL');
  }, [allUniqueSoftSkillTemplates, selectedMembers]);

  const sortedHardSkillChips = useMemo(() => {
    return getSortedCompetencies(allUniqueHardSkillTemplates, selectedMembers, 'TECNICA');
  }, [allUniqueHardSkillTemplates, selectedMembers]);

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
      return [];
    }

    const radarDataMap: Record<string, any> = {};

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
  const totalSelectedCompetencies = selectedSoftSkills.length + selectedHardSkills.length;

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

        {totalSelectedCompetencies < 3 && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-sm">
            <p className="font-semibold">Atenção:</p>
            <p>Selecione pelo menos 3 competências (Soft ou Hard Skills) para uma visualização completa no gráfico de radar.</p>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Hard Skills Chips (Left) */}
          <div className="lg:w-1/4 flex-shrink-0">
            <h3 className="font-semibold text-foreground mb-3">Hard Skills</h3>
            <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto pr-2">
              {sortedHardSkillChips.map(skill => (
                <Button
                  key={skill.name}
                  variant={selectedHardSkills.includes(skill.name) ? "default" : "outline"}
                  onClick={() => handleToggleHardSkill(skill.name)}
                  className={cn(
                    "flex items-center gap-2",
                    skill.hasRelevantScore ? "border-primary text-primary" : "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {skill.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Radar Chart (Center) */}
          <div className="flex-1 min-w-0">
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
                  fillOpacity={0}
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
          </div>

          {/* Soft Skills Chips (Right) */}
          <div className="lg:w-1/4 flex-shrink-0">
            <h3 className="font-semibold text-foreground mb-3">Soft Skills</h3>
            <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto pr-2">
              {sortedSoftSkillChips.map(skill => (
                <Button
                  key={skill.name}
                  variant={selectedSoftSkills.includes(skill.name) ? "default" : "outline"}
                  onClick={() => handleToggleSoftSkill(skill.name)}
                  className={cn(
                    "flex items-center gap-2",
                    skill.hasRelevantScore ? "border-primary text-primary" : "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {skill.name}
                </Button>
              ))}
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