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
      <div className="member-panel-wrapper py-10">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </div>
    </>
  );
}
