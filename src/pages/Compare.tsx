import { ArrowLeft, Filter, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const teamMembers = [
  { id: "1", name: "Ana Silva", role: "Estagiário", initials: "AS" },
  { id: "2", name: "Pedro Santos", role: "Especialista I", initials: "PS" },
  { id: "3", name: "Mariana Costa", role: "Senior", initials: "MC" },
  { id: "4", name: "Roberto Lima", role: "Pleno", initials: "RL" },
];

const memberScores: Record<string, any[]> = {
  "1": [
    { competency: "Comunicação", score: 3 },
    { competency: "Trabalho em Equipe", score: 4 },
    { competency: "Aprendizado", score: 2 },
    { competency: "Iniciativa", score: 2 },
    { competency: "Adaptabilidade", score: 3 },
  ],
  "2": [
    { competency: "Comunicação", score: 4 },
    { competency: "Trabalho em Equipe", score: 4 },
    { competency: "Aprendizado", score: 3 },
    { competency: "Iniciativa", score: 3 },
    { competency: "Adaptabilidade", score: 4 },
  ],
  "3": [
    { competency: "Comunicação", score: 4 },
    { competency: "Trabalho em Equipe", score: 4 },
    { competency: "Aprendizado", score: 4 },
    { competency: "Iniciativa", score: 4 },
    { competency: "Adaptabilidade", score: 4 },
  ],
  "4": [
    { competency: "Comunicação", score: 3 },
    { competency: "Trabalho em Equipe", score: 3 },
    { competency: "Aprendizado", score: 3 },
    { competency: "Iniciativa", score: 3 },
    { competency: "Adaptabilidade", score: 3 },
  ],
};

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberIds = searchParams.get("members")?.split(",") || [];
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSpecialization, setFilterSpecialization] = useState<string>("all");
  const [radarViewMode, setRadarViewMode] = useState<"all" | "soft" | "custom">("all");
  const [selectedHardSkills, setSelectedHardSkills] = useState<string[]>(["Comunicação", "Trabalho em Equipe"]);
  
  const selectedMembers = memberIds
    .map(id => teamMembers.find(m => m.id === id))
    .filter(Boolean);

  const allCompetencies = ["Comunicação", "Trabalho em Equipe", "Aprendizado", "Iniciativa", "Adaptabilidade"];
  const allCategories = ["Técnicas", "Comportamentais"];
  const allSpecializations = ["Backend", "Frontend", "DevOps", "Mobile"];

  const toggleHardSkill = (skill: string) => {
    setSelectedHardSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

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

  const radarData = memberScores[selectedMembers[0]!.id].map((item, index) => {
    const dataPoint: any = { competency: item.competency };
    selectedMembers.forEach((member) => {
      dataPoint[member!.name] = memberScores[member!.id][index].score;
    });
    return dataPoint;
  });

  const colors = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

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
          <Card key={member!.id} className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{member!.initials}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{member!.name}</h3>
                <Badge variant="secondary">{member!.role}</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              {memberScores[member!.id].map((comp) => (
                <div key={comp.competency}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{comp.competency}</span>
                    <span className="text-sm font-semibold text-foreground">{comp.score}/4</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${(comp.score / 4) * 100}%` }} 
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
            <Select value={radarViewMode} onValueChange={(v: any) => setRadarViewMode(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="soft">Soft Skills</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {radarViewMode === "custom" && (
            <div className="mb-4 p-3 border border-border rounded-lg bg-muted/20">
              <p className="text-sm font-medium text-foreground mb-2">Competências:</p>
              <div className="flex flex-wrap gap-2">
                {allCompetencies.map((comp) => (
                  <div key={comp} className="flex items-center gap-2">
                    <Checkbox 
                      checked={selectedHardSkills.includes(comp)}
                      onCheckedChange={() => toggleHardSkill(comp)}
                    />
                    <label className="text-sm text-muted-foreground cursor-pointer">
                      {comp}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        
          <ResponsiveContainer width="100%" height={450}>
          <RadarChart data={radarData}>
            <PolarGrid 
              stroke="hsl(var(--muted-foreground) / 0.3)" 
              strokeWidth={1}
            />
            <PolarAngleAxis 
              dataKey="competency" 
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
                key={member!.id}
                name={member!.name}
                dataKey={member!.name}
                stroke={colors[index]}
                fill={colors[index]}
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
              <p className="text-sm font-semibold text-foreground mb-1">Melhor Desempenho Geral:</p>
              <p className="text-sm text-muted-foreground">
                <strong className="text-primary">{selectedMembers[0]?.name}</strong> apresenta o melhor desempenho geral com média de <strong>3.6/4</strong> nas competências avaliadas.
              </p>
            </div>

            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="text-sm font-semibold text-foreground mb-1">Diferencial Principal:</p>
              <p className="text-sm text-muted-foreground">
                {selectedMembers[0]?.name} se destaca em <strong>Trabalho em Equipe</strong> (4/4) e <strong>Aprendizado</strong> (4/4), enquanto {selectedMembers[1]?.name} apresenta pontos fortes em <strong>Comunicação</strong> (4/4).
              </p>
            </div>

            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="text-sm font-semibold text-foreground mb-1">Recomendação:</p>
              <p className="text-sm text-muted-foreground">
                Para projetos que exigem alta capacidade de aprendizado rápido e colaboração, <strong className="text-primary">{selectedMembers[0]?.name}</strong> é a escolha mais adequada.
              </p>
            </div>

            <div className="mt-4 p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Dica:</strong> Use os filtros abaixo para comparar por categorias ou especializações específicas.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros de Comparação */}
      <Card className="p-6 mb-8 bg-card">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filtros de Comparação</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Filtrar por Categoria</label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Filtrar por Especialização</label>
            <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma especialização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Especializações</SelectItem>
                {allSpecializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
}
