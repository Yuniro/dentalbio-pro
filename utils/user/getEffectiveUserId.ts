import { SupabaseClient } from "@supabase/supabase-js";

const getEffectiveUserId = async ({ authUserId, targetUserId, supabase }: { authUserId: string, targetUserId?: string, supabase: SupabaseClient }) => {
  const { data: user, error } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', authUserId)
    .single();

  if (error) throw new Error('Error fetching user data');
  if (targetUserId && user.role !== 'admin') throw new Error('Not authorized');

  return targetUserId || authUserId;
};