import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const getEffectiveUserId = async ({ targetUserId, supabase }: { targetUserId?: string | null, supabase: SupabaseClient }) => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData?.session) {
    return redirect("/login");
  }

  const { user: sessionUser } = sessionData.session;

  const email = sessionUser.email;

  const { data: user, error } = await supabase
    .from('users')
    .select('id, role, subscription_status, current_period_end, trial_end')
    .eq('email', email)
    .single();

  if (error) throw new Error('Error fetching user data');
  if (targetUserId && user.role !== 'admin') return user.id

  return targetUserId || user.id;
};