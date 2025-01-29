import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { AdminServer } from "@/utils/functions/useAdminServer";

export async function getAuthorizedUser() {
  const supabase = createClient();

  const userId = await getEffectiveUserId({
    supabase,
    targetUserId: AdminServer.getTargetUserId(),
  });

  const { data: userData } = await supabase
    .from("users")
    .select("username, subscription_status")
    .eq("id", userId)
    .single();

  if (!userData) return redirect("/dashboard");

  return {
    userId,
    username: userData.username,
    subscriptionStatus: userData.subscription_status,
    isAdmin: userId === AdminServer.getTargetUserId(),
  };
}
