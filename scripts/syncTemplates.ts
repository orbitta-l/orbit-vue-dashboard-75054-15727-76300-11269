import { createClient } from "@supabase/supabase-js";
import { softSkillTemplates } from "@/data/evaluationTemplates";
import { MOCK_COMPETENCIAS } from "@/data/mockData";

/**
 * Script de sincronização das competências e templates (soft skills) para o Supabase.
 *
 * - Upsert de todas as competências do catálogo (tabela `competencia`)
 * - Upsert do template por cargo (tabela `template_competencia`)
 *
 * Expecta as variáveis de ambiente:
 *  - SUPABASE_URL
 *  - SUPABASE_SERVICE_ROLE_KEY  (use a chave de service role, NÃO exponha no front)
 *
 * Execute com ts-node ou transpile para JS antes de rodar:
 *  npx ts-node scripts/syncTemplates.ts
 */

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function syncCompetencias() {
  const rows = MOCK_COMPETENCIAS.map((c) => ({
    id: c.id_competencia,
    nome_competencia: c.nome_competencia,
    tipo: c.tipo,
    id_especializacao: c.id_especializacao || null,
    descricao: c.descricao || null,
  }));

  const { error } = await supabase
    .from("competencia")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    throw new Error(`Erro ao upsert de competencias: ${error.message}`);
  }
  console.log(`✔ Upsert de ${rows.length} competências concluído.`);
}

async function syncTemplateCompetencia() {
  const rows = softSkillTemplates.flatMap((tpl) =>
    tpl.competencias.map((comp) => ({
      cargo_id: tpl.id_cargo,
      competencia_id: comp.id_competencia,
      peso: comp.peso ?? 0,
      nota_ideal: comp.nota_ideal ?? 4.0,
    })),
  );

  const { error } = await supabase
    .from("template_competencia")
    .upsert(rows, { onConflict: "cargo_id,competencia_id" });

  if (error) {
    throw new Error(`Erro ao upsert de template_competencia: ${error.message}`);
  }
  console.log(`✔ Upsert de ${rows.length} linhas em template_competencia concluído.`);
}

async function main() {
  try {
    await syncCompetencias();
    await syncTemplateCompetencia();
    console.log("🎯 Sincronização completa.");
  } catch (err: any) {
    console.error("❌ Falha na sincronização:", err.message);
    process.exit(1);
  }
}

main();
