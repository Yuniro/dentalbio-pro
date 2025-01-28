import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { AdminServer } from "@/utils/functions/useAdminServer";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import DomainComponent from "./DomainComponent";

const Domain = async () => {
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
					<div className="flex justify-center gap-2 text-center bg-[#F7FAFC] p-2 rounded-[26px] text-gray-500 font=semibold my-4">
						<LockSimple size={22} />
						Upgrade your membership to unlock this feature
					</div>
					<div className="absolute w-full h-full left-0 top-0" />
				</>}

				<div className={`${premiumProAvailable ? "" : "opacity-40"}`}>
					<DomainComponent targetUserId={(userId === AdminServer.getTargetUserId()) && userId} enabled={premiumProAvailable} />
				</div>
		</div>
	)
}

export default Domain;