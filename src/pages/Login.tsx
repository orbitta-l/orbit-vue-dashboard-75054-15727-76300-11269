import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";

// Stars background animation component
function StarsBackground() {
  const [stars, setStars] = useState<Array<{
    id: number;
    top: number;
    left: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    const generateStars = () => {
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
    };

    generateStars();
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-shoot"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]" />
        </div>
      ))}

      <style>{`
        @keyframes shoot {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(-300px, -300px);
            opacity: 0;
          }
        }
        .animate-shoot {
          animation: shoot linear infinite;
        }
      `}</style>
    </div>
  );
}

// Floating rocket component
function FloatingRocket() {
  return (
    <div className="absolute bottom-0 left-1/4 hidden lg:block pointer-events-none animate-float">
      <div className="text-6xl opacity-30">🚀</div>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Left panel with branding
function LeftPanel({ title }: { title: React.ReactNode }) {
  return (
    <div className="flex-1 flex items-start justify-start p-12 z-10">
      <div className="max-w-md text-left">
        <img src={logo} alt="ORBITTA" className="h-12 mb-8" />
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

// Right panel with login form
function RightPanel() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de autenticação real
    // Por enquanto, apenas redireciona para o dashboard
    navigate("/");
  };

  const handleGoogleLogin = () => {
    // TODO: Implementar login com Google
    console.log("Google login");
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
              className="w-full border-0 border-b-2 border-[#D1D5DB] rounded-none px-0 py-3 text-lg bg-transparent focus-visible:border-[#1A2A46] focus-visible:ring-0 transition-colors"
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-[#6B7280] hover:text-[#1A2A46] transition-colors">
              Esqueceu a senha?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1A2A46] hover:bg-[#111A29] text-white rounded-full py-6 text-base font-semibold transition-all"
          >
            Entrar
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D1D5DB]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#A0AEC0]">ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full border-2 border-[#D1D5DB] bg-transparent hover:bg-[#F0F2F5] text-[#6B7280] hover:text-[#333] rounded-full py-6 text-base font-semibold transition-all"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </Button>

          <p className="text-center text-sm text-[#6B7280] mt-6">
            Não tem uma conta?{" "}
            <a href="#" className="text-[#1A2A46] font-semibold hover:underline">
              Criar conta
            </a>
          </p>
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
        background: 'url("/login.svg") center/cover no-repeat, #090F25',
      }}
    >
      <StarsBackground />
      <LeftPanel title={slogan} />
      <FloatingRocket />
      <RightPanel />
    </main>
  );
}
