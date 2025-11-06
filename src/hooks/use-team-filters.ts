import { useState, useMemo, useCallback } from "react";
import { LideradoDashboard, NivelMaturidade, SexoTipo } from "@/types/mer";
import { technicalTemplate } from "@/data/evaluationTemplates";

interface ActiveFilters {
  maturity: NivelMaturidade[] | 'all';
  category: string | 'all';
  specialization: string | 'all';
  competency: string | 'all';
  age: string | 'all'; // Ex: '<21', '21-29', '30-39', '40+'
  gender: SexoTipo | 'all';
}

const initialFilters: ActiveFilters = {
  maturity: 'all',
  category: 'all',
  specialization: 'all',
  competency: 'all',
  age: 'all',
  gender: 'all',
};

const AGE_RANGES: Record<string, { min: number, max: number }> = {
  '<21': { min: 0, max: 20 },
  '21-29': { min: 21, max: 29 },
  '30-39': { min: 30, max: 39 },
  '40+': { min: 40, max: 150 },
};

export function useTeamFilters(teamData: LideradoDashboard[], searchName: string) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(initialFilters);

  const resetFilters = useCallback(() => {
    setActiveFilters(initialFilters);
  }, []);

  const setFilter = useCallback(<K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).filter(value => 
      (Array.isArray(value) && value.length > 0) || 
      (typeof value === 'string' && value !== 'all' && value !== '')
    ).length;
  }, [activeFilters]);

  const filteredMembers = useMemo(() => {
    let members = teamData;

    // 1. Filtro de Nome
    if (searchName) {
      members = members.filter(member =>
        member.nome.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // 2. Aplicação de Filtros Ativos
    members = members.filter(member => {
      const { ultima_avaliacao, sexo, idade, competencias } = member;
      const { maturity, category, specialization, competency, age, gender } = activeFilters;

      // Maturidade
      if (maturity !== 'all' && Array.isArray(maturity) && ultima_avaliacao) {
        if (!maturity.includes(ultima_avaliacao.maturidade_quadrante)) return false;
      }

      // Gênero
      if (gender !== 'all' && sexo !== gender) return false;

      // Idade
      if (age !== 'all') {
        const range = AGE_RANGES[age];
        if (idade < range.min || idade > range.max) return false;
      }

      // Filtros de Competência (só se o membro tiver sido avaliado)
      if (ultima_avaliacao) {
        // Categoria
        if (category !== 'all') {
          const hasCategory = competencias.some(c => c.categoria_nome === category);
          if (!hasCategory) return false;
        }

        // Especialização
        if (specialization !== 'all') {
          const hasSpecialization = competencias.some(c => c.especializacao_nome === specialization);
          if (!hasSpecialization) return false;
        }

        // Competência Específica
        if (competency !== 'all') {
          const hasCompetency = competencias.some(c => c.nome_competencia === competency && c.pontuacao_1a4 > 0);
          if (!hasCompetency) return false;
        }
      } else {
        // Se filtros técnicos/maturidade estão ativos, mas o membro não tem avaliação, ele é filtrado
        if (maturity !== 'all' || category !== 'all' || specialization !== 'all' || competency !== 'all') {
            return false;
        }
      }

      return true;
    });

    // 3. Identificação do TALENTO (Melhor membro no subconjunto filtrado)
    // Critério: Maior média combinada (Técnica + Comportamental)
    let bestScore = -1;
    let talentId: string | null = null;

    members.forEach(member => {
      if (member.ultima_avaliacao) {
        const combinedScore = (member.ultima_avaliacao.media_tecnica_1a4 + member.ultima_avaliacao.media_comportamental_1a4) / 2;
        if (combinedScore > bestScore) {
          bestScore = combinedScore;
          talentId = member.id_usuario;
        }
      }
    });

    return members.map(member => ({
      ...member,
      isTalent: member.id_usuario === talentId,
    }));

  }, [teamData, searchName, activeFilters]);

  // Dados para popular os selects de filtro
  const filterOptions = useMemo(() => {
    const allCategories = technicalTemplate.map(c => c.nome_categoria);
    
    const specializations = activeFilters.category !== 'all'
      ? technicalTemplate.find(c => c.nome_categoria === activeFilters.category)?.especializacoes.map(s => s.nome_especializacao) || []
      : [];

    const competencies = activeFilters.specialization !== 'all'
      ? technicalTemplate.flatMap(c => 
          c.especializacoes
            .filter(s => s.nome_especializacao === activeFilters.specialization)
            .flatMap(s => s.competencias.map(comp => comp.nome_competencia))
        )
      : [];

    return {
      categories: allCategories,
      specializations,
      competencies,
      ageRanges: Object.keys(AGE_RANGES),
      genders: ['FEMININO', 'MASCULINO', 'NAO_BINARIO', 'NAO_INFORMADO'] as SexoTipo[],
      maturities: ['M1', 'M2', 'M3', 'M4'] as NivelMaturidade[],
    };
  }, [activeFilters.category, activeFilters.specialization]);

  return {
    activeFilters,
    setFilter,
    resetFilters,
    activeFilterCount,
    filteredMembers,
    filterOptions,
  };
}