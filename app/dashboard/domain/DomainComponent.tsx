'use client'

import { FormEvent, useEffect, useState } from "react";
import LabeledInput from "../components/LabeledInput";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import { generateVerificationCode } from "@/utils/functions/generateVerificationCode";
import { updateVercelRedirects } from "@/utils/vercel/updateVercelRedirects";

type DomainComponentProps = {
  enabled: boolean;
  targetUserId: string | null;
}

const DomainComponent: React.FC<DomainComponentProps> = ({ enabled, targetUserId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserType>({});
  const [domain, setDomain] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");

  useEffect(() => {
    const fetchUserDomain = async () => {
      const response = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({ targetUserId })
      });

      const data = await response.json();
      setUserData(data);
      setDomain(data.domain);
      setVerificationCode(data.domain_verification_code);
    }

    fetchUserDomain();
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!verificationCode) {
      return;
    }

    setIsLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const domain = formData.get("domain") as string;

    const response = await fetch("/api/domain/verify", {
      method: "POST",
      body: JSON.stringify({ targetUserId, domain, verificationCode })
    });

    const data = await response.json();

    setIsLoading(false);

    if (data.error) {
      console.error(data.error);
      return;
    }

    addDomainToVercel(domain);
  }

  const addDomainToVercel = async (domain: string) => {
    const response = await fetch("https://api/vercel.com/v4/domains", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
      },
      body: JSON.stringify({
        name: domain,
        projectId: process.env.VERCEL_PROJECT_ID,
      })
    })

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
    } else {
      updateVercelRedirects(userData.username!, domain);

      console.log("Added domain to Vercel successfully!")
    }
  }

  const generateCode = () => {
    setVerificationCode(generateVerificationCode());
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold text-dark text-start w-full mt-4 mb-0">
          Domain Name
        </h2>

        <div className="text-sm text-gray-500 my-2 ml-2">If you own a domain, please link it to your bio.</div>

        <LabeledInput
          label="Domain Name"
          name="domain"
          value={domain}
          onChange={e => setDomain(e.target.value)}
        />

        <div className="flex w-full justify-between items-center gap-2">
          <LabeledInput
            label="Verification Code"
            name="verification_code"
            value={verificationCode}
            readOnly
            required
          />

          <FullRoundedButton onClick={generateCode} className="mb-3" type="button" buttonType="warning">Generate</FullRoundedButton>
        </div>

        <div className="flex justify-end">
          <FullRoundedButton isLoading={isLoading} type="submit">Save</FullRoundedButton>
        </div>
      </form>
    </div>
  );
}

export default DomainComponent;
