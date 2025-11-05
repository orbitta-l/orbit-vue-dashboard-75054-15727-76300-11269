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
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = (await req.json()) as Partial<CreateLideradoInput>;

    // Validação de entrada
    if (!body.nome || typeof body.nome !== "string" || body.nome.length < 2) {
      return Response.json({ error: "Nome inválido" }, { status: 400 });
    }
    if (!body.email || typeof body.email !== "string") {
      return Response.json({ error: "E-mail inválido" }, { status: 400 });
    }
    if (!body.sexo || !["MASCULINO","FEMININO","OUTRO","NAO_BINARIO","NAO_INFORMADO"].includes(body.sexo)) {
      return Response.json({ error: "Sexo inválido" }, { status: 400 });
    }
    if (!body.id_cargo || typeof body.id_cargo !== "string") {
      return Response.json({ error: "Cargo inválido" }, { status: 400 });
    }
    if (!body.data_nascimento || isNaN(Date.parse(body.data_nascimento))) {
      return Response.json({ error: "Data de nascimento inválida" }, { status: 400 });
    }

    // Cliente com o JWT do líder para verificação de identidade
    const supabase = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Valida o papel do usuário que está fazendo a chamada
    const { data: leaderRow, error: leaderErr } = await supabase
      .from("usuario")
      .select("id, role")
      .eq("auth_user_id", user.id)
      .single();

    if (leaderErr || !leaderRow) {
      return Response.json({ error: "Líder não encontrado" }, { status: 403 });
    }
    if (leaderRow.role !== "LIDER" && leaderRow.role !== "ADMIN") {
      return Response.json({ error: "Permissão negada" }, { status: 403 });
    }

    // Cliente Admin para operações privilegiadas
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Verifica se o e-mail já existe na tabela de usuários
    const { data: existingUser } = await admin.from("usuario").select("id").eq("email", body.email).maybeSingle();
    if (existingUser) {
      return Response.json({ error: "E-mail já cadastrado no sistema" }, { status: 409 });
    }

    // 1. Cria o usuário no sistema de autenticação
    const tempPassword = generateTempPassword();
    const { data: authUserResponse, error: authUserError } = await admin.auth.admin.createUser({
      email: body.email,
      password: tempPassword,
      email_confirm: true, // Auto-confirma o e-mail
    });

    if (authUserError || !authUserResponse.user) {
      console.error("Auth creation error:", authUserError);
      return Response.json({ error: "Falha ao criar o usuário no sistema de autenticação" }, { status: 500 });
    }
    const newAuthUserId = authUserResponse.user.id;

    // 2. Insere o perfil na tabela 'usuario'
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
      return Response.json({ error: "Falha ao inserir o perfil do usuário" }, { status: 500 });
    }

    // 3. Cria o vínculo entre líder e liderado
    const { error: linkErr } = await admin.from("lider_liderado").insert({
      lider_id: leaderRow.id,
      liderado_id: (newUser as Usuario).id,
    });

    if (linkErr) {
      console.error("Link error:", linkErr);
      await admin.auth.admin.deleteUser(newAuthUserId); // Rollback completo
      await admin.from("usuario").delete().eq("id", (newUser as Usuario).id);
      return Response.json({ error: "Falha ao vincular o liderado ao líder" }, { status: 500 });
    }

    // Sucesso
    return Response.json({
      ok: true,
      liderado_id: (newUser as Usuario).id,
      email: body.email,
      temporaryPassword: tempPassword, 
    });

  } catch (e: any) {
    console.error("Unexpected error:", e);
    return Response.json({ error: e?.message ?? "Erro inesperado no servidor" }, { status: 500 });
  }
});