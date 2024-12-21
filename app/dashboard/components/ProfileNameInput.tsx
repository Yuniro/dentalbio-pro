// components/ProfileNameInput.tsx

import React, { useState } from 'react';

type AboutTextProps = {
  defaultName: string;
}

const ProfileNameInput: React.FC<AboutTextProps> = ({
  defaultName,
}) => {
  return (
    <>
      <h2 className="text-lg font-semibold mb-3">Name</h2>
      <div className="mb-3">
        <div className='rounded-[26px] bg-white py-2 px-3'>
          <div className='text-gray-500 text-sm'>Profile Title</div>
          <input
            name="about_title"
            className="w-full text-base placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
            defaultValue={defaultName}
            placeholder="Profile Title"
          />
        </div>
      </div>
    </>
  );
}

export default ProfileNameInput;