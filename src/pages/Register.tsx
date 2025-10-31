import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { SexoTipo } from "@/types/mer";

const schema = z.object({
  nome: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E‑mail inválido"),
  cargo_id: z.string().min(1, "Selecione um cargo"),
  sexo: z.enum(["FEMININO", "MASCULINO", "NAO_BINARIO", "NAO_INFORMADO"]),
  data_nascimento: z.string().min(1, "Data de nascimento é obrigatória").refine((val) => {
    const birthDate = new Date(val);
    const today = new Date();
    // Adjust for timezone offset to prevent future date errors
    birthDate.setMinutes(birthDate.getMinutes() + birthDate.getTimezoneOffset());
    if (birthDate > today) return false;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 14;
  }, "A data não pode ser futura e a idade mínima é 14 anos."),
});

export default function Register() {
  const navigate = useNavigate();
  const { addLiderado } = useAuth();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cargo_id: "",
    sexo: "NAO_INFORMADO" as SexoTipo,
    data_nascimento: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "Verifique os campos destacados.",
      });
      return;
    }

    const novoLiderado = {
      id_liderado: `lid-${Date.now()}`, // Corrigido para id_liderado
      nome_liderado: form.nome, // Corrigido para nome_liderado
      email: form.email,
      cargo: form.cargo_id, // Corrigido para cargo (nome do cargo)
      cargo_id: form.cargo_id, // Mantido para consistência
      sexo: form.sexo,
      data_nascimento: form.data_nascimento,
      lider_id: "lider-001", // Mockado, assumindo um líder padrão
    };

    addLiderado(novoLiderado);
    toast({
      title: "Liderado adicionado",
      description: `${form.nome} foi incluído na sua equipe.`,
    });
    navigate("/team");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <Card className="w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Adicionar Liderado</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              placeholder="Ex.: João da Silva"
            />
            {errors.nome && <p className="text-sm text-destructive mt-1">{errors.nome}</p>}
          </div>

          <div>
            <Label htmlFor="email">E‑mail</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="exemplo@empresa.com"
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="cargo">Cargo</Label>
            <Select value={form.cargo_id} onValueChange={(v) => handleChange("cargo_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estagiario">Estagiário</SelectItem>
                <SelectItem value="junior">Júnior</SelectItem>
                <SelectItem value="pleno">Pleno</SelectItem>
                <SelectItem value="senior">Sênior</SelectItem>
                <SelectItem value="especialista">Especialista</SelectItem>
              </SelectContent>
            </Select>
            {errors.cargo_id && <p className="text-sm text-destructive mt-1">{errors.cargo_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sexo">Sexo</Label>
              <Select value={form.sexo} onValueChange={(v) => handleChange("sexo", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FEMININO">Feminino</SelectItem>
                  <SelectItem value="MASCULINO">Masculino</SelectItem>
                  <SelectItem value="NAO_BINARIO">Não Binário</SelectItem>
                  <SelectItem value="NAO_INFORMADO">Não Informado</SelectItem>
                </SelectContent>
              </Select>
              {errors.sexo && <p className="text-sm text-destructive mt-1">{errors.sexo}</p>}
            </div>

            <div>
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                type="date"
                value={form.data_nascimento}
                onChange={(e) => handleChange("data_nascimento", e.target.value)}
              />
              {errors.data_nascimento && (
                <p className="text-sm text-destructive mt-1">{errors.data_nascimento}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">
            Salvar Liderado
          </Button>
        </form>
      </Card>
    </div>
  );
}