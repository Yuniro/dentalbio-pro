import React from 'react';

const MemberCardHeading = () => {
  return (
    <div className="member-card-heading">
      <div className="d-flex align-items-center justify-content-between">
        {/* Drag Arrow Icon */}
        <img
          src="/icons/drage-arrow.svg"
          alt="vector"
          className="cursor-pointer"
        />
        <div className="d-flex align-items-center gap-2 member-heading">
          {/* Heading Text */}
          <p className="mb-0">Heading</p>
          {/* Edit Icon */}
          <img
            src="/icons/edit.svg"
            alt="edit"
            className="cursor-pointer"
          />
        </div>
        {/* Trash Icon */}
        <img
          src="/icons/trash.svg"
          alt="trash"
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default MemberCardHeading;
