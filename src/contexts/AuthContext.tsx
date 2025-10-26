import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { MOCK_PERFORMANCE, MOCK_LIDER } from '@/data/mockData';
import { SexoTipo } from '@/types/mer';

export type UserRole = 'lider' | 'liderado';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Liderado {
  id: string;
  nome: string;
  email?: string;
  cargo_id?: string;
  sexo?: SexoTipo;
  data_nascimento?: string;
  lider_id?: string;
  // Frontend-specific fields
  maturityLevel?: string;
  areas?: string[];
  especializacaoDominante?: string;
}

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
  liderados: Liderado[];
  setLiderados: React.Dispatch<React.SetStateAction<Liderado[]>>;
  avaliacoes: Avaliacao[];
  setAvaliacoes: React.Dispatch<React.SetStateAction<Avaliacao[]>>;
  isPrimeiroAcesso: boolean;
  addLiderado: (novo: Liderado) => void;
  addAvaliacao: (nova: Avaliacao) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  { id: 'lider-001', email: 'juli.lider@gmail.com', password: 'juli@123', name: 'Juliana Martins', role: 'lider' as UserRole },
  { id: 'lid-001', email: 'tone.p@gmail.com', password: 'tone@123', name: 'Antonio Pereira', role: 'liderado' as UserRole },
  { id: 'lider-002', email: 'thais.lider@gmail.com', password: 'thais@123', name: 'Thais Costa', role: 'lider' as UserRole },
  { id: 'lid-002', email: 'ramon.p@gmail.com', password: 'ramon@123', name: 'Ramon Silva', role: 'liderado' as UserRole },
];

const ALWAYS_FIRST = ['thais.lider@gmail.com', 'ramon.p@gmail.com'];

export function isPrimeiroAcesso(user: Profile | null, liderados: Liderado[], avaliacoes: Avaliacao[]): boolean {
  if (!user) return true;
  if (ALWAYS_FIRST.includes(user.email)) return true;
  if (user.role !== 'lider') return false;
  return (liderados?.length ?? 0) === 0 || (avaliacoes?.length ?? 0) === 0;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [liderados, setLiderados] = useState<Liderado[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  useEffect(() => {
    const storedProfile = localStorage.getItem('orbitta_profile');
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setProfile(parsedProfile);
      if (parsedProfile.email === MOCK_LIDER.email) {
        loadMockData(parsedProfile.id);
      }
    }
  }, []);

  const loadMockData = (liderId: string) => {
    const lideradosIniciais = MOCK_PERFORMANCE.map((p) => ({
      id: p.id_liderado,
      nome: p.nome_liderado,
      cargo_id: p.cargo,
      email: `${p.nome_liderado.split(' ')[0].toLowerCase()}@orbitta.com`,
      maturityLevel: p.nivel_maturidade,
      areas: [p.categoria_dominante, p.especializacao_dominante],
      especializacaoDominante: p.especializacao_dominante,
    }));
    setLiderados(lideradosIniciais);

    const avals = MOCK_PERFORMANCE.map((p) => ({
      id: `av-${p.id_liderado}`,
      id_lider: liderId,
      id_liderado: p.id_liderado,
      eixo_x: p.quadrantX,
      eixo_y: p.quadrantY,
      nivel: p.nivel_maturidade,
      data: new Date().toISOString(),
    }));
    setAvaliacoes(avals);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);

    if (user) {
      const userProfile: Profile = { id: user.id, email: user.email, name: user.name, role: user.role };
      setProfile(userProfile);
      localStorage.setItem('orbitta_profile', JSON.stringify(userProfile));

      if (user.role === 'lider' && !ALWAYS_FIRST.includes(user.email)) {
        loadMockData(user.id);
      } else {
        setLiderados([]);
        setAvaliacoes([]);
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

  const addLiderado = (novo: Liderado) => setLiderados((prev) => [...prev, novo]);
  const addAvaliacao = (nova: Avaliacao) => setAvaliacoes((prev) => [...prev, nova]);

  const primeiroAcesso = useMemo(() => isPrimeiroAcesso(profile, liderados, avaliacoes), [profile, liderados, avaliacoes]);

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