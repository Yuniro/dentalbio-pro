import React from "react";
import DomainComponent from "./DomainComponent";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import { getAuthorizedUser } from "@/utils/user/getAuthorizedUser";

const Domain = async () => {
	const { subscriptionStatus, isAdmin, userId } = await getAuthorizedUser();
	const premiumProAvailable = subscriptionStatus === "PRO";

	return (
		<div className="px-10">
			{premiumProAvailable ?
				<DomainComponent targetUserId={isAdmin ? userId : undefined} enabled={premiumProAvailable} />
				:
				<div className="flex justify-center gap-2 text-center bg-[#F7FAFC] p-2 rounded-[26px] text-gray-500 font=semibold my-4">
					<LockSimple size={22} />
					Upgrade your membership to unlock this feature
				</div>
			}
		</div>
	)
}

export default Domain;