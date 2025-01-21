import { SupabaseClient } from "@supabase/supabase-js";

export const getEffectiveUserId = async ({ targetUserId, supabase }: { targetUserId?: string | null, supabase: SupabaseClient }) => {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error("Error fetching user:", authError);
    return;
  }

  const email = authData.user.email;

  const { data: user, error } = await supabase
    .from('users')
    .select('id, role, subscription_status, current_period_end, trial_end')
    .eq('email', email)
    .single();

    

  if (error) throw new Error('Error fetching user data');
  if (targetUserId && user.role !== 'admin') throw new Error('Not authorized');

  // return targetUserId || user.id;
  return user.id;
};