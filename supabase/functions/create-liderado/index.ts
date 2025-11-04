import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let newAuthUserId: string | null = null;

  try {
    const { nome, email, id_cargo, sexo, lider_id, data_nascimento } = await req.json();

    if (!nome || !email || !id_cargo || !sexo || !lider_id || !data_nascimento) {
      return new Response(JSON.stringify({ error: "Dados incompletos fornecidos." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const temporaryPassword = Math.random().toString(36).slice(-8);

    // Etapa 1: Criar o usuário no sistema de autenticação (sem metadados, pois não usamos mais o gatilho)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: temporaryPassword,
      email_confirm: true,
    });

    if (authError) {
      console.error("Erro na Etapa 1 (Auth):", authError);
      if (authError.message.includes("already registered")) {
        return new Response(JSON.stringify({ error: "Este e-mail já está em uso." }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw authError;
    }

    newAuthUserId = authData.user.id;

    // Etapa 2: Inserir o perfil diretamente na tabela 'usuario'
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
      console.error("Erro na Etapa 2 (Profile):", profileError);
      // Rollback: Se a criação do perfil falhar, exclua o usuário de autenticação
      if (newAuthUserId) {
        await supabaseAdmin.auth.admin.deleteUser(newAuthUserId);
      }
      throw profileError || new Error("Falha ao criar o perfil do usuário.");
    }

    const newLideradoId = profileData.id;

    // Etapa 3: Criar a relação na tabela 'lider_liderado'
    const { error: relationError } = await supabaseAdmin
      .from('lider_liderado')
      .insert({
        lider_id: Number(lider_id), // CORREÇÃO: Convertendo para número
        liderado_id: newLideradoId
      });

    if (relationError) {
      console.error("Erro na Etapa 3 (Relation):", relationError);
      // Rollback: Se a relação falhar, exclua o usuário de autenticação e o perfil
      if (newAuthUserId) {
        await supabaseAdmin.auth.admin.deleteUser(newAuthUserId);
      }
      // A exclusão do usuário em auth deve remover o perfil em 'usuario' via CASCADE
      throw relationError;
    }

    return new Response(JSON.stringify({ temporaryPassword }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Erro inesperado na Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message || "Ocorreu um erro interno." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});