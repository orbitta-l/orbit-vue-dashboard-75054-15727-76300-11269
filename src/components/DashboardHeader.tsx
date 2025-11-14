import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

export function DashboardHeader() {
  const { profile } = useAuth();
  const userName = profile?.nome?.split(' ')[0] || 'Usuário';
  const greeting = getGreeting();
  const currentDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

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
      </div>

      {/* Data e Hora (Direita) */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
        <Calendar className="w-4 h-4 text-primary/80" />
        <p className="capitalize">
          {currentDate}
        </p>
      </div>
    </div>
  );
}