import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { MOCK_PERFORMANCE, MOCK_LIDER, MOCK_LIDER_NOVO } from '@/data/mockData';
import { LideradoPerformance, AvaliacaoCompleta } from '@/types/mer';

// Tipos alinhados ao MER 2.0
export type UserRole = 'lider' | 'liderado';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Estrutura mínima de um liderado (usada no frontend)
export interface Liderado {
  id: string;
  nome: string;
  cargo_id?: string;
  // demais campos que possam ser necessários
}

// Estrutura mínima de uma avaliação (usada no frontend)
export interface Avaliacao {
  id: string;
  id_lider: string;
  id_liderado: string;
  eixo_x: number;
  eixo_y: number;
  nivel: 'M1' | 'M2' | 'M3' | 'M4';
  data: string;
}

interface AuthContextType {
  profile: Profile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Novos estados
  liderados: Liderado[];
  setLiderados: React.Dispatch<React.SetStateAction<Liderado[]>>;

  avaliacoes: Avaliacao[];
  setAvaliacoes: React.Dispatch<React.SetStateAction<Avaliacao[]>>;

  // Flag de primeiro acesso
  isPrimeiroAcesso: boolean;

  // Funções auxiliares
  addLiderado: (novo: Liderado) => void;
  addAvaliacao: (nova: Avaliacao) => void;
}

// Cria o contexto vazio
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários mockados - 4 perfis de teste
const MOCK_USERS = [
  // Líder com dados completos
  {
    id: 'lider-001',
    email: 'juli.lider@gmail.com',
    password: 'juli@123',
    name: 'Juliana Martins',
    role: 'lider' as UserRole,
  },
  // Liderado com dados completos
  {
    id: 'lid-001',
    email: 'tone.p@gmail.com',
    password: 'tone@123',
    name: 'Antonio Pereira',
    role: 'liderado' as UserRole,
  },
  // Líder novo (sem dados)
  {
    id: 'lider-002',
    email: 'thais.lider@gmail.com',
    password: 'thais@123',
    name: 'Thais Costa',
    role: 'lider' as UserRole,
  },
  // Liderado novo (sem dados)
  {
    id: 'lid-002',
    email: 'ramon.p@gmail.com',
    password: 'ramon@123',
    name: 'Ramon Silva',
    role: 'liderado' as UserRole,
  },
];

// Lista de e‑mails que sempre são considerados primeiro acesso
const ALWAYS_FIRST = ['thais.lider@gmail.com', 'ramon.p@gmail.com'] as const;

// Função utilitária que determina se o usuário está em primeiro acesso
export function isPrimeiroAcesso(
  user: Profile | null,
  liderados: Liderado[],
  avaliacoes: Avaliacao[]
): boolean {
  if (!user) return true;
  if (ALWAYS_FIRST.includes(user.email)) return true;
  if (user.role !== 'lider') return false;

  const semLiderados = (liderados?.length ?? 0) === 0;
  const semAvaliacoes = (avaliacoes?.length ?? 0) === 0;

  return semLiderados || semAvaliacoes;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  // Persistir sessão no localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem('orbitta_profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  // Estado de liderados e avaliações (inicialmente vazio)
  const [liderados, setLiderados] = useState<Liderado[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  // Função de login (mantida como antes)
  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const userProfile: Profile = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
      setProfile(userProfile);
      localStorage.setItem('orbitta_profile', JSON.stringify(userProfile));

      // Carrega dados iniciais de acordo com o usuário
      if (user.role === 'lider') {
        // Se for o líder com dados (juli.lider), preenche com mock
        if (user.email === MOCK_LIDER.email) {
          // Converte MOCK_PERFORMANCE (que já tem a estrutura de LideradoPerformance) para nosso tipo Liderado
          const lideradosIniciais = MOCK_PERFORMANCE.map((p) => ({
            id: p.id_liderado,
            nome: p.nome_liderado,
            cargo_id: p.cargo, // usando o campo cargo como cargo_id simplificado
          }));
          setLiderados(lideradosIniciais);
        } else {
          // Para os líderes que sempre são primeiro acesso, deixa vazio
          setLiderados([]);
        }
        // Avaliações iniciais (apenas para o líder com dados)
        if (user.email === MOCK_LIDER.email) {
          const avals = MOCK_PERFORMANCE.map((p) => ({
            id: `av-${p.id_liderado}`,
            id_lider: user.id,
            id_liderado: p.id_liderado,
            eixo_x: p.quadrantX,
            eixo_y: p.quadrantY,
            nivel: p.nivel_maturidade,
            data: new Date().toISOString(),
          }));
          setAvaliacoes(avals);
        } else {
          setAvaliacoes([]);
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
    localStorage.removeItem('orbitta_profile');
  };

  // Funções auxiliares de mutação
  const addLiderado = (novo: Liderado) => {
    setLiderados((prev) => [...prev, novo]);
  };

  const addAvaliacao = (nova: Avaliacao) => {
    setAvaliacoes((prev) => [...prev, nova]);
  };

  // Flag memoizada de primeiro acesso
  const primeiroAcesso = useMemo(
    () => isPrimeiroAcesso(profile, liderados, avaliacoes),
    [profile, liderados, avaliacoes]
  );

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
        isPrimeiroAcesso: primeiroAcesso,
        addLiderado,
        addAvaliacao,
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