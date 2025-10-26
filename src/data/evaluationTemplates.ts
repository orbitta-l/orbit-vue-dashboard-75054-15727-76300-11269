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
    cargo_id: "estagiario",
    cargo_nome: "Estagiário",
    competencias: [
      { id: "comunicacao", name: "Comunicação", description: "Capacidade de expressar ideias de forma clara e ouvir atentamente.", peso: 2, nivel_ideal: 3.5 },
      { id: "trabalho-equipe", name: "Trabalho em Equipe", description: "Colaborar efetivamente com outros para alcançar objetivos comuns.", peso: 3, nivel_ideal: 4.0 },
      { id: "adaptabilidade", name: "Adaptabilidade", description: "Ajustar-se a novas condições e desafios com flexibilidade.", peso: 2, nivel_ideal: 3.5 },
      { id: "aprendizado", name: "Vontade de Aprender", description: "Demonstrar curiosidade e iniciativa para adquirir novos conhecimentos.", peso: 3, nivel_ideal: 4.0 },
    ],
  },
  {
    cargo_id: "especialista",
    cargo_nome: "Especialista I",
    competencias: [
      { id: "lideranca-tecnica", name: "Liderança Técnica", description: "Orientar e influenciar tecnicamente outros membros da equipe.", peso: 3, nivel_ideal: 4.0 },
      { id: "pensamento-critico", name: "Pensamento Crítico", description: "Analisar informações de forma objetiva e tomar decisões fundamentadas.", peso: 3, nivel_ideal: 4.0 },
      { id: "inteligencia-emocional", name: "Inteligência Emocional", description: "Gerenciar as próprias emoções e compreender as dos outros.", peso: 2, nivel_ideal: 3.5 },
      { id: "resolucao-problemas-complexos", name: "Resolução de Problemas Complexos", description: "Identificar e solucionar problemas multifacetados de forma eficaz.", peso: 3, nivel_ideal: 4.0 },
    ],
  },
  // Adicionar outros cargos aqui (junior, pleno, senior)
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
          { id: "design-responsivo", name: "Design Responsivo (HTML/CSS)", description: "..." },
          { id: "interatividade-js", name: "Interatividade (JavaScript/DOM)", description: "..." },
          { id: "performance-web", name: "Otimização de Performance Web", description: "..." },
          { id: "acessibilidade-web", name: "Desenvolvimento Acessível", description: "..." },
        ],
      },
      {
        id: "backend",
        name: "Backend Web",
        competencias: [
          { id: "api-rest", name: "Criação e Gestão de APIs (REST)", description: "..." },
          { id: "modelagem-dados", name: "Modelagem e Consultas SQL/NoSQL", description: "..." },
          { id: "regras-negocio", name: "Implementação de Regras de Negócio", description: "..." },
          { id: "autenticacao", name: "Autenticação e Controle de Acesso", description: "..." },
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
        id: "nativo",
        name: "Desenvolvimento Nativo",
        competencias: [
            { id: "prog-especifica", name: "Programação Específica (iOS/Android)", description: "..." },
            { id: "recursos-nativos", name: "Uso de Recursos Nativos (Câmera, GPS)", description: "..." },
        ],
      },
      {
        id: "cross-platform",
        name: "Cross-Platform",
        competencias: [
            { id: "reutilizacao-codigo", name: "Reutilização de Código", description: "..." },
            { id: "gerenciamento-estado", name: "Gerenciamento de Estado", description: "..." },
        ],
      },
    ],
  },
  // Adicionar outras categorias (Ciência de Dados, DevOps, etc.)
];

// ==================================
// MAPEAMENTO DE CARGO PARA CATEGORIAS TÉCNICAS
// ==================================

export const cargoToCategoryMapping: Record<string, string[]> = {
  "estagiario": ["dev-web", "dev-mobile"],
  "junior": ["dev-web", "dev-mobile"],
  "pleno": ["dev-web", "dev-mobile", "devops"],
  "senior": ["dev-web", "dev-mobile", "devops", "data-science"],
  "especialista": ["dev-web", "dev-mobile", "devops", "data-science", "security", "ux-ui"],
};