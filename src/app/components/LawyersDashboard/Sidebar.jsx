"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CiUser } from "react-icons/ci";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchLawyerOffice = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/lawyer/get-lawyer-office-by`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProfileImage(response.data.profile_image_link);
      } catch (error) {
        return null;
      } finally {
        setIsImageLoading(false);
      }
    };

    fetchLawyerOffice();
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchLawyerBalance = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/wallet/get-balance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBalance(response.data.balance);
      } catch (error) {
        return null;
      } finally {
        setIsImageLoading(false);
      }
    };

    fetchLawyerBalance();
  }, [API_BASE_URL]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setProfileImage(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("userName");
      if (storedUserName) {
        const names = storedUserName.split(" ");
        const displayName = names.slice(0, 2).join(" ");
        setUserName(displayName);
      } else {
        setUserName("المستخدم");
      }
    }
  }, []);

  const isLeadDetailsPage = pathname.includes(
    "/Lawyer-dashboard/lead-details/"
  );

  return (
    <div>
      {/* desktop screen */}
      <div className="lg:fixed hidden lg:border-l-2 border-gray-300 lg:block gap-4 right-0 z-50 w-1/6 ml-auto h-screen">
        <h2 onClick={() => window.location.href = "/"} className="mt-20 cursor-pointer justify-center text-[#00447b] text-4xl font-extrabold flex items-center gap-2 pb-10">
          بشارة
          {/* <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={35}
              height={35}
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                d="M14.63 7L13 3h1V2H9V1H8v1H3v1h1L2.38 7H2v1h.15c.156.498.473.93.9 1.23a2.47 2.47 0 0 0 2.9 0A2.44 2.44 0 0 0 6.86 8H7V7h-.45L4.88 3H8v8H6l-.39.18l-2 2.51l.39.81h9l.39-.81l-2-2.51L11 11H9V3h3.13l-1.67 4H10v1h.15a2.48 2.48 0 0 0 4.71 0H15V7zM5.22 8.51a1.5 1.5 0 0 1-.72.19a1.45 1.45 0 0 1-.71-.19A1.5 1.5 0 0 1 3.25 8h2.5a1.5 1.5 0 0 1-.53.51M5.47 7h-2l1-2.4zm5.29 5L12 13.5H5L6.24 12zm1.78-7.38l1 2.4h-2zm.68 3.91a1.4 1.4 0 0 1-.72.19a1.35 1.35 0 0 1-.71-.19a1.55 1.55 0 0 1-.54-.53h2.5a1.37 1.37 0 0 1-.53.53"
              ></path>
            </svg>
          </span> */}
        </h2>
        <div className="flex flex-col items-end gap-1 border-b-2 px-2 pb-10">
          <Link
            className={`flex gap-2 items-center w-full p-2 rounded-3xl hover:bg-gray-50 ${
              pathname === "/Lawyer-dashboard"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard"
          >
            <p className="w-full text-right">فرص</p>
            <Image
              src="/images/icon1.png"
              alt="فرص"
              width={15}
              height={15}
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl w-full hover:bg-gray-50 ${
              pathname === "/Lawyer-dashboard/MyForas"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard/MyForas"
          >
            <p className="w-full text-right">فرصي</p>
            <Image
              src="/images/icon2.png"
              alt="فرصي"
              width={15}
              height={15}
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl w-full hover:bg-gray-50 ${
              pathname === "/Lawyer-dashboard/FreeQuestions"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard/FreeQuestions"
          >
            <p className="w-full text-right">الاسئلة المجانية</p>
            <Image
              src="/images/icon3.png"
              alt="الاسئلة المجانية"
              width={15}
              height={15}
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl w-full hover:bg-gray-50 ${
              pathname === "/Lawyer-dashboard/MyAnswers"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard/MyAnswers"
          >
            <p className="w-full text-right">أجوبتي</p>
            <Image
              src="/images/icon4.png"
              alt="أجوبتي"
              width={15}
              height={15}
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl w-full hover:bg-gray-50 ${
              pathname === "/Lawyer-dashboard/Profile"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard/Profile"
          >
            <p className="w-full text-right">صفحتي الشخصية</p>
            <Image
              src="/images/icon5.png"
              alt="profile"
              width={15}
              height={15}
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl w-full hover:bg-gray-50 ${
              pathname === "/Lawyer-dashboard/Balance"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard/Wallet"
          >
            <div className="w-full flex-row-reverse flex justify-start  items-center gap-1">
            <p className=" text-right">
              رصيدي
            </p>
              <p className="pr-1">{balance} </p>
              <p>ر.س</p>
            </div>
           
            <Image
              src="/images/icon6.png"
              alt="balance"
              width={15}
              height={15}
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </div>
        {/* Modified settings section */}
       
        <div className="absolute flex hover:bg-gray-100 py-2 items-center gap-4 w-full justify-end pr-5 bottom-5">
          <Link href="/Lawyer-dashboard/Settings">
          <div>
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-sm text-right">الاعدادات</p>
          </div>
          </Link>
          <div>
           
          {isImageLoading ? (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : profileImage ? (
              <Image
                className="w-12 h-12 rounded-full object-cover"
                src={profileImage}
                alt="profile"
                width={48}
                height={48}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile and medium screen navigation */}
      {!isLeadDetailsPage && (
        <div className="lg:hidden fixed bottom-0 right-0 left-0 bg-white border-t-2 py-4 px-4">
          <div className="flex flex-row-reverse justify-between items-center">
            <Link
              className={`flex flex-col items-center gap-1 ${
                pathname === "/Lawyer-dashboard" ? "text-primary" : ""
              }`}
              href="/Lawyer-dashboard"
            >
              <Image
                src="/images/icon1.png"
                alt="فرص"
                width={20}
                height={20}
                style={{ width: "auto", height: "auto" }}
              />
              <span className="text-xs">فرص</span>
            </Link>

            <Link
              className={`flex flex-col items-center gap-1 ${
                pathname === "/Lawyer-dashboard/MyForas" ? "text-primary" : ""
              }`}
              href="/Lawyer-dashboard/MyForas"
            >
              <Image
                src="/images/icon2.png"
                alt="فرصي"
                width={20}
                height={20}
                style={{ width: "auto", height: "auto" }}
              />
              <span className="text-xs">فرصي</span>
            </Link>

            <Link
              className={`flex flex-col items-center gap-1 ${
                pathname === "/Lawyer-dashboard/FreeQuestions"
                  ? "text-primary"
                  : ""
              }`}
              href="/Lawyer-dashboard/FreeQuestions"
            >
              <Image
                src="/images/icon3.png"
                alt="الاسئلة المجانية"
                width={20}
                height={20}
                style={{ width: "auto", height: "auto" }}
              />
              <span className="text-xs">الاسئلة المجانية</span>
            </Link>

            <Link
              className={`flex flex-col items-center gap-1 ${
                pathname === "/Lawyer-dashboard/MyAnswers" ? "text-primary" : ""
              }`}
              href="/Lawyer-dashboard/MyAnswers"
            >
              <Image
                src="/images/icon4.png"
                alt="أجوبتي"
                width={20}
                height={20}
                style={{ width: "auto", height: "auto" }}
              />
              <span className="text-xs">أجوبتي</span>
            </Link>

            <Link
              className={`flex flex-col items-center gap-1 ${
                pathname === "/Lawyer-dashboard/Settings" ? "text-primary" : ""
              }`}
              href="/Lawyer-dashboard/Settings"
            >
              <CiUser className="text-2xl" />
              <span className="text-xs">الاعدادات</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
