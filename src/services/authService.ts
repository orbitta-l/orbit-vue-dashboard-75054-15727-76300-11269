import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface SessionResult {
  session: Session | null;
  error?: string;
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<LoginResult> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { success: !error, error: error?.message };
}

export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentSession(): Promise<SessionResult> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return { session, error: error?.message };
}

export function subscribeToAuthChanges(
  callback: (event: string, session: Session | null) => void | Promise<void>,
) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    await callback(event, session);
  });
}

export async function updateCurrentUserPassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

