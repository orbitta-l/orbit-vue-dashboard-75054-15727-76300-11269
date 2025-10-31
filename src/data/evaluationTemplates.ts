import { CompetenciaTipo } from "@/types/mer";

// ==================================
// INTERFACES PARA OS TEMPLATES
// ==================================

export interface SoftSkill {
  id: string;
  name: string;
  description: string;
  peso: 1 | 2 | 3;
  nivel_ideal: number;
}

export interface SoftSkillTemplate {
  cargo_id: string;
  cargo_nome: string;
  competencias: SoftSkill[];
}

export interface TechnicalCompetency {
  id: string;
  name: string;
  descricao: string; // Garantindo que 'descricao' está presente
}

export interface TechnicalSpecialization {
  id: string;
  name: string;
  competencias: TechnicalCompetency[];
}

export interface TechnicalCategory {
  id: string;
  name: string;
  tipo: CompetenciaTipo;
  especializacoes: TechnicalSpecialization[];
}

// ==================================
// TEMPLATES DE SOFT SKILLS (POR CARGO)
// ==================================

export const softSkillTemplates: SoftSkillTemplate[] = [
  {
    cargo_id: "junior",
    cargo_nome: "Desenvolvedor Junior",
    competencias: [
      { id: "comunicacao", name: "Comunicação", description: "Capacidade de expressar ideias de forma clara e ouvir atentamente.", peso: 2, nivel_ideal: 3.0 },
      { id: "trabalho-equipe", name: "Trabalho em Equipe", description: "Colaborar efetivamente com outros para alcançar objetivos comuns.", peso: 3, nivel_ideal: 3.5 },
      { id: "adaptabilidade", name: "Adaptabilidade", description: "Ajustar-se a novas condições e desafios com flexibilidade.", peso: 2, nivel_ideal: 3.5 },
      { id: "aprendizado", name: "Vontade de Aprender", description: "Demonstrar curiosidade e iniciativa para adquirir novos conhecimentos.", peso: 3, nivel_ideal: 4.0 },
    ],
  },
  {
    cargo_id: "pleno",
    cargo_nome: "Desenvolvedor Pleno",
    competencias: [
      { id: "comunicacao", name: "Comunicação", description: "Expressar ideias complexas de forma clara e objetiva, mediando discussões.", peso: 3, nivel_ideal: 3.5 },
      { id: "trabalho-equipe", name: "Trabalho em Equipe", description: "Colaborar e influenciar positivamente a equipe, propondo soluções.", peso: 3, nivel_ideal: 4.0 },
      { id: "resolucao-problemas", name: "Resolução de Problemas", description: "Identificar, analisar e resolver problemas de forma autônoma.", peso: 3, nivel_ideal: 4.0 },
      { id: "iniciativa", name: "Iniciativa e Proatividade", description: "Agir antecipadamente, identificando oportunidades e riscos.", peso: 2, nivel_ideal: 3.5 },
    ],
  },
  {
    cargo_id: "senior",
    cargo_nome: "Designer Sênior",
    competencias: [
      { id: "lideranca-tecnica", name: "Liderança Técnica", description: "Orientar e influenciar tecnicamente outros membros da equipe.", peso: 3, nivel_ideal: 4.0 },
      { id: "pensamento-critico", name: "Pensamento Crítico", description: "Analisar informações de forma objetiva e tomar decisões estratégicas.", peso: 3, nivel_ideal: 4.0 },
      { id: "mentoria", name: "Mentoria", description: "Capacidade de ensinar e desenvolver outros membros da equipe.", peso: 2, nivel_ideal: 3.5 },
      { id: "visao-negocio", name: "Visão de Negócio", description: "Compreender e alinhar as entregas técnicas com os objetivos do negócio.", peso: 2, nivel_ideal: 3.0 },
    ],
  },
];

