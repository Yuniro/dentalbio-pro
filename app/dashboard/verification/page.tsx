import { AdminServer } from "@/utils/functions/useAdminServer";
import { createClient } from "@/utils/supabase/server";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { redirect } from "next/navigation";
import VerifyStatus from "./components/verifyStatus";

const Verification = async () => {
  const supabase = createClient();

  const userId = await getEffectiveUserId({ supabase, targetUserId: AdminServer.getTargetUserId() });

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("username, subscription_status, role")
    .eq("id", userId)
    .single();

  if (!(userData?.subscription_status === "PRO" || userData?.subscription_status === "PREMIUM PRO" || userData?.role === "admin"))
    return redirect("/dashboard");
  
  return (
    <VerifyStatus />
  );
}

export default Verification;