import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.svg";

// Sem estrelas no login conforme requisito

// Painel esquerdo com branding
function LeftPanel({ title }: { title: React.ReactNode }) {
  return (
    <div className="flex-1 flex items-start justify-start p-12 z-10">
      <div className="max-w-md text-left">
        <h1
          className="text-5xl font-bold leading-tight mb-4"
          style={{
            background: "linear-gradient(to bottom, #EEF3FD 70%, #012873 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}

// Painel direito com formulário de login
function RightPanel() {
  const navigate = useNavigate();
  const { login, isAuthenticated, profile } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirecionar usuário já autenticado
  useEffect(() => {
    if (isAuthenticated && profile) {
      const dashboard = profile.role === 'LIDER' ? '/dashboard-lider' : '/dashboard-liderado';
      navigate(dashboard, { replace: true });
    }
  }, [isAuthenticated, profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para seu dashboard...",
        });
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

  return (
    <div className="flex-1 flex items-center justify-center p-6 z-10">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-[#1A2A46] mb-8 text-center">Entrar</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-sm text-[#6B7280] font-semibold mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={isLoading}
              className="w-full border-0 border-b-2 border-[#D1D5DB] rounded-none px-0 py-3 text-lg bg-transparent focus-visible:border-[#1A2A46] focus-visible:ring-0 transition-colors"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm text-[#6B7280] font-semibold mb-2 block">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full border-0 border-b-2 border-[#D1D5DB] rounded-none px-0 py-3 text-lg bg-transparent focus-visible:border-[#1A2A46] focus-visible:ring-0 transition-colors"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A2A46] hover:bg-[#111A29] text-white rounded-full py-6 text-base font-semibold transition-all disabled:opacity-50"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          {/* Credenciais de teste - apenas para desenvolvimento */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-xs text-gray-600 space-y-3">
            <div>
              <p className="font-semibold mb-1">Com dados:</p>
              <p>Líder: juli.lider@gmail.com / juli@123</p>
              <p>Liderado: tone.p@gmail.com / tone@123</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Sem dados (novos usuários):</p>
              <p>Líder: thais.lider@gmail.com / thais@123</p>
              <p>Liderado: ramon.p@gmail.com / ramon@123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  const slogan = (
    <>
      Conectando talentos em
      <br />
      uma única órbita
    </>
  );

  return (
    <main
      className="relative flex min-h-screen w-full"
      style={{
        background: 'url("/login-bg.svg") center/cover no-repeat, #090F25',
      }}
    >
      <LeftPanel title={slogan} />
      <RightPanel />
    </main>
  );
}