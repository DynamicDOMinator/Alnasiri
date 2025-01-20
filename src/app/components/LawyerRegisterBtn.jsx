"use client";
import Link from "next/link";
import { FaUserTie, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function LawyerRegisterBtn() {
  const { isAuthenticated } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  const handleRegisterBtn = (e) => {
    if (isAuthenticated) {
      e.preventDefault();
      setShowAlert(true);
    }
  };

  return (
    <div>
      <Link href="/Register-Lawyer">
        <button
          onClick={handleRegisterBtn}
          className="bg-[#FF6624] hover:bg-[#e55a20] text-white gap-2 rounded-md flex mt-8 items-center justify-center flex-row-reverse py-2.5 px-4 text-center w-full md:w-2/3 lg:w-auto mx-auto lg:mx-0 text-sm md:text-base"
        >
          تسجيل كمحامي
          <FaUserTie />
        </button>
      </Link>

      {/* Alert Popup */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
              <FaExclamationTriangle className="text-[#FF6624] text-4xl mb-4" />
              <p className="text-center mb-4">
                الرجاء تسجيل الخروج أولاً قبل التسجيل كمحامي
              </p>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="bg-[#FF6624] hover:bg-[#e55a20] text-white py-2 px-4 rounded w-full"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
