import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { LogOut, Target, BookOpen, TrendingUp } from "lucide-react";

export default function DashboardLiderado() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Mock de competências comportamentais - Escala 1-4 (CRÍTICO)
  const competenciasComportamentais = [
    { nome: "Comunicação", peso: 2, nivel: 2 },
    { nome: "Trabalho em Equipe", peso: 3, nivel: 3 },
    { nome: "Capacidade de Aprendizado", peso: 3, nivel: 3 },
    { nome: "Iniciativa", peso: 1, nivel: 1 },
    { nome: "Adaptabilidade", peso: 2, nivel: 2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090F24] to-[#000303]">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Meu Desenvolvimento</h1>
            <p className="text-sm text-gray-400">Bem-vindo(a), {profile?.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
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
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-[#E09F7D]" />
                Minha Maturidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">M2</p>
              <p className="text-sm text-gray-400">Aprendiz</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5 text-[#E09F7D]" />
                Competências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">5</p>
              <p className="text-sm text-gray-400">em avaliação</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5 text-[#E09F7D]" />
              Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">68%</p>
              <p className="text-sm text-gray-400">da meta ideal</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Competências Comportamentais - UC-09 */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Competências Comportamentais</CardTitle>
              <CardDescription className="text-gray-400">
                Avalie as habilidades comportamentais de {profile?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {competenciasComportamentais.map((comp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-white font-medium">{comp.nome}</Label>
                    <span className="text-sm text-gray-400">
                      Peso: {comp.nivel} | <span className="text-[#E09F7D]">3/5</span>
                    </span>
                  </div>
                  <Slider
                    defaultValue={[comp.nivel]}
                    min={1}
                    max={4}
                    step={1}
                    disabled
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Escala: 1 (Iniciante) a 4 (Expert)
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Gráfico VERSUS - Atual vs Ideal */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Competências - Atual vs Ideal</CardTitle>
              <CardDescription className="text-gray-400">
                Visualização comparativa do seu desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-96 relative">
                <img 
                  src="/liderado.svg" 
                  alt="Visualização Liderado" 
                  className="max-h-full opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/60 text-center text-lg px-4">
                    Gráfico VERSUS (Radar Chart)<br />
                    Comparação Atual × Meta Ideal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel de Desenvolvimento Pessoal */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Meu Plano de Desenvolvimento</CardTitle>
            <CardDescription className="text-gray-400">
              Objetivos e marcos do seu crescimento profissional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border-l-4 border-[#E09F7D]">
                <h4 className="text-white font-semibold mb-2">Objetivo Atual</h4>
                <p className="text-gray-300 text-sm">
                  Desenvolver habilidades de comunicação e trabalho em equipe
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">
                    M2 - Aprendiz
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                    Em Progresso
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Próximos Passos</h4>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>Participar de reuniões de equipe semanalmente</li>
                  <li>Completar curso de comunicação interpessoal</li>
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

// Label component simples
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
