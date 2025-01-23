import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const isAdminMiddleware = async ({ supabase }: { supabase: SupabaseClient }) => {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    redirect("/login");
    return false;
  }

  const email = authData.user.email;

  const { data: user, error } = await supabase
    .from('users')
    .select('role')
    .eq('email', email)
    .single();

  if (user?.role !== "admin") {
    redirect("/dashboard");
    return false;
  }

  return true;
};