import { useState } from "react";
import { ArrowLeft, User, Mail, Briefcase, Target, Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, useNavigate } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";

const teamMembers = [
  { 
    id: "1", 
    name: "Ana Silva", 
    role: "Estagiário", 
    email: "ana.silva@orbitta.com", 
    initials: "AS", 
    areas: ["React", "TypeScript"],
    technicalSkills: [
      { category: "BIG DATA/IA", skills: ["Python", "TensorFlow", "Pandas"], level: "M2" },
      { category: "Desenvolvimento Web", skills: ["React", "TypeScript", "CSS"], level: "M3" }
    ]
  },
  { 
    id: "2", 
    name: "Pedro Santos", 
    role: "Especialista I", 
    email: "pedro.santos@orbitta.com", 
    initials: "PS", 
    areas: ["Node.js", "Python"],
    technicalSkills: [
      { category: "Backend", skills: ["Node.js", "PostgreSQL", "API REST"], level: "M4" },
      { category: "Cloud Computing", skills: ["AWS", "Docker", "Kubernetes"], level: "M3" }
    ]
  },
  { 
    id: "3", 
    name: "Mariana Costa", 
    role: "Senior", 
    email: "mariana.costa@orbitta.com", 
    initials: "MC", 
    areas: ["UI/UX", "Design"],
    technicalSkills: [
      { category: "Design", skills: ["Figma", "Adobe XD", "Photoshop"], level: "M4" },
      { category: "Frontend", skills: ["HTML", "CSS", "JavaScript"], level: "M4" }
    ]
  },
  { 
    id: "4", 
    name: "Roberto Lima", 
    role: "Pleno", 
    email: "roberto.lima@orbitta.com", 
    initials: "RL", 
    areas: ["Backend", "DevOps"],
    technicalSkills: [
      { category: "DevOps", skills: ["Jenkins", "GitLab CI", "Terraform"], level: "M3" },
      { category: "Monitoramento", skills: ["Prometheus", "Grafana", "ELK"], level: "M3" }
    ]
  },
];

export default function MemberDetail() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  const member = teamMembers.find(m => m.id === memberId);

  if (!member) {
    return <div className="p-8">Membro não encontrado</div>;
  }

  const radarData = [
    { competency: "Comunicação", atual: 4, ideal: 5 },
    { competency: "Trabalho em Equipe", atual: 5, ideal: 5 },
    { competency: "Aprendizado", atual: 3, ideal: 5 },
    { competency: "Iniciativa", atual: 4, ideal: 4 },
    { competency: "Adaptabilidade", atual: 4, ideal: 5 },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-8">
      <Button 
        variant="ghost" 
        className="mb-6 gap-2 hover:bg-muted/50"
        onClick={() => navigate("/team")}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Liderados
      </Button>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {member.name}
          </h1>
          <div className="flex items-center justify-center gap-3 text-muted-foreground mb-2">
            <Briefcase className="w-5 h-5" />
            <span className="text-lg">{member.role}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{member.email}</span>
          </div>
        </div>

        <Card className="p-8 mb-6 backdrop-blur-sm bg-card/50 border-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Radar Chart */}
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Mapa de Competências
              </h2>
              
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--muted-foreground) / 0.2)" />
                  <PolarAngleAxis 
                    dataKey="competency" 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Radar
                    name="Avaliação Atual"
                    dataKey="atual"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Meta Ideal"
                    dataKey="ideal"
                    stroke="hsl(var(--muted-foreground))"
                    fill="transparent"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    fillOpacity={0}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Right Side - Competency Details */}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Análise de Competências
              </h2>
              
              <div className="space-y-4 flex-1">
                {radarData.map((item) => (
                  <div key={item.competency} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className={`mt-0.5 ${item.atual >= item.ideal ? 'text-primary' : 'text-muted-foreground'}`}>
                      ✓
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1">{item.competency}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{item.atual} / 5</span>
                        <span className="text-xs">vs. meta {item.ideal}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">Áreas de Atuação</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {member.areas.map((area) => (
                    <Badge key={area} variant="secondary" className="text-sm px-3 py-1">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Competências Técnicas */}
        <Card className="p-8 backdrop-blur-sm bg-card/50 border-2">
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Competências Técnicas
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {member.technicalSkills?.map((skillGroup) => (
              <div key={skillGroup.category} className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{skillGroup.category}</h3>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {skillGroup.level}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {skillGroup.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
