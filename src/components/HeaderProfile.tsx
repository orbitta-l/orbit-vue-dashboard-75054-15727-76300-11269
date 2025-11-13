import { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

const getInitials = (name: string) => {
  if (!name) return "U";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export function HeaderProfile() {
  const { profile } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentDate = format(currentTime, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const currentHour = format(currentTime, "HH:mm:ss");
  
  const userName = profile?.nome || "Usuário";
  const userRole = profile?.role === 'LIDER' ? 'Tech Lead' : 'Desenvolvedor';
  const userEmail = profile?.email || 'email@exemplo.com';

  return (
    <div className="flex justify-between items-start mb-8 border-b pb-4 border-border">
      {/* Left Side: Greeting and Profile Info */}
      <div className="flex items-center gap-4">
        <Avatar className="w-14 h-14 flex-shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h1 className="text-4xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-primary">
            {getGreeting()}, {userName}!
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0">
            <Badge variant="secondary" className="text-xs font-medium">{userRole}</Badge>
            <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="truncate">{userEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Date and Time */}
      <div className="text-right flex flex-col items-end pt-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Calendar className="w-4 h-4 text-accent" />
          <span>{currentDate}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground opacity-70 mt-1">
          <Clock className="w-3 h-3" />
          <span>{currentHour}</span>
        </div>
      </div>
    </div>
  );
}