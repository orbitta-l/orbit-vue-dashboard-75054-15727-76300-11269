// Mock Data centralizado e coeso - MER 4.0
import { Usuario, Cargo, Categoria, Especializacao, Competencia } from '@/types/mer';

// ============ USUÁRIOS ============
// Líder com dados completos
export const MOCK_LIDER: Usuario = {
  id_usuario: 'lider-001',
  nome: 'Juliana Martins',
  email: 'juli.lider@gmail.com',
  senha_hash: 'hashed',
  role: 'LIDER',
  status: 'ACTIVE',
  lider_id: null,
  sexo: 'FEMININO',
  data_nascimento: '1985-05-15',
  avatar_url: null,
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
};

// Líder novo (sem dados)
export const MOCK_LIDER_NOVO: Usuario = {
  id_usuario: 'lider-002',
  nome: 'Thais Costa',
  email: 'thais.lider@gmail.com',
  senha_hash: 'hashed',
  role: 'LIDER',
  status: 'ACTIVE',
  lider_id: null,
  sexo: 'FEMININO',
  data_nascimento: '1990-03-20',
  avatar_url: null,
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
};

// Liderado com dados (time da juli.lider)
export const MOCK_LIDERADOS: Usuario[] = [
  {
    id_usuario: 'lid-001',
    nome: 'Antonio Pereira',
    email: 'tone.p@gmail.com',
    senha_hash: 'hashed',
    role: 'LIDERADO',
    status: 'ACTIVE',
    lider_id: 'lider-001',
    sexo: 'MASCULINO',
    data_nascimento: '2000-08-12',
    avatar_url: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id_usuario: 'lid-003',
    nome: 'Lara Mendes',
    email: 'lara.mendes@orbitta.com',
    senha_hash: 'hashed',
    role: 'LIDERADO',
    status: 'ACTIVE',
    lider_id: 'lider-001',
    sexo: 'FEMININO',
    data_nascimento: '1993-11-25',
    avatar_url: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id_usuario: 'lid-004',
    nome: 'Roberto Lima',
    email: 'roberto.lima@orbitta.com',
    senha_hash: 'hashed',
    role: 'LIDERADO',
    status: 'ACTIVE',
    lider_id: 'lider-001',
    sexo: 'MASCULINO',
    data_nascimento: '1995-02-10',
    avatar_url: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id_usuario: 'lid-005',
    nome: 'Mariana Costa',
    email: 'mariana.costa@orbitta.com',
    senha_hash: 'hashed',
    role: 'LIDERADO',
    status: 'ACTIVE',
    lider_id: 'lider-001',
    sexo: 'FEMININO',
    data_nascimento: '1996-09-05',
    avatar_url: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
];

// Liderado novo (sem dados)
export const MOCK_LIDERADO_NOVO: Usuario = {
  id_usuario: 'lid-002',
  nome: 'Ramon Silva',
  email: 'ramon.p@gmail.com',
  senha_hash: 'hashed',
  role: 'LIDERADO',
  status: 'ACTIVE',
  lider_id: 'lider-002',
  sexo: 'MASCULINO',
  data_nascimento: '1998-07-30',
  avatar_url: null,
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
};

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
    nome: 'Frontend',
    id_categoria: 'cat-002',
    descricao: 'Desenvolvimento de interfaces',
    created_at: new Date('2024-01-01'),
  },
  {
    id_especializacao: 'esp-002',
    nome: 'Backend',
    id_categoria: 'cat-002',
    descricao: 'Desenvolvimento de APIs e servidores',
    created_at: new Date('2024-01-01'),
  },
  {
    id_especializacao: 'esp-003',
    nome: 'Machine Learning',
    id_categoria: 'cat-003',
    descricao: 'Modelos de aprendizado de máquina',
    created_at: new Date('2024-01-01'),
  },
  {
    id_especializacao: 'esp-004',
    nome: 'Data Engineering',
    id_categoria: 'cat-003',
    descricao: 'Engenharia de dados',
    created_at: new Date('2024-01-01'),
  },
  {
    id_especializacao: 'esp-005',
    nome: 'Cloud & Infrastructure',
    id_categoria: 'cat-004',
    descricao: 'Infraestrutura em nuvem',
    created_at: new Date('2024-01-01'),
  },
];

