import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Trata a requisição OPTIONS (preflight) para CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { nome, email, id_cargo, sexo, lider_id } = await req.json();

    // Validação básica dos dados recebidos
    if (!nome || !email || !id_cargo || !sexo || !lider_id) {
      return new Response(JSON.stringify({ error: "Dados incompletos fornecidos." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Inicializa o cliente Supabase com a role de serviço para ter privilégios de admin
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Gera uma senha temporária para o novo liderado
    const temporaryPassword = Math.random().toString(36).slice(-8);

    // Cria o usuário no sistema de autenticação do Supabase (auth.users)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: temporaryPassword,
      email_confirm: true, // O usuário já é considerado confirmado
      user_metadata: {
        nome: nome,
        id_cargo: id_cargo,
        sexo: sexo,
      },
    });

    if (authError) {
      console.error("Erro ao criar usuário de autenticação:", authError);
      // Trata o erro de e-mail já existente de forma amigável
      if (authError.message.includes("already registered")) {
        return new Response(JSON.stringify({ error: "Este e-mail já está em uso." }), {
          status: 409, // Conflict
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw authError;
    }

    const newUserId = authData.user.id;

    // O trigger `handle_new_user` já deve ter criado o perfil em `public.usuario`.
    // Agora, atualizamos o `lider_id` e `auth_user_id` nesse perfil.
    const { error: profileError } = await supabaseAdmin
      .from("usuario")
      .update({ lider_id: lider_id, auth_user_id: newUserId })
      .eq("id", authData.user.id); // O trigger usa o mesmo ID

    if (profileError) {
      console.error("Erro ao atualizar perfil do usuário:", profileError);
      // Se a atualização do perfil falhar, é uma boa prática deletar o usuário de autenticação criado
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      throw profileError;
    }

    // Retorna a senha temporária para o frontend
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