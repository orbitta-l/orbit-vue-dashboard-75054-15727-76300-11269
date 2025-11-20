import { TemplateCargo } from "@/types/mer";

// ==================================
// TEMPLATES DE CARGO (SOFT SKILLS) - MER 5.0
// Apenas Estagiario e Especialista I; mesmas competencias para ambos,
// variando pesos e notas ideais (peso nunca diminui ao subir de cargo).
// ==================================

const allBehavioralCompetencies = [
  "1", // Comunicacao
  "2", // Trabalho em Equipe
  "3", // Adaptabilidade
  "4", // Vontade de Aprender
  "5", // Resolucao de Problemas
  "6", // Iniciativa e Proatividade
  "7", // Lideranca Tecnica
  "8", // Pensamento Critico
  "9", // Mentoria
  "10", // Visao de Negocio
];

type WeightConfig = Record<string, { peso: number; ideal: number }>;

const estagiarioWeights: WeightConfig = {
  "1": { peso: 2, ideal: 3.0 },
  "2": { peso: 3, ideal: 3.0 },
  "3": { peso: 2, ideal: 3.0 },
  "4": { peso: 3, ideal: 4.0 },
  "6": { peso: 2, ideal: 3.0 },
};

const especialistaWeights: WeightConfig = {
  "1": { peso: 3, ideal: 4.0 },
  "2": { peso: 2, ideal: 4.0 },
  "3": { peso: 2, ideal: 4.0 },
  "4": { peso: 2, ideal: 4.0 },
  "5": { peso: 3, ideal: 4.0 },
  "6": { peso: 2, ideal: 4.0 },
  "7": { peso: 4, ideal: 4.0 },
  "8": { peso: 3, ideal: 4.0 },
  "9": { peso: 2, ideal: 4.0 },
  "10": { peso: 4, ideal: 4.0 },
};

const buildCompetencias = (weights: WeightConfig) =>
  allBehavioralCompetencies.map((id) => {
    const cfg = weights[id];
    return {
      id_competencia: id,
      peso: cfg?.peso ?? 0,
      nota_ideal: cfg?.ideal ?? 4.0,
    };
  });

export const softSkillTemplates: TemplateCargo[] = [
  {
    id_template: "tpl_estagiario",
    id_cargo: "cargo_estagiario",
    origem: "GENERICO",
    ativo: true,
    competencias: buildCompetencias(estagiarioWeights),
  },
  {
    id_template: "tpl_especialista_i",
    id_cargo: "cargo_especialista_i",
    origem: "GENERICO",
    ativo: true,
    competencias: buildCompetencias(especialistaWeights),
  },
];

// ==================================
// TEMPLATE TECNICO (HARD SKILLS) - MER 5.0
// Estruturado em cascata: Categoria -> Especializacao -> Competencias
// ==================================

export const technicalTemplate = [
  {
    id_categoria: "2",
    nome_categoria: "Desenvolvimento Web",
    especializacoes: [
      {
        id_especializacao: "1",
        nome_especializacao: "Frontend Web",
        competencias: [
          { id_competencia: "11", nome_competencia: "Design Responsivo (HTML/CSS)" },
          { id_competencia: "12", nome_competencia: "Interatividade (JavaScript/DOM)" },
          { id_competencia: "13", nome_competencia: "Otimizacao de Performance Web" },
          { id_competencia: "14", nome_competencia: "Desenvolvimento Acessivel" },
        ],
      },
      {
        id_especializacao: "2",
        nome_especializacao: "Backend Web",
        competencias: [
          { id_competencia: "15", nome_competencia: "Criacao e Gestao de APIs (REST)" },
          { id_competencia: "16", nome_competencia: "Modelagem e Consultas SQL/NoSQL" },
          { id_competencia: "17", nome_competencia: "Implementacao de Regras de Negocio" },
          { id_competencia: "18", nome_competencia: "Autenticacao e Controle de Acesso" },
        ],
      },
    ],
  },
  {
    id_categoria: "3",
    nome_categoria: "Desenvolvimento Mobile",
    especializacoes: [
      {
        id_especializacao: "3",
        nome_especializacao: "Desenvolvimento Nativo",
        competencias: [{ id_competencia: "19", nome_competencia: "iOS Swift/Kotlin" }],
      },
      {
        id_especializacao: "4",
        nome_especializacao: "Cross-Platform",
        competencias: [{ id_competencia: "20", nome_competencia: "Flutter/React Native" }],
      },
    ],
  },
  {
    id_categoria: "4",
    nome_categoria: "Ciencia de Dados e IA",
    especializacoes: [
      {
        id_especializacao: "5",
        nome_especializacao: "Analise e Visualizacao",
        competencias: [
          { id_competencia: "21", nome_competencia: "Estatistica Aplicada" },
          { id_competencia: "22", nome_competencia: "Visualizacao de Dados (D3/Tableau)" },
        ],
      },
      {
        id_especializacao: "6",
        nome_especializacao: "Machine Learning",
        competencias: [
          { id_competencia: "23", nome_competencia: "Redes Neurais" },
          { id_competencia: "24", nome_competencia: "Processamento de Linguagem Natural (NLP)" },
        ],
      },
    ],
  },
  {
    id_categoria: "5",
    nome_categoria: "Cloud e DevOps",
    especializacoes: [
      {
        id_especializacao: "7",
        nome_especializacao: "Infraestrutura e Containers",
        competencias: [
          { id_competencia: "25", nome_competencia: "Docker e Kubernetes" },
          { id_competencia: "26", nome_competencia: "Infraestrutura como Codigo (Terraform)" },
        ],
      },
      {
        id_especializacao: "8",
        nome_especializacao: "CI/CD e Automacao",
        competencias: [
          { id_competencia: "27", nome_competencia: "Pipelines CI/CD (GitLab/Jenkins)" },
          { id_competencia: "28", nome_competencia: "Monitoramento e Logging (Prometheus/ELK)" },
        ],
      },
    ],
  },
  {
    id_categoria: "6",
    nome_categoria: "Seguranca da Informacao",
    especializacoes: [
      {
        id_especializacao: "9",
        nome_especializacao: "AppSec",
        competencias: [
          { id_competencia: "29", nome_competencia: "Analise de Vulnerabilidades" },
          { id_competencia: "30", nome_competencia: "OWASP Top 10" },
        ],
      },
      {
        id_especializacao: "10",
        nome_especializacao: "Infraestrutura Segura",
        competencias: [
          { id_competencia: "31", nome_competencia: "Hardening de Servidores" },
          { id_competencia: "32", nome_competencia: "Gestao de Identidade e Acesso (IAM)" },
        ],
      },
    ],
  },
  {
    id_categoria: "7",
    nome_categoria: "UX/UI Design",
    especializacoes: [
      {
        id_especializacao: "11",
        nome_especializacao: "UX Research",
        competencias: [
          { id_competencia: "33", nome_competencia: "Entrevistas e Testes de Usabilidade" },
          { id_competencia: "34", nome_competencia: "Criacao de Personas e Jornadas" },
        ],
      },
      {
        id_especializacao: "12",
        nome_especializacao: "UI Design",
        competencias: [
          { id_competencia: "35", nome_competencia: "Design System e Componentizacao" },
          { id_competencia: "36", nome_competencia: "Prototipagem (Figma/Sketch)" },
        ],
      },
    ],
  },
];
