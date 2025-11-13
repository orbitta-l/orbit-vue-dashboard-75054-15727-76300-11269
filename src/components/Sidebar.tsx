import { Home, Users, ClipboardCheck, LogOut, Settings } from "lucide-react";
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
    <aside className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-20 w-56">
      {/* Logo Section (Top) */}
      <div className="relative flex items-center justify-center h-16 border-b border-sidebar-border px-4">
        <img src={logo} alt="ORBITTA Logo" className="h-8" />
      </div>

      {/* Main Navigation Items (Vertically Centered) */}
      <div className="flex-1 flex flex-col justify-center p-3 overflow-y-auto">
        <nav className="space-y-1 mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard-lider"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-48",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-accent")} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section (Settings, Logout, Profile Info) */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
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
        
        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg bg-transparent hover:bg-sidebar-accent transition-all duration-200 text-sidebar-foreground/60 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="w-5 h-5 text-sidebar-foreground/60" />
          <span>Sair</span>
        </button>

        {/* Profile Footer (Email only) */}
        <div className="flex items-center gap-3 p-3 border-t border-sidebar-border pt-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {getInitials(profile?.nome || "U")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {profile?.email || "usuario@orbitta.com"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};