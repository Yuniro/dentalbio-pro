import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";

export const metadata = {
  title: "Admin | Dentalbio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="member-panel-wrapper py-10 bg-[#f3f3f1]">
        <div className="max-w-[1400px] mx-auto min-h-[100vh] bg-[#f3f3f1]">
          {children}
        </div>
      </div>
    </>
  );
}
