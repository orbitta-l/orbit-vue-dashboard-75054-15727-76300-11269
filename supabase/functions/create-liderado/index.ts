// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Tipos para clareza e segurança
type Sexo = "MASCULINO" | "FEMININO" | "OUTRO" | "NAO_BINARIO" | "NAO_INFORMADO";

interface CreateLideradoInput {
  nome: string;
  email: string;
  sexo: Sexo;
  id_cargo: string;
  data_nascimento: string;
}

interface Usuario {
  id: number;
  auth_user_id: string | null;
  role: "LIDER" | "LIDERADO" | "ADMIN";
}

// Variáveis de ambiente
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Função para gerar senha forte
function generateTempPassword(len = 14): string {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

serve(async (req) => {
  // Lidar com requisições OPTIONS (CORS preflight)
  const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    const body = (await req.json()) as Partial<CreateLideradoInput>;

    // 1. Autenticação do Líder (usando o token)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return Response.json({ error: "Não autenticado" }, { status: 401, headers: corsHeaders });
    }
    
    // Cliente Admin para operações privilegiadas (ignora RLS)
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    
    // Cliente para autenticação (usa ANON_KEY + JWT do usuário)
    const supabaseClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    // Decodificar o JWT para obter o UID do líder
    const { data: { user }, error: authErr } = await supabaseClient.auth.getUser();
    
    if (authErr || !user) {
      return Response.json({ error: "Token inválido ou expirado" }, { status: 401, headers: corsHeaders });
    }
    const leaderAuthUid = user.id;

    // 2. Valida o papel do usuário que está fazendo a chamada (usando cliente admin para ignorar RLS)
    const { data: leaderRow, error: leaderErr } = await admin
      .from("usuario")
      .select("id, role")
      .eq("auth_user_id", leaderAuthUid)
      .single();

    if (leaderErr || !leaderRow) {
      return Response.json({ error: "Líder não encontrado no perfil de usuário" }, { status: 403, headers: corsHeaders });
    }
    if (leaderRow.role !== "LIDER" && leaderRow.role !== "ADMIN") {
      return Response.json({ error: "Permissão negada: Apenas líderes podem cadastrar" }, { status: 403, headers: corsHeaders });
    }

    // Validação de entrada (simplificada)
    if (!body.nome || !body.email || !body.id_cargo || !body.data_nascimento) {
        return Response.json({ error: "Dados de entrada incompletos" }, { status: 400, headers: corsHeaders });
    }

    // Verifica se o e-mail já existe na tabela de usuários
    const { data: existingUser } = await admin.from("usuario").select("id").eq("email", body.email).maybeSingle();
    if (existingUser) {
      return Response.json({ error: "E-mail já cadastrado no sistema" }, { status: 409, headers: corsHeaders });
    }

    // 3. Cria o usuário no sistema de autenticação
    const tempPassword = generateTempPassword();
    const { data: authUserResponse, error: authUserError } = await admin.auth.admin.createUser({
      email: body.email,
      password: tempPassword,
      email_confirm: true,
    });

    if (authUserError || !authUserResponse.user) {
      console.error("Auth creation error:", authUserError);
      return Response.json({ error: "Falha ao criar o usuário no sistema de autenticação" }, { status: 500, headers: corsHeaders });
    }
    const newAuthUserId = authUserResponse.user.id;

    // 4. Insere o perfil na tabela 'usuario'
    const { data: newUser, error: insertUserErr } = await admin
      .from("usuario")
      .insert({
        nome: body.nome,
        email: body.email,
        sexo: body.sexo,
        id_cargo: body.id_cargo,
        data_nascimento: body.data_nascimento,
        role: "LIDERADO",
        auth_user_id: newAuthUserId,
      })
      .select("id")
      .single();

    if (insertUserErr) {
      console.error("User insert error:", insertUserErr);
      await admin.auth.admin.deleteUser(newAuthUserId); // Rollback
      return Response.json({ error: "Falha ao inserir o perfil do usuário" }, { status: 500, headers: corsHeaders });
    }

    // 5. Cria o vínculo entre líder e liderado
    const { error: linkErr } = await admin.from("lider_liderado").insert({
      lider_id: leaderRow.id,
      liderado_id: (newUser as Usuario).id,
    });

    if (linkErr) {
      console.error("Link error:", linkErr);
      await admin.auth.admin.deleteUser(newAuthUserId); // Rollback completo
      await admin.from("usuario").delete().eq("id", (newUser as Usuario).id);
      return Response.json({ error: "Falha ao vincular o liderado ao líder" }, { status: 500, headers: corsHeaders });
    }

    // Sucesso
    return Response.json({
      ok: true,
      liderado_id: (newUser as Usuario).id,
      email: body.email,
      temporaryPassword: tempPassword, 
    }, { headers: corsHeaders });

  } catch (e: any) {
    console.error("Unexpected error:", e);
    return Response.json({ error: e?.message ?? "Erro inesperado no servidor" }, { status: 500, headers: corsHeaders });
  }
});