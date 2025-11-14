import { Home, Users, ClipboardCheck, LogOut, Settings, Mail, Briefcase, User as UserIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getCargoNameById } from "@/utils/cargoUtils";

const navItems = [
  { to: "/dashboard-lider", icon: Home, label: "Dashboard" },
  { to: "/team", icon: Users, label: "Time" },
  { to: "/evaluation", icon: ClipboardCheck, label: "Avaliação" },
];

const getInitials = (name: string) => {
  if (!name) return "U";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, profile } = useAuth();

  const handleLogout = () => {
    logout();
    toast({
      title: "Saindo...",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/");
  };
  
  const userName = profile?.nome || "Usuário";
  const userEmail = profile?.email || 'email@exemplo.com';
  const userRole = profile?.role === 'LIDER' ? 'Líder' : 'Liderado';
  const userCargo = profile?.id_cargo ? getCargoNameById(profile.id_cargo) : 'N/A';

  return (
    <aside className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-20 w-56">
      {/* Logo Section (Top) */}
      <div className="relative flex items-center justify-center h-16 border-b border-sidebar-border px-4">
        <img src={logo} alt="ORBITTA Logo" className="h-8" />
      </div>

      {/* Profile Block (New Top Position) */}
      <div className="p-4 border-b border-sidebar-border/50">
        <div className="flex flex-col items-center text-center mb-3">
            <Avatar className="w-16 h-16 mb-2">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                    {getInitials(userName)}
                </AvatarFallback>
            </Avatar>
            <p className="text-lg font-semibold text-sidebar-foreground truncate max-w-full">{userName}</p>
        </div>
        
        <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-sidebar-foreground/80">
                <UserIcon className="w-4 h-4 text-sidebar-foreground/60" />
                <span className="truncate">{userRole}</span>
            </div>
            <div className="flex items-center gap-2 text-sidebar-foreground/80">
                <Briefcase className="w-4 h-4 text-sidebar-foreground/60" />
                <span className="truncate">{userCargo}</span>
            </div>
            <div className="flex items-center gap-2 text-sidebar-foreground/80">
                <Mail className="w-4 h-4 text-sidebar-foreground/60" />
                <span className="truncate">{userEmail}</span>
            </div>
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 p-3 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard-lider"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Ícones principais em cinza claro (text-sidebar-foreground/60) */}
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-sidebar-foreground/60")} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section (Settings and Logout) - Profile Footer REMOVED */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-all duration-200",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )
          }
        >
          <Settings className="w-5 h-5 text-sidebar-foreground/60" />
          <span>Configurações</span>
        </NavLink>
        
        {/* Logout (Botão Laranja) */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg bg-transparent hover:bg-accent/20 transition-all duration-200 text-accent hover:text-accent-foreground"
        >
          <LogOut className="w-5 h-5 text-accent" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};