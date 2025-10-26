import { useState, useEffect } from "react";
import { ArrowLeft, Target, Plus, Trash2, Save, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useNavigate } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { toast } from "@/hooks/use-toast";
import { technicalTemplates, type TechnicalCategoryTemplate } from "./EvaluationTemplates";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ESCALA_MIN,
  ESCALA_MAX,
  LIMIAR_MATURIDADE,
  calcularMediaPonderada,
  calcularNivelMaturidade,
  validarAutoavaliacao,
  validarPontuacao,
  type AvaliacaoCompleta,
  type PontuacaoAvaliacao,
  type RadarDataPoint
} from "@/types/mer";

import { useAuth } from "@/contexts/AuthContext";

const teamMembers = [
  { id: "1", name: "Ana Silva", role: "Estagiário", maturityLevel: "M2", initials: "AS" },
  { id: "2", name: "Pedro Santos", role: "Especialista I", maturityLevel: "M3", initials: "PS" },
  { id: "3", name: "Mariana Costa", role: "Senior", maturityLevel: "M4", initials: "MC" },
  { id: "4", name: "Roberto Lima", role: "Pleno", maturityLevel: "M3", initials: "RL" },
];

// ... (restante do código permanece igual até a parte de renderização)

export default function Evaluation() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { profile, liderados, addAvaliacao } = useAuth();

  const member = liderados.find((l) => l.id === memberId);

  // Guardas de rota
  useEffect(() => {
    if (!member) {
      toast({
        variant: "destructive",
        title: "Liderado não encontrado",
        description: "Selecione um liderado válido antes de avaliar.",
      });
      navigate("/team", { replace: true });
    }
  }, [member, navigate]);

  // Verifica se o liderado tem cargo definido (campo cargo_id)
  const [cargoDefinido, setCargoDefinido] = useState<boolean>(true);
  useEffect(() => {
    if (member && !member.cargo_id) {
      setCargoDefinido(false);
    }
  }, [member]);

  // Estado de carregamento do template (simulado)
  const [templateLoading, setTemplateLoading] = useState<boolean>(true);
  const [template, setTemplate] = useState<TechnicalCategoryTemplate | null>(null);

  useEffect(() => {
    // Simula fetch do template baseado no cargo_id
    if (member && member.cargo_id) {
      // Aqui você buscaria no Supabase; por enquanto usamos o primeiro template
      setTimeout(() => {
        setTemplate(technicalTemplates[0]);
        setTemplateLoading(false);
      }, 800);
    } else {
      setTemplateLoading(false);
    }
  }, [member]);

  // Se o cargo não está definido, mostra mensagem simples
  if (!cargoDefinido) {
    return (
      <div className="p-8">
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Defina o cargo do liderado</h2>
          <p className="text-muted-foreground mb-4">
            Antes de iniciar a avaliação, é necessário informar o cargo do colaborador.
          </p>
          {/* Aqui você poderia abrir um modal ou redirecionar para a página de edição do liderado */}
          <Button onClick={() => navigate(`/team/${memberId}`)} className="gap-2">
            <Edit className="w-4 h-4" />
            Editar Liderado
          </Button>
        </Card>
      </div>
    );
  }

  // Enquanto o template está carregando, exibe skeleton
  if (templateLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Se chegou aqui, temos um member válido e um template carregado
  // O restante do código original (estado de scores, radar, etc.) permanece inalterado
  // ... (código original permanece, apenas removendo a definição duplicada de member)

  // ... (todo o restante do componente permanece como antes, usando memberId etc.)

  // No final, ao salvar a avaliação, atualizamos o contexto:
  const handleSaveEvaluation = () => {
    // ... (cálculos existentes)

    // Cria objeto de avaliação simplificado para o contexto
    const novaAvaliacao = {
      id: `av-${Date.now()}`,
      id_lider: profile?.id ?? '',
      id_liderado: memberId ?? '',
      eixo_x: eixoX,
      eixo_y: eixoY,
      nivel: nivel_maturidade,
      data: new Date().toISOString(),
    };

    addAvaliacao(novaAvaliacao);

    // ... (toast e navegação existentes)
  };

  // ... (restante do JSX original permanece)
}