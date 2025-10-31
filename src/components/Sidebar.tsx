import { Home, Users, ClipboardCheck, LogOut, Settings } from "lucide-react"; // Remove Mail, Briefcase
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { to: "/dashboard-lider", icon: Home, label: "Dashboard" },
  { to: "/team", icon: Users, label: "Time" },
  { to: "/evaluation", icon: ClipboardCheck, label: "Avaliação" },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast({
      title: "Saindo...",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/");
  };
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-20 w-64">
      {/* Logo Section */}
      <div className="relative flex items-center justify-center h-16 border-b border-sidebar-border transition-all duration-300 px-6">
        <img src={logo} alt="ORBITTA Logo" className="h-8 transition-all duration-300" />
        {/* Botão de recolher removido */}
      </div>

      {/* Profile Section */}
      <div className="p-4 border-b border-sidebar-border transition-all duration-300 py-4 px-4">
        <div className="flex flex-col items-center p-2 rounded-lg transition-all duration-300 hover:bg-white/5">
          <Avatar className="mb-2 w-16 h-16">
            {/* Se houver avatar_url no profile, usar <AvatarImage src={profile.avatar_url} /> */}
            <AvatarFallback className="bg-accent text-accent-foreground font-semibold text-lg">
              {profile ? getInitials(profile.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 text-center transition-opacity duration-300">
            <p className="text-base font-medium text-sidebar-foreground truncate">
              {profile?.name || 'Usuário'}
            </p>
            <p className="text-sm text-sidebar-foreground/70 truncate">
              {profile?.role === 'lider' ? 'Tech Lead' : 'Desenvolvedor'}
            </p>
            <p className="text-sm text-sidebar-foreground/70 truncate">
              {profile?.email || 'email@exemplo.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard-lider"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-5 h-5", !isActive && "dark:text-accent")} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Navigation Items (Settings and Logout) */}
      <div className="p-4 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 mb-1",
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-sidebar-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Settings className={cn("w-5 h-5", !isActive && "dark:text-accent")} />
              <span>Configurações</span>
            </>
          )}
        </NavLink>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg bg-transparent hover:bg-accent/20 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-accent" />
          <span className="text-accent">Sair</span>
        </button>
      </div>
    </aside>
  );
};