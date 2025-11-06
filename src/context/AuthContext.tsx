import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { Usuario, Avaliacao, PontuacaoAvaliacao, LideradoDashboard, calcularIdade, NivelMaturidade } from '@/types/mer';
import { MOCK_CARGOS, MOCK_COMPETENCIAS, MOCK_ESPECIALIZACOES, MOCK_CATEGORIAS } from '@/data/mockData';

// Novo Contrato de Input para o RPC
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

// Tipo para dados consolidados da view v_member_xy
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
  liderados: Usuario[];
  avaliacoes: Avaliacao[];
  pontuacoes: PontuacaoAvaliacao[];
  teamData: LideradoDashboard[];
  isPrimeiroAcesso: boolean;
  loading: boolean;
  fetchTeamData: () => Promise<void>;
  saveEvaluation: (input: SaveEvaluationInput) => Promise<{ success: boolean; maturidade?: NivelMaturidade | 'N/A'; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Usuario | null>(null);
  const [liderados, setLiderados] = useState<Usuario[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [pontuacoes, setPontuacoes] = useState<PontuacaoAvaliacao[]>([]);
  const [memberXYData, setMemberXYData] = useState<MemberXYData[]>([]); // Novo estado para dados consolidados
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
        setMemberXYData([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfileAndData = async (user: User) => {
    setLoading(true);
    const { data: profileData, error: profileError } = await supabase
      .from('usuario')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (profileError) {
      console.error("Erro ao buscar perfil:", profileError);
      setProfile(null);
    } else {
      const dbProfile = profileData as any;
      const appProfile: Usuario = {
        ...dbProfile,
        id_usuario: String(dbProfile.id),
        lider_id: dbProfile.lider_id ? String(dbProfile.lider_id) : null,
      };
      setProfile(appProfile);
      if (appProfile.role === 'LIDER') {
        await fetchTeamData(dbProfile.id);
      }
    }
    setLoading(false);
  };

  const fetchTeamData = async (liderId?: number) => {
    const id = liderId || (profile ? Number(profile.id_usuario) : undefined);
    if (!id) return;

    // 1. Buscar IDs dos liderados
    const { data: relacaoData, error: relacaoError } = await supabase
      .from('lider_liderado')
      .select('liderado_id')
      .eq('lider_id', id);

    if (relacaoError) {
      console.error("Erro ao buscar relação líder-liderado:", relacaoError);
      setLiderados([]);
      return;
    }
    
    const lideradoIds = relacaoData.map(r => r.liderado_id);
    
    // 2. Buscar perfis dos liderados
    if (lideradoIds.length > 0) {
      const { data: lideradosData, error: lideradosError } = await supabase
        .from('usuario')
        .select('*')
        .in('id', lideradoIds);
      
      if (lideradosError) {
        console.error("Erro ao buscar liderados:", lideradosError);
      } else {
        const currentLiderados = lideradosData.map((l: any) => ({
          ...l,
          id_usuario: String(l.id),
          lider_id: l.lider_id ? String(l.lider_id) : null,
        })) as Usuario[];
        setLiderados(currentLiderados);
      }
    } else {
      setLiderados([]);
    }

    // 3. Buscar dados consolidados (XY)
    if (lideradoIds.length > 0) {
        const { data: xyData, error: xyError } = await supabase
            .from('v_member_xy')
            .select('*')
            .in('liderado_id', lideradoIds);
        
        if (xyError) {
            console.error("Erro ao buscar v_member_xy:", xyError);
            setMemberXYData([]);
        } else {
            setMemberXYData(xyData as MemberXYData[]);
        }
    } else {
        setMemberXYData([]);
    }

    // 4. Buscar avaliações e pontuações (para detalhes e recentes)
    const { data: avaliacoesData, error: avaliacoesError } = await supabase
      .from('avaliacao')
      .select('*')
      .eq('id_lider', id);

    if (avaliacoesError) {
      console.error("Erro ao buscar avaliações:", avaliacoesError);
    } else {
      const formattedAvaliacoes = avaliacoesData.map((a: any) => ({
        ...a,
        id_avaliacao: String(a.id),
        lider_id: String(a.id_lider),
        liderado_id: String(a.id_liderado),
        id_cargo: String(a.cargo_referenciado),
        media_comportamental_1a4: a.media_comportamental,
        media_tecnica_1a4: a.media_tecnica,
        maturidade_quadrante: a.nivel_maturidade,
      })) as Avaliacao[];
      setAvaliacoes(formattedAvaliacoes);

      // 5. Buscar pontuações
      if (formattedAvaliacoes.length > 0) {
        const avaliacaoIds = formattedAvaliacoes.map(a => Number(a.id_avaliacao));
        const { data: pontuacoesData, error: pontuacoesError } = await supabase
          .from('pontuacao_avaliacao')
          .select('*')
          .in('id_avaliacao', avaliacaoIds);
        
        if (pontuacoesError) {
          console.error("Erro ao buscar pontuações:", pontuacoesError);
        } else {
          const formattedPontuacoes = pontuacoesData.map((p: any) => ({
            ...p,
            id_avaliacao: String(p.id_avaliacao),
            id_competencia: String(p.id_competencia),
            pontuacao_1a4: p.pontuacao,
            peso_aplicado: p.peso,
          })) as PontuacaoAvaliacao[];
          setPontuacoes(formattedPontuacoes);
        }
      } else {
        setPontuacoes([]);
      }
    }
  };

  const saveEvaluation = async (input: SaveEvaluationInput) => {
    if (!session) {
      return { success: false, error: "Usuário não autenticado." };
    }

    try {
      // Chamada RPC para salvar a avaliação transacionalmente
      const { data, error } = await supabase.rpc('save_evaluation_transaction', { 
          p_lider_id: Number(input.liderId),
          p_liderado_id: Number(input.lideradoId),
          p_cargo_ref: input.cargoReferenciado,
          p_payload: input, // O objeto JSON completo é passado como payload
      });

      if (error) {
        console.error("RPC Save Evaluation Error:", error);
        return { success: false, error: error.message };
      }
      
      // O RPC retorna um array de objetos { avaliacao_id, maturidade }
      const maturidade = data[0]?.maturidade as NivelMaturidade | 'N/A';

      // Se a inserção for bem-sucedida, atualiza os dados do time
      await fetchTeamData(); 

      return { success: true, maturidade };

    } catch (e: any) {
      console.error("Unexpected save error:", e);
      return { success: false, error: e.message || "Erro desconhecido ao salvar avaliação." };
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
    if (!profile || profile.role !== 'LIDER') return [];
    
    return liderados.map(liderado => {
      const xyData = memberXYData.find(d => String(d.liderado_id) === liderado.id_usuario);
      
      const lideradoAvaliacoes = avaliacoes
        .filter(a => a.liderado_id === liderado.id_usuario)
        .sort((a, b) => new Date(b.data_avaliacao).getTime() - new Date(a.data_avaliacao).getTime());
      
      const ultimaAvaliacao = lideradoAvaliacoes[0];
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
            
            return {
                ...p,
                nome_competencia: competencia?.nome_competencia || 'Desconhecida',
                tipo: competencia?.tipo || 'TECNICA',
                categoria_nome: categoria?.nome_categoria || (competencia?.tipo === 'COMPORTAMENTAL' ? 'Soft Skills' : 'N/A'),
                especializacao_nome: especializacao?.nome_especializacao || 'N/A',
            };
        });

        const hardSkills = competenciasConsolidadas.filter(c => c.tipo === 'TECNICA');
        if (hardSkills.length > 0) {
            const categoryScores = hardSkills.reduce((acc, skill) => {
                if (skill.categoria_nome && skill.categoria_nome !== 'N/A') {
                    acc[skill.categoria_nome] = (acc[skill.categoria_nome] || 0) + skill.pontuacao_1a4;
                }
                return acc;
            }, {} as Record<string, number>);

            categoria_dominante = Object.keys(categoryScores).reduce((a, b) => categoryScores[a] > categoryScores[b] ? a : b, "Não Avaliado");

            const specializationScores = hardSkills.reduce((acc, skill) => {
                if (skill.especializacao_nome && skill.especializacao_nome !== 'N/A') {
                    acc[skill.especializacao_nome] = (acc[skill.especializacao_nome] || 0) + skill.pontuacao_1a4;
                }
                return acc;
            }, {} as Record<string, number>);

            especializacao_dominante = Object.keys(specializationScores).reduce((a, b) => specializationScores[a] > specializationScores[b] ? a : b, "Não Avaliado");
        }
      }

      return {
        ...liderado,
        idade: calcularIdade(liderado.data_nascimento),
        cargo_nome: cargo?.nome_cargo || 'Não definido',
        ultima_avaliacao: xyData ? {
            media_comportamental_1a4: xyData.y_comp || 0,
            media_tecnica_1a4: xyData.x_tecnico || 0,
            maturidade_quadrante: xyData.quadrante,
            data_avaliacao: ultimaAvaliacao?.data_avaliacao || new Date().toISOString(), // Usar data da última avaliação bruta
        } : undefined,
        competencias: competenciasConsolidadas,
        categoria_dominante,
        especializacao_dominante,
      };
    });
  }, [profile, liderados, avaliacoes, pontuacoes, memberXYData]);

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
    saveEvaluation,
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