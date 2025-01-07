import SkeletonLoader from "@/app/components/Loader/Loader";
import React from "react";

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
