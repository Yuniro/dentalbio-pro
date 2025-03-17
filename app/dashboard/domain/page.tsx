import React from "react";
import DomainComponent from "./DomainComponent";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import { getAuthorizedUser } from "@/utils/user/getAuthorizedUser";
import Link from 'next/link'

const Domain = async () => {
	const { subscriptionStatus, isAdmin, userId, isMessageStateForStudent } = await getAuthorizedUser();
	const premiumProAvailable = subscriptionStatus === "PREMIUM PRO";

	return (
		<div className="px-10">
			{!premiumProAvailable &&
				<div className="flex justify-center gap-2 text-center bg-[#F7FAFC] p-2 rounded-[26px] text-gray-500 font=semibold my-4">
					<LockSimple size={22} />
					<Link href={'/upgrade'} target="_blank" className="no-underline cursor-pointer">
						Upgrade your membership to unlock this feature
					</Link>
				</div>
			}
			<div className={`${premiumProAvailable ? "" : "relative opacity-40"}`}>
				{!premiumProAvailable &&
					<div className="absolute w-full h-full top-0 left-0 z-10" />}
				{/* {isMessageStateForStudent &&
					<div className="flex justify-center gap-2 text-center bg-[#F7FAFC] p-2 rounded-[26px] text-gray-500 font-semibold my-4">
						Congrulates! You have unlocked pro plan for 6 months!
					</div>
				} */}
				<DomainComponent targetUserId={isAdmin ? userId : null} enabled={premiumProAvailable} />
			</div>
		</div>
	)
}

export default Domain;