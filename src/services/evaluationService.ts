import { supabase } from "@/lib/supabaseClient";
import type { NivelMaturidade } from "@/types/mer";

interface CompetenciaScore {
  competenciaId: string;
  nota: number;
}

interface TechBlockInput {
  categoriaId: string;
  especializacaoId: string;
  competencias: CompetenciaScore[];
}

export interface SaveEvaluationInput {
  liderId: string;
  lideradoId: string;
  cargoReferenciado: string;
  comportamentais: CompetenciaScore[];
  tecnicas: TechBlockInput[];
  dataAvaliacao: string;
}

export interface SaveEvaluationResult {
  success: boolean;
  maturidade?: NivelMaturidade | "N/A";
  error?: string;
}

export async function saveEvaluationTransaction(
  input: SaveEvaluationInput,
): Promise<SaveEvaluationResult> {
  try {
    const { data, error } = await supabase.rpc(
      "save_evaluation_transaction",
      {
        p_lider_id: Number(input.liderId),
        p_liderado_id: Number(input.lideradoId),
        p_cargo_ref: input.cargoReferenciado,
        p_payload: input,
      },
    );

    if (error) {
      throw error;
    }

    const maturidade = (data?.[0]?.maturidade ||
      null) as NivelMaturidade | "N/A" | null;

    return {
      success: true,
      maturidade: maturidade ?? "N/A",
    };
  } catch (e: any) {
    return {
      success: false,
      error: e?.message || "Erro desconhecido ao salvar avaliação.",
    };
  }
}

