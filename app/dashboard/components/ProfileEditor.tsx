'use client'

import { At, CalendarPlus, CaretDown, Certificate, Phone, Subtitles } from "@phosphor-icons/react/dist/ssr"
import LabeledInput from "./LabeledInput"
import LimitedTextArea from "./LimitedTextArea"
import SaveButton from "./SaveButton"
import { positions } from "@/utils/global_constants"
import React, { useState } from "react"

type ProfileEditorProps = {
  dentistry: any;
  user: any;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, dentistry }) => {
  const [locationTitle, setLocationTitle] = useState<string>(dentistry.location_title || "");

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "Student") {
      setLocationTitle("Where I study");
    }
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-3">Name</h2>
      <LabeledInput
        label="Profile Title"
        defaultValue={dentistry?.about_title || ""}
        name="about_title"
        className="w-full text-base"
      />

      <h2 className="text-lg font-semibold mb-3">Bio</h2>
      <LimitedTextArea
        name="about_text"
        defaultText={dentistry?.about_text || ""}
        placeholder="About text"
      />

      {/* Position Dropdown */}
      <div className="mb-3 relative">
        <h2 className="text-base text-dark">Position</h2>
        <div className="relative">
          <select
            name="position"
            className="w-full appearance-none p-2 rounded-[26px] h-[50px] py-2 text-base px-3 text-neutral-800 pr-10 outline-none cursor-pointer"
            defaultValue={user?.position || ""}
            onChange={handlePositionChange}
          >
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
          <CaretDown
            size={20}
            weight="bold"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 pointer-events-none"
          />
        </div>
      </div>

      <LabeledInput
        label="Location Title"
        value={locationTitle}
        name="location_title"
        onChange={(e) => setLocationTitle(e.target.value)}
        className="w-full text-base pl-5">
        <Subtitles
          size={24}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
        />
      </LabeledInput>

      <LabeledInput
        label="GDC / Professional Body Reg No. (optional)"
        defaultValue={user?.gdc_no || ""}
        name="gdc_no"
        className="w-full text-base pl-5">
        <Subtitles
          size={24}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
        />
      </LabeledInput>

      <LabeledInput
        label="Qualification (optional)"
        defaultValue={user?.qualification || ""}
        name="qualification"
        className="w-full text-base pl-5">
        <Certificate
          size={24}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
        />
      </LabeledInput>

      <LabeledInput
        // id="phone"
        label="Contact Phone (optional)"
        defaultValue={dentistry?.phone || ""}
        name="phone"
        // placeholder="Contact Phone (optional)"
        className="w-full text-base pl-5">
        <Phone
          size={24}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
        />
      </LabeledInput>

      <LabeledInput
        // id="email"
        label="Contact Email (optional)"
        defaultValue={dentistry?.contact_email || ""}
        name="contact_email"
        type="email"
        // placeholder="Contact Email (optional)"
        className="w-full text-base pl-5">
        <At
          size={24}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
        />
      </LabeledInput>

      <div className="w-full flex justify-between items-center gap-3">
        <LabeledInput
          label="Booking Link (optional)"
          className="w-full flex-grow text-base pl-5"
          name="booking_link"
          defaultValue={dentistry?.booking_link || ""}
        // placeholder="Booking Link (optional)"
        >
          <CalendarPlus
            size={24}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
          />
        </LabeledInput>

        <div className="form-check form-switch custom-form-check mb-3">
          <input
            className="form-check-input cursor-pointer"
            type="checkbox"
            role="switch"
            id="booking_link_enabled"
            name="booking_link_enabled"
            // checked={dentistry.booking_link_enabled}
            defaultChecked={dentistry.booking_link_enabled}
          />
        </div>
      </div>

      {/* Save Button for Dentistry */}
      <div className="w-full flex items-end justify-end">
        <SaveButton />
      </div>
    </>
  )
}

export default ProfileEditor;