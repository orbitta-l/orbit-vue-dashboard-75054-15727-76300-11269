import { useState, useEffect } from "react";
import { Settings as SettingsIcon, User, Shield, Palette, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  // Dados mockados - Identidade e Papel
  const mockUser = {
    email: "carlos.silva@orbitta.com",
    role: "LÍDER" as "LÍDER" | "LIDERADO",
  };

  // Estado para alteração de senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estado para tema (localStorage)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Carregar preferência de tema ao montar
  useEffect(() => {
    const savedTheme = localStorage.getItem("orbitta_theme_preference");
    const prefersDark = savedTheme === "dark";
    setIsDarkMode(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Alternar tema
  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("orbitta_theme_preference", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("orbitta_theme_preference", "light");
    }
    
    toast({
      title: "Tema salvo",
      description: `Modo ${checked ? "Escuro" : "Claro"} ativado`,
      duration: 2000,
    });
  };

  // Validar e alterar senha
  const handlePasswordChange = () => {
    // Validações frontend
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "A nova senha e a confirmação não correspondem",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Erro",
        description: "A senha deve ter no mínimo 8 caracteres",
        variant: "destructive",
      });
      return;
    }

    // Simulação de sucesso (mockado)
    toast({
      title: "Senha alterada!",
      description: "Sua senha foi atualizada com sucesso",
    });

    // Limpar campos
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie sua conta, segurança e preferências da aplicação.
        </p>
      </div>

      {/* I. Identidade e Papel */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Identidade e Papel
          </h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">E-mail</Label>
            <p className="text-base font-medium text-foreground mt-1">
              {mockUser.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Identidade primária (não editável)
            </p>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Papel Atual</Label>
            <div className="mt-2">
              <Badge 
                variant={mockUser.role === "LÍDER" ? "default" : "secondary"}
                className="text-sm font-semibold px-3 py-1"
              >
                {mockUser.role}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Seu nível de acesso no sistema
            </p>
          </div>
        </div>
      </Card>

      {/* II. Segurança da Conta */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Segurança da Conta
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="current-password">Senha Atual</Label>
            <div className="relative mt-2">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="new-password">Nova Senha</Label>
            <div className="relative mt-2">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha (mín. 8 caracteres)"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <div className="relative mt-2">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button onClick={handlePasswordChange} className="mt-4">
            Alterar Senha
          </Button>
        </div>
      </Card>

      {/* III. Preferências da Aplicação */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Preferências da Aplicação
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium text-foreground">
              Tema da Interface
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Alternar entre modo claro e escuro
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {isDarkMode ? "Escuro" : "Claro"}
            </span>
            <Switch
              checked={isDarkMode}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
