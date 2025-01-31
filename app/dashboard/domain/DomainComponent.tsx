'use client'

import { FormEvent, useEffect, useState } from "react";
import LabeledInput from "../components/LabeledInput";
import { useAdmin } from "@/utils/functions/useAdmin";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";

type DomainComponentProps = {
  enabled: boolean;
  targetUserId: string | null;
}

const DomainComponent: React.FC<DomainComponentProps> = ({ enabled, targetUserId }) => {
  const { getTargetUserId } = useAdmin();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [domain, setDomain] = useState<string>("");

  useEffect(() => {
    const fetchUserDomain = async () => {
      const response = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({ targetUserId })
      });

      const data = await response.json();
      setDomain(data.domain);
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const domain = formData.get("domain") as string;
    console.log(domain);

    const response = await fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify({ targetUserId: getTargetUserId(), domain })
    });

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
    } else {

    }

    setIsLoading(false);
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

        <div className="flex justify-end">
          <FullRoundedButton isLoading={isLoading} type="submit">Save</FullRoundedButton>
        </div>
      </form>
    </div>
  );
}

export default DomainComponent;
