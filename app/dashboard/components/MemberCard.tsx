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
              <div className="form-check form-switch custom-form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  defaultChecked
                />
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
