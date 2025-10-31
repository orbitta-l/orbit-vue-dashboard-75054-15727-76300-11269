import { CompetenciaTipo } from "@/types/mer";
import { Code, Smartphone, Database, Cloud, Shield, LayoutDashboard } from "lucide-react";

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
  description: string;
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
  icon?: React.ElementType; // Adicionado para ícones
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
    icon: Code,
    especializacoes: [
      {
        id: "frontend-web",
        name: "Frontend Web",
        competencias: [
          {
            id: "design-responsivo",
            name: "Design Responsivo (HTML/CSS)",
            description: "Construção de UI responsivas com boas práticas de layout e semântica.",
          },
          {
            id: "interatividade-js",
            name: "Interatividade (JavaScript/DOM)",
            description: "Criação de interfaces interativas e manipulação do DOM.",
          },
          {
            id: "performance-web",
            name: "Otimização de Performance Web",
            description: "Melhorias de carregamento, renderização e métricas web vitais.",
          },
          {
            id: "acessibilidade-web",
            name: "Desenvolvimento Acessível",
            description: "Garantia de acessibilidade (WAI-ARIA) e inclusão em interfaces web.",
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
            description: "Modelagem de endpoints, versionamento e boas práticas REST.",
          },
          {
            id: "modelagem-sql-nosql",
            name: "Modelagem e Consultas SQL/NoSQL",
            description: "Projetar esquemas e escrever consultas eficientes.",
          },
          {
            id: "regras-negocio",
            name: "Implementação de Regras de Negócio",
            description: "Codificação de lógicas de domínio e validações no servidor.",
          },
          {
            id: "autenticacao-acesso",
            name: "Autenticação e Controle de Acesso",
            description: "Sessões, tokens, OAuth2/OpenID e autorização por papéis.",
          },
        ],
      },
    ],
  },
  {
    id: "dev-mobile",
    name: "Desenvolvimento Mobile",
    tipo: "TECNICA",
    icon: Smartphone,
    especializacoes: [
      {
        id: "mobile-nativo",
        name: "Desenvolvimento Nativo",
        competencias: [
          {
            id: "programacao-nativa",
            name: "Programação Específica (iOS/Android)",
            description: "Desenvolvimento com linguagens/plataformas nativas.",
          },
          {
            id: "recursos-nativos",
            name: "Uso de Recursos Nativos",
            description: "Integração com câmera, GPS, notificações e sensores.",
          },
          {
            id: "publicacao-lojas",
            name: "Publicação em Lojas de Aplicativos",
            description: "Empacotamento, requisitos e processos de publicação.",
          },
          {
            id: "padroes-ui-ux-plataforma",
            name: "Padrões de Design de Plataforma (UI/UX)",
            description: "Aderência a Material, Human Interface e guidelines nativas.",
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
            description: "Compartilhamento de lógica e componentes multi-plataforma.",
          },
          {
            id: "estado-mobile",
            name: "Gerenciamento de Estado",
            description: "Arquiteturas de estado previsível e performático.",
          },
          {
            id: "integracao-apis-mobile",
            name: "Integração com APIs",
            description: "Consumo, cache e sincronização de dados remotos.",
          },
          {
            id: "teste-debug-mobile",
            name: "Teste e Debugging",
            description: "Estratégias de testes, logs e inspeção de problemas.",
          },
        ],
      },
    ],
  },
  {
    id: "data-ai",
    name: "Ciência de Dados e IA",
    tipo: "TECNICA",
    icon: Database,
    especializacoes: [
      {
        id: "analise-viz",
        name: "Análise e Visualização",
        competencias: [
          {
            id: "etl",
            name: "ETL",
            description: "Extração, transformação e carga de dados de múltiplas fontes.",
          },
          {
            id: "eda",
            name: "Análise Exploratória",
            description: "Explorar dados, tratar outliers e hipóteses iniciais.",
          },
          {
            id: "visualizacao-dados",
            name: "Visualização de Dados",
            description: "Criação de gráficos e dashboards para tomada de decisão.",
          },
          {
            id: "comunicacao-insights",
            name: "Comunicação de Insights",
            description: "Storytelling com dados e suporte a decisões do negócio.",
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
            description: "Seleção de algoritmos, tuning e validação cruzada.",
          },
          {
            id: "treino-avaliacao",
            name: "Treinamento e Avaliação",
            description: "Métricas, overfitting/underfitting e experimentação.",
          },
          {
            id: "bibliotecas-ml",
            name: "Uso de Bibliotecas de ML",
            description: "Aplicação prática com frameworks do ecossistema.",
          },
          {
            id: "interpretacao-resultados",
            name: "Interpretação de Resultados",
            description: "Explicabilidade, feature importance e limitações.",
          },
        ],
      },
    ],
  },
  {
    id: "cloud-devops",
    name: "Cloud e DevOps",
    tipo: "TECNICA",
    icon: Cloud,
    especializacoes: [
      {
        id: "infra-containers",
        name: "Infraestrutura e Containers",
        competencias: [
          {
            id: "docker",
            name: "Docker",
            description: "Criação e gerenciamento de imagens e contêineres.",
          },
          {
            id: "monitoramento",
            name: "Monitoramento",
            description: "Coleta de métricas e observabilidade de serviços.",
          },
          {
            id: "cloud-services",
            name: "Serviços de Nuvem",
            description: "Provisionamento e operação em provedores cloud.",
          },
          {
            id: "troubleshooting",
            name: "Troubleshooting",
            description: "Diagnóstico e mitigação de incidentes de produção.",
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
            description: "Pipelines de build e testes automatizados.",
          },
          {
            id: "entrega-continua",
            name: "Entrega Contínua",
            description: "Estratégias de release e deploy automatizado.",
          },
          {
            id: "iac",
            name: "Infraestrutura como Código (IaC)",
            description: "Provisionamento automatizado e versionado de infra.",
          },
          {
            id: "fluxos-colaborativos",
            name: "Fluxos Colaborativos",
            description: "Práticas DevOps e colaboração entre times.",
          },
        ],
      },
    ],
  },
  {
    id: "sec-info",
    name: "Segurança da Informação",
    tipo: "TECNICA",
    icon: Shield,
    especializacoes: [
      {
        id: "appsec",
        name: "AppSec",
        competencias: [
          {
            id: "owasp",
            name: "OWASP",
            description: "Boas práticas e mitigação contra vulnerabilidades comuns.",
          },
          {
            id: "criptografia",
            name: "Criptografia",
            description: "Primitivas, hashing e armazenamento seguro.",
          },
          {
            id: "autenticacao-segura",
            name: "Autenticação Segura",
            description: "Padrões de segurança (OAuth2/OpenID) e proteção de sessão.",
          },
          {
            id: "postura-etica",
            name: "Postura Ética",
            description: "Ética profissional e responsabilidade no manuseio de dados.",
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
            description: "Gestão de identidades, permissões e políticas.",
          },
          {
            id: "hardening",
            name: "Hardening",
            description: "Endurecimento de SO/serviços e redução de superfície de ataque.",
          },
          {
            id: "seguranca-rede",
            name: "Segurança de Rede",
            description: "Segmentação, firewalls e proteção de tráfego.",
          },
          {
            id: "resposta-incidentes",
            name: "Resposta a Incidentes",
            description: "Detecção, contenção e lições aprendidas.",
          },
        ],
      },
    ],
  },
  {
    id: "ux-ui",
    name: "UX/UI Design",
    tipo: "TECNICA",
    icon: LayoutDashboard,
    especializacoes: [
      {
        id: "ux-research",
        name: "UX Research",
        competencias: [
          {
            id: "entrevistas",
            name: "Entrevistas",
            description: "Coleta estruturada de necessidades e dores do usuário.",
          },
          {
            id: "personas-jornadas",
            name: "Personas e Jornadas",
            description: "Modelagem de perfis e mapeamento de jornadas.",
          },
          {
            id: "arquitetura-informacao",
            name: "Arquitetura da Informação",
            description: "Organização de conteúdos e fluxos de navegação.",
          },
          {
            id: "testes-heuristicas",
            name: "Testes e Heurísticas",
            description: "Avaliações com usuários e heurísticas de usabilidade.",
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
            description: "Hierarquia, tipografia, cor e composição.",
          },
          {
            id: "prototipos",
            name: "Protótipos Interativos",
            description: "Fluxos clicáveis e validação de interação.",
          },
          {
            id: "design-system",
            name: "Design System",
            description: "Bibliotecas de componentes, tokens e consistência visual.",
          },
          {
            id: "justificativas-visuais",
            name: "Justificativas Visuais",
            description: "Racional de escolhas e documentação de decisão.",
          },
        ],
      },
    ],
  },
];