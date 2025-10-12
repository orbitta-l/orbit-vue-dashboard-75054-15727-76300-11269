import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Users, Target, TrendingUp } from "lucide-react";

export default function DashboardLider() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090F24] to-[#000303]">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard do Líder</h1>
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
          {/* Card de Estatísticas */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-[#E09F7D]" />
                Total de Membros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-sm text-gray-400">membros ativos</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-[#E09F7D]" />
                Avaliações Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">3</p>
              <p className="text-sm text-gray-400">aguardando revisão</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5 text-[#E09F7D]" />
                Maturidade Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">M2.5</p>
              <p className="text-sm text-gray-400">em evolução</p>
            </CardContent>
          </Card>
        </div>

        {/* Painel de Maturidade (UC-04) */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Painel de Maturidade da Equipe</CardTitle>
            <CardDescription className="text-gray-400">
              Distribuição de maturidade (M1-M4) em gráfico de quadrante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-96 relative">
              <img 
                src="/lider.svg" 
                alt="Visualização Líder" 
                className="max-h-full opacity-30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/60 text-lg">
                  Gráfico de Quadrante de Maturidade (Mock)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Consolidados da Equipe */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Visão Geral da Equipe</CardTitle>
            <CardDescription className="text-gray-400">
              Competências e desenvolvimento dos colaboradores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock de dados da equipe */}
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-semibold">Beatriz Santos</p>
                  <p className="text-sm text-gray-400">Estagiário</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">M2</p>
                  <p className="text-sm text-gray-400">Aprendiz</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-semibold">Carlos Silva</p>
                  <p className="text-sm text-gray-400">Desenvolvedor Jr</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">M3</p>
                  <p className="text-sm text-gray-400">Competente</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
