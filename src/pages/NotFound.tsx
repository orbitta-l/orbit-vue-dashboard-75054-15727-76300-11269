import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    toast({
      variant: "destructive",
      title: "Página não encontrada",
      description: `A rota ${location.pathname} não existe.`,
    });
    // Redireciona após 3 segundos
    const timer = setTimeout(() => navigate("/"), 3000);
    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Página não encontrada</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Voltar ao início
        </a>
      </div>
    </div>
  );
};

export default NotFound;