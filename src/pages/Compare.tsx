import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { softSkillTemplates, technicalTemplate } from "@/data/evaluationTemplates";
import { MOCK_COMPETENCIAS } from "@/data/mockData";
import { Label } from "@/components/ui/label";
import { ComparisonMemberCard } from "@/components/ComparisonMemberCard"; // Importando o novo componente

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberIds = searchParams.get("members")?.split(",") || [];
  const { teamData } = useAuth();

  const [selectedMembersForComparison] = useState<string[]>(memberIds.slice(0, 4));
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");

  const selectedMembers = useMemo(() => 
    teamData.filter(m => selectedMembersForComparison.includes(m.id_usuario)), 
    [teamData, selectedMembersForComparison]
  );

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

  const comparisonData = useMemo(() => {
    if (selectedMembers.length < 1 || !selectedTheme) return { relevantCompetencyNames: [], memberData: {} };

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
      if (!category) return { relevantCompetencyNames: [], memberData: {} };
      const specsToConsider = selectedSpecialization === 'all'
        ? category.especializacoes
        : category.especializacoes.filter(spec => spec.id_especializacao === selectedSpecialization);
      relevantCompetencies = specsToConsider.flatMap(spec => spec.competencias.map(comp => ({ name: comp.nome_competencia })));
    }

    const filteredCompetencyNames = relevantCompetencies
      .map(c => c.name)
      .filter(compName => selectedMembers.some(member => 
        member.competencias.some(c => c.nome_competencia === compName && c.pontuacao_1a4 > 0)
      ));

    const memberData: Record<string, { subject: string; atual: number; ideal: number }[]> = {};
    selectedMembers.forEach(member => {
      memberData[member.id_usuario] = filteredCompetencyNames.map(compName => {
        const memberCompetency = member.competencias.find(c => c.nome_competencia === compName);
        return {
          subject: compName,
          atual: memberCompetency ? parseFloat(memberCompetency.pontuacao_1a4.toFixed(1)) : 0,
          ideal: 4.0,
        };
      });
    });

    return { relevantCompetencyNames: filteredCompetencyNames, memberData };
  }, [selectedMembers, selectedTheme, selectedSpecialization]);

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

  return (
    <div className="p-8">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate("/team")}>
        <ArrowLeft className="w-4 h-4" /> Voltar para Liderados
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard de Comparação</h1>
        <p className="text-muted-foreground">{selectedMembers.length} colaborador(es) em análise</p>
      </div>

      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="font-semibold text-foreground mb-2 block">1. Selecione a Categoria de Análise</Label>
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger><SelectValue placeholder="Selecione uma categoria..." /></SelectTrigger>
              <SelectContent>{analysisThemes.map(theme => <SelectItem key={theme.id} value={theme.id}>{theme.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {specializationsForSelectedTheme.length > 0 && (
            <div>
              <Label className="font-semibold text-foreground mb-2 block">2. Filtre por Especialização (Opcional)</Label>
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger><SelectValue placeholder="Todas as especializações" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Especializações</SelectItem>
                  {specializationsForSelectedTheme.map(spec => <SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </Card>

      {!selectedTheme ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Selecione uma categoria de análise para comparar o desempenho da equipe.</p>
        </div>
      ) : comparisonData.relevantCompetencyNames.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Nenhum dado de avaliação encontrado para os membros selecionados nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedMembers.map((member, index) => (
            <ComparisonMemberCard
              key={member.id_usuario}
              member={member}
              radarData={comparisonData.memberData[member.id_usuario] || []}
              color={colors[index % colors.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
}