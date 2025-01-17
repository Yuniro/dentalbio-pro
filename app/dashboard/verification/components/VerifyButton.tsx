'use client';

import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import { useState } from "react";

type VerifyButtonProps = {
  userId: string;
  sessionUrl?: string;
  sessionCreatedAt?: Date;
  text?: string;
}

const VerifyButton: React.FC<VerifyButtonProps> = ({ userId, sessionUrl, sessionCreatedAt, text }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startVerification = async () => {
    setIsLoading(true);
    const currentTime = new Date();
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    
    try {
      const response = await fetch('/api/veriff/create-session', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to start verification');
      }

      const data = await response.json();

      window.location.href = data.verification.url; // Redirect to Veriff
    } catch (error) {
      console.error('Error starting verification:', error);
    }
  }

  return <FullRoundedButton isLoading={isLoading} onClick={startVerification}>{text || "Start now"}</FullRoundedButton>;
}

export default VerifyButton;