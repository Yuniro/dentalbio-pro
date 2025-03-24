import RightPanel from "./components/RightPanel";
import Sidebar from "./components/Sidebar";
import { getAuthorizedUser } from "@/utils/user/getAuthorizedUser";

import "./styles.css";
import "./globals.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-datepicker/dist/react-datepicker.css";

export const metadata = {
  title: "Dashboard | Dentalbio",
};

const RootLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isMessageStateForStudent } = await getAuthorizedUser();
  return (
    // <>
    //   <div className="member-panel-wrapper">
    //     <div className="container member-container">
    //       <div className="row">
    //         {/* Sidebar */}
    //         <div className="col-xl-3 col-12 mb-3">
    //           <Sidebar isMessageStateForStudent={isMessageStateForStudent} />
    //         </div>
    //         <div className="relative col-xl-6 col-12">{children}</div>
    //         <RightPanel />
    //       </div>
    //     </div>
    //   </div>
    // </>
    <div className="flex flex-col min-h-screen bg-[#f3f3f1] py-10">
      <div className="flex flex-1 container mx-auto px-4">
        <div className="flex flex-col xxl:flex-row w-full items-center xxl:items-start">
          {/* Sidebar */}
          <div className="w-full md:w-[768px] xxl:w-1/4 mb-3">
            <Sidebar isMessageStateForStudent={isMessageStateForStudent} />
          </div>
          <div className="relative w-full md:w-[768px] xxl:w-1/2">{children}</div>
          <RightPanel />
        </div>
      </div>
    </div>
  );
}

export default RootLayout