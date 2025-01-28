'use client'

import { useAdmin } from "@/utils/functions/useAdmin";
import { useEffect, useState } from "react";
import { showEntri } from "entrijs";

const config = {
  applicationId: 'your-real-application-id', // Replace with a valid ID
  dnsRecords: [
    {
      type: "CNAME",
      host: "www",
      value: "m.test.com",
      ttl: 300,
    },
  ],
  token: 'your-real-token', // Replace with a valid token
};

type DomainComponentProps = {
  enabled: boolean;
  targetUserId: string | null;
}

const DomainComponent: React.FC<DomainComponentProps> = ({ enabled, targetUserId }) => {
  const { getTargetUserId } = useAdmin();

  useEffect(() => {
    const existingScript = document.querySelector('script[src*="entri.js"]');
    if (!existingScript) {
      showEntri(config);
    } else {
      console.warn("EntriJS script already loaded.");
    }
  }, [])

  return (
    <div>
      Domain Component
    </div>
  )
}

export default DomainComponent;