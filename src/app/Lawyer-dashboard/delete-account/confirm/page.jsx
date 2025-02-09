"use client";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Add custom Alert component
const CustomAlert = ({ message, isVisible, onClose, isError }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <div className="text-center">
          <p className="text-lg mb-4">{message}</p>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-white ${
              isError
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            حسناً
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ConfirmDeleteAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    isError: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    // Clear error when user starts typing
    if (value.length > 0) {
      setPasswordError("");
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    // Validate password
    if (!password.trim()) {
      setPasswordError("الرجاء إدخال كلمة المرور");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/change-data/delete-account`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setAlert({
          show: true,
          message: "تم حذف حسابك بنجاح",
          isError: false,
        });
        localStorage.clear();
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setAlert({
        show: true,
        message: "حدث خطأ أثناء محاولة حذف الحساب",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl">
      <CustomAlert
        message={alert.message}
        isVisible={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
        isError={alert.isError}
      />
      <div className="max-w-4xl mx-auto mt-10 px-4 mb-32 lg:mt-16">
        <Link href="/Lawyer-dashboard/delete-account">
          <FaArrowRightLong />
        </Link>

        <h1 className="lg:text-3xl pt-5 text-xl text-center font-bold lg:text-right">
          احذف حسابي
        </h1>

        <div className="mt-8">
          <h2 className="text-center md:text-right mb-2 font-bold text-xl">
            ادخل كلمة المرور
           
          
          </h2>
          <p className="my-2 text-sm text-red-600">  يرجي ادخال كلمة المرور الخاصة بك من هويتك ومتابعة الغاء حذف حسابك</p>

          <form onSubmit={handleDeleteAccount} className="max-w-md mt-10 mx-auto">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 border rounded-lg mb-1 ${
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="كلمة المرور"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mb-3">{passwordError}</p>
              )}
            </div>

            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className="bg-red-600 text-white px-12 py-2 hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "جاري حذف الحساب..." : "احذف حسابي"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
