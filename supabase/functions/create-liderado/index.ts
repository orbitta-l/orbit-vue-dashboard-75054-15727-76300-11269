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

    // 1. Cria o usuário no sistema de autenticação
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        nome: nome,
        id_cargo: id_cargo,
        sexo: sexo,
        data_nascimento: data_nascimento,
      },
    });

    if (authError) {
      console.error("Erro ao criar usuário de autenticação:", authError);
      if (authError.message.includes("already registered")) {
        return new Response(JSON.stringify({ error: "Este e-mail já está em uso." }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw authError;
    }

    const newAuthUserId = authData.user.id;

    // 2. O gatilho `handle_new_user` cria o perfil na tabela `usuario`.
    // Agora, precisamos buscar o ID numérico desse perfil recém-criado.
    // Adicionamos uma pequena espera para garantir que o gatilho tenha sido executado.
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data: newProfileData, error: newProfileError } = await supabaseAdmin
      .from('usuario')
      .select('id')
      .eq('auth_user_id', newAuthUserId)
      .single();

    if (newProfileError || !newProfileData) {
      console.error("Erro ao buscar o perfil recém-criado:", newProfileError);
      await supabaseAdmin.auth.admin.deleteUser(newAuthUserId); // Rollback
      throw new Error("Não foi possível encontrar o perfil do novo usuário após a criação.");
    }

    const newLideradoId = newProfileData.id;

    // 3. Cria a relação na tabela `lider_liderado`
    const { error: relationError } = await supabaseAdmin
      .from('lider_liderado')
      .insert({
        lider_id: lider_id,
        liderado_id: newLideradoId
      });

    if (relationError) {
      console.error("Erro ao criar a relação líder-liderado:", relationError);
      await supabaseAdmin.auth.admin.deleteUser(newAuthUserId); // Rollback
      throw relationError;
    }

    return new Response(JSON.stringify({ temporaryPassword }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Erro inesperado na Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});