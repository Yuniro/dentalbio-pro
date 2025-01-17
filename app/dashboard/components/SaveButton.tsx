"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "phosphor-react";

export default function SaveButton({ text }: { text?: string }) {
  const status = useFormStatus();
  const hasStartedPending = useRef(false);

  useEffect(() => {
    if (status.pending && !hasStartedPending.current) {
      hasStartedPending.current = true;
    }

    if (!status.pending && hasStartedPending.current) {
      hasStartedPending.current = false;

      // Dispatch the custom event to trigger iframe refresh
      const event = new Event("iframeRefresh");
      window.dispatchEvent(event); // Fire the event to refresh the iframe
    }
  }, [status.pending]);

  return (
    <button
      type="submit"
      className={`bg-primary-1 hover:bg-[#302A83] transition-all text-white p-2 rounded-[26px] py-2 text-lg px-3 font-semibold flex items-center gap-2 ${
        status.pending ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={status.pending}
    >
      {status.pending ? (
        <>
          <Spinner className="animate-spin" size={20} />
          Saving...
        </>
      ) : (
        `${text ? text : "Save"}`
      )}
    </button>
  );
}
