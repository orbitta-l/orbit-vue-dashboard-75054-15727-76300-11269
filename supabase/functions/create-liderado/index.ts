import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Função auxiliar para rollback
async function rollbackAuthUser(supabaseAdmin: SupabaseClient, userId: string | null) {
  if (userId) {
    console.log(`Iniciando rollback para o usuário de autenticação: ${userId}`);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    console.log(`Rollback concluído para o usuário: ${userId}`);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let newAuthUserId: string | null = null;

  try {
    const { nome, email, id_cargo, sexo, lider_id, data_nascimento } = await req.json();

    if (!nome || !email || !id_cargo || !sexo || !lider_id || !data_nascimento) {
      return new Response(JSON.stringify({ error: "Dados incompletos. Todos os campos são obrigatórios." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const temporaryPassword = Math.random().toString(36).slice(-8);

    // --- ETAPA 1: Criar usuário no sistema de autenticação ---
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: temporaryPassword,
      email_confirm: true,
    });

    if (authError) {
      console.error("ERRO NA ETAPA DE AUTENTICAÇÃO:", authError);
      if (authError.message.includes("already registered")) {
        return new Response(JSON.stringify({ error: "Este e-mail já está em uso por outro usuário." }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Falha ao criar o registro de autenticação do usuário.");
    }
    newAuthUserId = authData.user.id;

    // --- ETAPA 2: Inserir perfil na tabela 'usuario' ---
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('usuario')
      .insert({
        auth_user_id: newAuthUserId,
        nome,
        email,
        id_cargo,
        sexo,
        data_nascimento,
        role: 'LIDERADO',
      })
      .select('id')
      .single();

    if (profileError || !profileData) {
      console.error("ERRO NA ETAPA DE CRIAÇÃO DE PERFIL:", profileError);
      await rollbackAuthUser(supabaseAdmin, newAuthUserId);
      throw new Error("Falha ao salvar o perfil do usuário. Verifique se o cargo selecionado é válido.");
    }
    const newLideradoId = profileData.id;

    // --- ETAPA 3: Criar a relação 'lider_liderado' ---
    const { error: relationError } = await supabaseAdmin
      .from('lider_liderado')
      .insert({
        lider_id: Number(lider_id),
        liderado_id: newLideradoId
      });

    if (relationError) {
      console.error("ERRO NA ETAPA DE RELACIONAMENTO:", relationError);
      await rollbackAuthUser(supabaseAdmin, newAuthUserId); // O CASCADE no DB deve remover o perfil
      throw new Error("Falha ao vincular o novo membro à sua equipe.");
    }

    // --- SUCESSO ---
    return new Response(JSON.stringify({ temporaryPassword }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("ERRO GERAL NA EDGE FUNCTION:", error);
    return new Response(JSON.stringify({ error: error.message || "Ocorreu um erro interno no servidor." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});