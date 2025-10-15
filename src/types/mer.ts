// MER 3.0 - Tipos TypeScript baseados no Modelo Entidade-Relacionamento

// ============ ENTIDADES PRINCIPAIS ============

export interface Usuario {
  id_usuario: string; // UUID
  nome: string;
  email: string;
  senha: string;
  role: 'LIDER' | 'LIDERADO';
  organization_id: string; // UUID
  lider_id: string | null; // UUID - FK para USUARIO (auto-relacionamento)
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Cargo {
  id_cargo: string; // UUID
  nome_cargo: string; // UNIQUE
  descricao: string;
  created_at: Date;
}

export interface Categoria {
  id_categoria: string; // UUID
  nome_categoria: string; // UNIQUE
  tipo: 'TECNICA' | 'COMPORTAMENTAL';
  descricao: string;
  created_at: Date;
}

export interface Especializacao {
  id_especializacao: string; // UUID
  nome_especializacao: string;
  id_categoria: string; // FK para CATEGORIA
  descricao: string;
  created_at: Date;
}

export interface Competencia {
  id_competencia: string; // UUID
  nome_competencia: string; // UNIQUE
  tipo: 'TECNICA' | 'COMPORTAMENTAL';
  descricao: string;
  created_at: Date;
}

export interface Avaliacao {
  id_avaliacao: string; // UUID
  data_avaliacao: Date;
  id_liderado: string; // FK para USUARIO
  id_lider: string; // FK para USUARIO
  id_cargo: string; // FK para CARGO
  // Denormalização intencional para performance (snapshot)
  eixo_x_tecnico_geral: number; // DECIMAL 3,2 (1.00-4.00)
  eixo_y_comportamental: number; // DECIMAL 3,2 (1.00-4.00)
  // Campo calculado automaticamente
  nivel_maturidade: 'M1' | 'M2' | 'M3' | 'M4';
  observacoes: string | null;
  status: 'RASCUNHO' | 'CONCLUIDA';
  created_at: Date;
  updated_at: Date;
}

// ============ ENTIDADES ASSOCIATIVAS (N:N) ============

export interface EspecializacaoCompetencia {
  id_especializacao: string; // PK, FK para ESPECIALIZACAO
  id_competencia: string; // PK, FK para COMPETENCIA
  ordem: number;
  created_at: Date;
}

export interface TemplateCompetencia {
  id_cargo: string; // PK, FK para CARGO
  id_competencia: string; // PK, FK para COMPETENCIA
  peso: 1 | 2 | 3; // 1=baixa, 2=média, 3=alta
  nota_ideal: number; // DECIMAL 3,2 (1.00-4.00)
  created_at: Date;
  updated_at: Date;
}

export interface PontuacaoAvaliacao {
  id_avaliacao: string; // PK, FK para AVALIACAO
  id_competencia: string; // PK, FK para COMPETENCIA
  pontuacao: number; // DECIMAL 3,2 (1.00-4.00)
  peso_aplicado: 1 | 2 | 3; // Snapshot do peso no momento da avaliação
  nota_ideal_aplicada: number; // Snapshot da nota ideal no momento da avaliação
  created_at: Date;
}

export interface AvaliacaoCategoria {
  id_avaliacao: string; // PK, FK para AVALIACAO
  id_categoria: string; // PK, FK para CATEGORIA
  created_at: Date;
}

// ============ VIEWS MATERIALIZADAS ============

export interface MvUltimaAvaliacao {
  // Todos os campos de AVALIACAO
  id_avaliacao: string;
  data_avaliacao: Date;
  id_liderado: string;
  id_lider: string;
  id_cargo: string;
  eixo_x_tecnico_geral: number;
  eixo_y_comportamental: number;
  nivel_maturidade: 'M1' | 'M2' | 'M3' | 'M4';
  observacoes: string | null;
  status: 'RASCUNHO' | 'CONCLUIDA';
  created_at: Date;
  updated_at: Date;
  // JOINs
  nome_liderado: string;
  email_liderado: string;
  nome_cargo: string;
}

export interface MvLideradoCompetencias {
  id_liderado: string;
  nome_liderado: string;
  id_competencia: string;
  nome_competencia: string;
  tipo: 'TECNICA' | 'COMPORTAMENTAL';
  id_categoria: string;
  nome_categoria: string;
  id_especializacao: string | null;
  nome_especializacao: string | null;
  media_pontuacao: number; // AVG
  ultima_avaliacao: Date; // MAX
  total_avaliacoes: number; // COUNT
}

// ============ REGRAS DE NEGÓCIO ============

export const ESCALA_MIN = 1.0;
export const ESCALA_MAX = 4.0;
export const LIMIAR_MATURIDADE = 2.5; // Ponto médio da escala 1-4

/**
 * Calcula o nível de maturidade baseado nos eixos X e Y
 * Modelo de Liderança Situacional
 */
export function calcularNivelMaturidade(
  eixo_y_comportamental: number,
  eixo_x_tecnico_geral: number
): 'M1' | 'M2' | 'M3' | 'M4' {
  if (eixo_y_comportamental >= LIMIAR_MATURIDADE && eixo_x_tecnico_geral < LIMIAR_MATURIDADE) {
    return 'M1'; // Alto Empenho, Baixa Competência Técnica
  }
  if (eixo_y_comportamental < LIMIAR_MATURIDADE && eixo_x_tecnico_geral < LIMIAR_MATURIDADE) {
    return 'M2'; // Baixo Empenho, Baixa Competência Técnica
  }
  if (eixo_y_comportamental < LIMIAR_MATURIDADE && eixo_x_tecnico_geral >= LIMIAR_MATURIDADE) {
    return 'M3'; // Baixo Empenho, Alta Competência Técnica
  }
  return 'M4'; // Alto Empenho, Alta Competência Técnica
}

/**
 * Calcula a média ponderada de um conjunto de pontuações
 * Σ(pontuacao × peso) / Σ(peso)
 */
export function calcularMediaPonderada(
  pontuacoes: Array<{ pontuacao: number; peso: number }>
): number {
  if (pontuacoes.length === 0) return 0;
  
  const somaPonderada = pontuacoes.reduce((acc, p) => acc + (p.pontuacao * p.peso), 0);
  const somaPesos = pontuacoes.reduce((acc, p) => acc + p.peso, 0);
  
  return somaPesos > 0 ? somaPonderada / somaPesos : 0;
}

/**
 * Valida se uma pontuação está dentro da escala permitida
 */
export function validarPontuacao(pontuacao: number): boolean {
  return pontuacao >= ESCALA_MIN && pontuacao <= ESCALA_MAX;
}

/**
 * Valida se o peso está dentro dos valores permitidos
 */
export function validarPeso(peso: number): peso is 1 | 2 | 3 {
  return [1, 2, 3].includes(peso);
}

/**
 * Valida se o líder não está avaliando a si mesmo
 */
export function validarAutoavaliacao(id_lider: string, id_liderado: string): boolean {
  return id_lider !== id_liderado;
}

// ============ TIPOS DE DADOS DO FRONT-END ============

/**
 * Estrutura completa de uma avaliação para salvamento atômico
 */
export interface AvaliacaoCompleta {
  // Cabeçalho da avaliação
  avaliacao: Omit<Avaliacao, 'id_avaliacao' | 'created_at' | 'updated_at'>;
  
