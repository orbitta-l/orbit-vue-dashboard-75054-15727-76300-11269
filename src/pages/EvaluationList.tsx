import { ClipboardCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const teamMembers = [
  {
    id: 1,
    name: "Ana Silva",
    role: "Estagiário",
    areas: ["BIG DATA/IA", "Machine Learning"],
    initials: "AS",
  },
  {
    id: 2,
    name: "Pedro Santos",
    role: "Especialista I",
    areas: ["Desenvolvimento", "Frontend"],
    initials: "PS",
  },
  {
    id: 3,
    name: "Mariana Costa",
    role: "Senior",
    areas: ["Product Management", "UX Research"],
    initials: "MC",
  },
  {
    id: 4,
    name: "Roberto Lima",
    role: "Pleno",
    areas: ["Backend", "DevOps"],
    initials: "RL",
  },
];

export default function EvaluationList() {
  const navigate = useNavigate();

  const handleEvaluate = (memberId: number) => {
    navigate(`/evaluation/${memberId}`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Avaliação de Competências</h1>
        </div>
        <p className="text-muted-foreground">Selecione um membro da equipe para avaliar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-accent/20 text-accent-foreground text-lg font-semibold">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground mb-1">{member.name}</h3>
                <Badge variant="secondary" className="mb-2">
                  {member.role}
                </Badge>
              </div>
            </div>

            <div className="mb-4 p-4 bg-secondary/30 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Área de Atuação</p>
              <div className="space-y-1">
                {member.areas.map((area) => (
                  <p key={area} className="text-sm text-muted-foreground">{area}</p>
                ))}
              </div>
            </div>

            <Button 
              className="w-full gap-2"
              onClick={() => handleEvaluate(member.id)}
            >
              <ClipboardCheck className="w-4 h-4" />
              Avaliar Competências
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
