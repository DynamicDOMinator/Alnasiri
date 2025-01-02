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
          <div className="lg:basis-3/4">{children}</div>
          <div className="lg:basis-1/4">
            <Sidebar />
          </div>
        </div>
      </body>
    </html>
  );
}
