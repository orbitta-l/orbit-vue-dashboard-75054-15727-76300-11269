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
        id: "frontend",
        name: "Frontend Web",
        competencias: [
          { id: "react", name: "React", description: "Construção de interfaces reativas e componentizadas." },
          { id: "typescript", name: "TypeScript", description: "Desenvolvimento com tipagem estática para maior robustez." },
          { id: "css-tailwind", name: "CSS/Tailwind", description: "Estilização e design de interfaces responsivas." },
        ],
      },
      {
        id: "backend",
        name: "Backend Web",
        competencias: [
          { id: "nodejs", name: "Node.js", description: "Desenvolvimento de servidores e APIs com JavaScript." },
          { id: "api-rest", name: "Desenvolvimento de API REST", description: "Criação e gestão de APIs seguindo o padrão RESTful." },
          { id: "sql", name: "SQL", description: "Modelagem e consulta a bancos de dados relacionais." },
        ],
      },
    ],
  },
  {
    id: "devops",
    name: "DevOps",
    tipo: "TECNICA",
    especializacoes: [
      {
        id: "cloud-infra",
        name: "Cloud & Infrastructure",
        competencias: [
            { id: "docker", name: "Docker", description: "Criação e gerenciamento de contêineres." },
            { id: "kubernetes", name: "Kubernetes", description: "Orquestração de contêineres em larga escala." },
            { id: "aws-gcp", name: "AWS/GCP", description: "Gerenciamento de recursos em provedores de nuvem." },
        ],
      },
    ],
  },
];

// ==================================
// MAPEAMENTO DE CARGO PARA CATEGORIAS TÉCNICAS
// ==================================

export const cargoToCategoryMapping: Record<string, string[]> = {
  "junior": ["dev-web"],
  "pleno": ["dev-web", "devops"],
  "senior": ["dev-web", "devops"],
};