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
  { id_categoria: "2", nome_categoria: "Desenvolvimento Web", tipo: "TECNICA", descricao: "Competências relacionadas ao desenvolvimento de aplicações web" },
  { id_categoria: "3", nome_categoria: "Desenvolvimento Mobile", tipo: "TECNICA", descricao: "Competências relacionadas ao desenvolvimento de aplicações mobile" },
  { id_categoria: "4", nome_categoria: "Ciência de Dados e IA", tipo: "TECNICA", descricao: "Competências relacionadas a dados e inteligência artificial" },
  { id_categoria: "5", nome_categoria: "Cloud e DevOps", tipo: "TECNICA", descricao: "Competências relacionadas a infraestrutura e operações" },
  { id_categoria: "6", nome_categoria: "Segurança da Informação", tipo: "TECNICA", descricao: "Competências relacionadas a segurança de sistemas" },
  { id_categoria: "7", nome_categoria: "UX/UI Design", tipo: "TECNICA", descricao: "Competências relacionadas a experiência do usuário e design de interface" },
];

export const MOCK_ESPECIALIZACOES: Especializacao[] = [
  { id_especializacao: "1", id_categoria: "2", nome_especializacao: "Frontend Web", descricao: "Desenvolvimento de interfaces de usuário" },
  { id_especializacao: "2", id_categoria: "2", nome_especializacao: "Backend Web", descricao: "Desenvolvimento de lógica de servidor e APIs" },
  { id_especializacao: "3", id_categoria: "3", nome_especializacao: "Desenvolvimento Nativo", descricao: "Desenvolvimento para iOS e Android" },
  { id_especializacao: "4", id_categoria: "3", nome_especializacao: "Cross-Platform", descricao: "Desenvolvimento para múltiplas plataformas" },
  { id_especializacao: "5", id_categoria: "4", nome_especializacao: "Análise e Visualização", descricao: "Análise e visualização de dados" },
  { id_especializacao: "6", id_categoria: "4", nome_especializacao: "Machine Learning", descricao: "Modelos de aprendizado de máquina" },
  { id_especializacao: "7", id_categoria: "5", nome_especializacao: "Infraestrutura e Containers", descricao: "Gerenciamento de infraestrutura e containers" },
  { id_especializacao: "8", id_categoria: "5", nome_especializacao: "CI/CD e Automação", descricao: "Integração e entrega contínua" },
  { id_especializacao: "9", id_categoria: "6", nome_especializacao: "AppSec", descricao: "Segurança de aplicações" },
  { id_especializacao: "10", id_categoria: "6", nome_especializacao: "Infraestrutura Segura", descricao: "Segurança de infraestrutura" },
  { id_especializacao: "11", id_categoria: "7", nome_especializacao: "UX Research", descricao: "Pesquisa com usuários" },
  { id_especializacao: "12", id_categoria: "7", nome_especializacao: "UI Design", descricao: "Design de interfaces" },
];

