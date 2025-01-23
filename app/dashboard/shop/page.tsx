import React from "react"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ManageIndividualProducts from "./components/ManageIndividualProducts";
import { AdminServer } from "@/utils/functions/useAdminServer";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";

const Product = async () => {
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
      {/* <ManageProductGroups /> */}
      <ManageIndividualProducts targetUserId={(userId === AdminServer.getTargetUserId()) && userId} />
    </div>
  )
}

export default Product