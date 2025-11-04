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

    const newUserId = authData.user.id;

    const { error: profileError } = await supabaseAdmin
      .from("usuario")
      .update({ lider_id: lider_id })
      .eq("auth_user_id", newUserId);

    if (profileError) {
      console.error("Erro ao atualizar perfil do usuário:", profileError);
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      throw profileError;
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