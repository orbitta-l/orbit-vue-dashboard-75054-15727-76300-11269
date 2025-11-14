import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground">
        {greeting}, {userName}
      </h1>
      <p className="text-muted-foreground text-sm capitalize">
        {currentDate}
      </p>
    </div>
  );
}