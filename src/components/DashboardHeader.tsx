import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

export function DashboardHeader() {
  const { profile } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const userName = profile?.nome?.split(' ')[0] || 'Usuário';
  const greeting = getGreeting();
  const currentDate = format(currentTime, "EEEE, d 'de' MMMM", { locale: ptBR });
  const formattedTime = format(currentTime, "HH:mm:ss");

  return (
    <div className="mb-8 flex justify-between items-start">
      {/* Título Principal (Esquerda) */}
      <div>
        <h1 className={cn(
          "text-3xl font-bold",
          "bg-gradient-to-r from-primary-dark to-primary", // Gradiente mais escuro
          "bg-clip-text text-transparent"
        )}>
          {greeting}, {userName}
        </h1>
        {/* Novo texto pequeno */}
        <p className="text-sm text-muted-foreground mt-0.5">
          Visão geral do desempenho e maturidade da sua equipe.
        </p>
      </div>

      {/* Data e Hora (Direita) */}
      <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground pt-1">
        <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary/80" />
            <p className="capitalize">
              {currentDate}
            </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
            <Clock className="w-3 h-3 text-primary/60" />
            <p>
              {formattedTime}
            </p>
        </div>
      </div>
    </div>
  );
}