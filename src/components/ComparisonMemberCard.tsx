import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LideradoDashboard } from '@/types/mer';

interface RadarDataPoint {
  subject: string;
  atual: number;
  ideal: number;
}

interface ComparisonMemberCardProps {
  member: LideradoDashboard;
  radarData: RadarDataPoint[];
  color: string;
}

const getInitials = (name: string) => name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "";

export const ComparisonMemberCard: React.FC<ComparisonMemberCardProps> = ({ member, radarData, color }) => {
  const analysis = useMemo(() => {
    if (!radarData || radarData.length === 0) {
      return { strengths: [], gaps: [] };
    }

    const evaluated = radarData
      .map(item => ({
        name: item.subject,
        gap: item.ideal - item.atual,
      }))
      .sort((a, b) => a.gap - b.gap);

    const strengths = evaluated.slice(0, 2);
    const gaps = evaluated.slice(-2).reverse();

    return { strengths, gaps };
  }, [radarData]);

  return (
    <Card className="flex flex-col h-full" style={{ borderTop: `4px solid ${color}` }}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-muted text-foreground font-semibold text-lg">
              {getInitials(member.nome)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{member.nome}</CardTitle>
            <CardDescription>{member.cargo_nome}</CardDescription>
          </div>
        </div>
        <div className="mt-2">
          <Badge variant="secondary">
            Maturidade: {member.ultima_avaliacao?.maturidade_quadrante || 'N/A'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {radarData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 4]} tickCount={5} />
              <Radar 
                name="Perfil Ideal" 
                dataKey="ideal" 
                stroke="hsl(var(--accent))" 
                fill="hsl(var(--accent))" 
                fillOpacity={0.2} 
              />
              <Radar 
                name="Perfil Atual" 
                dataKey="atual" 
                stroke={color}
                fill={color}
                fillOpacity={0.6} 
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconSize={10} />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground text-center p-4">
              Sem dados de avaliação para a seleção atual.
            </p>
          </div>
        )}
      </CardContent>
      {analysis.strengths.length > 0 && (
        <CardFooter className="flex flex-col items-start gap-4 pt-4 border-t">
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 text-green-600">
              <TrendingUp className="w-4 h-4" /> Maiores Forças
            </h4>
            <ul className="mt-1 list-disc list-inside text-xs text-muted-foreground">
              {analysis.strengths.map(item => <li key={item.name}>{item.name}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 text-amber-600">
              <TrendingDown className="w-4 h-4" /> Maiores Gaps
            </h4>
            <ul className="mt-1 list-disc list-inside text-xs text-muted-foreground">
              {analysis.gaps.map(item => <li key={item.name}>{item.name}</li>)}
            </ul>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};