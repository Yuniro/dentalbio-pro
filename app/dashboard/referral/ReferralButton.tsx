"use client";

import React from "react";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import { Copy } from "phosphor-react";
import { useMessage } from "@/app/contexts/MessageContext";

interface ReferralButtonProps {
    referralLink: string
}

const ReferralButton = ({ referralLink }: ReferralButtonProps) => {
    const { setNotificationMessage } = useMessage();
    const APP_URL = process.env.APP_URL;

    const copyLink = async() => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setNotificationMessage({ message: "Referral link copied!", type: "success" });
        } catch (err) {
            setNotificationMessage({ message: "Failed to copy referral link. Please try again.", type: "error" });
        }
    };
    
    return (
        <FullRoundedButton onClick={copyLink} className="my-3 flex gap-2" type="button" buttonType="primary">
            <Copy size={24} />
            Copy Referral Link
        </FullRoundedButton>
    );
};

export default ReferralButton;