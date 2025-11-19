import { NivelMaturidade } from "@/types/mer";

export const generateMaturitySummary = (maturity: NivelMaturidade | 'N/A'): string => {
  switch (maturity) {
    case 'M1':
      return "Você está na fase M1: construindo as bases. O foco agora é desenvolver tanto as competências técnicas quanto as comportamentais para ganhar mais autonomia.";
    case 'M2':
      return "Você está na fase M2: possui uma base comportamental sólida. O próximo passo é aprofundar seu conhecimento técnico para se tornar uma referência em sua área.";
    case 'M3':
      return "Você está na fase M3: sua expertise técnica é um diferencial. O foco agora é aprimorar suas habilidades de comunicação e influência para ampliar seu impacto.";
    case 'M4':
      return "Você está na fase M4: um profissional completo e referência para a equipe. Continue mentorando outros e buscando novos desafios para se manter na vanguarda.";
    default:
      return "Sua jornada de desenvolvimento está prestes a começar. Aguarde a primeira avaliação para descobrir seus pontos fortes e oportunidades.";
  }
};