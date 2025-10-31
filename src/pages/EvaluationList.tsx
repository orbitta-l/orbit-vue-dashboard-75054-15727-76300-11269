import { useState } from "react";
import { ClipboardCheck, Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function EvaluationList() {
  const navigate = useNavigate();
  const { liderados } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredLiderados = liderados.filter((member) =>
    member.nome_liderado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Avaliação de Competências</h1>
        </div>
        <p className="text-muted-foreground">Selecione um membro da equipe para avaliar ou busque pelo nome.</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar liderado pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-sm"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent"
              onClick={() => setSearchTerm("")}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>

      {filteredLiderados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLiderados.map((member) => (
            <Card key={member.id_liderado} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-accent/20 text-accent-foreground text-lg font-semibold">
                    {getInitials(member.nome_liderado)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-foreground mb-1">{member.nome_liderado}</h3>
                  <Badge variant="secondary" className="mb-2 capitalize">
                    {member.cargo || "Não definido"}
                  </Badge>
                </div>
              </div>

              <div className="mb-4 p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Área de Atuação Dominante</p>
                <div className="space-y-1">
                  {member.categoria_dominante && member.categoria_dominante !== "Não Avaliado" ? (
                    <>
                      <p className="text-sm text-muted-foreground"><strong>Categoria:</strong> {member.categoria_dominante}</p>
                      <p className="text-sm text-muted-foreground"><strong>Especialização:</strong> {member.especializacao_dominante}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aguardando primeira avaliação.</p>
                  )}
                </div>
              </div>

              <Button 
                className="w-full gap-2"
                onClick={() => handleEvaluate(member.id_liderado)}
              >
                <ClipboardCheck className="w-4 h-4" />
                Avaliar Competências
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-muted/20">
          <p className="text-muted-foreground">
            {liderados.length === 0 
              ? "Nenhum liderado cadastrado. Adicione um na tela de Liderados." 
              : "Nenhum liderado encontrado com o termo buscado."}
          </p>
        </Card>
      )}
    </div>
  );
}