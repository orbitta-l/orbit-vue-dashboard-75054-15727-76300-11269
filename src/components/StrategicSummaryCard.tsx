import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface StrategicSummaryCardProps {
  summaryText: string;
}

export const StrategicSummaryCard: React.FC<StrategicSummaryCardProps> = ({ summaryText }) => {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-6 flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">Resumo Estratégico</h3>
          <p className="text-muted-foreground text-sm">
            {summaryText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};