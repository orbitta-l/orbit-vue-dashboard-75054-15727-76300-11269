import { Home, Users, ClipboardCheck, LogOut, Rocket, Settings } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/team", icon: Users, label: "Liderados" },
  { to: "/evaluation", icon: ClipboardCheck, label: "Avaliação" },
  { to: "/settings", icon: Settings, label: "Configurações" },
];

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast({
      title: "Saindo...",
      description: "Você foi desconectado com sucesso.",
    });
    // Aqui você adicionaria a lógica de logout real quando implementar autenticação
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Rocket className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">ORBITTA</h1>
            <p className="text-xs text-sidebar-foreground/70">Dashboard do Líder</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <span className="text-sm font-semibold text-accent-foreground">MR</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Marina Rodriguez</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">Tech Lead</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
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

      <div className="p-4 border-t border-sidebar-border">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200"
        >
          <LogOut className="w-5 h-5 dark:text-accent" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};
