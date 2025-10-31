import { Usuario, Cargo, Categoria, Especializacao, Competencia, Avaliacao, PontuacaoAvaliacao, calcularNivelMaturidade } from "@/types/mer";

// ============ CATÁLOGOS BASE ============

export const MOCK_CARGOS: Cargo[] = [
  { id_cargo: "cargo_estagiario", nome_cargo: "Estagiário", descricao: "Nível inicial", ativo: true },
  { id_cargo: "cargo_junior", nome_cargo: "Desenvolvedor Júnior", descricao: "Nível júnior", ativo: true },
  { id_cargo: "cargo_pleno", nome_cargo: "Desenvolvedor Pleno", descricao: "Nível pleno", ativo: true },
  { id_cargo: "cargo_senior", nome_cargo: "Desenvolvedor Sênior", descricao: "Nível sênior", ativo: true },
];

export const MOCK_CATEGORIAS: Categoria[] = [
  { id_categoria: "cat_soft_skills", nome_categoria: "Soft Skills", tipo: "COMPORTAMENTAL", descricao: "Competências comportamentais" },
  { id_categoria: "cat_dev_web", nome_categoria: "Desenvolvimento Web", tipo: "TECNICA", descricao: "Desenvolvimento de aplicações web" },
  { id_categoria: "cat_devops", nome_categoria: "DevOps", tipo: "TECNICA", descricao: "Infraestrutura e operações" },
];

export const MOCK_ESPECIALIZACOES: Especializacao[] = [
  { id_especializacao: "spec_frontend", id_categoria: "cat_dev_web", nome_especializacao: "Frontend", descricao: "Desenvolvimento de interfaces" },
  { id_especializacao: "spec_backend", id_categoria: "cat_dev_web", nome_especializacao: "Backend", descricao: "Desenvolvimento de APIs e servidores" },
  { id_especializacao: "spec_cloud_infra", id_categoria: "cat_devops", nome_especializacao: "Cloud & Infrastructure", descricao: "Infraestrutura em nuvem" },
];

export const MOCK_COMPETENCIAS: Competencia[] = [
  // Soft Skills
  { id_competencia: "soft_comunicacao", nome_competencia: "Comunicação", tipo: "SOFT", id_especializacao: null, descricao: "..." },
  { id_competencia: "soft_trabalho_equipe", nome_competencia: "Trabalho em Equipe", tipo: "SOFT", id_especializacao: null, descricao: "..." },
  { id_competencia: "soft_capacidade_aprendizado", nome_competencia: "Capacidade de Aprendizado", tipo: "SOFT", id_especializacao: null, descricao: "..." },
  { id_competencia: "soft_iniciativa", nome_competencia: "Iniciativa", tipo: "SOFT", id_especializacao: null, descricao: "..." },
  { id_competencia: "soft_adaptabilidade", nome_competencia: "Adaptabilidade", tipo: "SOFT", id_especializacao: null, descricao: "..." },
  { id_competencia: "soft_organizacao", nome_competencia: "Organização", tipo: "SOFT", id_especializacao: null, descricao: "..." },
  { id_competencia: "soft_foco_resultados", nome_competencia: "Foco em Resultados", tipo: "SOFT", id_especializacao: null, descricao: "..." },
  { id_competencia: "soft_proatividade", nome_competencia: "Proatividade", tipo: "SOFT", id_especializacao: null, descricao: "..." },
  // Hard Skills
  { id_competencia: "hard_react", nome_competencia: "React", tipo: "HARD", id_especializacao: "spec_frontend", descricao: "..." },
  { id_competencia: "hard_typescript", nome_competencia: "TypeScript", tipo: "HARD", id_especializacao: "spec_frontend", descricao: "..." },
  { id_competencia: "hard_css_tailwind", nome_competencia: "CSS/Tailwind", tipo: "HARD", id_especializacao: "spec_frontend", descricao: "..." },
  { id_competencia: "hard_nodejs", nome_competencia: "Node.js", tipo: "HARD", id_especializacao: "spec_backend", descricao: "..." },
  { id_competencia: "hard_api_rest", nome_competencia: "API REST", tipo: "HARD", id_especializacao: "spec_backend", descricao: "..." },
  { id_competencia: "hard_sql", nome_competencia: "SQL", tipo: "HARD", id_especializacao: "spec_backend", descricao: "..." },
  { id_competencia: "hard_docker", nome_competencia: "Docker", tipo: "HARD", id_especializacao: "spec_cloud_infra", descricao: "..." },
  { id_competencia: "hard_kubernetes", nome_competencia: "Kubernetes", tipo: "HARD", id_especializacao: "spec_cloud_infra", descricao: "..." },
  { id_competencia: "hard_aws_gcp", nome_competencia: "AWS/GCP", tipo: "HARD", id_especializacao: "spec_cloud_infra", descricao: "..." },
];

// ============ USUÁRIOS ============

