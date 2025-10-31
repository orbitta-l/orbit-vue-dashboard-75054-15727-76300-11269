import { Home, Users, ClipboardCheck, LogOut, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Import Avatar and AvatarFallback

const navItems = [
  { to: "/dashboard-lider", icon: Home, label: "Dashboard" },
  { to: "/team", icon: Users, label: "Time" },
  { to: "/evaluation", icon: ClipboardCheck, label: "Avaliação" },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-20",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo Section */}
      <div className={cn(
        "relative flex items-center justify-center h-16 border-b border-sidebar-border transition-all duration-300",
        isCollapsed ? "px-2" : "px-6"
      )}>
        <img src={logo} alt="ORBITTA Logo" className={cn("h-8 transition-all duration-300", isCollapsed && "h-6")} />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-primary transition-colors border border-sidebar-border"
          aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Profile Section */}
      <div className={cn(
        "p-4 border-b border-sidebar-border transition-all duration-300",
        isCollapsed ? "py-3 px-2" : "py-4 px-4"
      )}>
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50 transition-all duration-300",
          isCollapsed ? "justify-center" : ""
        )}>
          <Avatar className={cn("w-10 h-10", isCollapsed && "w-8 h-8")}>
            {/* Se houver avatar_url no profile, usar <AvatarImage src={profile.avatar_url} /> */}
            <AvatarFallback className="bg-accent text-accent-foreground font-semibold text-sm">
              {profile ? getInitials(profile.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 transition-opacity duration-300">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {profile?.name || 'Usuário'}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {profile?.role === 'lider' ? 'Tech Lead' : 'Desenvolvedor'}
              </p>
            </div>
          )}
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
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  isCollapsed ? "justify-center px-2" : ""
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-5 h-5", !isActive && "dark:text-accent")} />
                  {!isCollapsed && <span>{item.label}</span>}
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
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground", // Mais opaco
              isCollapsed ? "justify-center px-2" : ""
            )
          }
        >
          {({ isActive }) => (
            <>
              <Settings className={cn("w-5 h-5", !isActive && "dark:text-accent")} />
              {!isCollapsed && <span>Configurações</span>}
            </>
          )}
        </NavLink>
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-4 py-3 w-full rounded-lg bg-accent text-accent-foreground hover:bg-accent/80 transition-all duration-200", // Laranja de destaque
            isCollapsed ? "justify-center px-2" : ""
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
};