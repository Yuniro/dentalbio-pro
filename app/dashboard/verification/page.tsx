import { AdminServer } from "@/utils/functions/useAdminServer";
import { createClient } from "@/utils/supabase/server";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { redirect } from "next/navigation";
import VerifyStatus from "./components/verifyStatus";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";

const Verification = async () => {
  const supabase = createClient();

  const userId = await getEffectiveUserId({ supabase, targetUserId: AdminServer.getTargetUserId() });

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("username, subscription_status, role")
    .eq("id", userId)
    .single();

  if (!userData)
    return redirect("/dashboard");

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
      <div className={`${proAvailable ? "" : "opacity-40"}`}>
        <VerifyStatus />
      </div>
    </div>
  );
}

export default Verification;