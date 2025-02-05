"use client";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function LeadsNotifications() {
  const [isLoading, setIsLoading] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchNotificationStatus(storedToken);
    }
  }, []);

  const fetchNotificationStatus = async (currentToken) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/stop-notification/status`,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      if (response.data) {
        setNotificationEnabled(response.data.notification_status === 1);
      }
    } catch (error) {
      console.error("Error fetching notification status:", error);
      toast.error("حدث خطأ أثناء تحميل حالة الإشعارات");
    }
  };

  const handleCheckboxChange = () => {
    setNotificationEnabled(!notificationEnabled);
  };

  const handleSaveChanges = async () => {
    if (!token) {
      toast.error("الرجاء تسجيل الدخول أولاً");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/stop-notification/start-stop`,
        {
          notification_status: notificationEnabled,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("تم تحديث إعدادات الإشعارات بنجاح");
        // Fetch the latest status after successful update
        await fetchNotificationStatus(token);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث إعدادات الإشعارات");
      console.error("Error updating notification settings:", error);
      // Revert the checkbox state if the API call fails
      setNotificationEnabled(!notificationEnabled);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl">
      <div className="max-w-4xl mx-auto mt-10  px-4  mb-32 lg:mt-16">
        <Link href="/Lawyer-dashboard/account-settings">
          {" "}
          <FaArrowRightLong />{" "}
        </Link>

        <h1 className="lg:text-3xl pt-5 text-xl text-center font-bold  lg:text-right">
          اشعارات الفرص
        </h1>

        <h2 className="text-lg font-semibold mt-5">تفضيلات الاشعارات</h2>
        <p className="mt-2">
          قم بادارة الطريقة التي يتم اعلامك بها عن تلقي فرصه عمل جديدة
        </p>

        <div className="flex items-center gap-4 mt-7">
          <input
            className="w-7 h-7 accent-green-700"
            type="checkbox"
            checked={notificationEnabled}
            onChange={handleCheckboxChange}
            disabled={isLoading}
          />
          <div>
            <label className="text-lg font-semibold" htmlFor="">
              البريد الالكتروني
            </label>
            <p>احصل علي بريد الكتروني في كل مره تحصل فيها علي فرصه عمل جديدة</p>
          </div>
        </div>

        <div className="flex justify-center mt-20">
          <button
            className="bg-green-700 w-full md:w-auto text-white px-14 py-3 rounded-md mt-5 disabled:opacity-50"
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? "جاري الحفظ..." : "حفظ التغيرات"}
          </button>
        </div>
      </div>
    </div>
  );
}
