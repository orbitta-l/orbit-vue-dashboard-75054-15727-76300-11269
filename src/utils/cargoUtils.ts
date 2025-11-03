// src/utils/cargoUtils.ts

import { MOCK_CARGOS } from "@/data/mockData";

// Mapeamento de cargo_id para nome do cargo e cor
export const cargoMap: Record<string, { name: string; colorClass: string }> = {
  "cargo_estagiario": { name: "Estagiário", colorClass: "bg-cargo-estagiario" },
  "cargo_junior": { name: "Júnior", colorClass: "bg-cargo-junior" },
  "cargo_pleno": { name: "Pleno", colorClass: "bg-cargo-pleno" },
  "cargo_especialista_i": { name: "Especialista I", colorClass: "bg-cargo-senior" }, // Usando a cor de senior
  "nao-definido": { name: "Não Definido", colorClass: "bg-cargo-nao-definido" },
};

/**
 * Retorna o nome do cargo com base no id_cargo.
 * @param cargoId O ID do cargo.
 * @returns O nome do cargo ou 'Não definido' se não encontrado.
 */
export const getCargoNameById = (cargoId: string): string => {
  // Busca primeiro na lista oficial (MOCK_CARGOS)
  const cargo = MOCK_CARGOS.find(c => c.id_cargo === cargoId && c.ativo);
  if (cargo) return cargo.nome_cargo;
  
  // Se não for ativo ou não encontrado, busca no mapeamento de cores (para cargos antigos)
  return cargoMap[cargoId]?.name || "Não definido";
};