  // Notas individuais (comportamentais + técnicas)
  pontuacoes: Array<Omit<PontuacaoAvaliacao, 'id_avaliacao' | 'created_at'>>;
  
  // Categorias avaliadas (para validação de categoria única)
  categorias_avaliadas: Array<Omit<AvaliacaoCategoria, 'id_avaliacao' | 'created_at'>>;
}

/**
 * Dados para o gráfico de radar VERSUS
 */
export interface RadarDataPoint {
  competency: string;
  atual: number;
  ideal: number;
  peso?: number;
  tipo?: 'TECNICA' | 'COMPORTAMENTAL';
}

/**
 * Estrutura para gap de competência (visualização)
 */
export interface CompetenciaGap {
  nome_competencia: string;
  nome_categoria: string;
  nome_especializacao: string | null;
  pontuacao_atual: number;
  nota_ideal: number;
  gap: number; // nota_ideal - pontuacao_atual
  gap_percentual: number; // (gap / nota_ideal) * 100
}

/**
 * Calcula a cor do gap (azul para score alto, vermelho para score baixo)
 * @param score - Pontuação média (1.0-4.0)
 * @returns Classe Tailwind ou valor HSL
 */
export function getGapColor(score: number): string {
  // Normaliza o score de 1-4 para 0-1
  const normalized = (score - ESCALA_MIN) / (ESCALA_MAX - ESCALA_MIN);
  
  // Inverte: score baixo = vermelho intenso, score alto = azul intenso
  const intensity = 1 - normalized;
  
  // HSL: vermelho = 0°, azul = 240°
  const hue = normalized * 240;
  const saturation = 50 + (intensity * 50); // 50-100%
  const lightness = 40 + (normalized * 20); // 40-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
