// Mock Data centralizado e coeso - MER 3.0
import { Usuario, Cargo, Categoria, Especializacao, Competencia } from '@/types/mer';

// ============ USUÁRIOS ============
export const MOCK_LIDER: Usuario = {
  id_usuario: 'lider-001',
  nome: 'Marina Rodriguez',
  email: 'marina.rodriguez@orbitta.com',
  senha: 'hashed',
  role: 'LIDER',
  organization_id: 'org-001',
  lider_id: null,
  avatar_url: null,
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
};

export const MOCK_LIDERADOS: Usuario[] = [
  {
    id_usuario: 'lid-001',
    nome: 'Ana Silva',
    email: 'ana.silva@orbitta.com',
    senha: 'hashed',
    role: 'LIDERADO',
    organization_id: 'org-001',
    lider_id: 'lider-001',
    avatar_url: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id_usuario: 'lid-002',
    nome: 'Carlos Santos',
    email: 'carlos.santos@orbitta.com',
    senha: 'hashed',
    role: 'LIDERADO',
    organization_id: 'org-001',
    lider_id: 'lider-001',
    avatar_url: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id_usuario: 'lid-003',
    nome: 'Mariana Costa',
    email: 'mariana.costa@orbitta.com',
    senha: 'hashed',
    role: 'LIDERADO',
    organization_id: 'org-001',
    lider_id: 'lider-001',
    avatar_url: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id_usuario: 'lid-004',
    nome: 'Roberto Lima',
    email: 'roberto.lima@orbitta.com',
    senha: 'hashed',
    role: 'LIDERADO',
    organization_id: 'org-001',
    lider_id: 'lider-001',
    avatar_url: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
];

// ============ CARGOS ============
export const MOCK_CARGOS: Cargo[] = [
  {
    id_cargo: 'cargo-001',
    nome_cargo: 'Desenvolvedor Junior',
    descricao: 'Desenvolvedor em fase inicial de carreira',
    created_at: new Date('2024-01-01'),
  },
  {
    id_cargo: 'cargo-002',
    nome_cargo: 'Desenvolvedor Pleno',
    descricao: 'Desenvolvedor com experiência intermediária',
    created_at: new Date('2024-01-01'),
  },
  {
    id_cargo: 'cargo-003',
    nome_cargo: 'Designer Sênior',
    descricao: 'Designer com vasta experiência',
    created_at: new Date('2024-01-01'),
  },
  {
    id_cargo: 'cargo-004',
    nome_cargo: 'Product Manager',
    descricao: 'Gerente de produto',
    created_at: new Date('2024-01-01'),
  },
];

// ============ CATEGORIAS ============
export const MOCK_CATEGORIAS: Categoria[] = [
  {
    id_categoria: 'cat-001',
    nome_categoria: 'Soft Skills',
    tipo: 'COMPORTAMENTAL',
    descricao: 'Competências comportamentais',
    created_at: new Date('2024-01-01'),
  },
  {
    id_categoria: 'cat-002',
    nome_categoria: 'Desenvolvimento Web',
    tipo: 'TECNICA',
    descricao: 'Desenvolvimento de aplicações web',
    created_at: new Date('2024-01-01'),
  },
  {
    id_categoria: 'cat-003',
    nome_categoria: 'Big Data / IA',
    tipo: 'TECNICA',
    descricao: 'Ciência de dados e inteligência artificial',
    created_at: new Date('2024-01-01'),
  },
  {
    id_categoria: 'cat-004',
    nome_categoria: 'DevOps',
    tipo: 'TECNICA',
    descricao: 'Infraestrutura e operações',
    created_at: new Date('2024-01-01'),
  },
];

// ============ ESPECIALIZAÇÕES ============
export const MOCK_ESPECIALIZACOES: Especializacao[] = [
  {
    id_especializacao: 'esp-001',
    nome_especializacao: 'Frontend',
    id_categoria: 'cat-002',
    descricao: 'Desenvolvimento de interfaces',
    created_at: new Date('2024-01-01'),
  },
  {
    id_especializacao: 'esp-002',
    nome_especializacao: 'Backend',
    id_categoria: 'cat-002',
    descricao: 'Desenvolvimento de APIs e servidores',
    created_at: new Date('2024-01-01'),
  },
  {
    id_especializacao: 'esp-003',
    nome_especializacao: 'Machine Learning',
    id_categoria: 'cat-003',
    descricao: 'Modelos de aprendizado de máquina',
    created_at: new Date('2024-01-01'),
  },
  {
    id_especializacao: 'esp-004',
    nome_especializacao: 'Data Engineering',
    id_categoria: 'cat-003',
    descricao: 'Engenharia de dados',
    created_at: new Date('2024-01-01'),
  },
  {
    id_especializacao: 'esp-005',
    nome_especializacao: 'Cloud & Infrastructure',
    id_categoria: 'cat-004',
    descricao: 'Infraestrutura em nuvem',
    created_at: new Date('2024-01-01'),
  },
];

// ============ COMPETÊNCIAS ============
export const MOCK_COMPETENCIAS: Competencia[] = [
  // Soft Skills
  { id_competencia: 'comp-001', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', descricao: 'Habilidade de comunicação', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-002', nome_competencia: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', descricao: 'Colaboração em equipe', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-003', nome_competencia: 'Liderança', tipo: 'COMPORTAMENTAL', descricao: 'Capacidade de liderança', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-004', nome_competencia: 'Resolução de Problemas', tipo: 'COMPORTAMENTAL', descricao: 'Solução de problemas', created_at: new Date('2024-01-01') },
  
  // Frontend (cat-002, esp-001)
  { id_competencia: 'comp-005', nome_competencia: 'React', tipo: 'TECNICA', descricao: 'Framework React', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-006', nome_competencia: 'TypeScript', tipo: 'TECNICA', descricao: 'Linguagem TypeScript', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-007', nome_competencia: 'CSS/Tailwind', tipo: 'TECNICA', descricao: 'Estilização', created_at: new Date('2024-01-01') },
  
  // Backend (cat-002, esp-002)
  { id_competencia: 'comp-008', nome_competencia: 'Node.js', tipo: 'TECNICA', descricao: 'Runtime Node.js', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-009', nome_competencia: 'Desenvolvimento de API REST', tipo: 'TECNICA', descricao: 'APIs RESTful', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-010', nome_competencia: 'SQL', tipo: 'TECNICA', descricao: 'Banco de dados SQL', created_at: new Date('2024-01-01') },
  
  // Machine Learning (cat-003, esp-003)
  { id_competencia: 'comp-011', nome_competencia: 'Python', tipo: 'TECNICA', descricao: 'Linguagem Python', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-012', nome_competencia: 'TensorFlow', tipo: 'TECNICA', descricao: 'Framework TensorFlow', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-013', nome_competencia: 'Algoritmos ML', tipo: 'TECNICA', descricao: 'Algoritmos de ML', created_at: new Date('2024-01-01') },
  
  // Data Engineering (cat-003, esp-004)
  { id_competencia: 'comp-014', nome_competencia: 'Apache Spark', tipo: 'TECNICA', descricao: 'Framework Spark', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-015', nome_competencia: 'ETL Pipelines', tipo: 'TECNICA', descricao: 'Pipelines ETL', created_at: new Date('2024-01-01') },
  
  // Cloud & Infrastructure (cat-004, esp-005)
  { id_competencia: 'comp-016', nome_competencia: 'Docker', tipo: 'TECNICA', descricao: 'Containerização', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-017', nome_competencia: 'Kubernetes', tipo: 'TECNICA', descricao: 'Orquestração', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-018', nome_competencia: 'AWS/GCP', tipo: 'TECNICA', descricao: 'Cloud providers', created_at: new Date('2024-01-01') },
];

// ============ MAPEAMENTO ESPECIALIZAÇÃO -> COMPETÊNCIAS ============
export const ESPECIALIZACAO_COMPETENCIAS = {
  'esp-001': ['comp-005', 'comp-006', 'comp-007'], // Frontend
  'esp-002': ['comp-008', 'comp-009', 'comp-010'], // Backend
  'esp-003': ['comp-011', 'comp-012', 'comp-013'], // ML
  'esp-004': ['comp-014', 'comp-015'], // Data Engineering
  'esp-005': ['comp-016', 'comp-017', 'comp-018'], // Cloud
};

// ============ DADOS DE PERFORMANCE (MV_LIDERADO_COMPETENCIAS simulado) ============
export interface LideradoPerformance {
  id_liderado: string;
  nome_liderado: string;
  cargo: string;
  nivel_maturidade: 'M1' | 'M2' | 'M3' | 'M4';
  quadrantX: number; // eixo_x_tecnico_geral
  quadrantY: number; // eixo_y_comportamental
  categoria_dominante: string;
  especializacao_dominante: string;
  competencias: {
    id_competencia: string;
    nome_competencia: string;
    tipo: 'TECNICA' | 'COMPORTAMENTAL';
    id_categoria: string;
    nome_categoria: string;
    id_especializacao: string | null;
    nome_especializacao: string | null;
    media_pontuacao: number;
  }[];
}

export const MOCK_PERFORMANCE: LideradoPerformance[] = [
  {
    id_liderado: 'lid-001',
    nome_liderado: 'Ana Silva',
    cargo: 'Desenvolvedor Junior',
    nivel_maturidade: 'M2',
    quadrantX: 2.3,
    quadrantY: 2.7,
    categoria_dominante: 'Desenvolvimento Web',
    especializacao_dominante: 'Frontend',
    competencias: [
      { id_competencia: 'comp-001', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.8 },
      { id_competencia: 'comp-002', nome_competencia: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.6 },
      { id_competencia: 'comp-004', nome_competencia: 'Resolução de Problemas', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.7 },
      { id_competencia: 'comp-005', nome_competencia: 'React', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-001', nome_especializacao: 'Frontend', media_pontuacao: 2.5 },
      { id_competencia: 'comp-006', nome_competencia: 'TypeScript', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-001', nome_especializacao: 'Frontend', media_pontuacao: 2.2 },
      { id_competencia: 'comp-007', nome_competencia: 'CSS/Tailwind', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-001', nome_especializacao: 'Frontend', media_pontuacao: 2.4 },
      { id_competencia: 'comp-009', nome_competencia: 'Desenvolvimento de API REST', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-002', nome_especializacao: 'Backend', media_pontuacao: 1.9 },
      { id_competencia: 'comp-010', nome_competencia: 'SQL', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-002', nome_especializacao: 'Backend', media_pontuacao: 2.1 },
    ],
  },
  {
    id_liderado: 'lid-002',
    nome_liderado: 'Carlos Santos',
    cargo: 'Designer Sênior',
    nivel_maturidade: 'M3',
    quadrantX: 3.4,
    quadrantY: 2.3,
    categoria_dominante: 'Desenvolvimento Web',
    especializacao_dominante: 'Frontend',
    competencias: [
      { id_competencia: 'comp-001', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.4 },
      { id_competencia: 'comp-002', nome_competencia: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.2 },
      { id_competencia: 'comp-003', nome_competencia: 'Liderança', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.3 },
      { id_competencia: 'comp-005', nome_competencia: 'React', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-001', nome_especializacao: 'Frontend', media_pontuacao: 3.6 },
      { id_competencia: 'comp-006', nome_competencia: 'TypeScript', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-001', nome_especializacao: 'Frontend', media_pontuacao: 3.4 },
      { id_competencia: 'comp-007', nome_competencia: 'CSS/Tailwind', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-001', nome_especializacao: 'Frontend', media_pontuacao: 3.8 },
      { id_competencia: 'comp-016', nome_competencia: 'Docker', tipo: 'TECNICA', id_categoria: 'cat-004', nome_categoria: 'DevOps', id_especializacao: 'esp-005', nome_especializacao: 'Cloud & Infrastructure', media_pontuacao: 2.9 },
    ],
  },
  {
    id_liderado: 'lid-003',
    nome_liderado: 'Mariana Costa',
    cargo: 'Product Manager',
    nivel_maturidade: 'M4',
    quadrantX: 3.2,
    quadrantY: 3.8,
    categoria_dominante: 'Big Data / IA',
    especializacao_dominante: 'Machine Learning',
    competencias: [
      { id_competencia: 'comp-001', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.9 },
      { id_competencia: 'comp-002', nome_competencia: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.7 },
      { id_competencia: 'comp-003', nome_competencia: 'Liderança', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.8 },
      { id_competencia: 'comp-011', nome_competencia: 'Python', tipo: 'TECNICA', id_categoria: 'cat-003', nome_categoria: 'Big Data / IA', id_especializacao: 'esp-003', nome_especializacao: 'Machine Learning', media_pontuacao: 3.4 },
      { id_competencia: 'comp-012', nome_competencia: 'TensorFlow', tipo: 'TECNICA', id_categoria: 'cat-003', nome_categoria: 'Big Data / IA', id_especializacao: 'esp-003', nome_especializacao: 'Machine Learning', media_pontuacao: 3.2 },
      { id_competencia: 'comp-013', nome_competencia: 'Algoritmos ML', tipo: 'TECNICA', id_categoria: 'cat-003', nome_categoria: 'Big Data / IA', id_especializacao: 'esp-003', nome_especializacao: 'Machine Learning', media_pontuacao: 3.0 },
      { id_competencia: 'comp-010', nome_competencia: 'SQL', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-002', nome_especializacao: 'Backend', media_pontuacao: 3.1 },
    ],
  },
  {
    id_liderado: 'lid-004',
    nome_liderado: 'Roberto Lima',
    cargo: 'Desenvolvedor Pleno',
    nivel_maturidade: 'M3',
    quadrantX: 3.2,
    quadrantY: 2.4,
    categoria_dominante: 'Desenvolvimento Web',
    especializacao_dominante: 'Backend',
    competencias: [
      { id_competencia: 'comp-001', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.5 },
      { id_competencia: 'comp-002', nome_competencia: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.3 },
      { id_competencia: 'comp-004', nome_competencia: 'Resolução de Problemas', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.4 },
      { id_competencia: 'comp-008', nome_competencia: 'Node.js', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-002', nome_especializacao: 'Backend', media_pontuacao: 3.5 },
      { id_competencia: 'comp-009', nome_competencia: 'Desenvolvimento de API REST', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-002', nome_especializacao: 'Backend', media_pontuacao: 3.7 },
      { id_competencia: 'comp-010', nome_competencia: 'SQL', tipo: 'TECNICA', id_categoria: 'cat-002', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'esp-002', nome_especializacao: 'Backend', media_pontuacao: 3.3 },
      { id_competencia: 'comp-016', nome_competencia: 'Docker', tipo: 'TECNICA', id_categoria: 'cat-004', nome_categoria: 'DevOps', id_especializacao: 'esp-005', nome_especializacao: 'Cloud & Infrastructure', media_pontuacao: 2.6 },
      { id_competencia: 'comp-017', nome_competencia: 'Kubernetes', tipo: 'TECNICA', id_categoria: 'cat-004', nome_categoria: 'DevOps', id_especializacao: 'esp-005', nome_especializacao: 'Cloud & Infrastructure', media_pontuacao: 2.4 },
    ],
  },
];

// ============ GAPS DE COMPETÊNCIAS DA EQUIPE ============
export function calcularGapsEquipe(): Array<{
  id_competencia: string;
  nome_competencia: string;
  id_categoria: string;
  nome_categoria: string;
  id_especializacao: string | null;
  nome_especializacao: string | null;
  media_score: number;
}> {
  const competenciasMap = new Map<string, { soma: number; count: number; competencia: any }>();

  MOCK_PERFORMANCE.forEach(liderado => {
    liderado.competencias.forEach(comp => {
      if (comp.tipo === 'TECNICA') {
        const existing = competenciasMap.get(comp.id_competencia);
        if (existing) {
          existing.soma += comp.media_pontuacao;
          existing.count += 1;
        } else {
          competenciasMap.set(comp.id_competencia, {
            soma: comp.media_pontuacao,
            count: 1,
            competencia: comp,
          });
        }
      }
    });
  });

  const gaps = Array.from(competenciasMap.values())
    .map(({ soma, count, competencia }) => ({
      id_competencia: competencia.id_competencia,
      nome_competencia: competencia.nome_competencia,
      id_categoria: competencia.id_categoria,
      nome_categoria: competencia.nome_categoria,
      id_especializacao: competencia.id_especializacao,
      nome_especializacao: competencia.nome_especializacao,
      media_score: soma / count,
    }))
    .sort((a, b) => a.media_score - b.media_score);

  return gaps;
}
