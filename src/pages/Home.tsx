import { Users as UsersIcon, Award, BarChart3, ClipboardList, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CompetencyQuadrantChart from "@/components/CompetencyQuadrantChart";
import DistributionPieChart from "@/components/DistributionPieChart";
import KnowledgeGapsSection from "@/components/KnowledgeGapsSection";
import RecentEvaluationsSection from "@/components/RecentEvaluationsSection";
import { MOCK_LIDER, MOCK_LIDER_NOVO } from "@/data/mockData";
import { LideradoPerformance } from "@/types/mer";

// Mock de dados - será filtrado baseado no perfil do líder
const getMockTeamData = (hasData: boolean): LideradoPerformance[] => {
  if (!hasData) return [];
  
  return [
    {
      id_liderado: 'lid-001',
      nome_liderado: 'Antonio Pereira',
      cargo: 'Desenvolvedor Junior',
      nivel_maturidade: 'M2',
      eixo_x_tecnico_geral: 2.3,
      eixo_y_comportamental: 2.7,
      categoria_dominante: 'Desenvolvimento Web',
      especializacao_dominante: 'Frontend',
      sexo: 'MASCULINO',
      idade: 24,
      competencias: [
        { id_competencia: 'comp-001', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.8 },
        { id_competencia: 'comp-005', nome_competencia: 'React', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-001', nome_especializacao: 'Frontend', media_pontuacao: 2.5 },
        { id_competencia: 'comp-006', nome_competencia: 'TypeScript', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-001', nome_especializacao: 'Frontend', media_pontuacao: 2.2 },
      ],
    },
    {
      id_liderado: 'lid-003',
      nome_liderado: 'Lara Mendes',
      cargo: 'Designer Sênior',
      nivel_maturidade: 'M3',
      eixo_x_tecnico_geral: 3.4,
      eixo_y_comportamental: 2.3,
      categoria_dominante: 'Desenvolvimento Web',
      especializacao_dominante: 'Frontend',
      sexo: 'FEMININO',
      idade: 31,
      competencias: [
        { id_competencia: 'comp-001', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.4 },
        { id_competencia: 'comp-005', nome_competencia: 'React', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-001', nome_especializacao: 'Frontend', media_pontuacao: 3.6 },
        { id_competencia: 'comp-007', nome_competencia: 'CSS/Tailwind', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-001', nome_especializacao: 'Frontend', media_pontuacao: 3.8 },
      ],
    },
  ];
};

const getMockRecentEvaluations = (hasData: boolean) => {
  if (!hasData) return [];
  
  return [
    { id: 'av-001', nome_liderado: 'Antonio Pereira', data_avaliacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'av-002', nome_liderado: 'Lara Mendes', data_avaliacao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  ];
};

const StatCard = ({ icon: Icon, title, value }: any) => (
  <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-2">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  </Card>
);

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Detecta se o líder logado tem dados (apenas juli.lider@gmail.com)
  const isLiderComDados = profile?.email === 'juli.lider@gmail.com';
  const hasEvaluations = isLiderComDados;

  // Dados mockados baseados no perfil
  const teamMembers = getMockTeamData(hasEvaluations);
  const recentEvaluations = getMockRecentEvaluations(hasEvaluations);

  // Dados do líder baseado no perfil logado
  const currentLeaderData = isLiderComDados ? MOCK_LIDER : MOCK_LIDER_NOVO;
  const leaderProfile = {
    name: currentLeaderData.nome,
    role: "Tech Lead",
    initials: currentLeaderData.nome.split(' ').map(n => n[0]).join(''),
    email: currentLeaderData.email,
    team: "Engenharia de Software"
  };

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

      {/* Stats - sempre renderizado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={UsersIcon} 
          title="Total de Membros" 
          value={hasEvaluations ? String(teamMembers.length) : "0"} 
        />
        <StatCard 
          icon={Award} 
          title="Avaliações Completas" 
          value={hasEvaluations ? String(recentEvaluations.length) : "0"} 
        />
        <StatCard 
          icon={BarChart3} 
          title="Maturidade Média" 
          value={hasEvaluations ? "M2.8" : "—"} 
        />
      </div>

      {/* Empty state apenas se não houver dados */}
      {!hasEvaluations && (
        <Card className="p-8 mb-8 text-center bg-muted/20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <ClipboardList className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhuma avaliação disponível ainda
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece avaliando seu primeiro liderado para visualizar métricas e gráficos de desempenho da equipe.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/evaluation')} className="gap-2">
                <ClipboardList className="w-4 h-4" />
                Iniciar Primeira Avaliação
              </Button>
              <Button variant="outline" onClick={() => navigate('/team')} className="gap-2">
                <UserPlus className="w-4 h-4" />
                Ver Equipe
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quadrante - sempre renderizado */}
      <CompetencyQuadrantChart teamMembers={teamMembers} />

      {/* Gráfico de Pizza - sempre renderizado */}
      <DistributionPieChart teamMembers={teamMembers} />

      {/* Gaps de Conhecimento - sempre renderizado */}
      <KnowledgeGapsSection teamMembers={teamMembers} />

      {/* Avaliações Recentes - sempre renderizado */}
      <RecentEvaluationsSection 
        evaluations={recentEvaluations}
        onEvaluationClick={(id) => navigate(`/evaluation/${id}`)}
      />
    </div>
  );
}
