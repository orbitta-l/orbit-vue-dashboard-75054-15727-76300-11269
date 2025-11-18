import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}

export function MetricCard({ title, value, icon, description }: MetricCardProps) {
  return (
    <Card className="transition-all duration-500 hover:shadow-xl hover:-translate-y-1 cursor-default text-center">
      <CardHeader className="flex flex-col items-center justify-center space-y-1 p-3 pb-0"> {/* Reduzido p-4 para p-3 e pb-1 para pb-0 */}
        <div className="text-primary mb-1 transition-transform duration-300 group-hover:scale-110">{icon}</div>
        <CardTitle className="text-xs text-muted-foreground flex items-center justify-center gap-2"> {/* Reduzido text-sm para text-xs */}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-1"> {/* Ajustado pt-0 para pt-1 */}
        <div className="text-xl font-bold">{value}</div> {/* Reduzido text-2xl para text-xl */}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}