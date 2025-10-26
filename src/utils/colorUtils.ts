// Utilitários de cor para gaps de competências (MER 3.0)

/**
 * Retorna uma cor HSL da paleta da plataforma com base na pontuação.
 * A paleta varia de vermelho (crítico) a azul (excelente).
 */
export function getGapColor(score: number): string {
  if (score < 2.0) return 'hsl(var(--destructive))';
  if (score < 2.5) return 'hsl(var(--accent))';
  if (score < 3.0) return 'hsl(var(--color-mid))';
  if (score < 3.5) return 'hsl(var(--color-good))';
  return 'hsl(var(--primary))';
}

/**
 * Retorna uma classe de cor do Tailwind CSS com base na pontuação.
 */
export function getGapColorClass(score: number): string {
  if (score < 2.0) return 'text-destructive';
  if (score < 2.5) return 'text-accent';
  if (score < 3.0) return 'text-mid';
  if (score < 3.5) return 'text-good';
  return 'text-primary';
}