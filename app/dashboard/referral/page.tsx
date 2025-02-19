import React from "react"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminServer } from "@/utils/functions/useAdminServer";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import ReferralButton from "./ReferralButton";

const Referral = async () => {
    const supabase = createClient();

    const userId = await getEffectiveUserId({ supabase, targetUserId: AdminServer.getTargetUserId() });

    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("username, subscription_status, role")
        .eq("id", userId)
        .single();

    if (!userData)
        return redirect("/dashboard");
    const referral = '40BAF2'

    const proAvailable = (userData.subscription_status === "PRO" || userData.subscription_status === "PREMIUM PRO");

    return (
        <div className='px-10'>
            {!proAvailable &&
                <>
                    <div className="flex justify-center gap-2 text-center bg-[#F7FAFC] p-2 rounded-[26px] text-gray-500 font-semibold my-4">
                        <LockSimple size={22} />
                        Upgrade your membership to unlock this feature
                    </div>
                    <div className="absolute w-full h-full top-0 left-0 z-10" />
                </>
            }
            <div className={`${proAvailable ? "pt-20" : "opacity-40"}`}>
                Get a free Dental.bio and one month free && trial 3 months when new user join with my link
                <div className="flex justify-end">
                    <ReferralButton userId={userId}/>
                </div>
            </div>
        </div>
    )
}

export default Referral