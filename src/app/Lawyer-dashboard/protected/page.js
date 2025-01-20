// "use client";
// import ProtectedRoute from "../../components/ProtectedRoute";
// import { useAuth } from "../../contexts/AuthContext";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function LawyerDashboard() {
//   const { role } = useAuth();
//   const router = useRouter();

//   // Additional check for lawyer role
//   useEffect(() => {
//     if (role !== "lawyer") {
//       router.push("/");
//     }
//   }, [role, router]);

//   return (
//     <ProtectedRoute>
//       <div>
//         {/* Your lawyer dashboard content */}
//         <h1>Lawyer Dashboard</h1>
//       </div>
//     </ProtectedRoute>
//   );
// }
