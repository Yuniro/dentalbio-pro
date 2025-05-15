import React from "react"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ManageReviews from "./ManageReviews";
// import { AdminServer } from "@/utils/functions/useAdminServer";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import Link from 'next/link'

const Review = async ({ searchParams }: { searchParams: { userId?: string } }) => {
  const supabase = createClient();
  const targetUserId = searchParams.userId;

  const userId = await getEffectiveUserId({ supabase, targetUserId });

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("username, subscription_status, role, created_at, trial_end, position")
    .eq("id", userId)
    .single();

  if (!userData)
    return redirect("/dashboard");

  const proAvailable = (userData.subscription_status === "PRO" || userData.subscription_status === "PREMIUM PRO");

  return (
    <div>
      {!proAvailable &&
        <>
          <div className="flex justify-center gap-2 text-center bg-[#F7FAFC] p-2 rounded-[26px] text-gray-500 font-semibold my-4">
            <LockSimple size={22} />
            <Link href={'/upgrade'} target="_blank" className="no-underline cursor-pointer">
              Upgrade your membership to unlock this feature
            </Link>
          </div>
        </>
      }
      <div className={`${proAvailable ? "" : "relative opacity-40"}`}>
        {!proAvailable &&
          <div className="absolute w-full h-full top-0 left-0 z-10" />}
        <ManageReviews targetUserId={(userId === targetUserId) && userId} enabled={proAvailable} />
      </div>
    </div>
  )
}

export default Review