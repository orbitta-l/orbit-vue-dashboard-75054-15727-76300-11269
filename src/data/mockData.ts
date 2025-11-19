import { Cargo, Categoria, Especializacao, Competencia } from "@/types/mer";

// ============ CATÁLOGOS BASE (ESTÁTICOS) ============

export const MOCK_CARGOS: Cargo[] = [
  { id_cargo: "cargo_tech_lead", nome_cargo: "Tech Lead", descricao: "Líder técnico de equipe", ativo: true },
  { id_cargo: "cargo_estagiario", nome_cargo: "Estagiário", descricao: "Nível inicial", ativo: true },
  { id_cargo: "cargo_especialista_i", nome_cargo: "Especialista I", descricao: "Nível especialista", ativo: true },
  { id_cargo: "cargo_junior", nome_cargo: "Desenvolvedor Júnior", descricao: "Nível júnior", ativo: false },
  { id_cargo: "cargo_pleno", nome_cargo: "Desenvolvedor Pleno", descricao: "Nível pleno", ativo: false },
];

export const MOCK_CATEGORIAS: Categoria[] = [
  { id_categoria: "cat_soft_skills", nome_categoria: "Soft Skills", tipo: "COMPORTAMENTAL", descricao: "Competências comportamentais" },
  { id_categoria: "2", nome_categoria: "Desenvolvimento Web", tipo: "TECNICA", descricao: "Competências relacionadas ao desenvolvimento de aplicações web" },
  { id_categoria: "3", nome_categoria: "Desenvolvimento Mobile", tipo: "TECNICA", descricao: "Competências relacionadas ao desenvolvimento de aplicações mobile" },
  { id_categoria: "4", nome_categoria: "Ciência de Dados e IA", tipo: "TECNICA", descricao: "Competências relacionadas a dados e inteligência artificial" },
  { id_categoria: "5", nome_categoria: "Cloud e DevOps", tipo: "TECNICA", descricao: "Competências relacionadas a infraestrutura e operações" },
  { id_categoria: "6", nome_categoria: "Segurança da Informação", tipo: "TECNICA", descricao: "Competências relacionadas a segurança de sistemas" },
  { id_categoria: "7", nome_categoria: "UX/UI Design", tipo: "TECNICA", descricao: "Competências relacionadas a experiência do usuário e design de interface" },
];

export const MOCK_ESPECIALIZACOES: Especializacao[] = [
  { id_especializacao: "1", id_categoria: "2", nome_especializacao: "Frontend Web", descricao: "Desenvolvimento de interfaces de usuário" },
  { id_especializacao: "2", id_categoria: "2", nome_especializacao: "Backend Web", descricao: "Desenvolvimento de lógica de servidor e APIs" },
  { id_especializacao: "3", id_categoria: "3", nome_especializacao: "Desenvolvimento Nativo", descricao: "Desenvolvimento para iOS e Android" },
  { id_especializacao: "4", id_categoria: "3", nome_especializacao: "Cross-Platform", descricao: "Desenvolvimento para múltiplas plataformas" },
  { id_especializacao: "5", id_categoria: "4", nome_especializacao: "Análise e Visualização", descricao: "Análise e visualização de dados" },
  { id_especializacao: "6", id_categoria: "4", nome_especializacao: "Machine Learning", descricao: "Modelos de aprendizado de máquina" },
  { id_especializacao: "7", id_categoria: "5", nome_especializacao: "Infraestrutura e Containers", descricao: "Gerenciamento de infraestrutura e containers" },
  { id_especializacao: "8", id_categoria: "5", nome_especializacao: "CI/CD e Automação", descricao: "Integração e entrega contínua" },
  { id_especializacao: "9", id_categoria: "6", nome_especializacao: "AppSec", descricao: "Segurança de aplicações" },
  { id_especializacao: "10", id_categoria: "6", nome_especializacao: "Infraestrutura Segura", descricao: "Segurança de infraestrutura" },
  { id_especializacao: "11", id_categoria: "7", nome_especializacao: "UX Research", descricao: "Pesquisa com usuários" },
  { id_especializacao: "12", id_categoria: "7", nome_especializacao: "UI Design", descricao: "Design de interfaces" },
];

