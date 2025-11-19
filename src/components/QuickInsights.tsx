import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, TrendingDown, BarChart } from "lucide-react";
import { NivelMaturidade } from "@/types/mer";

interface QuickInsightsProps {
  maturity: NivelMaturidade | 'N/A';
  behavioralAnalysis: string;
  strength: string | null;
  improvementArea: string | null;
}

const InsightItem: React.FC<{ icon: React.ElementType; title: string; value: React.ReactNode }> = ({ icon: Icon, title, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

export const QuickInsights: React.FC<QuickInsightsProps> = ({ maturity, behavioralAnalysis, strength, improvementArea }) => {
  return (
    <Card>
      <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightItem 
          icon={Target}
          title="Seu Nível de Maturidade"
          value={<Badge variant="default" className="text-base">{maturity}</Badge>}
        />
        <InsightItem 
          icon={BarChart}
          title="Desempenho Comportamental"
          value={behavioralAnalysis}
        />
        {strength && (
          <InsightItem 
            icon={TrendingUp}
            title="Seu Maior Ponto Forte"
            value={strength}
          />
        )}
        {improvementArea && (
          <InsightItem 
            icon={TrendingDown}
            title="Principal Ponto de Melhoria"
            value={improvementArea}
          />
        )}
      </CardContent>
    </Card>
  );
};