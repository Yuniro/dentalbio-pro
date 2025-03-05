"use client";

import React, { useState } from "react";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import { PaperPlane  } from "phosphor-react";
import { useMessage } from "@/app/contexts/MessageContext";
import LabeledInput from '../components/LabeledInput';

interface ReferralButtonProps {
    referralLink: string,
    name: string,
}

const ReferralButton = ({ referralLink, name }: ReferralButtonProps) => {
    const { setNotificationMessage } = useMessage();

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleInvite = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/invite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, referralLink, name }),
            });

            const data = await response.json();

            if (response.ok) {
                setNotificationMessage({ message: "Invite link sent successfully!", type: "success" })
            } else {
                setNotificationMessage({ message: "Failed to send Invite!", type: "error" })
            }
            setIsLoading(false)
        } catch (err) {
            setNotificationMessage({ message: "An error occurred while sending the invite.", type: "error" })
        }
    };

    return (
        <div>
            <h2 className="text-lg font-semibold text-dark text-start w-full mt-6 mb-0">
                Send Invite Link
            </h2>

            <div className="text-sm text-gray-500 my-1 ml-2">You can send the referral link to this email!</div>
            <form onSubmit={handleInvite}>
                <LabeledInput
                    label="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className='flex justify-end'>
                    <FullRoundedButton isLoading={isLoading} type='submit' className="my-3 flex gap-2">
                        <PaperPlane  size={24} />
                        Send Referral Link
                    </FullRoundedButton>
                </div>
            </form>
        </div>
    );
};

export default ReferralButton;