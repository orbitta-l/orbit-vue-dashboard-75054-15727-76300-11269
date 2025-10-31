import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { MOCK_USERS, MOCK_AVALIACAO, MOCK_PONTUACOES, MOCK_CARGOS, MOCK_COMPETENCIAS, MOCK_ESPECIALIZACOES, MOCK_CATEGORIAS } from '@/data/mockData';
import { Usuario, Avaliacao, PontuacaoAvaliacao, LideradoDashboard, calcularIdade } from '@/types/mer';

interface AuthContextType {
  profile: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  liderados: Usuario[];
  setLiderados: React.Dispatch<React.SetStateAction<Usuario[]>>;
  avaliacoes: Avaliacao[];
  setAvaliacoes: React.Dispatch<React.SetStateAction<Avaliacao[]>>;
  pontuacoes: PontuacaoAvaliacao[];
  setPontuacoes: React.Dispatch<React.SetStateAction<PontuacaoAvaliacao[]>>;
  isPrimeiroAcesso: boolean;
  addLiderado: (novo: Omit<Usuario, 'id_usuario' | 'ativo' | 'senha_hash' | 'role' | 'lider_id'>) => void;
  addAvaliacao: (nova: Avaliacao, novasPontuacoes: PontuacaoAvaliacao[]) => void;
  teamData: LideradoDashboard[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ALWAYS_FIRST_ACCESS_EMAILS = ['thais.lider@gmail.com', 'ramon.p@gmail.com'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Usuario | null>(null);
  const [liderados, setLiderados] = useState<Usuario[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [pontuacoes, setPontuacoes] = useState<PontuacaoAvaliacao[]>([]);

  useEffect(() => {
    const storedProfile = localStorage.getItem('orbitta_profile');
    if (storedProfile) {
      const parsedProfile: Usuario = JSON.parse(storedProfile);
      setProfile(parsedProfile);
      if (parsedProfile.role === 'LIDER' && !ALWAYS_FIRST_ACCESS_EMAILS.includes(parsedProfile.email)) {
        loadMockData(parsedProfile.id_usuario);
      }
    }
  }, []);

  const loadMockData = (liderId: string) => {
    setLiderados(MOCK_USERS.filter(u => u.lider_id === liderId));
    setAvaliacoes(MOCK_AVALIACAO.filter(a => a.lider_id === liderId));
    setPontuacoes(MOCK_PONTUACOES.filter(p => MOCK_AVALIACAO.some(a => a.id_avaliacao === p.id_avaliacao && a.lider_id === liderId)));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = MOCK_USERS.find((u) => u.email === email && u.senha_hash === password);

    if (user) {
      setProfile(user);
      localStorage.setItem('orbitta_profile', JSON.stringify(user));
      if (user.role === 'LIDER' && !ALWAYS_FIRST_ACCESS_EMAILS.includes(user.email)) {
        loadMockData(user.id_usuario);
      } else {
        if (user.role === 'LIDERADO') {
            setAvaliacoes(MOCK_AVALIACAO.filter(a => a.liderado_id === user.id_usuario));
            setPontuacoes(MOCK_PONTUACOES.filter(p => MOCK_AVALIACAO.some(a => a.id_avaliacao === p.id_avaliacao && a.liderado_id === user.id_usuario)));
        } else {
            setLiderados([]);
            setAvaliacoes([]);
            setPontuacoes([]);
        }
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setProfile(null);
    setLiderados([]);
    setAvaliacoes([]);
    setPontuacoes([]);
    localStorage.removeItem('orbitta_profile');
  };

  const addLiderado = (novo: Omit<Usuario, 'id_usuario' | 'ativo' | 'senha_hash' | 'role' | 'lider_id'>) => {
    if (!profile || profile.role !== 'LIDER') return;
    const newLiderado: Usuario = {
      ...novo,
      id_usuario: `lid-${Date.now()}`,
      ativo: true,
      senha_hash: Math.random().toString(36).slice(-8),
      role: 'LIDERADO',
      lider_id: profile.id_usuario,
    };
    setLiderados((prev) => [...prev, newLiderado]);
  };

  const addAvaliacao = (nova: Avaliacao, novasPontuacoes: PontuacaoAvaliacao[]) => {
    setAvaliacoes(prev => [...prev, nova]);
    setPontuacoes(prev => [...prev, ...novasPontuacoes]);
  };

  const isPrimeiroAcesso = useMemo(() => {
    if (!profile) return true;
    if (ALWAYS_FIRST_ACCESS_EMAILS.includes(profile.email)) return true;
    if (profile.role !== 'LIDER') return false;
    return liderados.length === 0 || avaliacoes.length === 0;
  }, [profile, liderados, avaliacoes]);

  const teamData = useMemo((): LideradoDashboard[] => {
    if (!profile || profile.role !== 'LIDER') return [];
    
    return liderados.map(liderado => {
      const cargo = MOCK_CARGOS.find(c => c.id_cargo === liderado.id_cargo);
      const lideradoAvaliacoes = avaliacoes
        .filter(a => a.liderado_id === liderado.id_usuario)
        .sort((a, b) => new Date(b.data_avaliacao).getTime() - new Date(a.data_avaliacao).getTime());
      
      const ultimaAvaliacao = lideradoAvaliacoes[0];

      const competenciasDaUltimaAvaliacao = ultimaAvaliacao 
        ? pontuacoes
            .filter(p => p.id_avaliacao === ultimaAvaliacao.id_avaliacao)
            .map(p => {
                const compDetails = MOCK_COMPETENCIAS.find(c => c.id_competencia === p.id_competencia);
                const especializacao = MOCK_ESPECIALIZACOES.find(e => e.id_especializacao === compDetails?.id_especializacao);
                const categoria = MOCK_CATEGORIAS.find(cat => cat.id_categoria === especializacao?.id_categoria);
                return {
                    ...p,
                    nome_competencia: compDetails?.nome_competencia || 'N/A',
                    tipo: compDetails?.tipo || 'HARD',
                    categoria_nome: categoria?.nome_categoria || (compDetails?.tipo === 'SOFT' ? 'Soft Skills' : 'N/A'),
                    especializacao_nome: especializacao?.nome_especializacao || null,
                };
            })
        : [];
      
      let categoria_dominante = "Não Avaliado";
      let especializacao_dominante = "Não Avaliado";

      if (competenciasDaUltimaAvaliacao.length > 0) {
        const techCompetencies = competenciasDaUltimaAvaliacao.filter(c => c.tipo === 'HARD' && c.categoria_nome);
        
        if (techCompetencies.length > 0) {
          const categories = new Map<string, { soma: number; count: number; especializacoes: Map<string, { soma: number; count: number }> }>();

          techCompetencies.forEach(comp => {
            const catName = comp.categoria_nome!;
            const specName = comp.especializacao_nome;

            if (!categories.has(catName)) {
              categories.set(catName, { soma: 0, count: 0, especializacoes: new Map() });
            }
            const categoryData = categories.get(catName)!;
            categoryData.soma += comp.pontuacao_1a4;
            categoryData.count++;

            if (specName) {
              if (!categoryData.especializacoes.has(specName)) {
                categoryData.especializacoes.set(specName, { soma: 0, count: 0 });
              }
              const specData = categoryData.especializacoes.get(specName)!;
              specData.soma += comp.pontuacao_1a4;
              specData.count++;
            }
          });

          let maxAvg = 0;
          let topCategory: string | null = null;

          categories.forEach((data, name) => {
            const avg = data.soma / data.count;
            if (avg > maxAvg) {
              maxAvg = avg;
              topCategory = name;
            }
          });

          if (topCategory) {
            categoria_dominante = topCategory;
            const topCategoryData = categories.get(topCategory)!;
            
            let maxSpecAvg = 0;
            let topSpec: string | null = null;
            topCategoryData.especializacoes.forEach((data, name) => {
              const avg = data.soma / data.count;
              if (avg > maxSpecAvg) {
                maxSpecAvg = avg;
                topSpec = name;
              }
            });
            if (topSpec) {
              especializacao_dominante = topSpec;
            } else {
              especializacao_dominante = "N/A";
            }
          }
        }
      }

      return {
        ...liderado,
        idade: calcularIdade(liderado.data_nascimento),
        cargo_nome: cargo?.nome_cargo || 'Não definido',
        ultima_avaliacao: ultimaAvaliacao ? {
          media_comportamental_1a4: ultimaAvaliacao.media_comportamental_1a4,
          media_tecnica_1a4: ultimaAvaliacao.media_tecnica_1a4,
          maturidade_quadrante: ultimaAvaliacao.maturidade_quadrante,
          data_avaliacao: ultimaAvaliacao.data_avaliacao,
        } : undefined,
        competencias: competenciasDaUltimaAvaliacao,
        categoria_dominante,
        especializacao_dominante,
      };
    });
  }, [profile, liderados, avaliacoes, pontuacoes]);

  return (
    <AuthContext.Provider
      value={{
        profile,
        isAuthenticated: !!profile,
        login,
        logout,
        liderados,
        setLiderados,
        avaliacoes,
        setAvaliacoes,
        pontuacoes,
        setPontuacoes,
        isPrimeiroAcesso,
        addLiderado,
        addAvaliacao,
        teamData,
      }}
    >
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