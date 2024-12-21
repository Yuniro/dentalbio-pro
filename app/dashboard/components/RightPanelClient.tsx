// "use client";

// import React, { useRef, useState } from "react";
// import { ArrowsClockwise } from "phosphor-react";

// const RightPanelClient = ({ username }: { username: string }) => {
//   // Reference for the iframe
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const [isReloading, setIsReloading] = useState(false); // State to track if the iframe is reloading

//   // Client-side function to reload iframe
//   const handleRefreshClick = async () => {
//     if (iframeRef.current) {
//       setIsReloading(true); // Start spinner when button is clicked
//       iframeRef.current.src = iframeRef.current.src;

//       // Wait for the iframe to finish loading before stopping the spinner
//       iframeRef.current.onload = () => {
//         setIsReloading(false); // Stop spinner when iframe is reloaded
//       };
//     }
//   };

//   return (
//     <>
//       <div className="memberpanel-index relative">
//         <iframe
//           id="myIframe"
//           ref={iframeRef}
//           src={`/${username}`}
//           frameBorder={0}
//           style={{
//             transform: "scale(0.75)",
//             transformOrigin: "0 0",
//             width: "133%",
//             height: "750px",
//           }}
//         />
//         <form className="no-underline add-btn upgrade-now-btn absolute bottom-44 z-20 right-4 cursor-pointer">
//           <button type="button" className="aspect-square cursor-pointer" onClick={handleRefreshClick}>
//             <ArrowsClockwise
//               size={24}
//               className={isReloading ? "animate-spin" : ""} // Apply spinning animation when reloading
//             />{" "}
//           </button>
//         </form>
//       </div>
//       <div className="footer-logo text-center mb-0 -mt-40 flex flex-col items-center justify-center">
//         <a href="/" target="_blank">
//           <img src="/logo.svg" alt="logo" className="img-fluid" />
//         </a>
//       </div>
//     </>
//   );
// };

// export default RightPanelClient;


"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowsClockwise } from "phosphor-react";

const RightPanelClient = ({ username }: { username: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReloading, setIsReloading] = useState(false);

  // Client-side function to reload iframe and show spinner
  const handleRefreshClick = async () => {
    if (iframeRef.current) {
      setIsReloading(true); // Start spinner immediately when button is clicked
      iframeRef.current.src = iframeRef.current.src;

      // Wait for the iframe to finish loading before stopping the spinner
      iframeRef.current.onload = () => {
        setIsReloading(false); // Stop spinner when iframe is reloaded
      };
    }
  };

  // Global event listener to reload iframe (triggered from anywhere)
  useEffect(() => {
    const handleIframeRefresh = () => {
      if (iframeRef.current) {
        setIsReloading(true);
        iframeRef.current.src = iframeRef.current.src;
        iframeRef.current.onload = () => setIsReloading(false);
      }
    };

    window.addEventListener("iframeRefresh", handleIframeRefresh);

    return () => {
      window.removeEventListener("iframeRefresh", handleIframeRefresh);
    };
  }, []);

  return (
    <>
      <div className="memberpanel-index relative">
        <iframe
          id="myIframe"
          ref={iframeRef}
          src={`/${username}`}
          frameBorder={0}
          style={{
            transform: "scale(0.75)",
            transformOrigin: "0 0",
            width: "133%",
            height: "750px",
          }}
        />
        <form className="no-underline add-btn upgrade-now-btn absolute bottom-44 z-20 right-4 cursor-pointer">
          <button type="button" className="aspect-square cursor-pointer" onClick={handleRefreshClick}>
            <ArrowsClockwise
              size={24}
              className={isReloading ? "animate-spin" : ""}
            />{" "}
          </button>
        </form>
      </div>
      <div className="footer-logo text-center mb-0 -mt-40 flex flex-col items-center justify-center">
        <a href="/" target="_blank">
          <img src="/logo.svg" alt="logo" className="img-fluid" />
        </a>
      </div>
    </>
  );
};

export default RightPanelClient;
