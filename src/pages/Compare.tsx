import { ArrowLeft, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { softSkillTemplates, technicalTemplate } from "@/data/evaluationTemplates";
import { MOCK_COMPETENCIAS } from "@/data/mockData";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const getInitials = (name: string) => name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-card border rounded-lg shadow-lg text-sm">
        <p className="font-bold text-foreground mb-2">{label}</p>
        <ul className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <li key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-semibold text-foreground">{entry.value.toFixed(1)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberIds = searchParams.get("members")?.split(",") || [];
  const { teamData } = useAuth();

  const [baseMemberId, setBaseMemberId] = useState<string | null>(null);
  const [comparedMemberIds, setComparedMemberIds] = useState<string[]>([]);
  
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");

  const selectedMembers = useMemo(() => 
    teamData.filter(m => memberIds.slice(0, 4).includes(m.id_usuario)), 
    [teamData, memberIds]
  );

  useEffect(() => {
    if (selectedMembers.length > 0 && !baseMemberId) {
      setBaseMemberId(selectedMembers[0].id_usuario);
    }
  }, [selectedMembers, baseMemberId]);

  const colors = ["hsl(var(--primary))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--destructive))"];

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

  const specializationsForSelectedTheme = useMemo(() => {
    if (selectedTheme === 'soft-skills' || !selectedTheme) return [];
    const category = technicalTemplate.find(c => c.id_categoria === selectedTheme);
    return category ? category.especializacoes.map(s => ({ id: s.id_especializacao, name: s.nome_especializacao })) : [];
  }, [selectedTheme]);

  useEffect(() => {
    setSelectedSpecialization("all");
  }, [selectedTheme]);

  const handleToggleComparedMember = (memberId: string) => {
    setComparedMemberIds(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      }
      if (prev.length >= 2) {
        toast({
          title: "Limite de Comparação Atingido",
          description: "Você pode comparar com até 2 outros membros por vez.",
          variant: "destructive"
        });
        return prev;
      }
      return [...prev, memberId];
    });
  };

  const comparisonData = useMemo(() => {
    if (!baseMemberId || !selectedTheme) return { chartData: [], baseMember: null, comparedMembers: [] };

    const baseMember = selectedMembers.find(m => m.id_usuario === baseMemberId);
    const comparedMembers = selectedMembers.filter(m => comparedMemberIds.includes(m.id_usuario));
    const allMembersInChart = [baseMember, ...comparedMembers].filter(Boolean);

    let relevantCompetencies: { name: string }[] = [];
    if (selectedTheme === "soft-skills") {
      const allSoftSkills = new Set<string>();
      softSkillTemplates.forEach(template => {
        template.competencias.forEach(comp => {
          const competencyDetails = MOCK_COMPETENCIAS.find(c => c.id_competencia === comp.id_competencia);
          if (competencyDetails) allSoftSkills.add(competencyDetails.nome_competencia);
        });
      });
      relevantCompetencies = Array.from(allSoftSkills).map(name => ({ name }));
    } else {
      const category = technicalTemplate.find(c => c.id_categoria === selectedTheme);
      if (!category) return { chartData: [], baseMember: null, comparedMembers: [] };
      const specsToConsider = selectedSpecialization === 'all'
        ? category.especializacoes
        : category.especializacoes.filter(spec => spec.id_especializacao === selectedSpecialization);
      relevantCompetencies = specsToConsider.flatMap(spec => spec.competencias.map(comp => ({ name: comp.nome_competencia })));
    }

    const filteredCompetencyNames = relevantCompetencies
      .map(c => c.name)
      .filter(compName => allMembersInChart.some(member => 
        member!.competencias.some(c => c.nome_competencia === compName && c.pontuacao_1a4 > 0)
      ));

    const chartData = filteredCompetencyNames.map(compName => {
      const dataPoint: { [key: string]: any } = {
        subject: compName,
        ideal: 4.0,
      };
      allMembersInChart.forEach(member => {
        if (member) {
          const memberCompetency = member.competencias.find(c => c.nome_competencia === compName);
          dataPoint[member.id_usuario] = memberCompetency ? parseFloat(memberCompetency.pontuacao_1a4.toFixed(1)) : 0;
        }
      });
      return dataPoint;
    });

    return { chartData, baseMember, comparedMembers };
  }, [baseMemberId, comparedMemberIds, selectedMembers, selectedTheme, selectedSpecialization]);

  if (selectedMembers.length === 0) {
    return (
      <div className="p-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate("/team")}>
          <ArrowLeft className="w-4 h-4" /> Voltar para Liderados
        </Button>
        <p className="text-muted-foreground">Selecione membros na página de "Time" para iniciar a comparação.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate("/team")}>
        <ArrowLeft className="w-4 h-4" /> Voltar para Liderados
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard de Comparação</h1>
        <p className="text-muted-foreground">{selectedMembers.length} colaborador(es) em análise</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel de Controle (Esquerda) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros de Análise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-semibold text-foreground mb-2 block">1. Categoria de Análise</Label>
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma categoria..." /></SelectTrigger>
                  <SelectContent>{analysisThemes.map(theme => <SelectItem key={theme.id} value={theme.id}>{theme.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {specializationsForSelectedTheme.length > 0 && (
                <div>
                  <Label className="font-semibold text-foreground mb-2 block">2. Especialização (Opcional)</Label>
                  <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                    <SelectTrigger><SelectValue placeholder="Todas as especializações" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Especializações</SelectItem>
                      {specializationsForSelectedTheme.map(spec => <SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Painel de Comparação</CardTitle>
              <CardDescription>Selecione a base e com quem comparar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedMembers.map(member => (
                <div
                  key={member.id_usuario}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer",
                    baseMemberId === member.id_usuario
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setBaseMemberId(member.id_usuario)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-muted text-foreground font-semibold">
                          {getInitials(member.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.nome}</p>
                        <p className="text-xs text-muted-foreground">{member.cargo_nome}</p>
                      </div>
                    </div>
                    {baseMemberId !== member.id_usuario && (
                      <Checkbox
                        checked={comparedMemberIds.includes(member.id_usuario)}
                        onCheckedChange={() => handleToggleComparedMember(member.id_usuario)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Painel de Visualização (Direita) */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Gráfico de Comparação de Competências</CardTitle>
              <CardDescription>
                {comparisonData.baseMember ? `Analisando ${comparisonData.baseMember.nome}` : "Selecione um membro base"}
                {comparisonData.comparedMembers.length > 0 && ` vs ${comparisonData.comparedMembers.map(m => m.nome).join(', ')}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {!selectedTheme ? (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                  <p>Selecione uma categoria de análise para começar.</p>
                </div>
              ) : comparisonData.chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                  <p>Nenhum dado de avaliação encontrado para a seleção atual.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={comparisonData.chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 4]} tickCount={5} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '40px' }} />
                    
                    <Radar name="Perfil Ideal" dataKey="ideal" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.1} />
                    
                    {comparisonData.baseMember && (
                      <Radar
                        name={comparisonData.baseMember.nome}
                        dataKey={comparisonData.baseMember.id_usuario}
                        stroke={colors[0]}
                        fill={colors[0]}
                        fillOpacity={0.4}
                      />
                    )}
                    
                    {comparisonData.comparedMembers.map((member, index) => (
                      <Radar
                        key={member.id_usuario}
                        name={member.nome}
                        dataKey={member.id_usuario}
                        stroke={colors[index + 1]}
                        fill={colors[index + 1]}
                        fillOpacity={0.4}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}