export const MOCK_COMPETENCIAS: Competencia[] = [
  // Soft Skills (IDs 1 a 10)
  { id_competencia: "1", nome_competencia: "Comunicação", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Capacidade de expressar ideias de forma clara e ouvir atentamente." },
  { id_competencia: "2", nome_competencia: "Trabalho em Equipe", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Colaborar efetivamente com outros para alcançar objetivos comuns." },
  { id_competencia: "3", nome_competencia: "Adaptabilidade", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Ajustar-se a novas condições e desafios com flexibilidade." },
  { id_competencia: "4", nome_competencia: "Vontade de Aprender", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Demonstrar curiosidade e iniciativa para adquirir novos conhecimentos." },
  { id_competencia: "5", nome_competencia: "Resolução de Problemas", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Identificar, analisar e resolver problemas de forma autônoma." },
  { id_competencia: "6", nome_competencia: "Iniciativa e Proatividade", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Agir antecipadamente, identificando oportunidades e riscos." },
  { id_competencia: "7", nome_competencia: "Liderança Técnica", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Orientar e influenciar tecnicamente outros membros da equipe." },
  { id_competencia: "8", nome_competencia: "Pensamento Crítico", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Analisar informações de forma objetiva e tomar decisões estratégicas." },
  { id_competencia: "9", nome_competencia: "Mentoria", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Capacidade de ensinar e desenvolver outros membros da equipe." },
  { id_competencia: "10", nome_competencia: "Visão de Negócio", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Compreender e alinhar as entregas técnicas com os objetivos do negócio." },
  // Hard Skills (IDs 11 a 18)
  { id_competencia: "11", nome_competencia: "Design Responsivo (HTML/CSS)", tipo: "TECNICA", id_especializacao: "1", descricao: "Construção de UI responsivas com boas práticas de layout e semântica." },
  { id_competencia: "12", nome_competencia: "Interatividade (JavaScript/DOM)", tipo: "TECNICA", id_especializacao: "1", descricao: "Criação de interfaces interativas e manipulação do DOM." },
  { id_competencia: "13", nome_competencia: "Otimização de Performance Web", tipo: "TECNICA", id_especializacao: "1", descricao: "Melhorias de carregamento, renderização e métricas web vitais." },
  { id_competencia: "14", nome_competencia: "Desenvolvimento Acessível", tipo: "TECNICA", id_especializacao: "1", descricao: "Garantia de acessibilidade (WAI-ARIA) e inclusão em interfaces web." },
  { id_competencia: "15", nome_competencia: "Criação e Gestão de APIs (REST)", tipo: "TECNICA", id_especializacao: "2", descricao: "Modelagem de endpoints, versionamento e boas práticas REST." },
  { id_competencia: "16", nome_competencia: "Modelagem e Consultas SQL/NoSQL", tipo: "TECNICA", id_especializacao: "2", descricao: "Projetar esquemas e escrever consultas eficientes." },
  { id_competencia: "17", nome_competencia: "Implementação de Regras de Negócio", tipo: "TECNICA", id_especializacao: "2", descricao: "Codificação de lógicas de domínio e validações no servidor." },
  { id_competencia: "18", nome_competencia: "Autenticação e Controle de Acesso", tipo: "TECNICA", id_especializacao: "2", descricao: "Sessões, tokens, OAuth2/OpenID e autorização por papéis." },
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
  // Soft (Usando novos IDs)
  { id_avaliacao: "av_001", id_competencia: "1", pontuacao_1a4: 2.5, peso_aplicado: 2 }, // Comunicação
  { id_avaliacao: "av_001", id_competencia: "2", pontuacao_1a4: 3.0, peso_aplicado: 3 }, // Trabalho em Equipe
  { id_avaliacao: "av_001", id_competencia: "6", pontuacao_1a4: 2.0, peso_aplicado: 2 }, // Iniciativa e Proatividade
  { id_avaliacao: "av_001", id_competencia: "10", pontuacao_1a4: 3.5, peso_aplicado: 3 }, // Visão de Negócio
  { id_avaliacao: "av_001", id_competencia: "4", pontuacao_1a4: 2.0, peso_aplicado: 3 }, // Vontade de Aprender
  // Hard (Usando novos IDs)
  { id_avaliacao: "av_001", id_competencia: "11", pontuacao_1a4: 2.5, peso_aplicado: null }, // Design Responsivo
  { id_avaliacao: "av_001", id_competencia: "12", pontuacao_1a4: 2.0, peso_aplicado: null }, // Interatividade
  { id_avaliacao: "av_001", id_competencia: "15", pontuacao_1a4: 1.5, peso_aplicado: null }, // Criação e Gestão de APIs
];

const PONTUACOES_LID_002: PontuacaoAvaliacao[] = [
  // Soft (simulando cargo Pleno, sem template definido ainda)
  { id_avaliacao: "av_002", id_competencia: "1", pontuacao_1a4: 3.5, peso_aplicado: 2 }, // Comunicação
  { id_avaliacao: "av_002", id_competencia: "2", pontuacao_1a4: 4.0, peso_aplicado: 3 }, // Trabalho em Equipe
  // Hard
  { id_avaliacao: "av_002", id_competencia: "15", pontuacao_1a4: 3.5, peso_aplicado: null }, // Criação e Gestão de APIs
  { id_avaliacao: "av_002", id_competencia: "16", pontuacao_1a4: 3.0, peso_aplicado: null }, // Modelagem e Consultas SQL/NoSQL
  { id_avaliacao: "av_002", id_competencia: "17", pontuacao_1a4: 2.5, peso_aplicado: null }, // Implementação de Regras de Negócio
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