// ============ COMPETÊNCIAS ============
export const MOCK_COMPETENCIAS: Competencia[] = [
  // Soft Skills
  { id_competencia: 'comp-001', nome: 'Comunicação', tipo: 'COMPORTAMENTAL', descricao: 'Habilidade de comunicação', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-002', nome: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', descricao: 'Colaboração em equipe', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-003', nome: 'Liderança', tipo: 'COMPORTAMENTAL', descricao: 'Capacidade de liderança', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-004', nome: 'Resolução de Problemas', tipo: 'COMPORTAMENTAL', descricao: 'Solução de problemas', created_at: new Date('2024-01-01') },
  
  // Frontend (cat-002, esp-001)
  { id_competencia: 'comp-005', nome: 'React', tipo: 'TECNICA', descricao: 'Framework React', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-006', nome: 'TypeScript', tipo: 'TECNICA', descricao: 'Linguagem TypeScript', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-007', nome: 'CSS/Tailwind', tipo: 'TECNICA', descricao: 'Estilização', created_at: new Date('2024-01-01') },
  
  // Backend (cat-002, esp-002)
  { id_competencia: 'comp-008', nome: 'Node.js', tipo: 'TECNICA', descricao: 'Runtime Node.js', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-009', nome: 'Desenvolvimento de API REST', tipo: 'TECNICA', descricao: 'APIs RESTful', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-010', nome: 'SQL', tipo: 'TECNICA', descricao: 'Banco de dados SQL', created_at: new Date('2024-01-01') },
  
  // Machine Learning (cat-003, esp-003)
  { id_competencia: 'comp-011', nome: 'Python', tipo: 'TECNICA', descricao: 'Linguagem Python', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-012', nome: 'TensorFlow', tipo: 'TECNICA', descricao: 'Framework TensorFlow', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-013', nome: 'Algoritmos ML', tipo: 'TECNICA', descricao: 'Algoritmos de ML', created_at: new Date('2024-01-01') },
  
  // Data Engineering (cat-003, esp-004)
  { id_competencia: 'comp-014', nome: 'Apache Spark', tipo: 'TECNICA', descricao: 'Framework Spark', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-015', nome: 'ETL Pipelines', tipo: 'TECNICA', descricao: 'Pipelines ETL', created_at: new Date('2024-01-01') },
  
  // Cloud & Infrastructure (cat-004, esp-005)
  { id_competencia: 'comp-016', nome: 'Docker', tipo: 'TECNICA', descricao: 'Containerização', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-017', nome: 'Kubernetes', tipo: 'TECNICA', descricao: 'Orquestração', created_at: new Date('2024-01-01') },
  { id_competencia: 'comp-018', nome: 'AWS/GCP', tipo: 'TECNICA', descricao: 'Cloud providers', created_at: new Date('2024-01-01') },
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
  cargo_id: string;
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
    nome_liderado: 'Antonio Pereira',
    cargo: 'Desenvolvedor Junior',
    cargo_id: 'junior',
    nivel_maturidade: 'M1',
    quadrantX: 2.2,
    quadrantY: 2.75,
    categoria_dominante: 'Desenvolvimento Web',
    especializacao_dominante: 'Frontend',
    competencias: [
      { id_competencia: 'comunicacao', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.5 },
      { id_competencia: 'trabalho-equipe', nome_competencia: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.0 },
      { id_competencia: 'adaptabilidade', nome_competencia: 'Adaptabilidade', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.0 },
      { id_competencia: 'aprendizado', nome_competencia: 'Vontade de Aprender', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.5 },
      { id_competencia: 'react', nome_competencia: 'React', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'frontend', nome_especializacao: 'Frontend Web', media_pontuacao: 2.5 },
      { id_competencia: 'typescript', nome_competencia: 'TypeScript', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'frontend', nome_especializacao: 'Frontend Web', media_pontuacao: 2.0 },
      { id_competencia: 'css-tailwind', nome_competencia: 'CSS/Tailwind', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'frontend', nome_especializacao: 'Frontend Web', media_pontuacao: 3.0 },
      { id_competencia: 'api-rest', nome_competencia: 'Desenvolvimento de API REST', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend', nome_especializacao: 'Backend Web', media_pontuacao: 1.5 },
      { id_competencia: 'sql', nome_competencia: 'SQL', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend', nome_especializacao: 'Backend Web', media_pontuacao: 2.0 },
    ],
  },
  {
    id_liderado: 'lid-003',
    nome_liderado: 'Lara Mendes',
    cargo: 'Designer Sênior',
    cargo_id: 'senior',
    nivel_maturidade: 'M4',
    quadrantX: 3.4,
    quadrantY: 2.75,
    categoria_dominante: 'Desenvolvimento Web',
    especializacao_dominante: 'Frontend',
    competencias: [
      { id_competencia: 'lideranca-tecnica', nome_competencia: 'Liderança Técnica', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.5 },
      { id_competencia: 'pensamento-critico', nome_competencia: 'Pensamento Crítico', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.0 },
      { id_competencia: 'mentoria', nome_competencia: 'Mentoria', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.5 },
      { id_competencia: 'visao-negocio', nome_competencia: 'Visão de Negócio', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.0 },
      { id_competencia: 'react', nome_competencia: 'React', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'frontend', nome_especializacao: 'Frontend Web', media_pontuacao: 4.0 },
      { id_competencia: 'typescript', nome_competencia: 'TypeScript', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'frontend', nome_especializacao: 'Frontend Web', media_pontuacao: 3.5 },
      { id_competencia: 'css-tailwind', nome_competencia: 'CSS/Tailwind', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'frontend', nome_especializacao: 'Frontend Web', media_pontuacao: 4.0 },
      { id_competencia: 'docker', nome_competencia: 'Docker', tipo: 'TECNICA', id_categoria: 'devops', nome_categoria: 'DevOps', id_especializacao: 'cloud-infra', nome_especializacao: 'Cloud & Infrastructure', media_pontuacao: 3.0 },
      { id_competencia: 'kubernetes', nome_competencia: 'Kubernetes', tipo: 'TECNICA', id_categoria: 'devops', nome_categoria: 'DevOps', id_especializacao: 'cloud-infra', nome_especializacao: 'Cloud & Infrastructure', media_pontuacao: 2.5 },
    ],
  },
  {
    id_liderado: 'lid-005',
    nome_liderado: 'Mariana Costa',
    cargo: 'Desenvolvedor Pleno',
    cargo_id: 'pleno',
    nivel_maturidade: 'M4',
    quadrantX: 2.5,
    quadrantY: 2.75,
    categoria_dominante: 'Desenvolvimento Web',
    especializacao_dominante: 'Backend',
    competencias: [
      { id_competencia: 'comunicacao', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.0 },
      { id_competencia: 'trabalho-equipe', nome_competencia: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.5 },
      { id_competencia: 'resolucao-problemas', nome_competencia: 'Resolução de Problemas', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.5 },
      { id_competencia: 'iniciativa', nome_competencia: 'Iniciativa e Proatividade', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.0 },
      { id_competencia: 'nodejs', nome_competencia: 'Node.js', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend', nome_especializacao: 'Backend Web', media_pontuacao: 3.0 },
      { id_competencia: 'api-rest', nome_competencia: 'Desenvolvimento de API REST', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend', nome_especializacao: 'Backend Web', media_pontuacao: 2.5 },
      { id_competencia: 'sql', nome_competencia: 'SQL', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend', nome_especializacao: 'Backend Web', media_pontuacao: 2.5 },
      { id_competencia: 'docker', nome_competencia: 'Docker', tipo: 'TECNICA', id_categoria: 'devops', nome_categoria: 'DevOps', id_especializacao: 'cloud-infra', nome_especializacao: 'Cloud & Infrastructure', media_pontuacao: 2.0 },
    ],
  },
  {
    id_liderado: 'lid-004',
    nome_liderado: 'Roberto Lima',
    cargo: 'Desenvolvedor Pleno',
    cargo_id: 'pleno',
    nivel_maturidade: 'M4',
    quadrantX: 2.8,
    quadrantY: 2.5,
    categoria_dominante: 'Desenvolvimento Web',
    especializacao_dominante: 'Backend',
    competencias: [
      { id_competencia: 'comunicacao', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.5 },
      { id_competencia: 'trabalho-equipe', nome_competencia: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.0 },
      { id_competencia: 'resolucao-problemas', nome_competencia: 'Resolução de Problemas', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.0 },
      { id_competencia: 'iniciativa', nome_competencia: 'Iniciativa e Proatividade', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.5 },
      { id_competencia: 'nodejs', nome_competencia: 'Node.js', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend', nome_especializacao: 'Backend Web', media_pontuacao: 3.5 },
      { id_competencia: 'api-rest', nome_competencia: 'Desenvolvimento de API REST', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend', nome_especializacao: 'Backend Web', media_pontuacao: 3.0 },
      { id_competencia: 'sql', nome_competencia: 'SQL', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend', nome_especializacao: 'Backend Web', media_pontuacao: 3.0 },
      { id_competencia: 'docker', nome_competencia: 'Docker', tipo: 'TECNICA', id_categoria: 'devops', nome_categoria: 'DevOps', id_especializacao: 'cloud-infra', nome_especializacao: 'Cloud & Infrastructure', media_pontuacao: 2.5 },
      { id_competencia: 'kubernetes', nome_competencia: 'Kubernetes', tipo: 'TECNICA', id_categoria: 'devops', nome_categoria: 'DevOps', id_especializacao: 'cloud-infra', nome_especializacao: 'Cloud & Infrastructure', media_pontuacao: 2.0 },
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