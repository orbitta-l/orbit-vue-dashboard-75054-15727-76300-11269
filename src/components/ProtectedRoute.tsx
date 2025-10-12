import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: UserRole;
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, profile } = useAuth();

  // Usuário não autenticado → redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Usuário autenticado mas sem permissão → redirecionar para dashboard correto
  if (profile?.role !== allowedRole) {
    const correctDashboard = profile?.role === 'lider' 
      ? '/dashboard-lider' 
      : '/dashboard-liderado';
    return <Navigate to={correctDashboard} replace />;
  }

  // Usuário autenticado e com permissão correta
  return <>{children}</>;
}
