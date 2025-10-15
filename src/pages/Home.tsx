import { Users as UsersIcon, TrendingUp, Award, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import CompetencyMatrixChart from "@/components/CompetencyMatrixChart";
import { MOCK_LIDER, MOCK_PERFORMANCE, calcularGapsEquipe } from "@/data/mockData";
import { getGapColor, getGapColorClass } from "@/utils/colorUtils";

// Simula dados - em produção viria do backend
const hasEvaluations = true; // Mude para false para ver estado vazio

const teamMembers = MOCK_PERFORMANCE.map(p => ({
  id: p.id_liderado,
  name: p.nome_liderado,
  role: p.cargo,
  level: p.nivel_maturidade,
  initials: p.nome_liderado.split(' ').map(n => n[0]).join(''),
  quadrantX: p.quadrantX,
  quadrantY: p.quadrantY,
}));

// Gaps de competências técnicas da equipe (ordenado por menor score)
const skillGaps = calcularGapsEquipe().slice(0, 8);

const leaderProfile = {
  name: MOCK_LIDER.nome,
  role: "Tech Lead",
  initials: MOCK_LIDER.nome.split(' ').map(n => n[0]).join(''),
  email: MOCK_LIDER.email,
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
          <p className="text-sm text-muted-foreground mb-6">
            Competências com desempenho mais baixo na equipe (média de score). 
            <span className="block mt-1">
              <span className="font-semibold text-red-600 dark:text-red-400">Vermelho intenso</span> = gap crítico | 
              <span className="font-semibold text-blue-600 dark:text-blue-400"> Azul</span> = desempenho adequado
            </span>
          </p>
          {hasEvaluations ? (
            <div className="space-y-4">
              {skillGaps.map((item) => (
                <div key={item.nome_competencia} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <span className={`font-medium ${getGapColorClass(item.media_score)}`}>
                        {item.nome_competencia}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({item.nome_categoria}{item.nome_especializacao ? ` › ${item.nome_especializacao}` : ''})
                      </span>
                    </div>
                    <span className={`font-semibold ${getGapColorClass(item.media_score)}`}>
                      {item.media_score.toFixed(1)}/4.0
                    </span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${(item.media_score / 4) * 100}%`,
                        backgroundColor: getGapColor(item.media_score)
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
