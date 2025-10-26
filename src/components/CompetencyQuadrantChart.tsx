import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LideradoPerformance, NivelMaturidade } from "@/types/mer";

interface CompetencyQuadrantChartProps {
  teamMembers: LideradoPerformance[];
  empty?: boolean;
}

const QUADRANT_COLORS = {
  M1: "hsl(var(--color-maturidade-m1))",
  M2: "hsl(var(--color-maturidade-m2))",
  M3: "hsl(var(--color-maturidade-m3))",
  M4: "hsl(var(--color-maturidade-m4))",
};

const MEMBER_COLORS = [
  "hsl(var(--color-chart-1))",
  "hsl(var(--color-chart-2))",
  "hsl(var(--color-chart-3))",
  "hsl(var(--color-chart-4))",
  "hsl(var(--color-chart-5))",
];

export default function CompetencyQuadrantChart({ teamMembers, empty = false }: CompetencyQuadrantChartProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  const filteredMembers = teamMembers.filter((member) =>
    member.nome_liderado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const quadrantCounts: Record<NivelMaturidade, number> = {
    M1: 0,
    M2: 0,
    M3: 0,
    M4: 0,
  };

  teamMembers.forEach((member) => {
    quadrantCounts[member.nivel_maturidade]++;
  });

  const getMemberColor = (index: number) => MEMBER_COLORS[index % MEMBER_COLORS.length];

  // Cores de placeholder quando empty
  const placeholderColor = "var(--color-muted)";

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Matriz de Competências
      </h3>

      {/* Busca */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar liderado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          disabled={empty}
        />
      </div>

      {/* Gráfico */}
      <div className="relative w-full h-[550px]">
        <svg className="w-full h-full" viewBox="0 0 700 550">
          {/* Fundo e grid - cores cinza quando empty */}
          <rect width="700" height="550" fill={empty ? placeholderColor : "url(#bg-gradient)"} />
          {empty ? null : (
            <defs>
              <pattern id="fine-grid" width="35" height="27.5" patternUnits="userSpaceOnUse">
                <path d="M 35 0 L 0 0 0 27.5" fill="none" stroke="#E0E0E0" strokeWidth="0.5" />
              </pattern>
            </defs>
          )}

          {/* Quadrantes - usar cor muted quando empty */}
          {["M2", "M4", "M1", "M3"].map((q) => (
            <rect
              key={q}
              x={q === "M2" || q === "M1" ? 0 : 216}
              y={q === "M2" || q === "M4" ? 0 : 306}
              width={216}
              height={306}
              fill={empty ? placeholderColor : QUADRANT_COLORS[q as keyof typeof QUADRANT_COLORS]}
              opacity={empty ? 0.1 : 0.03}
            />
          ))}

          {/* Eixos */}
          {!empty && (
            <>
              <line x1="216" y1="0" x2="216" y2="490" stroke="#B0B0B0" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.5" />
              <line x1="0" y1="306" x2="540" y2="306" stroke="#B0B0B0" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.5" />
            </>
          )}

          {/* Pontos */}
          {empty
            ? null
            : filteredMembers.map((member, idx) => {
                const x = (member.quadrantX / 4) * 540;
                const y = 490 - (member.quadrantY / 4) * 490;
                const color = getMemberColor(idx);
                return (
                  <g key={member.id_liderado}>
                    <circle cx={x} cy={y} r="11" fill={color} stroke="#4A4A4A" strokeWidth="2.5" />
                  </g>
                );
              })}
        </svg>
      </div>
    </Card>
  );
}