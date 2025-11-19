import { supabase } from "@/lib/supabaseClient";
import type { Usuario } from "@/types/mer";

export interface CreateLideradoPayload {
  nome: string;
  email: string;
  sexo: string;
  id_cargo: string;
  data_nascimento: string;
}

export interface CreateLideradoResult {
  success: boolean;
  temporaryPassword?: string;
  error?: string;
}

export async function createLiderado(
  payload: CreateLideradoPayload,
): Promise<CreateLideradoResult> {
  const { data, error } = await supabase.functions.invoke("create-liderado", {
    body: { ...payload },
    method: "POST",
  });

  if (error) {
    return {
      success: false,
      error: error.message || "Erro ao criar liderado via Edge Function.",
    };
  }

  const response = data as { temporaryPassword?: string; error?: string } | null;

  if (response?.temporaryPassword) {
    return { success: true, temporaryPassword: response.temporaryPassword };
  }

  return {
    success: false,
    error: response?.error ||
      "Resposta da função 'create-liderado' não retornou senha temporária.",
  };
}

export interface DeleteLideradoResult {
  success: boolean;
  error?: string;
}

export async function deleteLiderado(
  lideradoId: number,
): Promise<DeleteLideradoResult> {
  const { data, error } = await supabase.functions.invoke("delete-liderado", {
    body: { liderado_id: lideradoId },
    method: "POST",
  });

  if (error) {
    return {
      success: false,
      error: error.message || "Erro ao excluir liderado via Edge Function.",
    };
  }

  const response = data as { ok?: boolean; error?: string } | null;

  if (response?.ok) {
    return { success: true };
  }

  return {
    success: false,
    error: response?.error ||
      "Resposta da função 'delete-liderado' não indicou sucesso.",
  };
}

export interface UpdateFirstLoginResult {
  success: boolean;
  error?: string;
  updatedProfile?: Usuario;
}

export async function updateFirstLoginStatusOnUsuarioTable(
  userId: string,
): Promise<UpdateFirstLoginResult> {
  try {
    const { error } = await supabase
      .from("usuario")
      .update({ first_login: false })
      .eq("id", Number(userId));

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (e: any) {
    return {
      success: false,
      error: e?.message || "Erro ao atualizar first_login na tabela usuario.",
    };
  }
}

export async function getMyProfileRow() {
  const { data, error } = await supabase
    .rpc("get_my_profile")
    .single();

  return { data, error };
}

