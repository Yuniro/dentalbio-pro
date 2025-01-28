// components/AddProductModal.tsx

import { useState } from "react";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import { CaretDown } from "phosphor-react";
import LabeledInput from "@/app/dashboard/components/LabeledInput";
import CustomDatePicker from "@/app/components/DatePicker/DatePicker";
import { createClient } from "@/utils/supabase/client";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const UpgradePlanModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [period_end, setPeriodEnd] = useState<Date | null>(null);
  const [planName, setPlanName] = useState<string>("");

  const handleSubmit = async () => {
    const userId = user.id;

    const response = await fetch("/api/subscrible", {
      method: "POST",
      body: JSON.stringify({ id: userId, subscription_status: planName, current_period_end: period_end })
    });

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
    }
  }

  const plans = ["Pro", "Premium Pro"];

  return (
    <>
      {isOpen && (
        <div
          className="modal-overlay overflow-auto fixed bg-[#00000080] cursor-pointer z-10 left-0 top-0 right-0 bottom-0 flex justify-center items-center"
          onMouseDown={onClose}
        >
          <div
            className="w-[600px] overflow-hidden cursor-auto flex flex-col rounded-[26px] cursor- bg-[#F3F3F1] p-10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold">Upgrade Plan</h3>
            <form action={handleSubmit}>
              <div className="max-h-[70vh] overflow-y-auto">

                <div>
                  <LabeledInput
                    label="First Name"
                    defaultValue={user.first_name}
                    name="first_name"
                    className="w-full text-base"
                    readOnly
                  />
                  <LabeledInput
                    label="Last Name"
                    defaultValue={user.last_name}
                    name="last_name"
                    className="w-full text-base"
                    readOnly
                  />
                  <LabeledInput
                    label="Email"
                    defaultValue={user.email}
                    name="email"
                    className="w-full text-base"
                    readOnly
                  />
                  <LabeledInput
                    label="Current Plan"
                    defaultValue={user.subscription_status || "Free"}
                    name="subscription_status"
                    className="w-full text-base"
                    readOnly
                  />
                </div>

                <h4 className="text-base font-semibold mb-2">Select Plan</h4>
                <div className="relative mb-2">
                  <select
                    name="position"
                    className="w-full appearance-none p-2 rounded-[26px] h-[50px] py-2 text-base px-3 text-neutral-800 pr-10 outline-none cursor-pointer"
                    defaultValue={user?.subscription_status || ""}
                    onChange={(e) => setPlanName(e.target.value)}
                  >
                    {plans.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                  <CaretDown
                    size={20}
                    weight="bold"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 pointer-events-none"
                  />
                </div>

                <CustomDatePicker
                  selectedDate={period_end}
                  onChange={setPeriodEnd}
                  className="w-full mb-4"
                  placeholderText="Period End Date"
                />

              </div>
              <div className="flex justify-end gap-2 mt-4">
                <FullRoundedButton isLoading={isUploading} type="submit">
                  Upgrade
                </FullRoundedButton>
                <FullRoundedButton type="button" buttonType="danger" onClick={onClose}>
                  Close
                </FullRoundedButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpgradePlanModal;
