import { TemplateCargo } from "@/types/mer";

// ==================================
// TEMPLATES DE CARGO (SOFT SKILLS) - MER 5.0
// Apenas Estagiário e Especialista I possuem templates definidos
// ==================================

export const softSkillTemplates: TemplateCargo[] = [
  {
    id_template: "tpl_estagiario",
    id_cargo: "cargo_estagiario",
    origem: "GENÉRICO",
    ativo: true,
    competencias: [
      { id_competencia: "1", peso: 2, nota_ideal: 3.0 }, // Comunicação
      { id_competencia: "2", peso: 3, nota_ideal: 3.0 }, // Trabalho em Equipe
      { id_competencia: "4", peso: 3, nota_ideal: 4.0 }, // Vontade de Aprender
      { id_competencia: "6", peso: 2, nota_ideal: 3.0 }, // Iniciativa e Proatividade
      { id_competencia: "3", peso: 2, nota_ideal: 3.0 }, // Adaptabilidade
    ],
  },
  {
    id_template: "tpl_especialista_i",
    id_cargo: "cargo_especialista_i",
    origem: "GENÉRICO",
    ativo: true,
    competencias: [
      { id_competencia: "1", peso: 3, nota_ideal: 4.0 }, // Comunicação
      { id_competencia: "5", peso: 3, nota_ideal: 4.0 }, // Resolução de Problemas
      { id_competencia: "7", peso: 4, nota_ideal: 4.0 }, // Liderança Técnica
      { id_competencia: "8", peso: 3, nota_ideal: 4.0 }, // Pensamento Crítico
      { id_competencia: "10", peso: 4, nota_ideal: 4.0 }, // Visão de Negócio
    ],
  },
];

// ==================================
// TEMPLATE TÉCNICO (HARD SKILLS) - MER 5.0
// Estruturado em cascata: Categoria -> Especialização -> Competências
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
          { id_competencia: "13", nome_competencia: "Otimização de Performance Web" },
          { id_competencia: "14", nome_competencia: "Desenvolvimento Acessível" },
        ],
      },
      {
        id_especializacao: "2",
        nome_especializacao: "Backend Web",
        competencias: [
          { id_competencia: "15", nome_competencia: "Criação e Gestão de APIs (REST)" },
          { id_competencia: "16", nome_competencia: "Modelagem e Consultas SQL/NoSQL" },
          { id_competencia: "17", nome_competencia: "Implementação de Regras de Negócio" },
          { id_competencia: "18", nome_competencia: "Autenticação e Controle de Acesso" },
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
        competencias: [
          { id_competencia: "19", nome_competencia: "iOS Swift/Kotlin" },
        ],
      },
      {
        id_especializacao: "4",
        nome_especializacao: "Cross-Platform",
        competencias: [
          { id_competencia: "20", nome_competencia: "Flutter/React Native" },
        ],
      },
    ],
  },
  {
    id_categoria: "4",
    nome_categoria: "Ciência de Dados e IA",
    especializacoes: [
      {
        id_especializacao: "5",
        nome_especializacao: "Análise e Visualização",
        competencias: [
          { id_competencia: "21", nome_competencia: "Estatística Aplicada" },
          { id_competencia: "22", nome_competencia: "Visualização de Dados (D3/Tableau)" },
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
          { id_competencia: "26", nome_competencia: "Infraestrutura como Código (Terraform)" },
        ],
      },
      {
        id_especializacao: "8",
        nome_especializacao: "CI/CD e Automação",
        competencias: [
          { id_competencia: "27", nome_competencia: "Pipelines CI/CD (GitLab/Jenkins)" },
          { id_competencia: "28", nome_competencia: "Monitoramento e Logging (Prometheus/ELK)" },
        ],
      },
    ],
  },
  {
    id_categoria: "6",
    nome_categoria: "Segurança da Informação",
    especializacoes: [
      {
        id_especializacao: "9",
        nome_especializacao: "AppSec",
        competencias: [
          { id_competencia: "29", nome_competencia: "Análise de Vulnerabilidades" },
          { id_competencia: "30", nome_competencia: "OWASP Top 10" },
        ],
      },
      {
        id_especializacao: "10",
        nome_especializacao: "Infraestrutura Segura",
        competencias: [
          { id_competencia: "31", nome_competencia: "Hardening de Servidores" },
          { id_competencia: "32", nome_competencia: "Gestão de Identidade e Acesso (IAM)" },
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
          { id_competencia: "34", nome_competencia: "Criação de Personas e Jornadas" },
        ],
      },
      {
        id_especializacao: "12",
        nome_especializacao: "UI Design",
        competencias: [
          { id_competencia: "35", nome_competencia: "Design System e Componentização" },
          { id_competencia: "36", nome_competencia: "Prototipagem (Figma/Sketch)" },
        ],
      },
    ],
  },
];