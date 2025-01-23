import React from "react"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ManageBlogGroups from "./ManageBlogGroups";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { AdminServer } from "@/utils/functions/useAdminServer";

const Blog = async () => {
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
    <div className='px-10'>
      <ManageBlogGroups username={userData.username} targetUserId={(userId === AdminServer.getTargetUserId()) && userId} />
    </div>
  )
}

export default Blog