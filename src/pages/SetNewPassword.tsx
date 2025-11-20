import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import logo from '@/assets/logo.png';
import { useAuth } from '@/context/AuthContext';

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SetNewPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateFirstLoginStatus } = useAuth();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onBlur',
  });

  const watchedPassword = watch('newPassword');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setHasToken(true);
      }
    });
    if (window.location.hash.includes('access_token')) {
      setHasToken(true);
    }
    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    if (!hasToken) {
      toast({
        variant: 'destructive',
        title: 'Token inválido ou expirado',
        description: 'Por favor, solicite um novo link de redefinição.',
      });
      setIsLoading(false);
      navigate('/login');
      return;
    }

    if (!profile?.id_usuario) {
      toast({
        variant: 'destructive',
        title: 'Sessão inválida',
        description: 'Não foi possível identificar seu perfil. Por favor, faça login novamente.',
      });
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: data.newPassword });
      if (updateError) throw updateError;

      const { success, error: flagError } = await updateFirstLoginStatus(profile.id_usuario);
      if (!success) {
        console.error("Failed to update first_login status:", flagError);
        toast({
          variant: 'destructive',
          title: 'Aviso Importante',
          description: 'Sua senha foi alterada, mas houve um problema ao finalizar seu primeiro acesso. Por favor, contate o suporte se o problema persistir.',
        });
      }

      setIsSuccess(true);
      // **CORREÇÃO:** Redireciona para o dashboard do liderado, não para o login.
      setTimeout(() => navigate('/dashboard-liderado', { replace: true }), 3000);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao definir nova senha',
        description: error.message || 'Ocorreu um erro. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground">Senha Alterada com Sucesso!</h2>
            {/* **MELHORIA DE UX:** Mensagem clara sobre o próximo passo. */}
            <p className="text-muted-foreground mt-2">
              Tudo pronto! Estamos preparando seu dashboard e redirecionando você em instantes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src={logo} alt="Orbitta Logo" className="w-24 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Definir Nova Senha</CardTitle>
          <CardDescription>
            Crie uma nova senha segura para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="new-password">Nova Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Mínimo de 8 caracteres"
                  {...register('newPassword')}
                  disabled={isLoading}
                />
                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </Button>
              </div>
              <PasswordStrengthIndicator password={watchedPassword} />
              {errors.newPassword && <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>}
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua nova senha"
                  {...register('confirmPassword')}
                  disabled={isLoading}
                />
                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>}
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