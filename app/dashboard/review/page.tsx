import React from "react"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ManageReviews from "./ManageReviews";
import { AdminServer } from "@/utils/functions/useAdminServer";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";

const Review = async () => {
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
    <div className='px-10 pt-10'>
      <ManageReviews targetUserId={(userId === AdminServer.getTargetUserId()) && userId} />
    </div>
  )
}

export default Review