import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { softSkillTemplates, technicalTemplate } from "@/data/evaluationTemplates";
import { MOCK_COMPETENCIAS } from "@/data/mockData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// removed unused `cn`
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { ComparisonFilters } from "@/components/ComparisonFilters"; // Importando o novo componente de filtros

const getInitials = (name: string) => name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "";
const MAX_COMPETENCIES = 16; // Limite para manter a legibilidade do gráfico

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

  const [mode, setMode] = useState<'all' | 'soft' | 'tech'>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const selectedMembers = useMemo(() => 
    teamData.filter(m => memberIds.slice(0, 4).includes(m.id_usuario)), 
    [teamData, memberIds]
  );

  useEffect(() => {
    // Quando o modo muda, reseta as categorias selecionadas
    setSelectedCategories([]);
  }, [mode]);

  const colors = ["hsl(var(--primary))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--destructive))"];

  const handleCategoryChange = (categoryId: string, isSelected: boolean) => {
    setSelectedCategories(prev => 
      isSelected ? [...prev, categoryId] : prev.filter(id => id !== categoryId)
    );
  };

  const comparisonData = useMemo(() => {
    if (selectedMembers.length === 0) return { chartData: [] };

    // 1. Determinar quais competências devem ser exibidas com base nos filtros
    let relevantCompetencyNames = new Set<string>();

    const allSoftSkills = new Set<string>();
    softSkillTemplates.forEach(template => {
      template.competencias.forEach(comp => {
        const details = MOCK_COMPETENCIAS.find(c => c.id_competencia === comp.id_competencia);
        if (details) allSoftSkills.add(details.nome_competencia);
      });
    });

    if (mode === 'soft' || mode === 'all') {
      allSoftSkills.forEach(name => relevantCompetencyNames.add(name));
    }

    if (mode === 'tech' || mode === 'all') {
      const categoriesToScan = mode === 'all' 
        ? technicalTemplate 
        : technicalTemplate.filter(c => selectedCategories.includes(c.id_categoria));
      
      categoriesToScan.forEach(category => {
        category.especializacoes.forEach(spec => {
          spec.competencias.forEach(comp => relevantCompetencyNames.add(comp.nome_competencia));
        });
      });
    }

    // 2. Filtrar competências para incluir apenas aquelas que foram avaliadas por pelo menos um membro
    const evaluatedCompetencyNames = Array.from(relevantCompetencyNames).filter(compName =>
      selectedMembers.some(member =>
        member.competencias.some(c => c.nome_competencia === compName && c.pontuacao_1a4 > 0)
      )
    ).slice(0, MAX_COMPETENCIES); // Limita o número de competências

    // 3. Construir a estrutura de dados para o Recharts
    const chartData = evaluatedCompetencyNames.map(compName => {
      const dataPoint: { [key: string]: any } = {
        subject: compName,
        ideal: 4.0,
      };
      selectedMembers.forEach(member => {
        const memberCompetency = member.competencias.find(c => c.nome_competencia === compName);
        dataPoint[member.id_usuario] = memberCompetency ? parseFloat(memberCompetency.pontuacao_1a4.toFixed(1)) : 0;
      });
      return dataPoint;
    });

    return { chartData };
  }, [selectedMembers, mode, selectedCategories]);

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
        <h1 className="text-3xl font-bold text-foreground mb-2">Comparação de Perfil Atual vs Ideal</h1>
        <p className="text-muted-foreground">{selectedMembers.length} colaborador(es) em análise</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel de Controle (Esquerda) */}
        <div className="lg:col-span-1 space-y-6">
          <ComparisonFilters
            mode={mode}
            onModeChange={setMode}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <Card>
            <CardHeader>
              <CardTitle>Legenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedMembers.map((member, index) => (
                <div key={member.id_usuario} className="flex items-center gap-3 p-2 rounded-lg" style={{ borderLeft: `4px solid ${colors[index % colors.length]}` }}>
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
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Painel de Visualização (Direita) */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Gráfico de Comparação de Competências</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {comparisonData.chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                  <p>Nenhum dado de avaliação encontrado para os filtros e membros selecionados.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={comparisonData.chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 4]} tickCount={5} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '40px' }} />
                    
                    <Radar name="Perfil Ideal" dataKey="ideal" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.1} />
                    
                    {selectedMembers.map((member, index) => (
                      <Radar
                        key={member.id_usuario}
                        name={member.nome}
                        dataKey={member.id_usuario}
                        stroke={colors[index % colors.length]}
                        fill={colors[index % colors.length]}
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