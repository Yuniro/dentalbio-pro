import React from "react"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { AdminServer } from "@/utils/functions/useAdminServer";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";

import BrandingComponent from "./BrandingComponent";

const Branding = async () => {
  const supabase = createClient();

  const userId = await getEffectiveUserId({ supabase, targetUserId: AdminServer.getTargetUserId() });

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("username, subscription_status")
    .eq("id", userId)
    .single();

  if (!userData)
    return redirect("/dashboard");

  const premiumProAvailable = (userData.subscription_status === "PREMIUM PRO");

  return (
    <div className="px-10">
      {!premiumProAvailable &&
        <>
          <div className="flex justify-center gap-2 text-center bg-[#F7FAFC] p-2 rounded-[26px] text-gray-500 font-semibold my-4">
            <LockSimple size={22} />
            Upgrade your membership to unlock this feature
          </div>
          <div className="absolute w-full h-full top-0 left-0 z-10" />
        </>}

      <div className={`${premiumProAvailable ? "" : "opacity-40"}`}>
        <BrandingComponent targetUserId={(userId === AdminServer.getTargetUserId()) && userId} enabled={premiumProAvailable} />
      </div>
    </div>
  )
}

export default Branding;