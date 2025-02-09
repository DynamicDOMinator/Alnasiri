"use client";
import { FaArrowRightLong } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function ChangeMail() {
  const router = useRouter();
  const [mail, setMail] = useState("");
  const [newMail, setNewMail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []); // Runs only on mount

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    router.push("/");
  };

  const handleChangeMail = async () => {
    try {
      setError(""); // Clear any previous errors
      setSuccess(""); // Clear any previous success messages
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setError("لم يتم العثور على رمز المصادقة");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/change-data/change-email`,
        { email: newMail },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      console.log("Mail changed successfully:", response.data);
      setSuccess(
        "تم تغيير البريد الإلكتروني بنجاح! سيتم تسجيل خروجك تلقائياً..."
      );

      // Manual logout after 1.5 seconds
      setTimeout(() => {
        handleLogout();
      }, 1500);
    } catch (error) {
      console.error("Error changing mail:", error);
      setError(
        error.response?.data?.message || "حدث خطأ أثناء تغيير البريد الإلكتروني"
      );
    }
  };

  useEffect(() => {
    const currentMail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/get-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMail(response.data.data.email);
      } catch (error) {
        console.error("Error fetching current mail:", error);
      }
    };

    if (token) {
      // Ensure token is available before calling
      currentMail();
    }
  }, [BASE_URL, token]);

  return (
    <div dir="rtl">
      <div className="max-w-4xl mx-auto  px-4  mb-32 lg:mt-16">
        <Link href="/Lawyer-dashboard/account-settings">
          {" "}
          <FaArrowRightLong />{" "}
        </Link>

        <h1 className="lg:text-3xl pt-5 text-xl text-center font-bold  lg:text-right">
          تغير البريد الالكتروني
        </h1>

        <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full mt-20">
          <label
            className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
            htmlFor=""
          >
            البريد الالكتروني القديم
          </label>
          <input
            className="bg-gray-100 py-2 focus:outline-none w-full h-full"
            type="email"
            value={mail}
            readOnly // Since this is just for display
          />
        </div>
        <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full my-10">
          <label
            className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
            htmlFor=""
          >
            البريد الالكتروني الجديد
          </label>
          <input
            className="bg-gray-100 py-2 focus:outline-none w-full h-full"
            type="email"
            value={newMail}
            onChange={(e) => setNewMail(e.target.value)}
          />
        </div>

        {success && (
          <div className="text-green-600 text-sm mt-2 md:max-w-[400px] bg-green-50 p-3 rounded-md">
            {success}
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm mt-2 md:max-w-[400px]">
            {error}
          </div>
        )}

        <button
          className="bg-green-700 mt-10  text-white  hover:bg-green-800 px-14 py-3 rounded-md"
          onClick={handleChangeMail}
        >
          حفظ التغيرات
        </button>
      </div>
    </div>
  );
}
