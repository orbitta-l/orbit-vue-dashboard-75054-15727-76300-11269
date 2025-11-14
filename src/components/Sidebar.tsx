import { Home, Users, ClipboardCheck, LogOut, Settings, Mail, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";

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

  return (
    <aside className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-20 w-56">
      {/* Logo Section (Top) */}
      <div className="relative flex items-center justify-center h-16 border-b border-sidebar-border px-4">
        <img src={logo} alt="ORBITTA Logo" className="h-8" />
      </div>

      {/* Main Navigation Items (Aligned to Top) */}
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

      {/* Bottom Section (Settings and Logout) */}
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
        
        {/* Profile Footer */}
        <div className="pt-3 mt-3 border-t border-sidebar-border/50">
            <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {getInitials(userName)}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">{userRole}</p>
                </div>
            </div>
        </div>
      </div>
    </aside>
  );
};