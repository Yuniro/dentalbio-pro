import VerifyStatus from "./components/verifyStatus";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import { getAuthorizedUser } from "@/utils/user/getAuthorizedUser";
import Link from "next/link";

const Verification = async () => {
  const { subscriptionStatus } = await getAuthorizedUser();
  const premiumProAvailable = subscriptionStatus === "PREMIUM PRO" || subscriptionStatus === "PRO";

  return (
    <div className='px-10'>
      {!premiumProAvailable &&
        <Link
          href={"/upgrade"}
          target="_blank"
          className="flex justify-center gap-2 text-center bg-[#F7FAFC] p-2 rounded-[26px] text-gray-500 font-semibold my-4 no-underline"
        >
          <LockSimple size={22} />
          Upgrade your membership to unlock this feature
        </Link>}
      <div className={`${premiumProAvailable ? "" : "opacity-40"}`}>
        <VerifyStatus enabled={premiumProAvailable} />
      </div>
    </div>
  );
}

export default Verification;