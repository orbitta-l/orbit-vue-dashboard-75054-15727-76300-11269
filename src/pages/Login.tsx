import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LeftPanel from "@/components/login/LeftPanel";
import "./LoginPage.css";

// === Fundo animado de estrelas ===
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

// === Painel direito com formulário de login ===
function RightPanel() {
  const navigate = useNavigate();
  const { login, profile } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redireciona se o perfil for carregado (o que implica autenticação)
  useEffect(() => {
    if (profile) {
      const dashboard =
        profile.role === "LIDER"
          ? "/dashboard-lider"
          : "/dashboard-liderado";
      navigate(dashboard, { replace: true });
    }
  }, [profile, navigate]);

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
        // O useEffect cuidará do redirecionamento quando o perfil for carregado
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
    <section className="right-panel z-10">
      <div className="form-container bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-[#1A2A46] mb-6 text-center">
          Acessar plataforma
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-[320px]" // 🔹 caixa mais larga
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-[320px]" // 🔹 caixa mais larga
            />
          </div>

          <a href="#" className="forgot-password text-sm text-gray-600">
            Esqueceu sua senha?
          </a>

          <Button
            type="submit"
            className="w-full bg-[#1A2A46] hover:bg-[#111A29] text-white rounded-full py-3 font-semibold transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </section>
  );
}

// === Página completa ===
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