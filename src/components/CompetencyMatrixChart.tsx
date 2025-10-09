import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  level: string;
  initials: string;
  quadrantX: number;
  quadrantY: number;
}

interface CompetencyMatrixChartProps {
  teamMembers: TeamMember[];
}

const QUADRANT_COLORS = {
  M1: 'hsl(var(--chart-1))',  // Original M1 color
  M2: 'hsl(var(--chart-2))',  // Original M2 color
  M3: 'hsl(var(--chart-3))',  // Original M3 color
  M4: 'hsl(var(--chart-4))',  // Original M4 color
};

const MEMBER_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
];

export default function CompetencyMatrixChart({ teamMembers }: CompetencyMatrixChartProps) {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);

  const getQuadrant = (x: number, y: number): keyof typeof QUADRANT_COLORS => {
    if (x <= 2.5 && y > 2.5) return 'M2';
    if (x > 2.5 && y > 2.5) return 'M4';
    if (x <= 2.5 && y <= 2.5) return 'M1';
    return 'M3';
  };

  const getMemberColor = (memberId: string): string => {
    const idx = teamMembers.findIndex(m => m.id === memberId);
    return MEMBER_COLORS[idx % MEMBER_COLORS.length];
  };

  return (
    <TooltipProvider>
      <div className="relative w-full bg-white rounded-2xl p-8 shadow-sm">
        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Matriz de Competências</h2>
        <p className="text-sm text-muted-foreground mb-8 text-center">
          Distribuição estratégica por competências comportamentais e técnicas
        </p>

        {/* Chart Container */}
        <div className="relative w-full h-[550px]">
          <svg className="w-full h-full" viewBox="0 0 700 550" style={{ fontFamily: "'Inter', 'Roboto', sans-serif" }}>
            {/* Subtle grid pattern */}
            <defs>
              <pattern id="fine-grid" width="35" height="27.5" patternUnits="userSpaceOnUse">
                <path d="M 35 0 L 0 0 0 27.5" fill="none" stroke="#E0E0E0" strokeWidth="0.5"/>
              </pattern>
              
              {/* Gradient for quadrant backgrounds */}
              <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAFAFA" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>

              {/* Shadow filters */}
              <filter id="point-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                <feOffset dx="0" dy="2" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <filter id="point-shadow-hover" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                <feOffset dx="0" dy="4" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.4"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background */}
            <rect width="700" height="550" fill="url(#bg-gradient)" />
            <rect width="700" height="550" fill="url(#fine-grid)" />

            {/* Chart area - centered with margins */}
            <g transform="translate(80, 30)">
              {/* Quadrant background colors - very subtle */}
              <rect x="0" y="0" width="270" height="245" fill={QUADRANT_COLORS.M2} opacity="0.03" />
              <rect x="270" y="0" width="270" height="245" fill={QUADRANT_COLORS.M4} opacity="0.03" />
              <rect x="0" y="245" width="270" height="245" fill={QUADRANT_COLORS.M1} opacity="0.03" />
              <rect x="270" y="245" width="270" height="245" fill={QUADRANT_COLORS.M3} opacity="0.03" />

              {/* Main axis lines - subtle */}
              <line x1="270" y1="0" x2="270" y2="490" stroke="#B0B0B0" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.5" />
              <line x1="0" y1="245" x2="540" y2="245" stroke="#B0B0B0" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.5" />

              {/* Quadrant labels - positioned consistently in top-right of each area */}
              <g>
                {/* M2 - Top Left */}
                <rect x="180" y="20" width="70" height="32" fill={QUADRANT_COLORS.M2} rx="6" opacity="0.95" />
                <text x="215" y="41" fill="white" fontSize="16" textAnchor="middle" fontWeight="700">M2</text>

                {/* M4 - Top Right */}
                <rect x="450" y="20" width="70" height="32" fill={QUADRANT_COLORS.M4} rx="6" opacity="0.95" />
                <text x="485" y="41" fill="white" fontSize="16" textAnchor="middle" fontWeight="700">M4</text>

                {/* M1 - Bottom Left */}
                <rect x="20" y="438" width="70" height="32" fill={QUADRANT_COLORS.M1} rx="6" opacity="0.95" />
                <text x="55" y="459" fill="white" fontSize="16" textAnchor="middle" fontWeight="700">M1</text>

                {/* M3 - Bottom Right */}
                <rect x="290" y="438" width="70" height="32" fill={QUADRANT_COLORS.M3} rx="6" opacity="0.95" />
                <text x="325" y="459" fill="white" fontSize="16" textAnchor="middle" fontWeight="700">M3</text>
              </g>

              {/* Axis tick marks and labels */}
              {[1, 2, 3, 4, 5].map(i => (
                <g key={`x-${i}`}>
                  <line x1={i * 108} y1="240" x2={i * 108} y2="250" stroke="#666" strokeWidth="1.5" />
                  <text x={i * 108} y="270" fill="#666" fontSize="13" textAnchor="middle" fontWeight="500">{i}</text>
                </g>
              ))}
              {[1, 2, 3, 4, 5].map(i => (
                <g key={`y-${i}`}>
                  <line x1="265" y1={490 - i * 98} x2="275" y2={490 - i * 98} stroke="#666" strokeWidth="1.5" />
                  <text x="250" y={490 - i * 98 + 5} fill="#666" fontSize="13" textAnchor="end" fontWeight="500">{i}</text>
                </g>
              ))}

              {/* Axis labels */}
              <text x="270" y="510" fill="#1a1a1a" fontSize="15" textAnchor="middle" fontWeight="600">
                Competências Técnicas →
              </text>
              <text x="-245" y="-45" fill="#1a1a1a" fontSize="15" textAnchor="middle" fontWeight="600" transform="rotate(-90)">
                Competências Comportamentais →
              </text>

              {/* Data points with enhanced interactivity */}
              {teamMembers.map((member, idx) => {
                const x = (member.quadrantX / 5) * 540;
                const y = 490 - (member.quadrantY / 5) * 490;
                const color = getMemberColor(member.id);
                const quadrant = getQuadrant(member.quadrantX, member.quadrantY);
                
                const isHovered = hoveredMember === member.id;
                const isLegendHovered = hoveredLegend === member.id;
                const isDimmed = (hoveredMember !== null && hoveredMember !== member.id) || 
                                (hoveredLegend !== null && hoveredLegend !== member.id);

                return (
                  <Tooltip key={member.id}>
                    <TooltipTrigger asChild>
                      <g 
                        className="cursor-pointer transition-all duration-300"
                        onMouseEnter={() => setHoveredMember(member.id)}
                        onMouseLeave={() => setHoveredMember(null)}
                        style={{ 
                          opacity: isDimmed ? 0.25 : 1,
                          transform: isHovered || isLegendHovered ? 'scale(1.15)' : 'scale(1)',
                          transformOrigin: `${x}px ${y}px`,
                        }}
                      >
                        {/* Outer glow on hover */}
                        {(isHovered || isLegendHovered) && (
                          <circle 
                            cx={x} 
                            cy={y} 
                            r="20" 
                            fill={color}
                            opacity="0.2"
                          />
                        )}
                        
                        {/* Main point circle with border and shadow */}
                        <circle 
                          cx={x} 
                          cy={y} 
                          r="11" 
                          fill={color}
                          stroke="#4A4A4A"
                          strokeWidth="2.5"
                          filter={isHovered || isLegendHovered ? "url(#point-shadow-hover)" : "url(#point-shadow)"}
                        />

                        {/* Member initials - positioned above with smart collision avoidance */}
                        <text 
                          x={x} 
                          y={y - 22} 
                          fill="#1a1a1a" 
                          fontSize="13" 
                          textAnchor="middle"
                          fontWeight="700"
                          style={{ 
                            textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                            pointerEvents: 'none'
                          }}
                        >
                          {member.initials}
                        </text>

                        {/* Level badge below */}
                        <text 
                          x={x} 
                          y={y + 30} 
                          fill="#666" 
                          fontSize="11" 
                          textAnchor="middle"
                          fontWeight="600"
                          style={{ pointerEvents: 'none' }}
                        >
                          {member.level}
                        </text>
                      </g>
                    </TooltipTrigger>
                    <TooltipContent 
                      className="bg-white border-2 shadow-xl p-4 rounded-lg"
                      sideOffset={10}
                    >
                      <div className="space-y-2">
                        <p className="font-bold text-base text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <div className="pt-2 mt-2 border-t space-y-1.5">
                          <p className="text-xs text-foreground">
                            <span className="font-semibold">Competência Técnica:</span> {member.quadrantX.toFixed(1)}/5.0
                          </p>
                          <p className="text-xs text-foreground">
                            <span className="font-semibold">Competência Comportamental:</span> {member.quadrantY.toFixed(1)}/5.0
                          </p>
                          <p className="text-xs text-foreground">
                            <span className="font-semibold">Quadrante:</span> {quadrant}
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Interactive legend */}
        <div className="mt-6 bg-white/90 backdrop-blur-sm border rounded-xl p-5 shadow-md">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Membros da Equipe</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {teamMembers.map((member, idx) => {
              const color = getMemberColor(member.id);
              const isHovered = hoveredLegend === member.id;
              const isDimmed = hoveredLegend !== null && hoveredLegend !== member.id;

              return (
                <div 
                  key={member.id} 
                  className="flex items-center gap-2 p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-muted/50"
                  style={{ opacity: isDimmed ? 0.4 : 1 }}
                  onMouseEnter={() => setHoveredLegend(member.id)}
                  onMouseLeave={() => setHoveredLegend(null)}
                >
                  <div 
                    className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ring-offset-2 transition-all duration-200 ${isHovered ? 'ring-2' : 'ring-0'}`}
                    style={{ 
                      backgroundColor: color,
                      borderColor: isHovered ? color : 'transparent',
                      transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-foreground font-medium block truncate">
                      {member.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {member.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
