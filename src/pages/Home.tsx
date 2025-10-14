import { Users as UsersIcon, TrendingUp, Award, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import CompetencyMatrixChart from "@/components/CompetencyMatrixChart";

// Simula dados - em produção viria do backend
const hasEvaluations = true; // Mude para false para ver estado vazio
const teamMembers = [
  { id: "1", name: "Ana Silva", role: "Desenvolvedora Junior", level: "M2", initials: "AS", quadrantX: 2.5, quadrantY: 2.7 },
  { id: "2", name: "Carlos Santos", role: "Designer Sênior", level: "M3", initials: "CS", quadrantX: 3.4, quadrantY: 3.8 },
  { id: "3", name: "Mariana Costa", role: "Product Manager", level: "M4", initials: "MC", quadrantX: 4.0, quadrantY: 4.0 },
  { id: "4", name: "Roberto Lima", role: "Desenvolvedor Pleno", level: "M3", initials: "RL", quadrantX: 3.2, quadrantY: 3.0 },
];

// Dados mockados de gaps de competências técnicas (média de score da equipe por competência)
const skillGaps = [
  { competencia: "Desenvolvimento de API", mediaScore: 2.1 },
  { competencia: "SQL", mediaScore: 2.5 },
  { competencia: "Testes Automatizados", mediaScore: 2.7 },
  { competencia: "Docker & Kubernetes", mediaScore: 3.0 },
  { competencia: "Python", mediaScore: 3.2 },
];

const leaderProfile = {
  name: "Marina Rodriguez",
  role: "Tech Lead",
  initials: "MR",
  email: "marina.rodriguez@orbitta.com",
  team: "Engenharia de Software"
};

const StatCard = ({ icon: Icon, title, value, trend }: any) => (
  <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-2">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {trend && (
          <p className="text-sm text-accent mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {trend}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  </Card>
);

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard da Equipe</h1>
          <p className="text-muted-foreground">Visão geral do desempenho e métricas da sua equipe</p>
        </div>

        {/* Perfil do Líder */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">{leaderProfile.initials}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{leaderProfile.name}</h2>
              <p className="text-muted-foreground">{leaderProfile.role} • {leaderProfile.team}</p>
              <p className="text-sm text-muted-foreground">{leaderProfile.email}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={UsersIcon} title="Total de Membros" value="4" />
          <StatCard icon={Award} title="Avaliações Completas" value="12" trend="+3 este mês" />
          <StatCard icon={BarChart3} title="Maturidade Média" value="M2.8" trend="+0.3 vs anterior" />
        </div>

        {/* Gráfico de Quadrante */}
        {hasEvaluations ? (
          <CompetencyMatrixChart teamMembers={teamMembers} />
        ) : (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Maturidade da Equipe (Gráfico de Quadrante)</h3>
            <p className="text-sm text-muted-foreground mb-6">Distribuição estratégica dos membros por competências comportamentais (Y) e técnicas (X)</p>
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Nenhuma avaliação realizada ainda</p>
              </div>
            </div>
          </Card>
        )}

        {/* Gaps de Competências Técnicas */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Gaps de Competências Técnicas</h3>
          <p className="text-sm text-muted-foreground mb-6">Competências com desempenho mais baixo na equipe (média de score)</p>
          {hasEvaluations ? (
            <div className="space-y-4">
              {skillGaps.map((item) => (
                <div key={item.competencia} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">{item.competencia}</span>
                    <span className="font-semibold text-foreground">{item.mediaScore.toFixed(1)}/4.0</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${(item.mediaScore / 4) * 100}%`,
                        backgroundColor: item.mediaScore < 2 ? 'hsl(var(--destructive))' : item.mediaScore < 3 ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-3))'
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Award className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Nenhuma avaliação realizada ainda</p>
              </div>
            </div>
          )}
        </Card>

        {/* Acesso Rápido aos Membros */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Acesso Rápido aos Membros</h3>
            <span className="text-sm text-muted-foreground">{teamMembers.length} membros</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                onClick={() => navigate(`/team/${member.id}`)}
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{member.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{member.role}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded">
                    {member.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
  );
}
