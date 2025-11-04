import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/mer';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: UserRole;
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, profile, loading } = useAuth();

  // 1. Espera a verificação da sessão terminar
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. Após o carregamento, verifica se está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Garante que o perfil foi carregado
  if (!profile) {
    // Caso raro onde a sessão existe mas o perfil não foi encontrado.
    // Redirecionar para o login é a ação mais segura.
    return <Navigate to="/login" replace />;
  }

  // 4. Verifica se o papel do usuário é o permitido para a rota
  if (profile.role !== allowedRole) {
    const correctDashboard = profile.role === 'LIDER' 
      ? '/dashboard-lider' 
      : '/dashboard-liderado';
    return <Navigate to={correctDashboard} replace />;
  }

  // 5. Se tudo estiver certo, renderiza a página
  return <>{children}</>;
}