import "../globals.css";

import Sidebar from "../components/LawyersDashboard/Sidebar";
export const metadata = {
  title: "Lawyer Dashboard",
  description: "Lawyer Dashboard Page",
};
export default function LawyerDashboardLayout({ children }) {
  return (
    <html lang="ar">
      <body>
        <div className="lg:flex justify-between">
          <div className="lg:basis-4/5">{children}</div>
          <div className="lg:basis-1/5 ">
            <Sidebar />
          </div>
        </div>
      </body>
    </html>
  );
}
