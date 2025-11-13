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
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default text-center">
      <CardHeader className="flex flex-col items-center justify-center space-y-1 p-4 pb-1">
        <div className="text-primary mb-1">{icon}</div>
        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}