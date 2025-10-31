// Mock Data centralizado e coeso - MER 4.0
import { Usuario, Cargo, Categoria, Especializacao, Competencia, SexoTipo, LideradoPerformance } from '@/types/mer';
import { TechnicalCategory } from './evaluationTemplates'; // Importando TechnicalCategory

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

export const technicalCategories: TechnicalCategory[] = [
  {
    id: "dev-web",
    name: "Desenvolvimento Web",
    tipo: "TECNICA",
    especializacoes: [
      {
        id: "frontend-web",
        name: "Frontend Web",
        competencias: [
          {
            id: "design-responsivo",
            name: "Design Responsivo (HTML/CSS)",
            descricao: "Construção de UI responsivas com boas práticas de layout e semântica.",
          },
          {
            id: "interatividade-js",
            name: "Interatividade (JavaScript/DOM)",
            descricao: "Criação de interfaces interativas e manipulação do DOM.",
          },
          {
            id: "performance-web",
            name: "Otimização de Performance Web",
            descricao: "Melhorias de carregamento, renderização e métricas web vitais.",
          },
          {
            id: "acessibilidade-web",
            name: "Desenvolvimento Acessível",
            descricao: "Garantia de acessibilidade (WAI-ARIA) e inclusão em interfaces web.",
          },
        ],
      },
      {
        id: "backend-web",
        name: "Backend Web",
        competencias: [
          {
            id: "api-rest",
            name: "Criação e Gestão de APIs (REST)",
            descricao: "Modelagem de endpoints, versionamento e boas práticas REST.",
          },
          {
            id: "modelagem-sql-nosql",
            name: "Modelagem e Consultas SQL/NoSQL",
            descricao: "Projetar esquemas e escrever consultas eficientes.",
          },
          {
            id: "regras-negocio",
            name: "Implementação de Regras de Negócio",
            descricao: "Codificação de lógicas de domínio e validações no servidor.",
          },
          {
            id: "autenticacao-acesso",
            name: "Autenticação e Controle de Acesso",
            descricao: "Sessões, tokens, OAuth2/OpenID e autorização por papéis.",
          },
        ],
      },
    ],
  },
  {
    id: "dev-mobile",
    name: "Desenvolvimento Mobile",
    tipo: "TECNICA",
    especializacoes: [
      {
        id: "mobile-nativo",
        name: "Desenvolvimento Nativo",
        competencias: [
          {
            id: "programacao-nativa",
            name: "Programação Específica (iOS/Android)",
            descricao: "Desenvolvimento com linguagens/plataformas nativas.",
          },
          {
            id: "recursos-nativos",
            name: "Uso de Recursos Nativos",
            descricao: "Integração com câmera, GPS, notificações e sensores.",
          },
          {
            id: "publicacao-lojas",
            name: "Publicação em Lojas de Aplicativos",
            descricao: "Empacotamento, requisitos e processos de publicação.",
          },
          {
            id: "padroes-ui-ux-plataforma",
            name: "Padrões de Design de Plataforma (UI/UX)",
            descricao: "Aderência a Material, Human Interface e guidelines nativas.",
          },
        ],
      },
      {
        id: "mobile-cross",
        name: "Cross-Platform",
        competencias: [
          {
            id: "reutilizacao-codigo",
            name: "Reutilização de Código",
            descricao: "Compartilhamento de lógica e componentes multi-plataforma.",
          },
          {
            id: "estado-mobile",
            name: "Gerenciamento de Estado",
            descricao: "Arquiteturas de estado previsível e performático.",
          },
          {
            id: "integracao-apis-mobile",
            name: "Integração com APIs",
            descricao: "Consumo, cache e sincronização de dados remotos.",
          },
          {
            id: "teste-debug-mobile",
            name: "Teste e Debugging",
            descricao: "Estratégias de testes, logs e inspeção de problemas.",
          },
        ],
      },
    ],
  },
  {
    id: "data-ai",
    name: "Ciência de Dados e IA",
    tipo: "TECNICA",
    especializacoes: [
      {
        id: "analise-viz",
        name: "Análise e Visualização",
        competencias: [
          {
            id: "etl",
            name: "ETL",
            descricao: "Extração, transformação e carga de dados de múltiplas fontes.",
          },
          {
            id: "eda",
            name: "Análise Exploratória",
            descricao: "Explorar dados, tratar outliers e hipóteses iniciais.",
          },
          {
            id: "visualizacao-dados",
            name: "Visualização de Dados",
            descricao: "Criação de gráficos e dashboards para tomada de decisão.",
          },
          {
            id: "comunicacao-insights",
            name: "Comunicação de Insights",
            descricao: "Storytelling com dados e suporte a decisões do negócio.",
          },
        ],
      },
      {
        id: "machine-learning",
        name: "Machine Learning",
        competencias: [
          {
            id: "modelagem-preditiva",
            name: "Modelagem Preditiva",
            descricao: "Seleção de algoritmos, tuning e validação cruzada.",
          },
          {
            id: "treino-avaliacao",
            name: "Treinamento e Avaliação",
            descricao: "Métricas, overfitting/underfitting e experimentação.",
          },
          {
            id: "bibliotecas-ml",
            name: "Uso de Bibliotecas de ML",
            descricao: "Aplicação prática com frameworks do ecossistema.",
          },
          {
            id: "interpretacao-resultados",
            name: "Interpretação de Resultados",
            descricao: "Explicabilidade, feature importance e limitações.",
          },
        ],
      },
    ],
  },
  {
    id: "cloud-devops",
    name: "Cloud e DevOps",
    tipo: "TECNICA",
    especializacoes: [
      {
        id: "infra-containers",
        name: "Infraestrutura e Containers",
        competencias: [
          {
            id: "docker",
            name: "Docker",
            descricao: "Criação e gerenciamento de imagens e contêineres.",
          },
          {
            id: "monitoramento",
            name: "Monitoramento",
            descricao: "Coleta de métricas e observabilidade de serviços.",
          },
          {
            id: "cloud-services",
            name: "Serviços de Nuvem",
            descricao: "Provisionamento e operação em provedores cloud.",
          },
          {
            id: "troubleshooting",
            name: "Troubleshooting",
            descricao: "Diagnóstico e mitigação de incidentes de produção.",
          },
        ],
      },
      {
        id: "ci-cd-automacao",
        name: "CI/CD e Automação",
        competencias: [
          {
            id: "integracao-continua",
            name: "Integração Contínua",
            descricao: "Pipelines de build e testes automatizados.",
          },
          {
            id: "entrega-continua",
            name: "Entrega Contínua",
            descricao: "Estratégias de release e deploy automatizado.",
          },
          {
            id: "iac",
            name: "Infraestrutura como Código (IaC)",
            descricao: "Provisionamento automatizado e versionado de infra.",
          },
          {
            id: "fluxos-colaborativos",
            name: "Fluxos Colaborativos",
            descricao: "Práticas DevOps e colaboração entre times.",
          },
        ],
      },
    ],
  },
  {
    id: "sec-info",
    name: "Segurança da Informação",
    tipo: "TECNICA",
    especializacoes: [
      {
        id: "appsec",
        name: "AppSec",
        competencias: [
          {
            id: "owasp",
            name: "OWASP",
            descricao: "Boas práticas e mitigação contra vulnerabilidades comuns.",
          },
          {
            id: "criptografia",
            name: "Criptografia",
            descricao: "Primitivas, hashing e armazenamento seguro.",
          },
          {
            id: "autenticacao-segura",
            name: "Autenticação Segura",
            descricao: "Padrões de segurança (OAuth2/OpenID) e proteção de sessão.",
          },
          {
            id: "postura-etica",
            name: "Postura Ética",
            descricao: "Ética profissional e responsabilidade no manuseio de dados.",
          },
        ],
      },
      {
        id: "infra-segura",
        name: "Infraestrutura Segura",
        competencias: [
          {
            id: "iam",
            name: "IAM",
            descricao: "Gestão de identidades, permissões e políticas.",
          },
          {
            id: "hardening",
            name: "Hardening",
            descricao: "Endurecimento de SO/serviços e redução de superfície de ataque.",
          },
          {
            id: "seguranca-rede",
            name: "Segurança de Rede",
            descricao: "Segmentação, firewalls e proteção de tráfego.",
          },
          {
            id: "resposta-incidentes",
            descricao: "Detecção, contenção e lições aprendidas.",
          },
        ],
      },
    ],
  },
  {
    id: "ux-ui",
    name: "UX/UI Design",
    tipo: "TECNICA",
    especializacoes: [
      {
        id: "ux-research",
        name: "UX Research",
        competencias: [
          {
            id: "entrevistas",
            name: "Entrevistas",
            descricao: "Coleta estruturada de necessidades e dores do usuário.",
          },
          {
            id: "personas-jornadas",
            name: "Personas e Jornadas",
            descricao: "Modelagem de perfis e mapeamento de jornadas.",
          },
          {
            id: "arquitetura-informacao",
            name: "Arquitetura da Informação",
            descricao: "Organização de conteúdos e fluxos de navegação.",
          },
          {
            id: "testes-heuristicas",
            name: "Testes e Heurísticas",
            descricao: "Avaliações com usuários e heurísticas de usabilidade.",
          },
        ],
      },
      {
        id: "ui-design",
        name: "UI Design",
        competencias: [
          {
            id: "design-visual",
            name: "Design Visual",
            descricao: "Hierarquia, tipografia, cor e composição.",
          },
          {
            id: "prototipos",
            name: "Protótipos Interativos",
            descricao: "Fluxos clicáveis e validação de interação.",
          },
          {
            id: "design-system",
            name: "Design System",
            descricao: "Bibliotecas de componentes, tokens e consistência visual.",
          },
          {
            id: "justificativas-visuais",
            descricao: "Racional de escolhas e documentação de decisão.",
          },
        ],
      },
    ],
  },
];


