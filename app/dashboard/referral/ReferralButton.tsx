"use client";

import React from "react";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import { Copy } from "phosphor-react";

interface ReferralButtonProps {
    userId: string
}

const ReferralButton = ({ userId }: ReferralButtonProps) => {
    const APP_URL = process.env.APP_URL || "http://localhost:3000";
    const referralLink = `${APP_URL}/api/invite?referral=${userId}`;

    const copyLink = async() => {
        try {
            // Use the Clipboard API to copy the referral link to the clipboard
            await navigator.clipboard.writeText(referralLink);
        } catch (err) {
            console.error("Failed to copy referral link:", err);
            alert("Failed to copy referral link. Please try again.");
        }
    };
    
    return (
        <FullRoundedButton onClick={copyLink} className="my-3 flex gap-2" type="button" buttonType="primary">
            <Copy size={24} />
            CopyReferral Link
        </FullRoundedButton>
    );
};

export default ReferralButton;