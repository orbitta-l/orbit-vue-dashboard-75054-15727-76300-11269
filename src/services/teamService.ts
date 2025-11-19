import { supabase } from "@/lib/supabaseClient";

export async function getLeaderDashboardData(liderId: number) {
  const { data, error } = await supabase.rpc("get_leader_dashboard_data", {
    p_leader_id: liderId,
  });

  return { data, error };
}

export async function getLideradoDashboardData(lideradoId: number) {
  const { data, error } = await supabase.rpc("get_liderado_dashboard_data", {
    p_liderado_id: lideradoId,
  });

  return { data, error };
}

