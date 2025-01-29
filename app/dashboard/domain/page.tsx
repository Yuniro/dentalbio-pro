import React from "react";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import DomainComponent from "./DomainComponent";
import { getAuthorizedUser } from "@/utils/user/getAuthorizedUser";

const Domain = async () => {
	const { subscriptionStatus, isAdmin, userId } = await getAuthorizedUser();
	const premiumProAvailable = subscriptionStatus === "PREMIUM PRO";

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
					<DomainComponent targetUserId={isAdmin ? userId : undefined} enabled={premiumProAvailable} />
				</div>
		</div>
	)
}

export default Domain;