// src/utils/cargoUtils.ts

import { MOCK_CARGOS } from "@/data/mockData";

// Mapeamento de cargo_id para nome do cargo e cor
export const cargoMap: Record<string, { name: string; colorClass: string }> = {
  "estagiario": { name: "Estagiário", colorClass: "bg-cargo-estagiario" },
  "junior": { name: "Júnior", colorClass: "bg-cargo-junior" },
  "pleno": { name: "Pleno", colorClass: "bg-cargo-pleno" },
  "senior": { name: "Sênior", colorClass: "bg-cargo-senior" },
  "especialista": { name: "Especialista", colorClass: "bg-cargo-especialista" },
  "nao-definido": { name: "Não Definido", colorClass: "bg-cargo-nao-definido" },
};

/**
 * Retorna o nome do cargo com base no id_cargo.
 * @param cargoId O ID do cargo.
 * @returns O nome do cargo ou 'Não definido' se não encontrado.
 */
export const getCargoNameById = (cargoId: string): string => {
  const cargo = MOCK_CARGOS.find(c => c.id_cargo === cargoId);
  return cargo ? cargo.nome_cargo : cargoMap[cargoId]?.name || "Não definido";
};