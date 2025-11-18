// Utilitários de cor para gaps de competências (MER 3.0)

/**
 * Retorna uma cor HSL da paleta da plataforma com base na pontuação.
 * A paleta varia de vermelho (crítico) a azul (excelente).
 */
export function getGapColor(score: number): string {
  if (score <= 2.0) return 'hsl(var(--destructive-muted))';
  if (score < 3.0) return 'hsl(var(--color-score-blue-gray))';
  return 'hsl(var(--primary))';
}

/**
 * Retorna uma classe de cor do Tailwind CSS com base na pontuação.
 */
export function getGapColorClass(score: number): string {
  if (score <= 2.0) return 'text-destructive-muted';
  if (score < 3.0) return 'text-score-blue-gray';
  return 'text-primary';
}