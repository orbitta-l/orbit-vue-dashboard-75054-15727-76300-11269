import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Target, BookOpen, TrendingUp } from "lucide-react";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend,
  ResponsiveContainer 
} from "recharts";

export default function DashboardLiderado() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Mock de competências para o Gráfico VERSUS - Escala 1-4
  const competenciasVersus = [
    { competencia: "Comunicação", atual: 2, ideal: 4 },
    { competencia: "Trabalho em Equipe", atual: 3, ideal: 4 },
    { competencia: "Aprendizado", atual: 2, ideal: 4 },
    { competencia: "Iniciativa", atual: 2, ideal: 3 },
    { competencia: "Adaptabilidade", atual: 2, ideal: 4 },
    { competencia: "React", atual: 3, ideal: 4 },
    { competencia: "TypeScript", atual: 2, ideal: 4 },
    { competencia: "API REST", atual: 3, ideal: 4 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meu Desenvolvimento</h1>
            <p className="text-sm text-muted-foreground">Bem-vindo(a), {profile?.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Cards de Estatísticas Pessoais */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Minha Maturidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">M2</p>
              <p className="text-sm text-muted-foreground">Aprendiz</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Competências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">8</p>
              <p className="text-sm text-muted-foreground">em avaliação</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
              Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">68%</p>
              <p className="text-sm text-muted-foreground">da meta ideal</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico VERSUS - Atual vs Ideal (Principal Funcionalidade) */}
        <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Gráfico de Gap de Conhecimento - VERSUS
            </CardTitle>
            <CardDescription>
              Comparação visual entre seu perfil atual e o perfil ideal do cargo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <RadarChart data={competenciasVersus}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="competencia" 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 4]} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Radar 
                  name="Perfil Ideal" 
                  dataKey="ideal" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Radar 
                  name="Meu Perfil Atual" 
                  dataKey="atual" 
                  stroke="hsl(var(--accent))" 
                  fill="hsl(var(--accent))" 
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Sobre este gráfico:</h4>
              <p className="text-sm text-muted-foreground">
                A área entre os dois polígonos representa os <strong>gaps de conhecimento</strong> que precisam ser desenvolvidos. 
                Quanto maior a diferença entre o perfil ideal (azul) e seu perfil atual (laranja), maior a oportunidade de crescimento naquela competência específica.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Painel de Desenvolvimento Pessoal */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Meu Plano de Desenvolvimento
            </CardTitle>
            <CardDescription>
              Objetivos e marcos do seu crescimento profissional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                <h4 className="font-semibold mb-2 text-foreground">Objetivo Atual</h4>
                <p className="text-muted-foreground text-sm">
                  Desenvolver habilidades de comunicação e trabalho em equipe, além de fortalecer competências técnicas em React e TypeScript
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-medium">
                    M2 - Aprendiz
                  </span>
                  <span className="px-2 py-1 bg-chart-3/40 text-foreground text-xs rounded font-medium">
                    Em Progresso
                  </span>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2 text-foreground">Próximos Passos</h4>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                  <li>Participar de reuniões de equipe semanalmente</li>
                  <li>Completar curso de comunicação interpessoal</li>
                  <li>Aprimorar conhecimentos em TypeScript (gap identificado)</li>
                  <li>Desenvolver iniciativa em projetos (gap crítico)</li>
                  <li>Solicitar feedback do líder mensalmente</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