export const MOCK_COMPETENCIAS: Competencia[] = [
  // Soft Skills (IDs 1 a 10)
  { id_competencia: "1", nome_competencia: "Comunicação", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Capacidade de expressar ideias de forma clara e ouvir atentamente." },
  { id_competencia: "2", nome_competencia: "Trabalho em Equipe", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Colaborar efetivamente com outros para alcançar objetivos comuns." },
  { id_competencia: "3", nome_competencia: "Adaptabilidade", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Ajustar-se a novas condições e desafios com flexibilidade." },
  { id_competencia: "4", nome_competencia: "Vontade de Aprender", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Demonstrar curiosidade e iniciativa para adquirir novos conhecimentos." },
  { id_competencia: "5", nome_competencia: "Resolução de Problemas", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Identificar, analisar e resolver problemas de forma autônoma." },
  { id_competencia: "6", nome_competencia: "Iniciativa e Proatividade", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Agir antecipadamente, identificando oportunidades e riscos." },
  { id_competencia: "7", nome_competencia: "Liderança Técnica", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Orientar e influenciar tecnicamente outros membros da equipe." },
  { id_competencia: "8", nome_competencia: "Pensamento Crítico", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Analisar informações de forma objetiva e tomar decisões estratégicas." },
  { id_competencia: "9", nome_competencia: "Mentoria", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Capacidade de ensinar e desenvolver outros membros da equipe." },
  { id_competencia: "10", nome_competencia: "Visão de Negócio", tipo: "COMPORTAMENTAL", id_especializacao: null, descricao: "Compreender e alinhar as entregas técnicas com os objetivos do negócio." },
  // Hard Skills (IDs 11 a 36)
  { id_competencia: "11", nome_competencia: "Design Responsivo (HTML/CSS)", tipo: "TECNICA", id_especializacao: "1", descricao: "Construção de UI responsivas com boas práticas de layout e semântica." },
  { id_competencia: "12", nome_competencia: "Interatividade (JavaScript/DOM)", tipo: "TECNICA", id_especializacao: "1", descricao: "Criação de interfaces interativas e manipulação do DOM." },
  { id_competencia: "13", nome_competencia: "Otimização de Performance Web", tipo: "TECNICA", id_especializacao: "1", descricao: "Melhorias de carregamento, renderização e métricas web vitais." },
  { id_competencia: "14", nome_competencia: "Desenvolvimento Acessível", tipo: "TECNICA", id_especializacao: "1", descricao: "Garantia de acessibilidade (WAI-ARIA) e inclusão em interfaces web." },
  { id_competencia: "15", nome_competencia: "Criação e Gestão de APIs (REST)", tipo: "TECNICA", id_especializacao: "2", descricao: "Modelagem de endpoints, versionamento e boas práticas REST." },
  { id_competencia: "16", nome_competencia: "Modelagem e Consultas SQL/NoSQL", tipo: "TECNICA", id_especializacao: "2", descricao: "Projetar esquemas e escrever consultas eficientes." },
  { id_competencia: "17", nome_competencia: "Implementação de Regras de Negócio", tipo: "TECNICA", id_especializacao: "2", descricao: "Codificação de lógicas de domínio e validações no servidor." },
  { id_competencia: "18", nome_competencia: "Autenticação e Controle de Acesso", tipo: "TECNICA", id_especializacao: "2", descricao: "Sessões, tokens, OAuth2/OpenID e autorização por papéis." },
  { id_competencia: "19", nome_competencia: "iOS Swift/Kotlin", tipo: "TECNICA", id_especializacao: "3", descricao: "Desenvolvimento nativo para iOS e Android." },
  { id_competencia: "20", nome_competencia: "Flutter/React Native", tipo: "TECNICA", id_especializacao: "4", descricao: "Desenvolvimento cross-platform." },
  { id_competencia: "21", nome_competencia: "Estatística Aplicada", tipo: "TECNICA", id_especializacao: "5", descricao: "Uso de métodos estatísticos para análise de dados." },
  { id_competencia: "22", nome_competencia: "Visualização de Dados (D3/Tableau)", tipo: "TECNICA", id_especializacao: "5", descricao: "Criação de dashboards e relatórios visuais." },
  { id_competencia: "23", nome_competencia: "Redes Neurais", tipo: "TECNICA", id_especializacao: "6", descricao: "Implementação de modelos de Machine Learning." },
  { id_competencia: "24", nome_competencia: "Processamento de Linguagem Natural (NLP)", tipo: "TECNICA", id_especializacao: "6", descricao: "Tratamento de dados textuais." },
  { id_competencia: "25", nome_competencia: "Docker e Kubernetes", tipo: "TECNICA", id_especializacao: "7", descricao: "Gerenciamento de containers e orquestração." },
  { id_competencia: "26", nome_competencia: "Infraestrutura como Código (Terraform)", tipo: "TECNICA", id_especializacao: "7", descricao: "Provisionamento de infraestrutura via código." },
  { id_competencia: "27", nome_competencia: "Pipelines CI/CD (GitLab/Jenkins)", tipo: "TECNICA", id_especializacao: "8", descricao: "Automação de build, teste e deploy." },
  { id_competencia: "28", nome_competencia: "Monitoramento e Logging (Prometheus/ELK)", tipo: "TECNICA", id_especializacao: "8", descricao: "Observabilidade de sistemas." },
  { id_competencia: "29", nome_competencia: "Análise de Vulnerabilidades", tipo: "TECNICA", id_especializacao: "9", descricao: "Identificação de falhas de segurança em aplicações." },
  { id_competencia: "30", nome_competencia: "OWASP Top 10", tipo: "TECNICA", id_especializacao: "9", descricao: "Conhecimento e mitigação das principais falhas web." },
  { id_competencia: "31", nome_competencia: "Hardening de Servidores", tipo: "TECNICA", id_especializacao: "10", descricao: "Configuração segura de sistemas operacionais e redes." },
  { id_competencia: "32", nome_competencia: "Gestão de Identidade e Acesso (IAM)", tipo: "TECNICA", id_especializacao: "10", descricao: "Controle de acesso em ambientes cloud." },
  { id_competencia: "33", nome_competencia: "Entrevistas e Testes de Usabilidade", tipo: "TECNICA", id_especializacao: "11", descricao: "Condução de pesquisa qualitativa e quantitativa." },
  { id_competencia: "34", nome_competencia: "Criação de Personas e Jornadas", tipo: "TECNICA", id_especializacao: "11", descricao: "Mapeamento da experiência do usuário." },
  { id_competencia: "35", nome_competencia: "Design System e Componentização", tipo: "TECNICA", id_especializacao: "12", descricao: "Criação e manutenção de bibliotecas de componentes." },
  { id_competencia: "36", nome_competencia: "Prototipagem (Figma/Sketch)", tipo: "TECNICA", id_especializacao: "12", descricao: "Criação de protótipos de alta fidelidade." },
];