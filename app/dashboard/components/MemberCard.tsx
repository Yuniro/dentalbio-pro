import React from 'react';

const MemberCard = () => {
  return (
    <div className="membar-cards">
      <div className="flex items-center gap-3">
        {/* Drag Arrow Icon */}
        <img
          src="icons/drage-arrow.svg"
          alt="vector"
          className="cursor-pointer"
        />
        <div className="w-100">
          {/* Member Card Actions */}
          <div className="flex items-center justify-between gap-2 mb-3 member-cards-actions">
            <div>
              <div className="flex items-center gap-2 member-heading">
                <p className="mb-0">Title Lorem Ipsum Dolor</p>
                {/* Edit Icon */}
                <img
                  src="icons/edit.svg"
                  alt="edit"
                  className="cursor-pointer"
                />
              </div>
              {/* Link */}
              <p className="links-wrapper mb-0">
                http://amazon.co.uk/Lorem-ipsum-dolor-sit-ametor
              </p>
            </div>
            {/* Link and Switch */}
            <div className="flex gap-3 items-center">
              <img
                src="icons/link-icon.svg"
                alt="link"
                className="cursor-pointer"
              />
              <div className="relative inline-block w-8 h-5">
                <input defaultChecked id="switch-component-blue" type="checkbox" className="peer appearance-none w-8 h-5 bg-white border-grey-500 border-[1px] rounded-full checked:bg-[#7d71e5] cursor-pointer transition-colors duration-300" />
                <label htmlFor="switch-component-blue" className="absolute top-0 left-[2px] w-[14px] h-[14px] mt-[3px] bg-[#86B7FE] rounded-full shadow-sm transition-transform duration-300 peer-checked:translate-x-4 peer-checked:border-grey-500 peer-checked:bg-white cursor-pointer">
                </label>
              </div>
            </div>
          </div>

          {/* Clicks and Trash Icons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="mb-0">8 clicks</p>
              {/* Gallery Button */}
              <button className="btn border-0 p-0">
                <img
                  src="icons/gallery-vector.svg"
                  alt="gallery"
                  className="cursor-pointer"
                />
              </button>
            </div>
            {/* Trash Icon */}
            <img
              src="icons/trash.svg"
              alt="trash"
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
