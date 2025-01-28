'use client'

import { useAdmin } from "@/utils/functions/useAdmin";
import { useEffect, useState } from "react";

type BrandingComponentProps = {
  enabled: boolean;
  targetUserId: string | null;
}

const BrandingComponent: React.FC<BrandingComponentProps> = ({ enabled, targetUserId }) => {
  const { getTargetUserId } = useAdmin();
  const [originalBranding, setOriginalBranding] = useState<boolean>(false);
  const [useDentalbioBranding, setUseDentalbioBranding] = useState<boolean>(false);

  const updateUseDentalbioBranding = async () => {
    const response = await fetch('/api/user', {
      method: 'PUT',
      body: JSON.stringify({ targetUserId: getTargetUserId()!, use_dental_brand: useDentalbioBranding })
    })

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
    } else {
      setOriginalBranding(data.use_dental_brand);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({ targetUserId: getTargetUserId()! })
      });
      const data = await response.json();

      setOriginalBranding(data.use_dental_brand);
      setUseDentalbioBranding(data.use_dental_brand);
    }

    fetchUser();
  }, [targetUserId])

  useEffect(() => {
    if (useDentalbioBranding !== originalBranding) {
      updateUseDentalbioBranding();
    }
  }, [useDentalbioBranding])

  const toggleUseDentalbioBranding = () => {
    setUseDentalbioBranding((prev) => {
      return !prev;
    })
  }

  return (
    <div className="flex justify-start items-center gap-4 py-10">
      <h4 className="m-0 text-lg">Use the Dentalbio's Logo</h4>

      <div className="form-check form-switch custom-form-check">
        <input
          className="form-check-input cursor-pointer"
          type="checkbox"
          role="switch"
          checked={useDentalbioBranding}
          onChange={toggleUseDentalbioBranding}
          disabled={!enabled}
        />
      </div>

    </div>
  )
}

export default BrandingComponent;