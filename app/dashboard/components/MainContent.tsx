import React from "react";
import MemberCard from "./MemberCard";
import MemberCardHeading from "./MemberCardHeading";
import Link from "next/link";

const MainContent = () => {
  return (
    <div className="memberpanel-details-wrapper">
      <Link href={"/dashboard/links"} className=" no-underline">
        <div className="add-btn">
          <button>
            <i className="fa-solid fa-plus"></i> Add Link
          </button>
        </div>
      </Link>
      <Link href={"/dashboard/links"} className=" no-underline">
        <div className="add-header-btn">
          <button>
            <svg
              width="18"
              height="16"
              viewBox="0 0 18 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.8584 3.66235H1.14156V1.17525H16.8584V3.66235ZM1.14156 4.5376H16.8584V14.8248H1.14156V4.5376ZM1.01994 15.7H16.979C17.3895 15.7 17.7 15.3462 17.7 14.9404V4.09998V1.06079C17.7 0.655527 17.39 0.3 16.979 0.3H1.01994C0.60971 0.3 0.3 0.655812 0.3 1.06079V4.09998V14.9404C0.3 15.3442 0.608606 15.7 1.01994 15.7ZM2.14682 6.59998C2.14682 6.82702 2.32212 7.0376 2.5676 7.0376H15.4335C15.679 7.0376 15.8543 6.82702 15.8543 6.59998C15.8543 6.37293 15.679 6.16235 15.4335 6.16235H2.5676C2.32212 6.16235 2.14682 6.37293 2.14682 6.59998ZM2.40312 2.79998H3.37344C3.61892 2.79998 3.79422 2.5894 3.79422 2.36235C3.79422 2.1353 3.61892 1.92473 3.37344 1.92473H2.40312C2.15764 1.92473 1.98234 2.13531 1.98234 2.36235C1.98234 2.5894 2.15764 2.79998 2.40312 2.79998ZM4.78974 2.79998H5.76006C6.00554 2.79998 6.18084 2.5894 6.18084 2.36235C6.18084 2.1353 6.00554 1.92473 5.76006 1.92473H4.78974C4.54426 1.92473 4.36896 2.13531 4.36896 2.36235C4.36896 2.5894 4.54426 2.79998 4.78974 2.79998Z"
                fill="#1C1C21"
                stroke="#1C1C21"
                strokeWidth="0.4"
              />
            </svg>
            Add Header
          </button>
        </div>
      </Link>

      not sure what this page is for

      {/* Member Cards Section */}
      {/* <div id="columns">
        <MemberCardHeading />
        <MemberCard />
      </div> */}
    </div>
  );
};

export default MainContent;
