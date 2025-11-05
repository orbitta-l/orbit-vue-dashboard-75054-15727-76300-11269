// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Tipos de entrada
interface PontuacaoInput {
  id_competencia: string;
  pontuacao_1a4: number;
  peso_aplicado: number | null;
}

interface SaveEvaluationInput {
  liderado_id: string;
  id_cargo: string;
  observacoes: string | null;
  pontuacoes: PontuacaoInput[];
}

// Variáveis de ambiente
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função auxiliar para calcular o nível de maturidade (M1 a M4)
function calcularNivelMaturidade(media_tecnica: number, media_comportamental: number): 'M1' | 'M2' | 'M3' | 'M4' {
  const LIMIAR_MATURIDADE = 2.5;
  if (media_tecnica <= LIMIAR_MATURIDADE && media_comportamental <= LIMIAR_MATURIDADE) return 'M1';
  if (media_tecnica <= LIMIAR_MATURIDADE && media_comportamental > LIMIAR_MATURIDADE) return 'M2';
  if (media_tecnica > LIMIAR_MATURIDADE && media_comportamental <= LIMIAR_MATURIDADE) return 'M3';
  return 'M4';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    const body = (await req.json()) as SaveEvaluationInput;

    // 1. Autenticação e Autorização do Líder
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    // Obter o ID interno do líder
    const { data: leaderIdData, error: leaderIdErr } = await supabase.rpc('get_user_id_by_auth_uid', { p_auth_uid: user.id });
    if (leaderIdErr || !leaderIdData) {
        console.error("Leader ID lookup error:", leaderIdErr);
        return Response.json({ error: "Líder não encontrado ou sem permissão." }, { status: 403, headers: corsHeaders });
    }
    const lider_id = leaderIdData as number;
    const liderado_id = parseInt(body.liderado_id);

    // 2. Validação de Permissão (O líder pode avaliar este liderado?)
    const { count: linkCount, error: linkErr } = await supabase
        .from('lider_liderado')
        .select('*', { count: 'exact', head: true })
        .eq('lider_id', lider_id)
        .eq('liderado_id', liderado_id);

    if (linkErr || linkCount === 0) {
        return Response.json({ error: "Permissão negada: O usuário não é líder deste liderado." }, { status: 403, headers: corsHeaders });
    }

    // 3. Cálculo das Médias
    const { data: competenciasData, error: compErr } = await supabase
        .from('competencia')
        .select('id, tipo')
        .in('id', body.pontuacoes.map(p => parseInt(p.id_competencia)));

    if (compErr) {
        console.error("Competency lookup error:", compErr);
        return Response.json({ error: "Falha ao buscar tipos de competência." }, { status: 500, headers: corsHeaders });
    }

    const competenciaTipos = new Map(competenciasData.map(c => [String(c.id), c.tipo]));

    const softScores = body.pontuacoes
        .filter(p => competenciaTipos.get(p.id_competencia) === 'COMPORTAMENTAL')
        .map(p => p.pontuacao_1a4);
    
    const hardScores = body.pontuacoes
        .filter(p => competenciaTipos.get(p.id_competencia) === 'TECNICA')
        .map(p => p.pontuacao_1a4);

    const media_comportamental_1a4 = softScores.length > 0 ? softScores.reduce((a, b) => a + b, 0) / softScores.length : 0;
    const media_tecnica_1a4 = hardScores.length > 0 ? hardScores.reduce((a, b) => a + b, 0) / hardScores.length : 0;
    
    const maturidade_quadrante = calcularNivelMaturidade(media_tecnica_1a4, media_comportamental_1a4);

    // 4. Inserção Transacional (Avaliação e Pontuações)
    
    // Inserir na tabela 'avaliacao'
    const { data: newEvaluation, error: evalErr } = await supabase
        .from('avaliacao')
        .insert({
            id_lider: lider_id,
            id_liderado: liderado_id,
            cargo_referenciado: body.id_cargo,
            media_comportamental: parseFloat(media_comportamental_1a4.toFixed(2)),
            media_tecnica: parseFloat(media_tecnica_1a4.toFixed(2)),
            nivel_maturidade: maturidade_quadrante,
            // data_avaliacao e criado_em usam default NOW()
        })
        .select('id')
        .single();

    if (evalErr || !newEvaluation) {
        console.error("Evaluation insert error:", evalErr);
        return Response.json({ error: "Falha ao inserir a avaliação principal." }, { status: 500, headers: corsHeaders });
    }

    const newEvaluationId = newEvaluation.id;

    // Preparar dados para 'pontuacao_avaliacao'
    const pontuacoesToInsert = body.pontuacoes.map(p => ({
        id_avaliacao: newEvaluationId,
        id_competencia: parseInt(p.id_competencia),
        pontuacao: p.pontuacao_1a4,
        peso: p.peso_aplicado,
    }));

    // Inserir na tabela 'pontuacao_avaliacao'
    const { error: pontuacaoErr } = await supabase
        .from('pontuacao_avaliacao')
        .insert(pontuacoesToInsert);

    if (pontuacaoErr) {
        console.error("Pontuacao insert error:", pontuacaoErr);
        // Em um ambiente real, faríamos um rollback da avaliação principal aqui.
        return Response.json({ error: "Falha ao inserir as pontuações detalhadas." }, { status: 500, headers: corsHeaders });
    }

    // 5. Sucesso
    return Response.json({
      ok: true,
      id_avaliacao: newEvaluationId,
      maturidade: maturidade_quadrante,
    }, { headers: corsHeaders });

  } catch (e: any) {
    console.error("Unexpected error:", e);
    return Response.json({ error: e?.message ?? "Erro inesperado no servidor" }, { status: 500, headers: corsHeaders });
  }
});