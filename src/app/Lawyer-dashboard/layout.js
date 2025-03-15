"use client";
import { Cairo } from "next/font/google";
import "../globals.css";
import Sidebar from "../components/LawyersDashboard/Sidebar";
import { UserTypeProvider } from "../contexts/UserTypeContext";
import { useUserType } from "../contexts/UserTypeContext";
import { useAuth } from "../contexts/AuthContext";
import { AuthProvider } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function LawyerDashboardLayout({ children }) {
  const router = useRouter();

  return (
    <html>
      <head>
        <title>بشارة - لوحة التحكم</title>
        <link rel="icon" href="/images/afav.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={cairo.className}>
        <AuthProvider>
          <UserTypeProvider>
            <AuthContent>{children}</AuthContent>
          </UserTypeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function AuthContent({ children }) {
  const { isAuthenticated } = useAuth();
  const { userType, isLoading } = useUserType();
  const router = useRouter();

  
  useEffect(() => {
   

   
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || userType !== "lawyer") {
    
      router.push("/");
    }
  }, [isAuthenticated, userType, isLoading, router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  if (!isAuthenticated || userType !== "lawyer") {
    return null;
  }

  return (
    <div className="lg:flex justify-between">
      <div className="mx-auto lg:w-5/6">{children}</div>
      <div className="lg:w-1/6">
        <Sidebar />
      </div>
    </div>
  );
}
