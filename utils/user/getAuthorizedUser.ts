import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
// import { AdminServer } from "@/utils/functions/useAdminServer";

export async function getAuthorizedUser(targetUserId: string) {
  const supabase = createClient();

  const userId = await getEffectiveUserId({
    supabase,
    targetUserId,
  });

  const { data: userData } = await supabase
    .from("users")
    .select("username, subscription_status, created_at, trial_end, position")
    .eq("id", userId)
    .single();

  if (!userData) return redirect("/dashboard");
  const isSixMonthsOrMore = (userData: any) => {
    const createdAt = new Date(userData.created_at);
    const trialEnd = new Date(userData.trial_end);

    // Calculate the difference in months
    const diffInMonths = (trialEnd.getFullYear() - createdAt.getFullYear()) * 12 +
      (trialEnd.getMonth() - createdAt.getMonth());

    return userData.position === 'Student' && diffInMonths >= 6;
  }

  return {
    userId,
    username: userData.username,
    subscriptionStatus: userData.subscription_status,
    isAdmin: userId === targetUserId,
    isMessageStateForStudent: isSixMonthsOrMore(userData)
  };
}
