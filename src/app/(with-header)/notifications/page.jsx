"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useUserType } from "@/app/contexts/UserTypeContext";

export default function Notifications() {







  
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());





  const { logout , isAuthenticated } = useAuth();
  const { userType, isLoading: userTypeLoading } = useUserType();
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  if (!userTypeLoading && (!isAuthenticated || userType === "lawyer")) {
   router.push("/");
  }
}, [isAuthenticated, userType, userTypeLoading, router]);







  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(`${BASE_URL}/notification/get-all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleViewQuestion = (questionUuid) => {
    router.push(`/question/${questionUuid}`);
  };

  const ProfileImage = ({ src, size = 100 }) => {
    const hasError = imageErrors.has(src);

    if (!src || hasError) {
      return (
        <div
          className="bg-gray-100 rounded-full flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <FaUser className="text-gray-400" style={{ fontSize: size * 0.5 }} />
        </div>
      );
    }

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src={src}
          alt="lawyer profile"
          width={size}
          height={size}
          className="rounded-full object-cover"
          onError={() => {
            setImageErrors((prev) => new Set([...prev, src]));
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-slate-100 pt-24 pb-10 px-4 min-h-screen">
      {loading ? (
        <div className="absolute inset-0 flex justify-center items-center">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <h1 className="lg:text-3xl text-xl font-bold text-right">الاشعارات</h1>

          <div
            dir="rtl"
            className="flex md:flex-row flex-col md:items-start items-center mt-10 gap-10 justify-between"
          >
            <div className="flex flex-col gap-4 w-full md:w-auto lg:w-2/3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-2 w-full p-4 bg-white shadow-md"
                  >
                    <ProfileImage src={notification.lawyer_image} size={100} />
                    <div>
                      <p className="text-lg font-bold">{notification.text}</p>
                      <p className="mt-2">{notification.question?.question_title}</p>
                      <p className="mt-2">
                        {new Date(notification.created_at).toLocaleDateString("ar-EG")}
                      </p>
                      <button 
                        onClick={() => handleViewQuestion(notification.question_uuid)}
                        className="text-blue-800 hover:underline flex items-center gap-1 mt-2"
                      >
                        اطلع علي السؤال
                        <IoIosArrowBack />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-white shadow-md rounded-lg">
                  <IoNotificationsOutline className="text-6xl text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">لا توجد إشعارات</h3>
                  <p className="text-gray-500 text-center mb-6">
                    لم تتلق أي إشعارات حتى الآن. ابدأ بطرح سؤالك الأول واحصل على
                    إجابات من محامين متخصصين
                  </p>
                  <button
                    onClick={() => router.push("/Askquestion")}
                    className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-900 transition-colors flex items-center gap-2"
                  >
                    اطرح سؤالاً
                    <IoIosArrowBack />
                  </button>
                </div>
              )}
            </div>

            <div className="border-t-4 lg:w-1/3 w-full md:w-auto border-blue-800 pb-5 bg-white p-2 flex flex-col items-center shadow-md">
              <h2 className="text-lg font-bold mt-2">أسأل سؤال مجاني</h2>
              <p className="text-gray-800 mt-2">
                اطرح سؤالاً واحصل على مشورة مجانية من عدة محامين
              </p>
              <button className="bg-blue-800 mt-10 hover:bg-blue-900 text-white px-4 py-2 rounded">
                <Link href="/Askquestion">اسأل سؤال مجاني</Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
