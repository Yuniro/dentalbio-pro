import { useEffect } from 'react';

const IframeComponent = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const iframe = document.getElementById('myIframe') as HTMLIFrameElement | null;
      const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;

      if (iframeDoc) {
        const style = document.createElement('style');
        style.innerHTML = `
          .navbar-nav.custom-navbar-links {
              padding: 9px 12px;
          }
          .navbar-nav.custom-navbar-links .nav-link {
              font-size: 9px !important;
          }
          /* Add more CSS rules here */
        `;
        iframeDoc.head.appendChild(style);
      }
    }
  }, []);

  return <iframe id="myIframe" src="/path/to/index.html" frameBorder="0"></iframe>;
};

export default IframeComponent;
