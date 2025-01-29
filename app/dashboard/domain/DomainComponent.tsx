'use client'

import { useAdmin } from "@/utils/functions/useAdmin";
import { useEffect, useState } from "react";
import { showEntri } from "entrijs";

type DomainComponentProps = {
  enabled: boolean;
  targetUserId: string | null;
}

const DomainComponent: React.FC<DomainComponentProps> = ({ enabled, targetUserId }) => {
  const { getTargetUserId } = useAdmin();

  return (
    <div>
      Domain Component
    </div>
  )
}

export default DomainComponent;