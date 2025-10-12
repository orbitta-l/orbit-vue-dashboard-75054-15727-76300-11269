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

// Usuários mockados conforme especificação
const MOCK_USERS = [
  {
    id: '1',
    email: 'ana.lider@gmail.com',
    password: 'ana@123',
    name: 'Ana Silva',
    role: 'lider' as UserRole,
  },
  {
    id: '2',
    email: 'bea.santos@gmail.com',
    password: 'bea@123',
    name: 'Beatriz Santos',
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
