'use client';

import FullRoundedButton from "@/app/components/Button/FullRoundedButton";

type VerifyButtonProps = {
  userId: string;
  sessionUrl?: string;
}

const VerifyButton: React.FC<VerifyButtonProps> = ({ userId, sessionUrl }) => {
  const startVerification = async () => {
    if (sessionUrl) {
      window.location.href = sessionUrl; // Redirect to Veriff
    } else {
      try {
        const response = await fetch('/api/veriff/create-session', {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to start verification');
        }

        const data = await response.json();

        console.log(data);

        window.location.href = data.verification.url; // Redirect to Veriff
      } catch (error) {
        console.error('Error starting verification:', error);
      }
    };
  }

  return <FullRoundedButton onClick={startVerification}>Start now</FullRoundedButton>;
}

export default VerifyButton;