import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";

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
    { competency: "Aprendizado", score: 3 },
    { competency: "Iniciativa", score: 3 },
    { competency: "Adaptabilidade", score: 4 },
  ],
  "2": [
    { competency: "Comunicação", score: 5 },
    { competency: "Trabalho em Equipe", score: 5 },
    { competency: "Aprendizado", score: 4 },
    { competency: "Iniciativa", score: 4 },
    { competency: "Adaptabilidade", score: 5 },
  ],
  "3": [
    { competency: "Comunicação", score: 5 },
    { competency: "Trabalho em Equipe", score: 5 },
    { competency: "Aprendizado", score: 5 },
    { competency: "Iniciativa", score: 4 },
    { competency: "Adaptabilidade", score: 5 },
  ],
  "4": [
    { competency: "Comunicação", score: 4 },
    { competency: "Trabalho em Equipe", score: 4 },
    { competency: "Aprendizado", score: 4 },
    { competency: "Iniciativa", score: 4 },
    { competency: "Adaptabilidade", score: 4 },
  ],
};

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberIds = searchParams.get("members")?.split(",") || [];
  
  const selectedMembers = memberIds
    .map(id => teamMembers.find(m => m.id === id))
    .filter(Boolean);

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
                    <span className="text-sm font-semibold text-foreground">{comp.score}/5</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${(comp.score / 5) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-card to-card/50">
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
          Comparação Visual - Competências
        </h2>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Análise comparativa de desempenho entre liderados selecionados
        </p>
        
        <ResponsiveContainer width="100%" height={550}>
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
              domain={[0, 5]} 
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
    </div>
  );
}
