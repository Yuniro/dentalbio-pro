'use client'

import Loading from "@/app/dashboard/loading";
import { useEffect, useState } from "react";
import VerifyButton from "./VerifyButton";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { SealCheck } from "@phosphor-icons/react";
import { redirect } from "next/navigation";

type SessionType = "pending" | "approved" | "declined";

const VerifyStatus: React.FC = () => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionType | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/user', {
        method: 'GET'
      });
      const data = await response.json();

      if (!data.data) {
        return redirect("/error?message=user_not_found");
      }

      if (data.data.isVerified) {
        setSessionStatus("approved");
      } 
      // else if (data.data.session_id) {
      //   const response = await fetch(`${process.env.VERIFF_BASE_URL}/v1/sessions/${data.data.session_id}/decision`, {
      //     method: 'GET',
      //     headers: {
      //       'X-HMAC-SIGNATURE': '334141f052e317fde6668de54dc6640b4a5c47582ad86a8bed63afe566f17b14',
      //       'X-AUTH-CLIENT': `Bearer ${process.env.VERIFF_API_KEY}`,
      //     },
      //   });

      //   const status = await response.json();
      //   console.log(status);
      //   setSessionStatus(status);
      // } 
      else {
        setSessionStatus("declined");
      }

      setUserData(data.data);
    }

    fetchUserData();
  }, [])

  if (!userData)
    return <Loading />

  return (
    <div className="py-4">
      <div className="flex items-center gap-2 mb-4">
        <h4 className="mb-0">{userData.isVerified ? "Your account is verified" : "Identity verification"}</h4>
        {(sessionStatus === "approved") && <SealCheck size={16} weight="fill" color="#49ADF4" />}
      </div>

      {(sessionStatus === "approved") &&
        <>
          <div className="p-6 bg-white rounded-[26px]">
            <h3 className="text-base">You verfied your identity</h3>
            <p className="text-gray-500">You've completed an important part of establishing trust in our community.</p>
            <div className="text-gray-500">

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <CheckCircle size={36} weight="fill" color="#5046db" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1 mb-4">
                  <h5 className="text-base mb-1">Connect your phone</h5>
                  <p className="font-light text-gray-500">Use your phone to access the verification flow.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <CheckCircle size={36} weight="fill" color="#5046db" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1 mb-4">
                  <h5 className="text-base mb-1">Show us a ID card photo</h5>
                  <p className="font-light text-gray-500">We'll check that your ID card's authenticity.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <CheckCircle size={36} weight="fill" color="#5046db" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1 mb-4">
                  <h5 className="text-base mb-1">Appear on camera</h5>
                  <p className="font-light text-gray-500">To show us it's really you, take a selfie.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <CheckCircle size={36} weight="fill" color="#5046db" />
                <div className="mt-1">
                  <h5 className="text-base mb-1">Liveness Detection</h5>
                  <p className="font-light text-gray-500">Follow the instructions to ensure you're completing this in real-time.</p>
                </div>
              </div>
            </div>
          </div>
        </>}

      {(sessionStatus === "pending") &&
        <>
          <div className="p-6 bg-white rounded-[26px]">
            <h3 className="text-base">Verification is pending</h3>
            <p className="text-gray-500">Your verification is pending. We will notify you via email once it's complete.</p>
          </div>
        </>}

      {(sessionStatus === "declined") &&
        <>
          <div className="p-6 bg-white rounded-[26px]">
            <h3 className="text-base">You don't verified your identity</h3>
            <p className="text-gray-500">How to verify your identity to keep the community safe for everyone:</p>
            <div className="text-gray-500">

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 aspect-square rounded-full border" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1 mb-2">
                  <h5 className="text-base mb-1">Connect via your phone</h5>
                  <p className="font-light text-gray-500">You will need to connect to Veriff via your phone.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 aspect-square rounded-full border" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1 mb-2">
                  <h5 className="text-base mb-1">Upload Your ID Card</h5>
                  <p className="font-light text-gray-500">You will be prompted to upload a clear picture of your ID card.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 aspect-square rounded-full border" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1">
                  <h5 className="text-base mb-1">Take a Selfie</h5>
                  <p className="font-light text-gray-500">After uploading your ID, you’ll need to take a selfie. This selfie will be compared to the photo on your ID to confirm that it’s really you.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-8 h-8 aspect-square rounded-full border"></div>
                <div className="mt-1">
                  <h5 className="text-base mb-1">Perform Liveness Detection</h5>
                  <p className="font-light text-gray-500">Follow the instructions to ensure you're completing this in real-time.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end my-4">
            <VerifyButton
              userId={userData.id!}
              sessionUrl={userData.veriff_session_url}
            />
          </div>
        </>}

    </div>
  );
}

export default VerifyStatus;