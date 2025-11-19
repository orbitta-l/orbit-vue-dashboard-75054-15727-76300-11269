import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LeftPanel from "@/components/login/LeftPanel";
import { supabase } from "@/lib/supabaseClient"; // Importando o cliente Supabase
import "./LoginPage.css";

// === Fundo animado de estrelas (sem alterações) ===
function StarsBackground() {
  const [stars, setStars] = useState<
    { id: number; top: number; left: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 15; i++) {
      newStars.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: -Math.random() * 3,
        duration: 1 + Math.random() * 2,
      });
    }
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animation: `shoot ${star.duration}s linear ${star.delay}s infinite`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]" />
        </div>
      ))}

      <style>{`
        @keyframes shoot {
          0% { transform: translate(0, 0); opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { transform: translate(-300px, -300px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// === Painel direito com formulário de login e redefinição de senha ===
function RightPanel() {
  const navigate = useNavigate();
  const { login, profile } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'login' | 'reset'>('login');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { success } = await login(email, password);
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para seu dashboard...",
        });
        // O redirecionamento é tratado pelo AuthContext
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: "Email ou senha incorretos. Tente novamente.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao tentar fazer login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetRequest = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/set-new-password`,
      });

      if (error) throw error;

      toast({
        title: "Verifique seu e-mail",
        description: "Se uma conta com este e-mail existir, um link para redefinição de senha foi enviado.",
      });
      setView('login'); // Volta para a tela de login
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao solicitar redefinição",
        description: error.message || "Não foi possível processar sua solicitação.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="right-panel z-10">
      <div className="form-container bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8">
        {view === 'login' ? (
          <>
            <h2 className="text-2xl font-bold text-[#1A2A46] mb-6 text-center">
              Acessar plataforma
            </h2>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu.email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="w-[320px]" />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="w-[320px]" />
              </div>
              <div className="text-right">
                <button type="button" onClick={() => setView('reset')} className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Esqueceu sua senha?
                </button>
              </div>
              <Button type="submit" className="w-full bg-[#1A2A46] hover:bg-[#111A29] text-white rounded-full py-3 font-semibold transition-all" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#1A2A46] mb-2 text-center">
              Redefinir Senha
            </h2>
            <p className="text-center text-muted-foreground text-sm mb-6">
              Digite seu e-mail para receber o link de redefinição.
            </p>
            <form onSubmit={handlePasswordResetRequest} className="space-y-5">
              <div>
                <Label htmlFor="reset-email">Email</Label>
                <Input id="reset-email" type="email" placeholder="seu.email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="w-[320px]" />
              </div>
              <Button type="submit" className="w-full bg-[#1A2A46] hover:bg-[#111A29] text-white rounded-full py-3 font-semibold transition-all" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Link de Redefinição"}
              </Button>
              <Button variant="link" type="button" onClick={() => setView('login')} className="w-full text-gray-600">
                Voltar para o login
              </Button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

// === Página completa (sem alterações) ===
export default function LoginPage() {
  const slogan = (
    <>
      Conectando talentos em
      <br />
      uma única órbita
    </>
  );

  return (
    <main
      className="login-page relative flex min-h-screen w-full overflow-hidden"
      style={{
        background: 'url("/Login.svg") center/cover no-repeat',
      }}
    >
      <StarsBackground />
      <LeftPanel title={slogan} />
      <img className="float absolute" src="/Rocket.svg" alt="Foguete" />
      <RightPanel />
    </main>
  );
}