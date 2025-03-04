import React from "react"
import ManageGalleries from "./ManageGalleries"
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import { getAuthorizedUser } from "@/utils/user/getAuthorizedUser";

const Gallery = async () => {
  const { subscriptionStatus, isAdmin, userId } = await getAuthorizedUser();
  const proAvailable = ["PRO", "PREMIUM PRO"].includes(subscriptionStatus);

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
        <ManageGalleries targetUserId={isAdmin ? userId : undefined} enabled={proAvailable} />
      </div>
    </div>
  )
}

export default Gallery