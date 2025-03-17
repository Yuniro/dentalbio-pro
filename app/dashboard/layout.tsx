import { Inter } from "next/font/google";
import RightPanel from "./components/RightPanel";
import Sidebar from "./components/Sidebar";
import { getAuthorizedUser } from "@/utils/user/getAuthorizedUser";

import "./styles.css";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
    <>
      <div className="member-panel-wrapper">
        <div className="container member-container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-xl-3 col-12 mb-3">
              <Sidebar isMessageStateForStudent={isMessageStateForStudent} />
            </div>
            <div className="relative col-xl-6 col-12">{children}</div>
            <RightPanel />
          </div>
        </div>
      </div>
    </>
  );
}

export default RootLayout