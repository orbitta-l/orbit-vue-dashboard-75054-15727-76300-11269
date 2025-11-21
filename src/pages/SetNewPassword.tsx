import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SetNewPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateFirstLoginStatus, loading: authLoading, session } = useAuth();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onBlur",
  });

  const watchedPassword = watch("newPassword");

  // Detecta fluxo de recuperação via hash ou query (type=recovery) e estabelece sessão com tokens do Supabase
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    // Supabase normalmente envia no hash, mas tratamos query-string como fallback
    const params = new URLSearchParams(hash ? hash.replace("#", "") : search.replace("?", ""));
    const type = params.get("type");
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (type === "recovery" && access_token && refresh_token) {
      setIsRecoveryMode(true);
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) {
            toast({
              variant: "destructive",
              title: "Link inválido ou expirado",
              description: "Solicite um novo link de recuperação.",
            });
          }
        })
        .finally(() => setSessionReady(true));
    } else {
      setSessionReady(true);
    }
  }, [toast]);

  // Evita redirecionar quem está em recuperação; só redireciona se já tiver senha definida
  useEffect(() => {
    if (!authLoading && profile && profile.first_login === false && !isRecoveryMode) {
      toast({
        title: "Acesso não necessário",
        description: "Sua senha já foi definida. Redirecionando para o dashboard.",
      });
      const dashboardPath = profile.role === "LIDER" ? "/dashboard-lider" : "/dashboard-liderado";
      navigate(dashboardPath, { replace: true });
    }
  }, [profile, authLoading, navigate, toast, isRecoveryMode]);

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);

    // Fluxo de recuperação via e-mail do Supabase
    if (isRecoveryMode) {
      try {
        const { error } = await supabase.auth.updateUser({ password: data.newPassword });
        if (error) throw error;
        setIsSuccess(true);
        setTimeout(() => navigate("/login", { replace: true }), 3000);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao redefinir senha",
          description: error.message || "Link inválido ou expirado. Solicite novamente.",
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Fluxo de primeiro acesso (usuário já autenticado)
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Sessão inválida",
        description: "Não foi possível identificar seu usuário. Por favor, faça login novamente.",
      });
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const authUid = session.user.id;

    try {
      const { success, error: flagError } = await updateFirstLoginStatus(authUid);
      if (!success) {
        throw new Error(flagError || "Não foi possível finalizar seu primeiro acesso. A senha não foi alterada.");
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: data.newPassword });
      if (updateError) {
        throw updateError;
      }

      setIsSuccess(true);
      setTimeout(() => navigate("/dashboard-liderado", { replace: true }), 3000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao definir nova senha",
        description: error.message || "Ocorreu um erro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!sessionReady) {
    return null;
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground">Senha Alterada com Sucesso!</h2>
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
            {isRecoveryMode
              ? "Você está redefinindo sua senha via link de recuperação."
              : "Crie uma nova senha segura para acessar sua conta."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="new-password">Nova Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Mínimo de 8 caracteres"
                  {...register("newPassword")}
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
              <PasswordStrengthIndicator password={watchedPassword} />
              {errors.newPassword && (
                <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                  {...register("confirmPassword")}
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
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Definir Senha e Acessar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
