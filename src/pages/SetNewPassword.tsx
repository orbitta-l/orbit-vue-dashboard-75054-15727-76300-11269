import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function SetNewPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // O Supabase Auth Helper trata o evento 'PASSWORD_RECOVERY'
    // e cria uma sessão temporária. Verificamos se isso aconteceu.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setHasToken(true);
      }
    });

    // Verifica se o token já está na URL ao carregar a página
    if (window.location.hash.includes('access_token')) {
      setHasToken(true);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!hasToken) {
      toast({
        variant: 'destructive',
        title: 'Token inválido ou expirado',
        description: 'Por favor, solicite um novo link de redefinição de senha.',
      });
      setIsLoading(false);
      navigate('/login');
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
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Senha atualizada com sucesso!',
        description: 'Você já pode fazer login com sua nova senha.',
      });
      navigate('/login', { replace: true });

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
            Crie uma nova senha segura para acessar sua conta.
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
              {isLoading ? 'Salvando...' : 'Definir Senha e Acessar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}