// ============ CARGOS ============
export const MOCK_CARGOS: Cargo[] = [
  {
    id_cargo: 'estagiario',
    nome_cargo: 'Estagiário',
    descricao: 'Desenvolvedor em fase inicial de carreira',
    created_at: new Date('2024-01-01'),
  },
  {
    id_cargo: 'junior',
    nome_cargo: 'Desenvolvedor Junior',
    descricao: 'Desenvolvedor em fase inicial de carreira',
    created_at: new Date('2024-01-01'),
  },
  {
    id_cargo: 'pleno',
    nome_cargo: 'Desenvolvedor Pleno',
    descricao: 'Desenvolvedor com experiência intermediária',
    created_at: new Date('2024-01-01'),
  },
  {
    id_cargo: 'senior',
    nome_cargo: 'Desenvolvedor Sênior',
    descricao: 'Desenvolvedor com vasta experiência',
    created_at: new Date('2024-01-01'),
  },
  {
    id_cargo: 'especialista',
    nome_cargo: 'Especialista',
    descricao: 'Especialista técnico',
    created_at: new Date('2024-01-01'),
  },
  {
    id_cargo: 'cargo-003', // Mantido para compatibilidade, mas idealmente deveria ser um dos acima
    nome_cargo: 'Designer Sênior',
    descricao: 'Designer com vasta experiência',
    created_at: new Date('2024-01-01'),
  },
  {
    id_cargo: 'cargo-004', // Mantido para compatibilidade
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
  { id_competencia: 'comunicacao', nome: 'Comunicação', tipo: 'COMPORTAMENTAL', descricao: 'Habilidade de comunicação', created_at: new Date('2024-01-01') },
  { id_competencia: 'trabalho-equipe', nome: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', descricao: 'Colaboração em equipe', created_at: new Date('2024-01-01') },
  { id_competencia: 'lideranca', nome: 'Liderança', tipo: 'COMPORTAMENTAL', descricao: 'Capacidade de liderança', created_at: new Date('2024-01-01') },
  { id_competencia: 'resolucao-problemas', nome: 'Resolução de Problemas', tipo: 'COMPORTAMENTAL', descricao: 'Solução de problemas', created_at: new Date('2024-01-01') },
  { id_competencia: 'adaptabilidade', nome: 'Adaptabilidade', tipo: 'COMPORTAMENTAL', descricao: "Ajustar-se a novas condições e desafios com flexibilidade.", created_at: new Date('2024-01-01') },
  { id_competencia: 'aprendizado', nome: 'Vontade de Aprender', tipo: 'COMPORTAMENTAL', descricao: "Demonstrar curiosidade e iniciativa para adquirir novos conhecimentos.", created_at: new Date('2024-01-01') },
  { id_competencia: 'lideranca-tecnica', nome: 'Liderança Técnica', tipo: 'COMPORTAMENTAL', descricao: "Orientar e influenciar tecnicamente outros membros da equipe.", created_at: new Date('2024-01-01') },
  { id_competencia: 'pensamento-critico', nome: 'Pensamento Crítico', tipo: 'COMPORTAMENTAL', descricao: "Analisar informações de forma objetiva e tomar decisões estratégicas.", created_at: new Date('2024-01-01') },
  { id_competencia: 'mentoria', nome: 'Mentoria', tipo: 'COMPORTAMENTAL', descricao: "Capacidade de ensinar e desenvolver outros membros da equipe.", created_at: new Date('2024-01-01') },
  { id_competencia: 'visao-negocio', nome: 'Visão de Negócio', tipo: 'COMPORTAMENTAL', descricao: "Compreender e alinhar as entregas técnicas com os objetivos do negócio.", created_at: new Date('2024-01-01') },
  { id_competencia: 'iniciativa', nome: 'Iniciativa e Proatividade', tipo: 'COMPORTAMENTAL', descricao: "Agir antecipadamente, identificando oportunidades e riscos.", created_at: new Date('2024-01-01') },
  
  // Frontend (cat-002, esp-001)
  { id_competencia: 'react', nome: 'React', tipo: 'TECNICA', descricao: 'Framework React', created_at: new Date('2024-01-01') },
  { id_competencia: 'typescript', nome: 'TypeScript', tipo: 'TECNICA', descricao: 'Linguagem TypeScript', created_at: new Date('2024-01-01') },
  { id_competencia: 'css-tailwind', nome: 'CSS/Tailwind', tipo: 'TECNICA', descricao: 'Estilização', created_at: new Date('2024-01-01') },
  { id_competencia: 'design-responsivo', nome: 'Design Responsivo (HTML/CSS)', tipo: 'TECNICA', descricao: 'Construção de UI responsivas com boas práticas de layout e semântica.', created_at: new Date('2024-01-01') },
  { id_competencia: 'interatividade-js', nome: 'Interatividade (JavaScript/DOM)', tipo: 'TECNICA', descricao: 'Criação de interfaces interativas e manipulação do DOM.', created_at: new Date('2024-01-01') },
  { id_competencia: 'performance-web', nome: 'Otimização de Performance Web', tipo: 'TECNICA', descricao: 'Melhorias de carregamento, renderização e métricas web vitais.', created_at: new Date('2024-01-01') },
  { id_competencia: 'acessibilidade-web', nome: 'Desenvolvimento Acessível', tipo: 'TECNICA', descricao: 'Garantia de acessibilidade (WAI-ARIA) e inclusão em interfaces web.', created_at: new Date('2024-01-01') },

  // Backend (cat-002, esp-002)
  { id_competencia: 'nodejs', nome: 'Node.js', tipo: 'TECNICA', descricao: 'Runtime Node.js', created_at: new Date('2024-01-01') },
  { id_competencia: 'api-rest', nome: 'Desenvolvimento de API REST', tipo: 'TECNICA', descricao: 'APIs RESTful', created_at: new Date('2024-01-01') },
  { id_competencia: 'sql', nome: 'SQL', tipo: 'TECNICA', descricao: 'Banco de dados SQL', created_at: new Date('2024-01-01') },
  { id_competencia: 'modelagem-sql-nosql', nome: 'Modelagem e Consultas SQL/NoSQL', tipo: 'TECNICA', descricao: 'Projetar esquemas e escrever consultas eficientes.', created_at: new Date('2024-01-01') },
  { id_competencia: 'regras-negocio', nome: 'Implementação de Regras de Negócio', tipo: 'TECNICA', descricao: 'Codificação de lógicas de domínio e validações no servidor.', created_at: new Date('2024-01-01') },
  { id_competencia: 'autenticacao-acesso', nome: 'Autenticação e Controle de Acesso', tipo: 'TECNICA', descricao: 'Sessões, tokens, OAuth2/OpenID e autorização por papéis.', created_at: new Date('2024-01-01') },
  
  // Machine Learning (cat-003, esp-003)
  { id_competencia: 'python', nome: 'Python', tipo: 'TECNICA', descricao: 'Linguagem Python', created_at: new Date('2024-01-01') },
  { id_competencia: 'tensorflow', nome: 'TensorFlow', tipo: 'TECNICA', descricao: 'Framework TensorFlow', created_at: new Date('2024-01-01') },
  { id_competencia: 'algoritmos-ml', nome: 'Algoritmos ML', tipo: 'TECNICA', descricao: 'Algoritmos de ML', created_at: new Date('2024-01-01') },
  { id_competencia: 'modelagem-preditiva', nome: 'Modelagem Preditiva', tipo: 'TECNICA', descricao: 'Seleção de algoritmos, tuning e validação cruzada.', created_at: new Date('2024-01-01') },
  { id_competencia: 'treino-avaliacao', nome: 'Treinamento e Avaliação', tipo: 'TECNICA', descricao: 'Métricas, overfitting/underfitting e experimentação.', created_at: new Date('2024-01-01') },
  { id_competencia: 'bibliotecas-ml', nome: 'Uso de Bibliotecas de ML', tipo: 'TECNICA', descricao: 'Aplicação prática com frameworks do ecossistema.', created_at: new Date('2024-01-01') },
  { id_competencia: 'interpretacao-resultados', nome: 'Interpretação de Resultados', tipo: 'TECNICA', descricao: 'Explicabilidade, feature importance e limitações.', created_at: new Date('2024-01-01') },

  // Data Engineering (cat-003, esp-004)
  { id_competencia: 'apache-spark', nome: 'Apache Spark', tipo: 'TECNICA', descricao: 'Framework Spark', created_at: new Date('2024-01-01') },
  { id_competencia: 'etl-pipelines', nome: 'ETL Pipelines', tipo: 'TECNICA', descricao: 'Pipelines ETL', created_at: new Date('2024-01-01') },
  { id_competencia: 'etl', nome: 'ETL', tipo: 'TECNICA', descricao: 'Extração, transformação e carga de dados de múltiplas fontes.', created_at: new Date('2024-01-01') },
  { id_competencia: 'eda', nome: 'Análise Exploratória', tipo: 'TECNICA', descricao: 'Explorar dados, tratar outliers e hipóteses iniciais.', created_at: new Date('2024-01-01') },
  { id_competencia: 'visualizacao-dados', nome: 'Visualização de Dados', tipo: 'TECNICA', descricao: 'Criação de gráficos e dashboards para tomada de decisão.', created_at: new Date('2024-01-01') },
  { id_competencia: 'comunicacao-insights', nome: 'Comunicação de Insights', tipo: 'TECNICA', descricao: 'Storytelling com dados e suporte a decisões do negócio.', created_at: new Date('2024-01-01') },
  
  // Cloud & Infrastructure (cat-004, esp-005)
  { id_competencia: 'docker', nome: 'Docker', tipo: 'TECNICA', descricao: 'Containerização', created_at: new Date('2024-01-01') },
  { id_competencia: 'kubernetes', nome: 'Kubernetes', tipo: 'TECNICA', descricao: 'Orquestração', created_at: new Date('2024-01-01') },
  { id_competencia: 'aws-gcp', nome: 'AWS/GCP', tipo: 'TECNICA', descricao: 'Cloud providers', created_at: new Date('2024-01-01') },
  { id_competencia: 'monitoramento', nome: 'Monitoramento', tipo: 'TECNICA', descricao: 'Coleta de métricas e observabilidade de serviços.', created_at: new Date('2024-01-01') },
  { id_competencia: 'cloud-services', nome: 'Serviços de Nuvem', tipo: 'TECNICA', descricao: 'Provisionamento e operação em provedores cloud.', created_at: new Date('2024-01-01') },
  { id_competencia: 'troubleshooting', nome: 'Troubleshooting', tipo: 'TECNICA', descricao: 'Diagnóstico e mitigação de incidentes de produção.', created_at: new Date('2024-01-01') },
  { id_competencia: 'integracao-continua', nome: 'Integração Contínua', tipo: 'TECNICA', descricao: 'Pipelines de build e testes automatizados.', created_at: new Date('2024-01-01') },
  { id_competencia: 'entrega-continua', nome: 'Entrega Contínua', tipo: 'TECNICA', descricao: 'Estratégias de release e deploy automatizado.', created_at: new Date('2024-01-01') },
  { id_competencia: 'iac', nome: 'Infraestrutura como Código (IaC)', tipo: 'TECNICA', descricao: 'Provisionamento automatizado e versionado de infra.', created_at: new Date('2024-01-01') },
  { id_competencia: 'fluxos-colaborativos', nome: 'Fluxos Colaborativos', tipo: 'TECNICA', descricao: 'Práticas DevOps e colaboração entre times.', created_at: new Date('2024-01-01') },
];

// ============ MAPEAMENTO ESPECIALIZAÇÃO -> COMPETÊNCIAS ============
export const ESPECIALIZACAO_COMPETENCIAS = {
  'frontend-web': ['design-responsivo', 'interatividade-js', 'performance-web', 'acessibilidade-web'],
  'backend-web': ['api-rest', 'modelagem-sql-nosql', 'regras-negocio', 'autenticacao-acesso'],
  'mobile-nativo': ['programacao-nativa', 'recursos-nativos', 'publicacao-lojas', 'padroes-ui-ux-plataforma'],
  'mobile-cross': ['reutilizacao-codigo', 'estado-mobile', 'integracao-apis-mobile', 'teste-debug-mobile'],
  'analise-viz': ['etl', 'eda', 'visualizacao-dados', 'comunicacao-insights'],
  'machine-learning': ['modelagem-preditiva', 'treino-avaliacao', 'bibliotecas-ml', 'interpretacao-resultados'],
  'infra-containers': ['docker', 'monitoramento', 'cloud-services', 'troubleshooting'],
  'ci-cd-automacao': ['integracao-continua', 'entrega-continua', 'iac', 'fluxos-colaborativos'],
  'appsec': ['owasp', 'criptografia', 'autenticacao-segura', 'postura-etica'],
  'infra-segura': ['iam', 'hardening', 'seguranca-rede', 'resposta-incidentes'],
  'ux-research': ['entrevistas', 'personas-jornadas', 'arquitetura-informacao', 'testes-heuristicas'],
  'ui-design': ['design-visual', 'prototipos', 'design-system', 'justificativas-visuais'],
};


export const MOCK_PERFORMANCE: LideradoPerformance[] = [
  {
    id_liderado: 'lid-001',
    nome_liderado: 'Antonio Pereira',
    cargo: 'Desenvolvedor Junior',
    cargo_id: 'junior',
    nivel_maturidade: 'M1',
    eixo_x_tecnico_geral: 2.2,
    eixo_y_comportamental: 2.75,
    categoria_dominante: 'Desenvolvimento Web',
    especializacao_dominante: 'Frontend Web',
    sexo: 'MASCULINO',
    data_nascimento: '2000-08-12',
    idade: 23,
    competencias: [
      { id_competencia: 'comunicacao', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.5 },
      { id_competencia: 'trabalho-equipe', nome_competencia: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.0 },
      { id_competencia: 'adaptabilidade', nome_competencia: 'Adaptabilidade', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.0 },
      { id_competencia: 'aprendizado', nome_competencia: 'Vontade de Aprender', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.5 },
      { id_competencia: 'design-responsivo', nome_competencia: 'Design Responsivo (HTML/CSS)', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'frontend-web', nome_especializacao: 'Frontend Web', media_pontuacao: 2.5 },
      { id_competencia: 'interatividade-js', nome_competencia: 'Interatividade (JavaScript/DOM)', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'frontend-web', nome_especializacao: 'Frontend Web', media_pontuacao: 2.0 },
      { id_competencia: 'performance-web', nome_competencia: 'Otimização de Performance Web', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'frontend-web', nome_especializacao: 'Frontend Web', media_pontuacao: 3.0 },
      { id_competencia: 'api-rest', nome_competencia: 'Criação e Gestão de APIs (REST)', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend-web', nome_especializacao: 'Backend Web', media_pontuacao: 1.5 },
      { id_competencia: 'modelagem-sql-nosql', nome_competencia: 'Modelagem e Consultas SQL/NoSQL', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend-web', nome_especializacao: 'Backend Web', media_pontuacao: 2.0 },
    ],
  },
  {
    id_liderado: 'lid-003',
    nome_liderado: 'Lara Mendes',
    cargo: 'Designer Sênior',
    cargo_id: 'senior',
    nivel_maturidade: 'M4',
    eixo_x_tecnico_geral: 3.4,
    eixo_y_comportamental: 2.75,
    categoria_dominante: 'UX/UI Design',
    especializacao_dominante: 'UI Design',
    sexo: 'FEMININO',
    data_nascimento: '1993-11-25',
    idade: 30,
    competencias: [
      { id_competencia: 'lideranca-tecnica', nome_competencia: 'Liderança Técnica', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.5 },
      { id_competencia: 'pensamento-critico', nome_competencia: 'Pensamento Crítico', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.0 },
      { id_competencia: 'mentoria', nome_competencia: 'Mentoria', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.5 },
      { id_competencia: 'visao-negocio', nome_competencia: 'Visão de Negócio', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.0 },
      { id_competencia: 'design-visual', nome_competencia: 'Design Visual', tipo: 'TECNICA', id_categoria: 'ux-ui', nome_categoria: 'UX/UI Design', id_especializacao: 'ui-design', nome_especializacao: 'UI Design', media_pontuacao: 4.0 },
      { id_competencia: 'prototipos', nome_competencia: 'Protótipos Interativos', tipo: 'TECNICA', id_categoria: 'ux-ui', nome_categoria: 'UX/UI Design', id_especializacao: 'ui-design', nome_especializacao: 'UI Design', media_pontuacao: 3.5 },
      { id_competencia: 'design-system', nome_competencia: 'Design System', tipo: 'TECNICA', id_categoria: 'ux-ui', nome_categoria: 'UX/UI Design', id_especializacao: 'ui-design', nome_especializacao: 'UI Design', media_pontuacao: 4.0 },
      { id_competencia: 'entrevistas', nome_competencia: 'Entrevistas', tipo: 'TECNICA', id_categoria: 'ux-ui', nome_categoria: 'UX/UI Design', id_especializacao: 'ux-research', nome_especializacao: 'UX Research', media_pontuacao: 3.0 },
      { id_competencia: 'personas-jornadas', nome_competencia: 'Personas e Jornadas', tipo: 'TECNICA', id_categoria: 'ux-ui', nome_categoria: 'UX/UI Design', id_especializacao: 'ux-research', nome_especializacao: 'UX Research', media_pontuacao: 2.5 },
    ],
  },
  {
    id_liderado: 'lid-005',
    nome_liderado: 'Mariana Costa',
    cargo: 'Desenvolvedor Pleno',
    cargo_id: 'pleno',
    nivel_maturidade: 'M4',
    eixo_x_tecnico_geral: 2.5,
    eixo_y_comportamental: 2.75,
    categoria_dominante: 'Desenvolvimento Web',
    especializacao_dominante: 'Backend Web',
    sexo: 'FEMININO',
    data_nascimento: '1996-09-05',
    idade: 27,
    competencias: [
      { id_competencia: 'comunicacao', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.0 },
      { id_competencia: 'trabalho-equipe', nome_competencia: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.5 },
      { id_competencia: 'resolucao-problemas', nome_competencia: 'Resolução de Problemas', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.5 },
      { id_competencia: 'iniciativa', nome_competencia: 'Iniciativa e Proatividade', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.0 },
      { id_competencia: 'nodejs', nome_competencia: 'Node.js', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend-web', nome_especializacao: 'Backend Web', media_pontuacao: 3.0 },
      { id_competencia: 'api-rest', nome_competencia: 'Criação e Gestão de APIs (REST)', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend-web', nome_especializacao: 'Backend Web', media_pontuacao: 2.5 },
      { id_competencia: 'modelagem-sql-nosql', nome_competencia: 'Modelagem e Consultas SQL/NoSQL', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend-web', nome_especializacao: 'Backend Web', media_pontuacao: 2.5 },
      { id_competencia: 'docker', nome_competencia: 'Docker', tipo: 'TECNICA', id_categoria: 'cloud-devops', nome_categoria: 'Cloud e DevOps', id_especializacao: 'infra-containers', nome_especializacao: 'Infraestrutura e Containers', media_pontuacao: 2.0 },
    ],
  },
  {
    id_liderado: 'lid-004',
    nome_liderado: 'Roberto Lima',
    cargo: 'Desenvolvedor Pleno',
    cargo_id: 'pleno',
    nivel_maturidade: 'M4',
    eixo_x_tecnico_geral: 2.8,
    eixo_y_comportamental: 2.5,
    categoria_dominante: 'Desenvolvimento Web',
    especializacao_dominante: 'Backend Web',
    sexo: 'MASCULINO',
    data_nascimento: '1995-02-10',
    idade: 29,
    competencias: [
      { id_competencia: 'comunicacao', nome_competencia: 'Comunicação', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.5 },
      { id_competencia: 'trabalho-equipe', nome_competencia: 'Trabalho em Equipe', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.0 },
      { id_competencia: 'resolucao-problemas', nome_competencia: 'Resolução de Problemas', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 3.0 },
      { id_competencia: 'iniciativa', nome_competencia: 'Iniciativa e Proatividade', tipo: 'COMPORTAMENTAL', id_categoria: 'cat-001', nome_categoria: 'Soft Skills', id_especializacao: null, nome_especializacao: null, media_pontuacao: 2.5 },
      { id_competencia: 'nodejs', nome_competencia: 'Node.js', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend-web', nome_especializacao: 'Backend Web', media_pontuacao: 3.5 },
      { id_competencia: 'api-rest', nome_competencia: 'Criação e Gestão de APIs (REST)', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend-web', nome_especializacao: 'Backend Web', media_pontuacao: 3.0 },
      { id_competencia: 'modelagem-sql-nosql', nome_competencia: 'Modelagem e Consultas SQL/NoSQL', tipo: 'TECNICA', id_categoria: 'dev-web', nome_categoria: 'Desenvolvimento Web', id_especializacao: 'backend-web', nome_especializacao: 'Backend Web', media_pontuacao: 3.0 },
      { id_competencia: 'docker', nome_competencia: 'Docker', tipo: 'TECNICA', id_categoria: 'cloud-devops', nome_categoria: 'Cloud e DevOps', id_especializacao: 'infra-containers', nome_especializacao: 'Infraestrutura e Containers', media_pontuacao: 2.5 },
      { id_competencia: 'kubernetes', nome_competencia: 'Kubernetes', tipo: 'TECNICA', id_categoria: 'cloud-devops', nome_categoria: 'Cloud e DevOps', id_especializacao: 'infra-containers', nome_especializacao: 'Infraestrutura e Containers', media_pontuacao: 2.0 },
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