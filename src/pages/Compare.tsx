import { ArrowLeft, Filter, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, Liderado } from "@/contexts/AuthContext";
import { CompetenciaTipo } from "@/types/mer";
import { Command, CommandEmpty, CommandGroup, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CommandInputWithClear } from "@/components/CommandInputWithClear"; // Importa o novo componente

type ComparisonLevel = "category" | "specialization" | "competency";

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberIds = searchParams.get("members")?.split(",") || [];
  const { liderados } = useAuth();

  const [comparisonLevel, setComparisonLevel] = useState<ComparisonLevel>("specialization");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [selectedSpecializationFilter, setSelectedSpecializationFilter] = useState<string>("all");
  const [customSelectedCompetencies, setCustomSelectedCompetencies] = useState<string[]>([]);
  const [isCompetencySelectOpen, setIsCompetencySelectOpen] = useState(false);
  const [customCompetencySearch, setCustomCompetencySearch] = useState(""); // Novo estado para o termo de busca

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

        // Lógica de filtragem e agrupamento
        if (comparisonLevel === "category") {
          if (selectedCategoryFilter === "all") {
            if (comp.tipo === 'TECNICA' && comp.nome_categoria) {
              subjectKey = comp.nome_categoria;
            } else if (comp.tipo === 'COMPORTAMENTAL') {
              subjectKey = 'Soft Skills';
            }
          } else if (comp.nome_categoria === selectedCategoryFilter) {
            subjectKey = comp.nome_especializacao || comp.nome_competencia;
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

    const finalData = Array.from(subjects).map(subject => {
      const item: any = { subject };
      selectedMembers.forEach(member => {
        const totalScore = data[subject]?.[member.nome_liderado] || 0;
        const count = data[subject]?.[`${member.nome_liderado}_count`] || 0;
        item[member.nome_liderado] = count > 0 ? parseFloat((totalScore / count).toFixed(1)) : 0;
      });
      item.PerfilIdeal = 4.0; // Adiciona o Perfil Ideal como referência
      item.fullMark = 4;
      return item;
    });

    return finalData;
  };

  const radarData = getRadarChartData();

  // Cores: Azul Primário, Laranja, Cinza, Roxo
  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

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
            
            {comparisonLevel === "category" && (
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                  {allAvailableCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {comparisonLevel === "specialization" && (
              <Select value={selectedSpecializationFilter} onValueChange={setSelectedSpecializationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar Especialização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Especializações</SelectItem>
                  {allAvailableSpecializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {comparisonLevel === "competency" && (
              <Popover open={isCompetencySelectOpen} onOpenChange={setIsCompetencySelectOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {customSelectedCompetencies.length > 0 ? `${customSelectedCompetencies.length} selecionadas` : "Selecione competências..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInputWithClear // Usando o novo componente
                      placeholder="Buscar competência..."
                      value={customCompetencySearch}
                      onValueChange={setCustomCompetencySearch}
                    />
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
            )}
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
              fillOpacity={0.1}
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