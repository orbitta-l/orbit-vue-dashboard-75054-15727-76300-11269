import { ClipboardCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function EvaluationList() {
  const navigate = useNavigate();
  const { liderados } = useAuth();

  const handleEvaluate = (memberId: string) => {
    navigate(`/evaluation/${memberId}`);
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
        {liderados.map((member) => (
          <Card key={member.id} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-accent/20 text-accent-foreground text-lg font-semibold">
                  {getInitials(member.nome)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground mb-1">{member.nome}</h3>
                <Badge variant="secondary" className="mb-2 capitalize">
                  {member.cargo_id || "Não definido"}
                </Badge>
              </div>
            </div>

            <div className="mb-4 p-4 bg-secondary/30 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Área de Atuação</p>
              <div className="space-y-1">
                {member.areas && member.areas.length > 0 ? (
                  member.areas.map((area) => (
                    <p key={area} className="text-sm text-muted-foreground">{area}</p>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma área definida</p>
                )}
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