import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos alinhados ao MER 2.0
export type UserRole = 'lider' | 'liderado';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  profile: Profile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  // Persistir sessão no localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem('orbitta_profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = MOCK_USERS.find(
      u => u.email === email && u.password === password
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
      return true;
    }

    return false;
  };

  const logout = () => {
    setProfile(null);
    localStorage.removeItem('orbitta_profile');
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        isAuthenticated: !!profile,
        login,
        logout,
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
