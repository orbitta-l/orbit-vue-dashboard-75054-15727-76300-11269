export interface TechnicalSkillTemplate {
  id: string;
  name: string;
  description: string;
}

export interface TechnicalCategoryTemplate {
  id: string;
  name: string;
  description: string;
  skills: TechnicalSkillTemplate[];
}

export const technicalTemplates: TechnicalCategoryTemplate[] = [
  {
    id: "big-data-ia",
    name: "BIG DATA/IA",
    description: "Competências em análise de dados e inteligência artificial",
    skills: [
      { id: "python", name: "Python", description: "Programação em Python para análise de dados" },
      { id: "sql", name: "SQL", description: "Consultas e manipulação de bancos de dados" },
      { id: "machine-learning", name: "Machine Learning", description: "Algoritmos e modelos de aprendizado de máquina" },
      { id: "data-visualization", name: "Visualização de Dados", description: "Criação de dashboards e gráficos" },
      { id: "statistics", name: "Estatística", description: "Análise estatística e probabilidade" },
    ]
  },
  {
    id: "desenvolvimento-web",
    name: "Desenvolvimento Web",
    description: "Competências em desenvolvimento de aplicações web",
    skills: [
      { id: "html-css", name: "HTML/CSS", description: "Estruturação e estilização de páginas web" },
      { id: "javascript", name: "JavaScript", description: "Programação JavaScript para web" },
      { id: "react", name: "React", description: "Desenvolvimento com React" },
      { id: "nodejs", name: "Node.js", description: "Desenvolvimento backend com Node.js" },
      { id: "apis", name: "APIs REST", description: "Criação e consumo de APIs REST" },
    ]
  },
  {
    id: "devops",
    name: "DevOps",
    description: "Competências em infraestrutura e automação",
    skills: [
      { id: "docker", name: "Docker", description: "Containerização de aplicações" },
      { id: "kubernetes", name: "Kubernetes", description: "Orquestração de containers" },
      { id: "ci-cd", name: "CI/CD", description: "Integração e entrega contínua" },
      { id: "cloud", name: "Cloud Computing", description: "Serviços em nuvem (AWS, Azure, GCP)" },
      { id: "monitoring", name: "Monitoramento", description: "Monitoramento e observabilidade" },
    ]
  },
  {
    id: "mobile",
    name: "Desenvolvimento Mobile",
    description: "Competências em desenvolvimento de aplicações móveis",
    skills: [
      { id: "react-native", name: "React Native", description: "Desenvolvimento mobile multiplataforma" },
      { id: "ios", name: "iOS (Swift)", description: "Desenvolvimento nativo iOS" },
      { id: "android", name: "Android (Kotlin)", description: "Desenvolvimento nativo Android" },
      { id: "mobile-ui", name: "UI/UX Mobile", description: "Design de interfaces mobile" },
      { id: "mobile-testing", name: "Testes Mobile", description: "Testes e qualidade em apps mobile" },
    ]
  },
  {
    id: "product-design",
    name: "Product Design",
    description: "Competências em design de produto e UX",
    skills: [
      { id: "figma", name: "Figma", description: "Design de interfaces no Figma" },
      { id: "ux-research", name: "UX Research", description: "Pesquisa com usuários" },
      { id: "prototyping", name: "Prototipação", description: "Criação de protótipos interativos" },
      { id: "design-systems", name: "Design Systems", description: "Criação e manutenção de design systems" },
      { id: "accessibility", name: "Acessibilidade", description: "Design acessível e inclusivo" },
    ]
  },
];
