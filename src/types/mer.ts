// MER 5.0 - Tipos TypeScript baseados no Modelo Entidade-Relacionamento

// ============ ENUMS ============

export type UserRole = 'LIDER' | 'LIDERADO';
export type SexoTipo = 'MASCULINO' | 'FEMININO' | 'OUTRO' | 'NAO_BINARIO' | 'NAO_INFORMADO';
export type CompetenciaTipo = 'COMPORTAMENTAL' | 'TECNICA';
export type AvaliacaoStatus = 'RASCUNHO' | 'CONCLUIDA';
export type NivelMaturidade = 'M1' | 'M2' | 'M3' | 'M4';
export type PieChartFilterType = "maturidade" | "categoria" | "sexo" | "faixaEtaria";

// ============ ENTIDADES PRINCIPAIS ============

export interface Usuario {
  id_usuario: string;
  nome: string;
  email: string;
  senha_hash: string; // Simulado no frontend
  role: UserRole;
  id_cargo: string; // FK para CARGO
  lider_id: string | null; // FK para USUARIO (auto-relacionamento)
  sexo: SexoTipo;
  data_nascimento: string; // YYYY-MM-DD
  ativo: boolean;
  avatar_url?: string | null;
  first_login?: boolean; // Adicionado first_login
}

export interface Cargo {
  id_cargo: string;
  nome_cargo: string;
  descricao: string;
  ativo: boolean;
}

export interface Categoria {
  id_categoria: string;
  nome_categoria: string;
  tipo: 'TECNICA' | 'COMPORTAMENTAL';
  descricao: string;
}

export interface Especializacao {
  id_especializacao: string;
  id_categoria: string; // FK para CATEGORIA
  nome_especializacao: string;
  descricao: string;
}

export interface Competencia {
  id_competencia: string;
  nome_competencia: string;
  descricao: string;
  tipo: CompetenciaTipo;
  id_especializacao: string | null; // FK opcional para ESPECIALIZACAO
}

export interface Avaliacao {
  id_avaliacao: string;
  lider_id: string; // FK para USUARIO
  liderado_id: string; // FK para USUARIO
  id_cargo: string; // FK para CARGO (snapshot do cargo no momento da avaliação)
  data_avaliacao: Date; // Alterado para Date
  media_comportamental_1a4: number; // Eixo Y
  media_tecnica_1a4: number; // Eixo X
  maturidade_quadrante: NivelMaturidade;
  status: AvaliacaoStatus;
  observacoes: string | null;
}

export interface PontuacaoAvaliacao {
  id_avaliacao: string; // PK, FK
  id_competencia: string; // PK, FK
  pontuacao_1a4: number;
  peso_aplicado: number | null; // Para SOFT, do template; para HARD, NULL
}

// ============ TIPOS PARA TEMPLATES ============

export interface TemplateCompetencia {
  id_competencia: string;
  peso: 1 | 2 | 3 | 4; // Permitindo peso 4
  nota_ideal: number;
}

export interface TemplateCargo {
  id_template: string;
  id_cargo: string;
  origem: string;
  ativo: boolean;
  competencias: TemplateCompetencia[];
}

// ============ REGRAS DE NEGÓCIO E HELPERS ============

export const LIMIAR_MATURIDADE = 2.5;

export function calcularNivelMaturidade(
  media_tecnica_1a4: number, // Eixo X
  media_comportamental_1a4: number // Eixo Y
): NivelMaturidade {
  if (media_tecnica_1a4 <= LIMIAR_MATURIDADE && media_comportamental_1a4 <= LIMIAR_MATURIDADE) return 'M1';
  if (media_tecnica_1a4 <= LIMIAR_MATURIDADE && media_comportamental_1a4 > LIMIAR_MATURIDADE) return 'M2';
  if (media_tecnica_1a4 > LIMIAR_MATURIDADE && media_comportamental_1a4 <= LIMIAR_MATURIDADE) return 'M3';
  return 'M4'; // x > 2.5, y > 2.5
}

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

// ============ TIPOS PARA VISUALIZAÇÃO NO FRONTEND ============

// Dados consolidados de um liderado para exibição nos dashboards
export interface LideradoDashboard extends Usuario {
  idade: number;
  cargo_nome: string;
  ultima_avaliacao?: {
    media_comportamental_1a4: number;
    media_tecnica_1a4: number;
    maturidade_quadrante: NivelMaturidade | 'N/A'; // Permitindo 'N/A'
    data_avaliacao: Date; 
  };
  competencias: (PontuacaoAvaliacao & {
    nome_competencia: string;
    tipo: CompetenciaTipo;
    categoria_nome?: string;
    especializacao_nome?: string;
    nota_ideal?: number; // Adicionado nota_ideal
  })[];
  categoria_dominante?: string;
  especializacao_dominante?: string;
}