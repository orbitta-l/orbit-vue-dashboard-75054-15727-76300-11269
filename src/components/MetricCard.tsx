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
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default">
      <CardHeader className="flex flex-col items-center justify-center space-y-1 p-4 pb-2">
        <div className="text-muted-foreground mb-1">{icon}</div>
        <CardTitle className="text-sm font-medium text-muted-foreground text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-center">
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}