// Utilitários de cor para gaps de competências (MER 3.0)
import { ESCALA_MIN, ESCALA_MAX } from '@/types/mer';

/**
 * Calcula a cor do gap baseada no score médio.
 * Paleta: AZUL (score alto ~4.0) → VERMELHO (score baixo ~1.0)
 * A intensidade da cor é inversamente proporcional à nota:
 * - Quanto MENOR o score, mais FORTE e SATURADO o vermelho
 * - Quanto MAIOR o score, mais SUAVE e CLARO o azul
 */
export function getGapColor(score: number): string {
  // Normaliza o score de 1-4 para 0-1
  const normalized = Math.max(0, Math.min(1, (score - ESCALA_MIN) / (ESCALA_MAX - ESCALA_MIN)));
  
  // Inverte: score baixo = vermelho intenso, score alto = azul intenso
  const intensity = 1 - normalized;
  
  // HSL: vermelho = 0°, azul = 220°
  const hue = normalized * 220;
  
  // Saturação: score baixo = mais saturado (70-90%), score alto = menos saturado (40-60%)
  const saturation = 70 + (intensity * 20);
  
  // Luminosidade: score baixo = mais escuro (40-45%), score alto = mais claro (55-65%)
  const lightness = 40 + (normalized * 25);
  
  return `hsl(${hue.toFixed(0)}, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`;
}

/**
 * Retorna uma classe de cor baseada no score
 */
export function getGapColorClass(score: number): string {
  if (score < 2.0) return 'text-red-600 dark:text-red-400';
  if (score < 2.5) return 'text-orange-600 dark:text-orange-400';
  if (score < 3.0) return 'text-yellow-600 dark:text-yellow-400';
  if (score < 3.5) return 'text-blue-600 dark:text-blue-400';
  return 'text-blue-700 dark:text-blue-300';
}
