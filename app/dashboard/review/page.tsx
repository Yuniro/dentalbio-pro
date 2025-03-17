import React from "react"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ManageReviews from "./ManageReviews";
import { AdminServer } from "@/utils/functions/useAdminServer";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import Link from 'next/link'

const Review = async () => {
  const supabase = createClient();

  const userId = await getEffectiveUserId({ supabase, targetUserId: AdminServer.getTargetUserId() });

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("username, subscription_status, role, created_at, trial_end, position")
    .eq("id", userId)
    .single();

  if (!userData)
    return redirect("/dashboard");
  
  // const isSixMonthsOrMore = () => {
  //   const createdAt = new Date(userData.created_at);
  //   const trialEnd = new Date(userData.trial_end);

  //   // Calculate the difference in months
  //   const diffInMonths = (trialEnd.getFullYear() - createdAt.getFullYear()) * 12 +
  //     (trialEnd.getMonth() - createdAt.getMonth());

  //   return userData.position === 'Student' && diffInMonths >= 6;
  // }

  const proAvailable = (userData.subscription_status === "PRO" || userData.subscription_status === "PREMIUM PRO");

  return (
    <div className='px-10'>
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
        {/* {isSixMonthsOrMore() &&
          <div className="flex justify-center gap-2 text-center bg-[#F7FAFC] p-2 rounded-[26px] text-gray-500 font-semibold my-4">
            Congrulates! You have unlocked pro plan for 6 months!
          </div>
        } */}
        <ManageReviews targetUserId={(userId === AdminServer.getTargetUserId()) && userId} enabled={proAvailable} />
      </div>
    </div>
  )
}

export default Review