// src/utils/cargoUtils.ts

import { MOCK_CARGOS } from "@/data/mockData";

// Mapeamento de cargo_id para nome do cargo e cor
export const cargoMap: Record<string, { name: string; colorClass: string }> = {
  "estagiario": { name: "Estagiário", colorClass: "bg-blue-600" },
  "junior": { name: "Júnior", colorClass: "bg-green-600" },
  "pleno": { name: "Pleno", colorClass: "bg-yellow-600" },
  "senior": { name: "Sênior", colorClass: "bg-red-600" },
  "especialista": { name: "Especialista", colorClass: "bg-purple-600" },
  "nao-definido": { name: "Não Definido", colorClass: "bg-gray-500" },
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