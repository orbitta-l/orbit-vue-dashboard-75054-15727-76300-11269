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
      { id_competencia: "1", peso: 2, nota_ideal: 3.0 }, // Comunicação
      { id_competencia: "2", peso: 3, nota_ideal: 3.0 }, // Trabalho em Equipe
      { id_competencia: "4", peso: 3, nota_ideal: 4.0 }, // Vontade de Aprender
      { id_competencia: "6", peso: 2, nota_ideal: 3.0 }, // Iniciativa e Proatividade
      { id_competencia: "3", peso: 2, nota_ideal: 3.0 }, // Adaptabilidade
    ],
  },
  {
    id_template: "tpl_junior",
    id_cargo: "cargo_junior",
    origem: "GENÉRICO",
    ativo: true,
    competencias: [
      { id_competencia: "1", peso: 2, nota_ideal: 3.0 }, // Comunicação
      { id_competencia: "2", peso: 3, nota_ideal: 3.0 }, // Trabalho em Equipe
      { id_competencia: "5", peso: 2, nota_ideal: 3.0 }, // Resolução de Problemas
      { id_competencia: "10", peso: 3, nota_ideal: 4.0 }, // Visão de Negócio
      { id_competencia: "6", peso: 3, nota_ideal: 4.0 }, // Iniciativa e Proatividade
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
    id_categoria: "5",
    nome_categoria: "Cloud e DevOps",
    especializacoes: [
      {
        id_especializacao: "7",
        nome_especializacao: "Infraestrutura e Containers",
        competencias: [
          // Mantendo as competências antigas, mas elas não estão na nova lista de 18.
          // Vou removê-las para evitar referências a IDs inexistentes.
          // Se precisar de novas competências para Cloud/DevOps, me avise.
        ],
      },
    ],
  },
  // Adicionar outras categorias aqui (Mobile, Data/AI, etc.)
];