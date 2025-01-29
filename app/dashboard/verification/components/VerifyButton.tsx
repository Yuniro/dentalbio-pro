'use client';

import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import { useState } from "react";

type VerifyButtonProps = {
  text?: string;
  enabled?: boolean;
}

const VerifyButton: React.FC<VerifyButtonProps> = ({ text, enabled }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startVerification = async () => {
    setIsLoading(true);

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

  return <FullRoundedButton isLoading={isLoading} onClick={startVerification} disabled={!enabled}>{text || "Start now"}</FullRoundedButton>;
}

export default VerifyButton;