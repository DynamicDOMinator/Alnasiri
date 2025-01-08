import "../globals.css";
import { Cairo } from "next/font/google";

import Sidebar from "../components/LawyersDashboard/Sidebar";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "Lawyer Dashboard",
  description: "Lawyer Dashboard Page",
};

export default function LawyerDashboardLayout({ children }) {
  return (
    <html lang="ar" className={cairo.className}>
      <body className="cairo-font">
        <div className="lg:flex justify-between ">
          <div className="mx-auto w-5/6 ">{children}</div>
          <div className=" w-1/6  border-l-2  border-gray-300 bg-white  ">
            <Sidebar />
          </div>
        </div>
      </body>
    </html>
  );
}
