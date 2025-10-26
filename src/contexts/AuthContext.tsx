import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { MOCK_PERFORMANCE, MOCK_LIDER, MOCK_LIDERADOS as MOCK_USERS_LIDERADOS } from '@/data/mockData';
import { SexoTipo, LideradoPerformance, NivelMaturidade, calcularNivelMaturidade, calcularIdade } from '@/types/mer';

export type UserRole = 'lider' | 'liderado';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Liderado agora é a interface completa de LideradoPerformance
export interface Liderado extends LideradoPerformance {
  lider_id: string; // Adiciona lider_id para consistência com Usuario
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
  liderados: Liderado[]; // Agora holds LideradoPerformance data
  setLiderados: React.Dispatch<React.SetStateAction<Liderado[]>>;
  avaliacoes: Avaliacao[];
  setAvaliacoes: React.Dispatch<React.SetStateAction<Avaliacao[]>>;
  isPrimeiroAcesso: boolean;
  addLiderado: (novo: Omit<Liderado, 'nivel_maturidade' | 'eixo_x_tecnico_geral' | 'eixo_y_comportamental' | 'categoria_dominante' | 'especializacao_dominante' | 'competencias' | 'idade' | 'lider_id'> & { lider_id: string }) => void;
  addAvaliacao: (nova: Avaliacao) => void;
  updateLideradoPerformance: (lideradoId: string, performanceData: Partial<LideradoPerformance>) => void;
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
      if (parsedProfile.role === 'lider' && !ALWAYS_FIRST.includes(parsedProfile.email)) {
        loadMockData(parsedProfile.id);
      }
    }
  }, []);

  const loadMockData = (liderId: string) => {
    const lideradosCompletos: Liderado[] = MOCK_PERFORMANCE.map((p) => ({
      ...p,
      lider_id: liderId, // Associa ao líder mockado
    }));
    setLiderados(lideradosCompletos);

    const avals = MOCK_PERFORMANCE.map((p) => ({
      id: `av-${p.id_liderado}`,
      id_lider: liderId,
      id_liderado: p.id_liderado,
      eixo_x: p.eixo_x_tecnico_geral,
      eixo_y: p.eixo_y_comportamental,
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

  const addLiderado = (novo: Omit<Liderado, 'nivel_maturidade' | 'eixo_x_tecnico_geral' | 'eixo_y_comportamental' | 'categoria_dominante' | 'especializacao_dominante' | 'competencias' | 'idade'> & { lider_id: string }) => {
    const newLiderado: Liderado = {
      ...novo,
      nivel_maturidade: 'M1', // Default inicial
      eixo_x_tecnico_geral: 0,
      eixo_y_comportamental: 0,
      categoria_dominante: 'Não Avaliado',
      especializacao_dominante: 'Não Avaliado',
      competencias: [],
      idade: calcularIdade(novo.data_nascimento),
    };
    setLiderados((prev) => [...prev, newLiderado]);
  };

  const addAvaliacao = (nova: Avaliacao) => setAvaliacoes((prev) => [...prev, nova]);

  const updateLideradoPerformance = (lideradoId: string, performanceData: Partial<LideradoPerformance>) => {
    setLiderados(prev => prev.map(l => 
      l.id_liderado === lideradoId ? { ...l, ...performanceData } : l
    ));
  };

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
        updateLideradoPerformance,
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