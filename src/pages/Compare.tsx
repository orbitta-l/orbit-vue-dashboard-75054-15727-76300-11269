import { ArrowLeft, Filter, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, Liderado } from "@/contexts/AuthContext";
import { technicalCategories, softSkillTemplates } from "@/data/evaluationTemplates";
import { CompetenciaTipo } from "@/types/mer";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ComparisonLevel = "category" | "specialization" | "competency";

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberIds = searchParams.get("members")?.split(",") || [];
  const { liderados } = useAuth();

  const [comparisonLevel, setComparisonLevel] = useState<ComparisonLevel>("category");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [selectedSpecializationFilter, setSelectedSpecializationFilter] = useState<string>("all");
  const [customSelectedCompetencies, setCustomSelectedCompetencies] = useState<string[]>([]);
  const [isCompetencySelectOpen, setIsCompetencySelectOpen] = useState(false);

  const selectedMembers = useMemo(() => 
    liderados.filter(m => memberIds.includes(m.id_liderado)), 
    [liderados, memberIds]
  );

  const allAvailableCategories = useMemo(() => {
    const categories = new Set<string>();
    selectedMembers.forEach(member => {
      member.competencias.forEach(comp => {
        if (comp.tipo === 'TECNICA' && comp.nome_categoria) {
          categories.add(comp.nome_categoria);
        }
      });
    });
    return Array.from(categories).sort();
  }, [selectedMembers]);

  const allAvailableSpecializations = useMemo(() => {
    const specializations = new Set<string>();
    selectedMembers.forEach(member => {
      member.competencias.forEach(comp => {
        if (comp.tipo === 'TECNICA' && comp.nome_especializacao && (selectedCategoryFilter === 'all' || comp.nome_categoria === selectedCategoryFilter)) {
          specializations.add(comp.nome_especializacao);
        }
      });
    });
    return Array.from(specializations).sort();
  }, [selectedMembers, selectedCategoryFilter]);

  const allAvailableCompetencies = useMemo(() => {
    const competencies = new Set<string>();
    selectedMembers.forEach(member => {
      member.competencias.forEach(comp => {
        if (comp.tipo === 'TECNICA' && (selectedCategoryFilter === 'all' || comp.nome_categoria === selectedCategoryFilter) && (selectedSpecializationFilter === 'all' || comp.nome_especializacao === selectedSpecializationFilter)) {
          competencies.add(comp.nome_competencia);
        } else if (comp.tipo === 'COMPORTAMENTAL' && selectedCategoryFilter === 'Soft Skills') {
          competencies.add(comp.nome_competencia);
        }
      });
    });
    return Array.from(competencies).sort();
  }, [selectedMembers, selectedCategoryFilter, selectedSpecializationFilter]);

  const getRadarChartData = () => {
    if (selectedMembers.length < 2) return [];

    const data: Record<string, any> = {};
    const subjects = new Set<string>();

    selectedMembers.forEach(member => {
      member.competencias.forEach(comp => {
        let subjectKey: string | null = null;
        let score = comp.media_pontuacao;

        if (comparisonLevel === "category") {
          if (selectedCategoryFilter === "all") {
            if (comp.tipo === 'TECNICA' && comp.nome_categoria) {
              subjectKey = comp.nome_categoria;
            } else if (comp.tipo === 'COMPORTAMENTAL') {
              subjectKey = 'Soft Skills'; // Agrupar todas as soft skills em uma categoria
            }
          } else if (comp.nome_categoria === selectedCategoryFilter) {
            subjectKey = comp.nome_especializacao || comp.nome_competencia; // Se categoria específica, mostrar especializações ou competências
          } else if (selectedCategoryFilter === 'Soft Skills' && comp.tipo === 'COMPORTAMENTAL') {
            subjectKey = comp.nome_competencia;
          }
        } else if (comparisonLevel === "specialization") {
          if (comp.nome_especializacao === selectedSpecializationFilter) {
            subjectKey = comp.nome_competencia;
          }
        } else if (comparisonLevel === "competency" && customSelectedCompetencies.includes(comp.nome_competencia)) {
          subjectKey = comp.nome_competencia;
        }

        if (subjectKey) {
          subjects.add(subjectKey);
          if (!data[subjectKey]) {
            data[subjectKey] = { subject: subjectKey };
          }
          data[subjectKey][member.nome_liderado] = (data[subjectKey][member.nome_liderado] || 0) + score;
          data[subjectKey][`${member.nome_liderado}_count`] = (data[subjectKey][`${member.nome_liderado}_count`] || 0) + 1;
        }
      });
    });

    // Calculate averages for subjects that were aggregated
    const finalData = Array.from(subjects).map(subject => {
      const item: any = { subject };
      selectedMembers.forEach(member => {
        const totalScore = data[subject]?.[member.nome_liderado] || 0;
        const count = data[subject]?.[`${member.nome_liderado}_count`] || 0;
        item[member.nome_liderado] = count > 0 ? parseFloat((totalScore / count).toFixed(1)) : 0;
      });
      item.fullMark = 4; // Max score for radar chart
      return item;
    });

    return finalData;
  };

  const radarData = getRadarChartData();

  const colors = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  if (selectedMembers.length < 2) {
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
        <p className="text-muted-foreground">Selecione pelo menos 2 membros para comparar</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDominantInfo = (member: Liderado) => {
    if (member.categoria_dominante && member.especializacao_dominante) {
      return `${member.categoria_dominante} > ${member.especializacao_dominante}`;
    }
    return member.categoria_dominante || 'N/A';
  };

  const getComparisonAnalysis = () => {
    if (radarData.length === 0) return "Não há dados suficientes para uma análise com os filtros atuais.";

    let analysisText = "";
    const memberScores: Record<string, number> = {};
    const memberStrengths: Record<string, string[]> = {};
    const memberWeaknesses: Record<string, string[]> = {};

    selectedMembers.forEach(member => {
      memberScores[member.nome_liderado] = 0;
      memberStrengths[member.nome_liderado] = [];
      memberWeaknesses[member.nome_liderado] = [];
    });

    radarData.forEach(item => {
      selectedMembers.forEach(member => {
        const score = item[member.nome_liderado] || 0;
        memberScores[member.nome_liderado] += score;
        if (score >= 3.5) {
          memberStrengths[member.nome_liderado].push(item.subject);
        } else if (score <= 2.0 && score > 0) { // Score > 0 para ignorar competências não avaliadas
          memberWeaknesses[member.nome_liderado].push(item.subject);
        }
      });
    });

    const avgScores: Record<string, number> = {};
    selectedMembers.forEach(member => {
      avgScores[member.nome_liderado] = memberScores[member.nome_liderado] / radarData.length;
    });

    const sortedMembersByAvg = Object.entries(avgScores).sort(([, avgA], [, avgB]) => avgB - avgA);
    const bestMember = sortedMembersByAvg[0]?.[0];
    const bestAvg = sortedMembersByAvg[0]?.[1];

    analysisText += `Com base nos filtros atuais, `;
    if (bestMember) {
      analysisText += `<strong class="text-primary">${bestMember}</strong> apresenta o melhor desempenho geral com média de <strong class="text-primary">${bestAvg.toFixed(1)}/4.0</strong>. `;
    }

    if (selectedMembers.length > 1) {
      const firstMember = selectedMembers[0];
      const secondMember = selectedMembers[1];

      const firstMemberStrengths = memberStrengths[firstMember.nome_liderado];
      const secondMemberStrengths = memberStrengths[secondMember.nome_liderado];

      if (firstMemberStrengths.length > 0 || secondMemberStrengths.length > 0) {
        analysisText += `Em termos de pontos fortes, `;
        if (firstMemberStrengths.length > 0) {
          analysisText += `<strong class="text-primary">${firstMember.nome_liderado}</strong> se destaca em <strong class="text-primary">${firstMemberStrengths.join(", ")}</strong>. `;
        }
        if (secondMemberStrengths.length > 0) {
          analysisText += `Já <strong class="text-chart-2">${secondMember.nome_liderado}</strong> demonstra força em <strong class="text-chart-2">${secondMemberStrengths.join(", ")}</strong>. `;
        }
      }

      const firstMemberWeaknesses = memberWeaknesses[firstMember.nome_liderado];
      const secondMemberWeaknesses = memberWeaknesses[secondMember.nome_liderado];

      if (firstMemberWeaknesses.length > 0 || secondMemberWeaknesses.length > 0) {
        analysisText += `Para oportunidades de desenvolvimento, `;
        if (firstMemberWeaknesses.length > 0) {
          analysisText += `<strong class="text-primary">${firstMember.nome_liderado}</strong> pode focar em <strong class="text-destructive">${firstMemberWeaknesses.join(", ")}</strong>. `;
        }
        if (secondMemberWeaknesses.length > 0) {
          analysisText += `<strong class="text-chart-2">${secondMember.nome_liderado}</strong> pode aprimorar <strong class="text-destructive">${secondMemberWeaknesses.join(", ")}</strong>.`;
        }
      }
    }

    return analysisText || "Selecione filtros para uma análise mais detalhada.";
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
          {selectedMembers.length} colaboradores selecionados para comparação
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {selectedMembers.map((member) => (
          <Card key={member.id_liderado} className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{getInitials(member.nome_liderado)}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{member.nome_liderado}</h3>
                <Badge variant="secondary">{member.cargo}</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              {member.competencias.map((comp) => (
                <div key={comp.id_competencia}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{comp.nome_competencia}</span>
                    <span className="text-sm font-semibold text-foreground">{comp.media_pontuacao.toFixed(1)}/4</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${(comp.media_pontuacao / 4) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-card to-card/50 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Comparação Visual - Competências
              </h2>
              <p className="text-sm text-muted-foreground">
                Análise comparativa de desempenho entre liderados selecionados
              </p>
            </div>
            <Select value={comparisonLevel} onValueChange={(v: ComparisonLevel) => {
              setComparisonLevel(v);
              setSelectedCategoryFilter("all");
              setSelectedSpecializationFilter("all");
              setCustomSelectedCompetencies([]);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Nível de Comparação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Por Categoria</SelectItem>
                <SelectItem value="specialization">Por Especialização</SelectItem>
                <SelectItem value="competency">Competências Personalizadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {comparisonLevel === "category" && (
            <div className="mb-4 p-3 border border-border rounded-lg bg-muted/20">
              <p className="text-sm font-medium text-foreground mb-2">Filtrar Categoria:</p>
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as Categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias (incl. Soft Skills)</SelectItem>
                  <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                  {allAvailableCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {comparisonLevel === "specialization" && (
            <div className="mb-4 p-3 border border-border rounded-lg bg-muted/20">
              <p className="text-sm font-medium text-foreground mb-2">Filtrar Especialização:</p>
              <Select value={selectedSpecializationFilter} onValueChange={setSelectedSpecializationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as Especializações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Especializações</SelectItem>
                  {allAvailableSpecializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {comparisonLevel === "competency" && (
            <div className="mb-4 p-3 border border-border rounded-lg bg-muted/20">
              <p className="text-sm font-medium text-foreground mb-2">Competências Personalizadas:</p>
              <Popover open={isCompetencySelectOpen} onOpenChange={setIsCompetencySelectOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {customSelectedCompetencies.length > 0 ? customSelectedCompetencies.join(", ") : "Selecione competências..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar competência..." />
                    <CommandList>
                      <CommandEmpty>Nenhuma competência encontrada.</CommandEmpty>
                      <CommandGroup>
                        {allAvailableCompetencies.map(comp => (
                          <CommandItem
                            key={comp}
                            onSelect={() => {
                              setCustomSelectedCompetencies(prev => 
                                prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp]
                              );
                            }}
                          >
                            <Checkbox
                              checked={customSelectedCompetencies.includes(comp)}
                              onCheckedChange={() => {
                                setCustomSelectedCompetencies(prev => 
                                  prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp]
                                );
                              }}
                              className="mr-2"
                            />
                            {comp}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}
        
          <ResponsiveContainer width="100%" height={450}>
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
        </Card>

        {/* Interpretação Textual */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <h3 className="text-lg font-bold text-foreground mb-4">Análise Comparativa</h3>
          
          <div className="space-y-4">
            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="text-sm font-semibold text-foreground mb-1">Visão Geral:</p>
              <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: getComparisonAnalysis() }} />
            </div>

            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="text-sm font-semibold text-foreground mb-1">Filtros Ativos:</p>
              <p className="text-sm text-muted-foreground">
                Nível: <Badge variant="secondary">{comparisonLevel === 'category' ? 'Por Categoria' : comparisonLevel === 'specialization' ? 'Por Especialização' : 'Competências Personalizadas'}</Badge>
                {selectedCategoryFilter !== 'all' && <Badge variant="secondary" className="ml-2">Categoria: {selectedCategoryFilter}</Badge>}
                {selectedSpecializationFilter !== 'all' && <Badge variant="secondary" className="ml-2">Especialização: {selectedSpecializationFilter}</Badge>}
                {customSelectedCompetencies.length > 0 && <Badge variant="secondary" className="ml-2">Competências: {customSelectedCompetencies.join(', ')}</Badge>}
              </p>
            </div>

            <div className="mt-4 p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Dica:</strong> Use os filtros para refinar a comparação e obter insights mais específicos.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}