// ==================================
// TEMPLATES DE HARD SKILLS (HIERÁRQUICO)
// ==================================

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
            descricao: "Melhorias de carregamento, renderização e métricas web vitais.",
          },
          {
            id: "acessibilidade-web",
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
            descricao: "Modelagem de endpoints, versionamento e boas práticas REST.",
          },
          {
            id: "modelagem-sql-nosql",
            descricao: "Projetar esquemas e escrever consultas eficientes.",
          },
          {
            id: "regras-negocio",
            descricao: "Codificação de lógicas de domínio e validações no servidor.",
          },
          {
            id: "autenticacao-acesso",
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
            descricao: "Desenvolvimento com linguagens/plataformas nativas.",
          },
          {
            id: "recursos-nativos",
            descricao: "Integração com câmera, GPS, notificações e sensores.",
          },
          {
            id: "publicacao-lojas",
            descricao: "Empacotamento, requisitos e processos de publicação.",
          },
          {
            id: "padroes-ui-ux-plataforma",
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
            descricao: "Compartilhamento de lógica e componentes multi-plataforma.",
          },
          {
            id: "estado-mobile",
            descricao: "Arquiteturas de estado previsível e performático.",
          },
          {
            id: "integracao-apis-mobile",
            descricao: "Consumo, cache e sincronização de dados remotos.",
          },
          {
            id: "teste-debug-mobile",
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
            descricao: "Extração, transformação e carga de dados de múltiplas fontes.",
          },
          {
            id: "eda",
            descricao: "Explorar dados, tratar outliers e hipóteses iniciais.",
          },
          {
            id: "visualizacao-dados",
            descricao: "Criação de gráficos e dashboards para tomada de decisão.",
          },
          {
            id: "comunicacao-insights",
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
            descricao: "Seleção de algoritmos, tuning e validação cruzada.",
          },
          {
            id: "treino-avaliacao",
            descricao: "Métricas, overfitting/underfitting e experimentação.",
          },
          {
            id: "bibliotecas-ml",
            descricao: "Aplicação prática com frameworks do ecossistema.",
          },
          {
            id: "interpretacao-resultados",
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
            descricao: "Criação e gerenciamento de imagens e contêineres.",
          },
          {
            id: "monitoramento",
            descricao: "Coleta de métricas e observabilidade de serviços.",
          },
          {
            id: "cloud-services",
            descricao: "Provisionamento e operação em provedores cloud.",
          },
          {
            id: "troubleshooting",
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
            descricao: "Pipelines de build e testes automatizados.",
          },
          {
            id: "entrega-continua",
            descricao: "Estratégias de release e deploy automatizado.",
          },
          {
            id: "iac",
            descricao: "Provisionamento automatizado e versionado de infra.",
          },
          {
            id: "fluxos-colaborativos",
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
            descricao: "Boas práticas e mitigação contra vulnerabilidades comuns.",
          },
          {
            id: "criptografia",
            descricao: "Primitivas, hashing e armazenamento seguro.",
          },
          {
            id: "autenticacao-segura",
            descricao: "Padrões de segurança (OAuth2/OpenID) e proteção de sessão.",
          },
          {
            id: "postura-etica",
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
            descricao: "Gestão de identidades, permissões e políticas.",
          },
          {
            id: "hardening",
            descricao: "Endurecimento de SO/serviços e redução de superfície de ataque.",
          },
          {
            id: "seguranca-rede",
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
            descricao: "Coleta estruturada de necessidades e dores do usuário.",
          },
          {
            id: "personas-jornadas",
            descricao: "Modelagem de perfis e mapeamento de jornadas.",
          },
          {
            id: "arquitetura-informacao",
            descricao: "Organização de conteúdos e fluxos de navegação.",
          },
          {
            id: "testes-heuristicas",
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
            descricao: "Hierarquia, tipografia, cor e composição.",
          },
          {
            id: "prototipos",
            descricao: "Fluxos clicáveis e validação de interação.",
          },
          {
            id: "design-system",
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