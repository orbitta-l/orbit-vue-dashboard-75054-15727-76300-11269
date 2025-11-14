import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function SetNewPassword() {
  const navigate = useNavigate();
  const { profile, updateFirstLoginStatus, logout } = useAuth();
  const { toast } = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!profile?.id_usuario) {
      toast({
        variant: 'destructive',
        title: 'Erro de autenticação',
        description: 'Não foi possível identificar seu perfil. Por favor, faça login novamente.',
      });
      logout();
      navigate('/login', { replace: true });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Senha muito curta',
        description: 'A nova senha deve ter no mínimo 8 caracteres.',
      });
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Senhas não coincidem',
        description: 'A nova senha e a confirmação não correspondem.',
      });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Atualizar a senha no sistema de autenticação do Supabase
      const { error: updateAuthError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateAuthError) {
        throw updateAuthError;
      }

      // 2. Atualizar o status first_login na tabela public.usuario
      // Usamos o retorno para garantir que o perfil foi atualizado no contexto
      const { success: updateStatusSuccess, error: updateStatusError } = await updateFirstLoginStatus(profile.id_usuario);

      if (!updateStatusSuccess) {
        throw new Error(updateStatusError || 'Falha ao atualizar status de primeiro login.');
      }

      // 3. Feedback de sucesso e redirecionamento
      toast({
        title: 'Senha atualizada com sucesso!',
        description: 'Você será redirecionado para o seu dashboard.',
      });
      
      // Redireciona após o sucesso garantido
      navigate('/dashboard-liderado', { replace: true });

    } catch (error: any) {
      console.error('Erro ao definir nova senha:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao definir nova senha',
        description: error.message || 'Ocorreu um erro inesperado. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Definir Nova Senha</CardTitle>
          <CardDescription>
            Esta é a sua primeira vez acessando. Por favor, defina uma nova senha segura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="new-password">Nova Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Definir Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}