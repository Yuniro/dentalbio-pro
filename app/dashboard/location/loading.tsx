import React from "react";

// Glowing Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="membar-cards animate-pulse">
      <div className="d-flex align-items-center gap-3">
        <div className="w-100">
          <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
            <div className="bg-neutral-100 w-3/5 h-6 rounded-md mb-2"></div>
            <div className="bg-neutral-100 w-1/5 h-6 rounded-md"></div>
          </div>
          <div className="bg-neutral-100 w-full h-5 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default function Loading() {
  return (
    <div className="memberpanel-details-wrapper">
      <div id="columns">
        <SkeletonLoader/>
        <SkeletonLoader/>
        <SkeletonLoader/>
        <SkeletonLoader/>
        <SkeletonLoader/>
      </div>
    </div>
  );
}