export const MOCK_USERS: Usuario[] = [
  // Líder com time
  { id_usuario: 'lider-001', nome: 'Juliana Martins', email: 'juli.lider@gmail.com', senha_hash: 'juli@123', role: 'LIDER', id_cargo: 'cargo_senior', lider_id: null, sexo: 'FEMININO', data_nascimento: '1985-05-15', ativo: true },
  // Líder sem time
  { id_usuario: 'lider-002', nome: 'Thais Costa', email: 'thais.lider@gmail.com', senha_hash: 'thais@123', role: 'LIDER', id_cargo: 'cargo_pleno', lider_id: null, sexo: 'FEMININO', data_nascimento: '1990-03-20', ativo: true },
  // Liderados
  { id_usuario: 'lid-001', nome: 'Antonio Pereira', email: 'tone.p@gmail.com', senha_hash: 'tone@123', role: 'LIDERADO', id_cargo: 'cargo_junior', lider_id: 'lider-001', sexo: 'MASCULINO', data_nascimento: '2000-08-12', ativo: true },
  { id_usuario: 'lid-002', nome: 'Lara Mendes', email: 'lara.m@gmail.com', senha_hash: 'lara@123', role: 'LIDERADO', id_cargo: 'cargo_pleno', lider_id: 'lider-001', sexo: 'FEMININO', data_nascimento: '1993-11-25', ativo: true },
  { id_usuario: 'lid-003', nome: 'Ramon Silva', email: 'ramon.p@gmail.com', senha_hash: 'ramon@123', role: 'LIDERADO', id_cargo: 'cargo_estagiario', lider_id: 'lider-002', sexo: 'MASCULINO', data_nascimento: '1998-07-30', ativo: true },
];

// ============ AVALIAÇÕES E PONTUAÇÕES ============

const PONTUACOES_LID_001: PontuacaoAvaliacao[] = [
  // Soft
  { id_avaliacao: "av_001", id_competencia: "soft_comunicacao", pontuacao_1a4: 2.5, peso_aplicado: 2 },
  { id_avaliacao: "av_001", id_competencia: "soft_trabalho_equipe", pontuacao_1a4: 3.0, peso_aplicado: 3 },
  { id_avaliacao: "av_001", id_competencia: "soft_organizacao", pontuacao_1a4: 2.0, peso_aplicado: 2 },
  { id_avaliacao: "av_001", id_competencia: "soft_foco_resultados", pontuacao_1a4: 3.5, peso_aplicado: 3 },
  { id_avaliacao: "av_001", id_competencia: "soft_proatividade", pontuacao_1a4: 2.0, peso_aplicado: 3 },
  // Hard
  { id_avaliacao: "av_001", id_competencia: "hard_react", pontuacao_1a4: 2.5, peso_aplicado: null },
  { id_avaliacao: "av_001", id_competencia: "hard_typescript", pontuacao_1a4: 2.0, peso_aplicado: null },
  { id_avaliacao: "av_001", id_competencia: "hard_api_rest", pontuacao_1a4: 1.5, peso_aplicado: null },
];

const PONTUACOES_LID_002: PontuacaoAvaliacao[] = [
  // Soft (simulando cargo Pleno, sem template definido ainda)
  { id_avaliacao: "av_002", id_competencia: "soft_comunicacao", pontuacao_1a4: 3.5, peso_aplicado: 2 },
  { id_avaliacao: "av_002", id_competencia: "soft_trabalho_equipe", pontuacao_1a4: 4.0, peso_aplicado: 3 },
  // Hard
  { id_avaliacao: "av_002", id_competencia: "hard_nodejs", pontuacao_1a4: 3.5, peso_aplicado: null },
  { id_avaliacao: "av_002", id_competencia: "hard_sql", pontuacao_1a4: 3.0, peso_aplicado: null },
  { id_avaliacao: "av_002", id_competencia: "hard_docker", pontuacao_1a4: 2.5, peso_aplicado: null },
];

export const MOCK_PONTUACOES: PontuacaoAvaliacao[] = [...PONTUACOES_LID_001, ...PONTUACOES_LID_002];

// Função para calcular médias para uma avaliação
const calcularMedias = (pontuacoes: PontuacaoAvaliacao[]) => {
  const soft = pontuacoes.filter(p => MOCK_COMPETENCIAS.find(c => c.id_competencia === p.id_competencia)?.tipo === 'SOFT');
  const hard = pontuacoes.filter(p => MOCK_COMPETENCIAS.find(c => c.id_competencia === p.id_competencia)?.tipo === 'HARD');
  
  const media_comportamental_1a4 = soft.length > 0 ? soft.reduce((acc, p) => acc + p.pontuacao_1a4, 0) / soft.length : 0;
  const media_tecnica_1a4 = hard.length > 0 ? hard.reduce((acc, p) => acc + p.pontuacao_1a4, 0) / hard.length : 0;

  return { media_comportamental_1a4, media_tecnica_1a4 };
};

const medias_lid_001 = calcularMedias(PONTUACOES_LID_001);
const medias_lid_002 = calcularMedias(PONTUACOES_LID_002);

export const MOCK_AVALIACAO: Avaliacao[] = [
  {
    id_avaliacao: "av_001",
    lider_id: "lider-001",
    liderado_id: "lid-001",
    id_cargo: "cargo_junior",
    data_avaliacao: "2024-05-10T10:00:00Z",
    media_comportamental_1a4: medias_lid_001.media_comportamental_1a4,
    media_tecnica_1a4: medias_lid_001.media_tecnica_1a4,
    maturidade_quadrante: calcularNivelMaturidade(medias_lid_001.media_tecnica_1a4, medias_lid_001.media_comportamental_1a4),
    status: "CONCLUIDA",
    observacoes: "Antonio demonstra bom potencial de aprendizado."
  },
  {
    id_avaliacao: "av_002",
    lider_id: "lider-001",
    liderado_id: "lid-002",
    id_cargo: "cargo_pleno",
    data_avaliacao: "2024-05-15T14:30:00Z",
    media_comportamental_1a4: medias_lid_002.media_comportamental_1a4,
    media_tecnica_1a4: medias_lid_002.media_tecnica_1a4,
    maturidade_quadrante: calcularNivelMaturidade(medias_lid_002.media_tecnica_1a4, medias_lid_002.media_comportamental_1a4),
    status: "CONCLUIDA",
    observacoes: "Lara é uma excelente colaboradora, referência técnica no backend."
  }
];