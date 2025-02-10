import VerifyStatus from "./components/verifyStatus";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import { getAuthorizedUser } from "@/utils/user/getAuthorizedUser";

const Verification = async () => {
  const { subscriptionStatus } = await getAuthorizedUser();
  const premiumProAvailable = subscriptionStatus === "PREMIUM PRO";

  return (
    <div className='px-10'>
      {!premiumProAvailable &&
        <>
          <div className="flex justify-center gap-2 text-center bg-[#F7FAFC] p-2 rounded-[26px] text-gray-500 font-semibold my-4">
            <LockSimple size={22} />
            Upgrade your membership to unlock this feature
          </div>
          <div className="absolute w-full h-full top-0 left-0 z-10" />
        </>
      }
      <div className={`${premiumProAvailable ? "" : "opacity-40"}`}>
        <VerifyStatus enabled={premiumProAvailable}/>
      </div>
    </div>
  );
}

export default Verification;