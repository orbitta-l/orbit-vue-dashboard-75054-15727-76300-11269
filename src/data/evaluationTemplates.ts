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
  descricao: string; // Alterado de 'description' para 'descricao'
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
            name: "Resposta a Incidentes",
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
            name: "Justificativas Visuais",
            descricao: "Racional de escolhas e documentação de decisão.",
          },
        ],
      },
    ],
  },
];