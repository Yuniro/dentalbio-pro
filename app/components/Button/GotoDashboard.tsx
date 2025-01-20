'use client'
import FullRoundedButton from "./FullRoundedButton";
import { useAdmin } from "@/utils/functions/useAdmin";
import { useRouter } from "next/navigation";

const GotoDashboard = () => {
  const { setTargetUserId } = useAdmin();
  const router = useRouter();

  const handleGotoDashBoard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTargetUserId("");
    router.push("/dashboard");
  }

  return (
    <FullRoundedButton onClick={handleGotoDashBoard}>
      Go to Dashboard
    </FullRoundedButton>
  )
}

export default GotoDashboard;
