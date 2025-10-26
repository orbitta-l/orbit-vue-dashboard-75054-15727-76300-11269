import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LideradoPerformance, NivelMaturidade } from "@/types/mer";

interface CompetencyQuadrantChartProps {
  teamMembers: LideradoPerformance[];
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

export default function CompetencyQuadrantChart({ teamMembers }: CompetencyQuadrantChartProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  const hasData = teamMembers.length > 0;

  // Filtrar membros pela busca
  const filteredMembers = teamMembers.filter((member) =>
    member.nome_liderado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Contar membros por quadrante
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

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Matriz de Competências
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Distribuição dos liderados por competências técnicas (eixo X) e comportamentais (eixo Y)
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quadrante SVG */}
        <div className="lg:col-span-3">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-auto border border-border rounded-lg"
            style={{ maxHeight: "500px" }}
          >
            {/* Fundo dos quadrantes */}
            <rect x="50" y="50" width="200" height="200" fill={QUADRANT_COLORS.M1} opacity="0.1" />
            <rect x="250" y="50" width="200" height="200" fill={QUADRANT_COLORS.M4} opacity="0.1" />
            <rect x="50" y="250" width="200" height="200" fill={QUADRANT_COLORS.M2} opacity="0.1" />
            <rect x="250" y="250" width="200" height="200" fill={QUADRANT_COLORS.M3} opacity="0.1" />

            {/* Linhas do grid */}
            <line x1="50" y1="150" x2="450" y2="150" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
            <line x1="150" y1="50" x2="150" y2="450" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
            <line x1="350" y1="50" x2="350" y2="450" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
            <line x1="50" y1="350" x2="450" y2="350" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />

            {/* Eixos principais */}
            <line x1="250" y1="50" x2="250" y2="450" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="50" y1="250" x2="450" y2="250" stroke="hsl(var(--foreground))" strokeWidth="2" />

            {/* Labels dos eixos */}
            <text x="250" y="480" textAnchor="middle" className="fill-muted-foreground" fontSize="12">
              Competências Técnicas (X)
            </text>
            <text x="20" y="250" textAnchor="middle" className="fill-muted-foreground" fontSize="12" transform="rotate(-90 20 250)">
              Competências Comportamentais (Y)
            </text>

            {/* Marcações de escala */}
            <text x="50" y="470" textAnchor="middle" className="fill-muted-foreground" fontSize="10">1.0</text>
            <text x="150" y="470" textAnchor="middle" className="fill-muted-foreground" fontSize="10">2.0</text>
            <text x="250" y="470" textAnchor="middle" className="fill-muted-foreground" fontSize="10">2.5</text>
            <text x="350" y="470" textAnchor="middle" className="fill-muted-foreground" fontSize="10">3.0</text>
            <text x="450" y="470" textAnchor="middle" className="fill-muted-foreground" fontSize="10">4.0</text>

            <text x="35" y="455" textAnchor="end" className="fill-muted-foreground" fontSize="10">1.0</text>
            <text x="35" y="355" textAnchor="end" className="fill-muted-foreground" fontSize="10">2.0</text>
            <text x="35" y="255" textAnchor="end" className="fill-muted-foreground" fontSize="10">2.5</text>
            <text x="35" y="155" textAnchor="end" className="fill-muted-foreground" fontSize="10">3.0</text>
            <text x="35" y="55" textAnchor="end" className="fill-muted-foreground" fontSize="10">4.0</text>

            {/* Labels dos quadrantes com contadores */}
            <text x="150" y="80" textAnchor="middle" className="fill-foreground font-bold" fontSize="16">
              M1 ({quadrantCounts.M1})
            </text>
            <text x="350" y="80" textAnchor="middle" className="fill-foreground font-bold" fontSize="16">
              M4 ({quadrantCounts.M4})
            </text>
            <text x="150" y="430" textAnchor="middle" className="fill-foreground font-bold" fontSize="16">
              M2 ({quadrantCounts.M2})
            </text>
            <text x="350" y="430" textAnchor="middle" className="fill-foreground font-bold" fontSize="16">
              M3 ({quadrantCounts.M3})
            </text>

            {/* Renderizar membros ou mensagem de vazio */}
            {!hasData ? (
              <text x="250" y="250" textAnchor="middle" className="fill-muted-foreground" fontSize="14">
                Aguardando avaliações
              </text>
            ) : (
              filteredMembers.map((member, idx) => {
                // Converter scores (1-4) para coordenadas (50-450)
                const x = 50 + ((member.eixo_x_tecnico_geral - 1) / 3) * 400;
                const y = 450 - ((member.eixo_y_comportamental - 1) / 3) * 400;
                const isHovered = hoveredMember === member.id_liderado;
                const isFiltered = searchTerm && !isHovered;

                return (
                  <g key={member.id_liderado}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 12 : 8}
                      fill={getMemberColor(idx)}
                      opacity={isFiltered ? 0.3 : 1}
                      stroke="white"
                      strokeWidth="2"
                      className="transition-all cursor-pointer"
                      onMouseEnter={() => setHoveredMember(member.id_liderado)}
                      onMouseLeave={() => setHoveredMember(null)}
                    />
                    {isHovered && (
                      <g>
                        {/* Tooltip */}
                        <rect
                          x={x + 15}
                          y={y - 40}
                          width="150"
                          height="70"
                          fill="hsl(var(--popover))"
                          stroke="hsl(var(--border))"
                          strokeWidth="1"
                          rx="4"
                        />
                        <text x={x + 20} y={y - 20} className="fill-popover-foreground font-semibold" fontSize="12">
                          {member.nome_liderado}
                        </text>
                        <text x={x + 20} y={y - 5} className="fill-muted-foreground" fontSize="10">
                          {member.cargo}
                        </text>
                        <text x={x + 20} y={y + 10} className="fill-foreground font-bold" fontSize="11">
                          Nível: {member.nivel_maturidade}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })
            )}
          </svg>
        </div>

        {/* Lista lateral com busca */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar liderado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {!hasData ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum liderado disponível
              </p>
            ) : filteredMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum resultado encontrado
              </p>
            ) : (
              filteredMembers.map((member, idx) => (
                <div
                  key={member.id_liderado}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    hoveredMember === member.id_liderado
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/50"
                  }`}
                  onMouseEnter={() => setHoveredMember(member.id_liderado)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getMemberColor(idx) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{member.nome_liderado}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.cargo}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
