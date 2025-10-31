import { TemplateCargo } from "@/types/mer";

// ==================================
// TEMPLATES DE CARGO (SOFT SKILLS) - MER 5.0
// ==================================

export const softSkillTemplates: TemplateCargo[] = [
  {
    id_template: "tpl_estagiario",
    id_cargo: "cargo_estagiario",
    origem: "GENÉRICO",
    ativo: true,
    competencias: [
      { id_competencia: "soft_comunicacao", peso: 2, nota_ideal: 3.0 },
      { id_competencia: "soft_trabalho_equipe", peso: 3, nota_ideal: 3.0 },
      { id_competencia: "soft_capacidade_aprendizado", peso: 3, nota_ideal: 4.0 },
      { id_competencia: "soft_iniciativa", peso: 2, nota_ideal: 3.0 },
      { id_competencia: "soft_adaptabilidade", peso: 2, nota_ideal: 3.0 },
    ],
  },
  {
    id_template: "tpl_junior",
    id_cargo: "cargo_junior",
    origem: "GENÉRICO",
    ativo: true,
    competencias: [
      { id_competencia: "soft_comunicacao", peso: 2, nota_ideal: 3.0 },
      { id_competencia: "soft_trabalho_equipe", peso: 3, nota_ideal: 3.0 },
      { id_competencia: "soft_organizacao", peso: 2, nota_ideal: 3.0 },
      { id_competencia: "soft_foco_resultados", peso: 3, nota_ideal: 4.0 },
      { id_competencia: "soft_proatividade", peso: 3, nota_ideal: 4.0 },
    ],
  },
  // Adicionar outros templates de cargo aqui (Pleno, Sênior, etc.)
];

// ==================================
// TEMPLATE TÉCNICO (HARD SKILLS) - MER 5.0
// Estruturado em cascata: Categoria -> Especialização -> Competências
// ==================================

export const technicalTemplate = [
  {
    id_categoria: "cat_dev_web",
    nome_categoria: "Desenvolvimento Web",
    especializacoes: [
      {
        id_especializacao: "spec_frontend",
        nome_especializacao: "Frontend",
        competencias: [
          { id_competencia: "hard_react", nome_competencia: "React" },
          { id_competencia: "hard_typescript", nome_competencia: "TypeScript" },
          { id_competencia: "hard_css_tailwind", nome_competencia: "CSS/Tailwind" },
        ],
      },
      {
        id_especializacao: "spec_backend",
        nome_especializacao: "Backend",
        competencias: [
          { id_competencia: "hard_nodejs", nome_competencia: "Node.js" },
          { id_competencia: "hard_api_rest", nome_competencia: "API REST" },
          { id_competencia: "hard_sql", nome_competencia: "SQL" },
        ],
      },
    ],
  },
  {
    id_categoria: "cat_devops",
    nome_categoria: "DevOps",
    especializacoes: [
      {
        id_especializacao: "spec_cloud_infra",
        nome_especializacao: "Cloud & Infrastructure",
        competencias: [
          { id_competencia: "hard_docker", nome_competencia: "Docker" },
          { id_competencia: "hard_kubernetes", nome_competencia: "Kubernetes" },
          { id_competencia: "hard_aws_gcp", nome_competencia: "AWS/GCP" },
        ],
      },
    ],
  },
  // Adicionar outras categorias aqui (Big Data, UI/UX, etc.)
];