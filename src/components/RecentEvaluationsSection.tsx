import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentEvaluation {
  id: string;
  nome_liderado: string;
  data_avaliacao: Date;
  avatar_url?: string | null;
}

interface RecentEvaluationsSectionProps {
  evaluations: RecentEvaluation[];
  onEvaluationClick?: (id: string) => void;
}

export default function RecentEvaluationsSection({
  evaluations,
  onEvaluationClick,
}: RecentEvaluationsSectionProps) {
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
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Avaliações Recentes</h3>

      {!hasData ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evaluations.slice(0, 3).map((evaluation) => (
            <div
              key={evaluation.id}
              onClick={() => onEvaluationClick?.(evaluation.id)}
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                  {getInitials(evaluation.nome_liderado)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {evaluation.nome_liderado}
                </p>
                <p className="text-sm text-muted-foreground">
                  Avaliado {formatDate(evaluation.data_avaliacao)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
