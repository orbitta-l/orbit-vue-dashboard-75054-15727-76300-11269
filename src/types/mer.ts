// MER 4.0 - Tipos TypeScript baseados no Modelo Entidade-Relacionamento

// ============ ENUMS ============

export type UserRole = 'LIDER' | 'LIDERADO';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'DISABLED';
export type SexoTipo = 'FEMININO' | 'MASCULINO' | 'NAO_BINARIO' | 'NAO_INFORMADO';
export type CompetenciaTipo = 'TECNICA' | 'COMPORTAMENTAL';
export type AvaliacaoStatus = 'RASCUNHO' | 'CONCLUIDA';
export type NivelMaturidade = 'M1' | 'M2' | 'M3' | 'M4';

// ============ ENTIDADES PRINCIPAIS ============

export interface Usuario {
  id_usuario: string; // UUID
  nome: string;
  email: string;
  senha_hash: string;
  role: UserRole;
  status: UserStatus;
  lider_id: string | null; // FK para USUARIO (auto-relacionamento)
  sexo: SexoTipo;
  data_nascimento: string; // DATE format YYYY-MM-DD
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
  tipo: CompetenciaTipo;
  descricao: string;
  created_at: Date;
}

export interface Especializacao {
  id_especializacao: string; // UUID
  id_categoria: string; // FK para CATEGORIA
  nome: string;
  descricao: string;
  created_at: Date;
}

export interface Competencia {
  id_competencia: string; // UUID
  nome: string;
  tipo: CompetenciaTipo;
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
  nivel_maturidade: NivelMaturidade;
  observacoes: string | null;
  status: AvaliacaoStatus;
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
  nivel_maturidade: NivelMaturidade;
  observacoes: string | null;
  status: AvaliacaoStatus;
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
  tipo: CompetenciaTipo;
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
): NivelMaturidade {
  // M1: Baixo Técnico, Baixo Comportamental
  if (eixo_x_tecnico_geral <= LIMIAR_MATURIDADE && eixo_y_comportamental <= LIMIAR_MATURIDADE) {
    return 'M1';
  }
  // M2: Baixo Técnico, Alto Comportamental
  if (eixo_x_tecnico_geral <= LIMIAR_MATURIDADE && eixo_y_comportamental > LIMIAR_MATURIDADE) {
    return 'M2';
  }
  // M3: Alto Técnico, Baixo Comportamental
  if (eixo_x_tecnico_geral > LIMIAR_MATURIDADE && eixo_y_comportamental <= LIMIAR_MATURIDADE) {
    return 'M3';
  }
  // M4: Alto Técnico, Alto Comportamental
  return 'M4';
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

/**
 * Calcula idade derivada a partir da data de nascimento
 */
export function calcularIdade(data_nascimento: string): number {
  const hoje = new Date();
  const nascimento = new Date(data_nascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
}

/**
 * Calcula faixa etária para agrupamento
 */
export function calcularFaixaEtaria(idade: number): string {
  if (idade < 21) return '<21';
  if (idade < 30) return '21-29';
  if (idade < 40) return '30-39';
  return '40+';
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
  tipo?: CompetenciaTipo;
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
 * Performance de liderado para visualizações do dashboard
 */
export interface LideradoPerformance {
  id_liderado: string;
  nome_liderado: string;
  cargo: string;
  nivel_maturidade: NivelMaturidade;
  eixo_x_tecnico_geral: number;
  eixo_y_comportamental: number;
  categoria_dominante: string;
  especializacao_dominante: string;
  sexo: SexoTipo;
  idade: number;
  competencias: {
    id_competencia: string;
    nome_competencia: string;
    tipo: CompetenciaTipo;
    id_categoria: string;
    nome_categoria: string;
    id_especializacao: string | null;
    nome_especializacao: string | null;
    media_pontuacao: number;
  }[];
}

/**
 * Tipos de filtro para o gráfico de pizza
 */
export type PieChartFilterType = 'maturidade' | 'categoria' | 'sexo' | 'faixaEtaria';