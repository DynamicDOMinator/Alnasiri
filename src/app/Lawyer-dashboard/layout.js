import { Cairo } from "next/font/google";
import "../globals.css";
import Sidebar from "../components/LawyersDashboard/Sidebar";

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function LawyerDashboardLayout({ children }) {
  return (
    <html>
      <body className={cairo.className}>
        <div className="lg:flex justify-between">
          <div className="mx-auto lg:w-5/6">{children}</div>
          <div className="lg:w-1/6">
            <Sidebar />
          </div>
        </div>
      </body>
    </html>
  );
}
