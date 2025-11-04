import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { Usuario, Avaliacao, PontuacaoAvaliacao, LideradoDashboard, calcularIdade } from '@/types/mer';

interface AuthContextType {
  session: Session | null;
  profile: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  liderados: Usuario[];
  avaliacoes: Avaliacao[];
  pontuacoes: PontuacaoAvaliacao[];
  teamData: LideradoDashboard[];
  isPrimeiroAcesso: boolean;
  loading: boolean;
  fetchTeamData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Usuario | null>(null);
  const [liderados, setLiderados] = useState<Usuario[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [pontuacoes, setPontuacoes] = useState<PontuacaoAvaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await fetchProfileAndData(session.user);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await fetchProfileAndData(session.user);
      } else {
        setProfile(null);
        setLiderados([]);
        setAvaliacoes([]);
        setPontuacoes([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfileAndData = async (user: User) => {
    setLoading(true);
    // Busca o perfil do usuário logado na tabela 'usuario'
    const { data: profileData, error: profileError } = await supabase
      .from('usuario')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (profileError) {
      console.error("Erro ao buscar perfil:", profileError);
      setProfile(null);
    } else {
      setProfile(profileData as Usuario);
      if (profileData.role === 'LIDER') {
        await fetchTeamData(profileData.id);
      }
    }
    setLoading(false);
  };

  const fetchTeamData = async (liderId?: number) => {
    const id = liderId || profile?.id;
    if (!id) return;

    // Busca os liderados
    const { data: lideradosData, error: lideradosError } = await supabase
      .from('usuario')
      .select('*')
      .eq('lider_id', id);
    
    if (lideradosError) console.error("Erro ao buscar liderados:", lideradosError);
    else setLiderados(lideradosData as Usuario[]);

    // Busca as avaliações
    const { data: avaliacoesData, error: avaliacoesError } = await supabase
      .from('avaliacao')
      .select('*')
      .eq('id_lider', id);

    if (avaliacoesError) console.error("Erro ao buscar avaliações:", avaliacoesError);
    else setAvaliacoes(avaliacoesData as Avaliacao[]);

    // Busca as pontuações
    if (avaliacoesData) {
      const avaliacaoIds = avaliacoesData.map(a => a.id);
      const { data: pontuacoesData, error: pontuacoesError } = await supabase
        .from('pontuacao_avaliacao')
        .select('*')
        .in('id_avaliacao', avaliacaoIds);
      
      if (pontuacoesError) console.error("Erro ao buscar pontuações:", pontuacoesError);
      else setPontuacoes(pontuacoesData as PontuacaoAvaliacao[]);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const isPrimeiroAcesso = useMemo(() => {
    if (!profile) return true;
    if (profile.role !== 'LIDER') return false;
    return liderados.length === 0 || avaliacoes.length === 0;
  }, [profile, liderados, avaliacoes]);

  const teamData = useMemo((): LideradoDashboard[] => {
    // Esta lógica de consolidação de dados permanece a mesma,
    // mas agora opera sobre os dados reais do Supabase.
    if (!profile || profile.role !== 'LIDER') return [];
    
    return liderados.map(liderado => {
      // ... (lógica de cálculo de LideradoDashboard)
      // Esta parte é complexa e depende de MOCK_CARGOS, etc.
      // Por enquanto, vamos manter uma versão simplificada.
      const lideradoAvaliacoes = avaliacoes
        .filter(a => a.id_liderado === liderado.id)
        .sort((a, b) => new Date(b.data_avaliacao).getTime() - new Date(a.data_avaliacao).getTime());
      
      const ultimaAvaliacao = lideradoAvaliacoes[0];

      return {
        ...liderado,
        idade: calcularIdade(liderado.data_nascimento),
        cargo_nome: 'Não definido', // Simplificado por agora
        ultima_avaliacao: ultimaAvaliacao ? {
          media_comportamental_1a4: ultimaAvaliacao.media_comportamental,
          media_tecnica_1a4: ultimaAvaliacao.media_tecnica,
          maturidade_quadrante: ultimaAvaliacao.nivel_maturidade,
          data_avaliacao: ultimaAvaliacao.data_avaliacao,
        } : undefined,
        competencias: [], // Simplificado por agora
        categoria_dominante: "Não Avaliado",
        especializacao_dominante: "Não Avaliado",
      };
    });
  }, [profile, liderados, avaliacoes, pontuacoes]);

  const value = {
    session,
    profile,
    isAuthenticated: !!session,
    login,
    logout,
    liderados,
    avaliacoes,
    pontuacoes,
    teamData,
    isPrimeiroAcesso,
    loading,
    fetchTeamData: () => fetchTeamData(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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