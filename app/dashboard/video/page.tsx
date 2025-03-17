import React from "react"
import ManageVideoGroups from "./ManageVideoGroups";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import { getAuthorizedUser } from "@/utils/user/getAuthorizedUser";
import Link from 'next/link'

const Video = async () => {
  const { userId, subscriptionStatus, isAdmin } = await getAuthorizedUser();
  const proAvailable = ["PRO", "PREMIUM PRO"].includes(subscriptionStatus);

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
      <div className={`${proAvailable ? "" : "opacity-40"}`}>
        <ManageVideoGroups targetUserId={isAdmin ? userId : undefined} enabled={proAvailable} />
      </div>
    </div>
  )
}

export default Video