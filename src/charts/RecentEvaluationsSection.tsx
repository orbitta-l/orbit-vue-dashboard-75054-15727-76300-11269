import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ClipboardCheck, Plus } from "lucide-react"; // Importando Plus
import { Button } from "@/components/ui/button"; // Importando Button
import { useNavigate } from "react-router-dom"; // Importando useNavigate

interface RecentEvaluation {
  evaluationId: string;
  lideradoId: string; // Adicionado o ID do liderado
  nome_liderado: string;
  data_avaliacao: Date;
  avatar_url?: string | null;
}

interface RecentEvaluationsSectionProps {
  evaluations: RecentEvaluation[];
  onEvaluationClick?: (lideradoId: string) => void; // Agora espera o ID do liderado
  empty?: boolean;
}

export default function RecentEvaluationsSection({
  evaluations,
  onEvaluationClick,
  empty = false,
}: RecentEvaluationsSectionProps) {
  const navigate = useNavigate();

  const handleNewEvaluation = () => {
    navigate("/evaluation");
  };

  if (empty) {
    return (
      <Card className="p-6 bg-muted/20 h-full flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          Avaliações Recentes
        </h3>
        <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-muted-foreground">
            Aguardando avaliações para exibir histórico.
            </p>
        </div>
        <Button onClick={handleNewEvaluation} variant="secondary" className="mt-4 w-full gap-2">
          <Plus className="w-4 h-4" />
          Nova Avaliação
        </Button>
      </Card>
    );
  }

  const hasData = evaluations.length > 0;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
        <ClipboardCheck className="w-5 h-5 text-primary" />
        Avaliações Recentes
      </h3>

      <div className="flex-1 overflow-y-auto space-y-3"> {/* Reduzido space-y-4 para space-y-3 */}
        {!hasData ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/50"> {/* Reduzido gap-4 para gap-3 e p-4 para p-3 */}
                <Skeleton className="w-10 h-10 rounded-full" /> {/* Reduzido w-12 h-12 para w-10 h-10 */}
                <div className="flex-1 space-y-1"> {/* Reduzido space-y-2 para space-y-1 */}
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
            <p className="text-center text-sm text-muted-foreground mt-4">
              Sem avaliações recentes
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {evaluations.slice(0, 3).map((evaluation) => (
              <div
                key={evaluation.evaluationId}
                onClick={() => onEvaluationClick?.(evaluation.lideradoId)}
                className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-10 h-10"> {/* Reduzido w-12 h-12 para w-10 h-10 */}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm"> {/* Reduzido text-base para text-sm */}
                      {getInitials(evaluation.nome_liderado)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate"> {/* Reduzido text-base para text-sm */}
                    {evaluation.nome_liderado}
                  </p>
                  <p className="text-xs text-muted-foreground"> {/* Reduzido text-sm para text-xs */}
                    Avaliado {formatDate(evaluation.data_avaliacao)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Botão Nova Avaliação */}
      <Button onClick={handleNewEvaluation} variant="secondary" className="mt-4 w-full gap-2 flex-shrink-0">
        <Plus className="w-4 h-4" />
        Nova Avaliação
      </Button>
    </Card>
  );
}