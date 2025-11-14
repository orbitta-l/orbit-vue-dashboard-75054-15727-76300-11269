import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { Usuario, Avaliacao, PontuacaoAvaliacao, LideradoDashboard, calcularIdade, NivelMaturidade } from '@/types/mer';
import { MOCK_CARGOS, MOCK_COMPETENCIAS, MOCK_ESPECIALIZACOES, MOCK_CATEGORIAS } from '@/data/mockData';
import { useNavigate, useLocation } from 'react-router-dom';

// Contrato de Input para o RPC de salvar avaliação
interface CompetenciaScore {
  competenciaId: string;
  nota: number;
}
interface TechBlockInput {
  categoriaId: string;
  especializacaoId: string;
  competencias: CompetenciaScore[];
}
interface SaveEvaluationInput {
  liderId: string;
  lideradoId: string;
  cargoReferenciado: string;
  comportamentais: CompetenciaScore[];
  tecnicas: TechBlockInput[];
  dataAvaliacao: string;
}

// Tipo para dados da view v_member_xy
interface MemberXYData {
  liderado_id: number;
  x_tecnico: number | null;
  y_comp: number | null;
  quadrante: NivelMaturidade | 'N/A';
}

interface AuthContextType {
  session: Session | null;
  profile: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  // Dados do Líder
  liderados: Usuario[];
  avaliacoes: Avaliacao[];
  pontuacoes: PontuacaoAvaliacao[];
  teamData: LideradoDashboard[];
  isPrimeiroAcesso: boolean;
  fetchTeamData: () => Promise<void>;
  // Dados do Liderado
  lideradoDashboardData: LideradoDashboard | null;
  fetchLideradoDashboardData: (lideradoId: number) => Promise<void>;
  loading: boolean;
  saveEvaluation: (input: SaveEvaluationInput) => Promise<{ success: boolean; maturidade?: NivelMaturidade | 'N/A'; error?: string }>;
  updateFirstLoginStatus: (userId: string) => Promise<{ success: boolean; error?: string }>; // Nova função
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Usuario | null>(null);
  const [liderados, setLiderados] = useState<Usuario[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [pontuacoes, setPontuacoes] = useState<PontuacaoAvaliacao[]>([]);
  const [memberXYData, setMemberXYData] = useState<MemberXYData[]>([]);
  const [lideradoDashboardData, setLideradoDashboardData] = useState<LideradoDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchLideradoDashboardData = useCallback(async (lideradoId: number) => {
    const { data, error } = await supabase.rpc('get_liderado_dashboard_data', { p_liderado_id: lideradoId });

    if (error) {
      console.error("Erro ao buscar dados do dashboard do liderado:", error);
      setLideradoDashboardData(null);
      return;
    }

    if (data) {
      const rawData = data as any;
      const profileData = rawData.profile;
      const ultimaAvaliacaoData = rawData.ultima_avaliacao;
      const competenciasData = rawData.competencias;

      const mappedLideradoDashboard: LideradoDashboard = {
        id_usuario: String(profileData.id_usuario),
        nome: profileData.nome,
        email: profileData.email,
        senha_hash: '', // Não exposto
        role: profileData.role,
        id_cargo: profileData.id_cargo,
        lider_id: null, // Não relevante para o próprio dashboard
        sexo: profileData.sexo,
        data_nascimento: profileData.data_nascimento,
        ativo: profileData.ativo,
        avatar_url: profileData.avatar_url,
        idade: profileData.idade,
        cargo_nome: profileData.cargo_nome,
        first_login: profileData.first_login, // Adicionado first_login
        ultima_avaliacao: ultimaAvaliacaoData ? {
          media_comportamental_1a4: ultimaAvaliacaoData.media_comportamental_1a4,
          media_tecnica_1a4: ultimaAvaliacaoData.media_tecnica_1a4,
          maturidade_quadrante: ultimaAvaliacaoData.maturidade_quadrante,
          data_avaliacao: new Date(ultimaAvaliacaoData.data_avaliacao + 'Z'),
        } : undefined,
        competencias: competenciasData ? competenciasData.map((c: any) => ({
          id_avaliacao: String(ultimaAvaliacaoData?.id_avaliacao || ''),
          id_competencia: String(c.id_competencia),
          pontuacao_1a4: c.pontuacao_1a4,
          peso_aplicado: c.peso_aplicado,
          nome_competencia: c.nome_competencia,
          tipo: c.tipo,
          categoria_nome: c.categoria_nome,
          especializacao_nome: c.especializacao_nome,
          nota_ideal: c.nota_ideal, // Adicionado nota_ideal
        })) : [],
        categoria_dominante: profileData.categoria_dominante,
        especializacao_dominante: profileData.especializacao_dominante,
      };

      setLideradoDashboardData(mappedLideradoDashboard);
    } else {
      setLideradoDashboardData(null);
    }
  }, []); // Removida a dependência 'profile'

  // Refatorado: Agora aceita o ID do líder explicitamente.
  const fetchTeamData = useCallback(async (liderId: number) => {
    if (!liderId) return;

    // 1. Buscar dados do dashboard do líder (inclui liderados, avaliações, pontuações e memberXYData)
    const { data: dashboardData, error: dashboardError } = await supabase.rpc('get_leader_dashboard_data', { p_leader_id: liderId });

    if (dashboardError) {
        console.error("Erro ao buscar dados do dashboard do líder:", dashboardError);
        setLiderados([]);
        setAvaliacoes([]);
        setPontuacoes([]);
        setMemberXYData([]);
        return;
    }

    const rawData = dashboardData as any;
    
    // Mapear Liderados
    const currentLiderados = (rawData.liderados || []).map((l: any) => ({
        ...l,
        id_usuario: String(l.id),
        lider_id: l.lider_id ? String(l.lider_id) : null,
    })) as Usuario[];
    setLiderados(currentLiderados);

    // Mapear Avaliações
    const formattedAvaliacoes = (rawData.avaliacoes || []).map((a: any) => ({
        ...a,
        id_avaliacao: String(a.id),
        lider_id: String(a.id_lider),
        liderado_id: String(a.id_liderado),
        id_cargo: String(a.cargo_referenciado),
        data_avaliacao: new Date(a.data_avaliacao + 'Z'),
        media_comportamental_1a4: a.media_comportamental,
        media_tecnica_1a4: a.media_tecnica,
        maturidade_quadrante: a.nivel_maturidade,
    })) as Avaliacao[];
    setAvaliacoes(formattedAvaliacoes);

    // Mapear Pontuações
    const formattedPontuacoes = (rawData.pontuacoes || []).map((p: any) => ({
        ...p,
        id_avaliacao: String(p.id_avaliacao),
        id_competencia: String(p.id_competencia),
        pontuacao_1a4: p.pontuacao,
        peso_aplicado: p.peso,
    })) as PontuacaoAvaliacao[];
    setPontuacoes(formattedPontuacoes);

    // Mapear Member XY Data
    setMemberXYData((rawData.memberXYData || []) as MemberXYData[]);

  }, []); // Removida a dependência 'profile'

  const updateFirstLoginStatus = useCallback(async (userId: string) => {
    try {
      const { error } = await supabase
        .from('usuario')
        .update({ first_login: false })
        .eq('id', Number(userId));

      if (error) throw error;
      
      // Atualiza o perfil no contexto para refletir a mudança
      setProfile(prev => prev ? { ...prev, first_login: false } : null);
      return { success: true };
    } catch (e: any) {
      console.error("Erro ao atualizar status de primeiro login:", e);
      return { success: false, error: e.message };
    }
  }, []);

  useEffect(() => {
    const fetchProfileAndData = async (user: User) => {
      const { data: profileData, error: profileError } = await supabase
        .rpc('get_my_profile')
        .single();
  
      if (profileError || !profileData) {
        console.error("Erro ao buscar perfil via RPC ou perfil não encontrado:", profileError);
        setProfile(null);
        if (!profileData) await supabase.auth.signOut();
        return;
      }
      
      const dbProfile = profileData as any;
      const appProfile: Usuario = {
        ...dbProfile,
        id_usuario: String(dbProfile.id),
        lider_id: dbProfile.lider_id ? String(dbProfile.lider_id) : null,
        first_login: dbProfile.first_login,
      };
      setProfile(appProfile);
  
      const targetDashboard = appProfile.role === 'LIDER' ? '/dashboard-lider' : '/dashboard-liderado';
      const targetFirstLogin = '/set-new-password';
      const currentPath = location.pathname;

      // 1. LIDERADO em Primeiro Login: Prioriza a tela de nova senha
      if (appProfile.role === 'LIDERADO' && appProfile.first_login) {
        if (currentPath !== targetFirstLogin) {
          navigate(targetFirstLogin, { replace: true });
        }
        await fetchLideradoDashboardData(dbProfile.id);
      } 
      // 2. Usuário Logado em Rota Pública: Redireciona para o dashboard
      else if (currentPath === '/login' || currentPath === '/' || currentPath === '/set-new-password') {
        navigate(targetDashboard, { replace: true });
      }
      
      // 3. Busca de Dados (após redirecionamentos iniciais)
      if (appProfile.role === 'LIDER') {
        // Passa o ID do líder explicitamente para fetchTeamData
        await fetchTeamData(dbProfile.id);
        setLideradoDashboardData(null);
      } else if (appProfile.role === 'LIDERADO') {
        // Se já buscou no passo 1, não precisa buscar de novo, a menos que não seja o primeiro login
        if (!appProfile.first_login) {
            await fetchLideradoDashboardData(dbProfile.id);
        }
      }
    };

    const getInitialSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        await fetchProfileAndData(session.user);
      } else {
        setProfile(null);
        // Se não houver sessão e estiver em uma rota protegida, redireciona para a Landing Page
        if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/team') || location.pathname.startsWith('/evaluation') || location.pathname.startsWith('/settings')) {
          navigate('/', { replace: true });
        }
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        // Quando o estado muda para SIGNED_IN, re-executa a lógica de perfil e redirecionamento
        await fetchProfileAndData(session.user);
      } else {
        // Limpa estados e redireciona para a Landing Page
        setProfile(null);
        setLiderados([]);
        setAvaliacoes([]);
        setPontuacoes([]);
        setMemberXYData([]);
        setLideradoDashboardData(null);
        if (location.pathname !== '/' && location.pathname !== '/login') {
          navigate('/', { replace: true });
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname, fetchLideradoDashboardData, fetchTeamData]);

  const saveEvaluation = async (input: SaveEvaluationInput) => {
    if (!session) return { success: false, error: "Usuário não autenticado." };
    try {
      const { data, error } = await supabase.rpc('save_evaluation_transaction', { 
          p_lider_id: Number(input.liderId),
          p_liderado_id: Number(input.lideradoId),
          p_cargo_ref: input.cargoReferenciado,
          p_payload: input,
      });
      if (error) throw error;
      const maturidade = data[0]?.maturidade as NivelMaturidade | 'N/A';
      
      // Chamada de atualização de dados: usa o ID do perfil atual
      if (profile?.role === 'LIDER' && profile.id_usuario) await fetchTeamData(Number(profile.id_usuario)); 
      if (profile?.role === 'LIDERADO' && profile.id_usuario === input.lideradoId) await fetchLideradoDashboardData(Number(profile.id_usuario));
      
      return { success: true, maturidade };
    } catch (e: any) {
      return { success: false, error: e.message || "Erro desconhecido." };
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { success: !error, error: error?.message };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const isPrimeiroAcesso = useMemo(() => {
    if (!profile || profile.role !== 'LIDER') return false;
    return liderados.length === 0 || avaliacoes.length === 0;
  }, [profile, liderados, avaliacoes]);

  const teamData = useMemo((): LideradoDashboard[] => {
    if (!profile || profile.role !== 'LIDER') return [];
    return liderados.map(liderado => {
      const xyData = memberXYData.find(d => String(d.liderado_id) === liderado.id_usuario);
      const ultimaAvaliacao = avaliacoes.filter(a => a.liderado_id === liderado.id_usuario).sort((a, b) => b.data_avaliacao.getTime() - a.data_avaliacao.getTime())[0];
      const cargo = MOCK_CARGOS.find(c => c.id_cargo === liderado.id_cargo);
      let competenciasConsolidadas: LideradoDashboard['competencias'] = [];
      let categoria_dominante = "Não Avaliado";
      let especializacao_dominante = "Não Avaliado";

      if (ultimaAvaliacao) {
        const pontuacoesDaAvaliacao = pontuacoes.filter(p => p.id_avaliacao === ultimaAvaliacao.id_avaliacao);
        competenciasConsolidadas = pontuacoesDaAvaliacao.map(p => {
            const competencia = MOCK_COMPETENCIAS.find(c => c.id_competencia === p.id_competencia);
            const especializacao = competencia?.id_especializacao ? MOCK_ESPECIALIZACOES.find(e => e.id_especializacao === competencia.id_especializacao) : null;
            const categoria = especializacao ? MOCK_CATEGORIAS.find(cat => cat.id_categoria === especializacao.id_categoria) : null;
            return { ...p, nome_competencia: competencia?.nome_competencia || 'Desconhecida', tipo: competencia?.tipo || 'TECNICA', categoria_nome: categoria?.nome_categoria || (competencia?.tipo === 'COMPORTAMENTAL' ? 'Soft Skills' : 'N/A'), especializacao_nome: especializacao?.nome_especializacao || 'N/A' };
        });
        const hardSkills = competenciasConsolidadas.filter(c => c.tipo === 'TECNICA');
        if (hardSkills.length > 0) {
            const categoryScores = hardSkills.reduce((acc, skill) => { if (skill.categoria_nome && skill.categoria_nome !== 'N/A') { acc[skill.categoria_nome] = (acc[skill.categoria_nome] || 0) + skill.pontuacao_1a4; } return acc; }, {} as Record<string, number>);
            categoria_dominante = Object.keys(categoryScores).reduce((a, b) => categoryScores[a] > categoryScores[b] ? a : b, "Não Avaliado");
            const specializationScores = hardSkills.reduce((acc, skill) => { if (skill.especializacao_nome && skill.especializacao_nome !== 'N/A') { acc[skill.especializacao_nome] = (acc[skill.especializacao_nome] || 0) + skill.pontuacao_1a4; } return acc; }, {} as Record<string, number>);
            especializacao_dominante = Object.keys(specializationScores).reduce((a, b) => specializationScores[a] > specializationScores[b] ? a : b, "Não Avaliado");
        }
      }
      return { ...liderado, idade: calcularIdade(liderado.data_nascimento), cargo_nome: cargo?.nome_cargo || 'Não definido', ultima_avaliacao: xyData ? { media_comportamental_1a4: xyData.y_comp || 0, media_tecnica_1a4: xyData.x_tecnico || 0, maturidade_quadrante: xyData.quadrante, data_avaliacao: ultimaAvaliacao?.data_avaliacao || new Date() } : undefined, competencias: competenciasConsolidadas, categoria_dominante, especializacao_dominante };
    });
  }, [profile, liderados, avaliacoes, pontuacoes, memberXYData]);

  const value = {
    session, profile, isAuthenticated: !!session, login, logout, liderados, avaliacoes, pontuacoes, teamData, lideradoDashboardData, isPrimeiroAcesso, loading, fetchTeamData: () => profile?.id_usuario ? fetchTeamData(Number(profile.id_usuario)) : Promise.resolve(), fetchLideradoDashboardData, saveEvaluation, updateFirstLoginStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}