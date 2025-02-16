"use client";
import { CiSettings } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { CiCreditCard1 } from "react-icons/ci";
import { MdStarBorderPurple500 } from "react-icons/md";
import { BiSolidPhoneCall } from "react-icons/bi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ImProfile } from "react-icons/im";

export default function Settings() {
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Only access localStorage in the browser
    const name = localStorage.getItem("userName");
    setUserName(name);
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");

    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto  px-4  mb-32 lg:mb-10">
      <div className="sticky top-0 bg-white pt-16 pb-2 ">
        <h1 className="lg:text-3xl text-xl text-center font-bold  lg:text-right">
          الاعدادات الشخصيىة
        </h1>
      </div>

      <div className="text-right mt-10 ">
        <p>مرحبا بك </p>
        <p>{userName}</p>
      </div>

      <Link href="/Lawyer-dashboard/Profile">
        <div className="flex  items-center border-b lg:hover:bg-gray-100 lg:py-2 lg:px-2 pb-5 justify-between flex-row-reverse mt-10">
          <div>
            <div className="flex gap-1 items-center justify-end">
              <h2 className="text-lg font-semibold">معلومات الملف الشخصي</h2>
              <ImProfile />
            </div>
            <div className="text-right">
              <p className="text-gray-500">
                قم بتعديل صفحة الملف الشخصي الخاص بك
              </p>
            </div>
          </div>
          <IoIosArrowBack />
        </div>
      </Link>

      <Link href="/Lawyer-dashboard/account-settings">
        <div className="flex  items-center border-b lg:hover:bg-gray-100 lg:py-2 lg:px-2 pb-5 justify-between flex-row-reverse mt-10">
          <div>
            <div className="flex gap-1 items-center justify-end">
              <h2 className="text-lg font-semibold"> اعدادات الحساب</h2>
              <CiSettings />
            </div>
            <div className="text-right">
              <p className="text-gray-500">
                قم بتعديل صفحة الملف الشخصي, الاسم, البريد الالكتروني,رقم الهاتف
                , وتغيير كلمة المرور
              </p>
            </div>
          </div>
          <IoIosArrowBack />
        </div>
      </Link>

      <Link href="/Lawyer-dashboard/Wallet">
        <div className="flex  items-center lg:hover:bg-gray-100 lg:py-2 lg:px-2 border-b pb-5 justify-between flex-row-reverse mt-8">
          <div>
            <div className="flex gap-1 items-center justify-end">
              <h2 className="text-lg font-semibold">محفظتي</h2>
              <CiCreditCard1 />
            </div>
            <div className="text-right">
              <p className="text-gray-500">
                قم بتعبئة حسابك وتحقق من رصيدك وقم بادارة الدفع
              </p>
            </div>
          </div>
          <IoIosArrowBack />
        </div>
      </Link>

      <Link href="/Lawyer-dashboard/clients-reviews">
        <div className="flex  items-center border-b lg:hover:bg-gray-100 lg:py-2 lg:px-2 pb-5 justify-between flex-row-reverse mt-8">
          <div>
            <div className="flex gap-1 items-center justify-end">
              <h2 className="text-lg font-semibold"> اراء العملاء</h2>

              <MdStarBorderPurple500 />
            </div>
            <div className="text-right">
              <p className="text-gray-500">الق نظرة علي ما كتبة العميل عنك</p>
            </div>
          </div>
          <IoIosArrowBack />
        </div>
      </Link>

      <Link href="/Lawyer-dashboard/Profile">
        <div className="flex  items-center border-b lg:hover:bg-gray-100 lg:py-2 lg:px-2 pb-5 justify-between flex-row-reverse mt-8">
          <div>
            <div className="flex gap-1 items-center justify-end">
              <h2 className="text-lg font-semibold"> تواصل معنا</h2>
              <BiSolidPhoneCall />
            </div>
          </div>
          <IoIosArrowBack />
        </div>
      </Link>

      <Link href="/Lawyer-dashboard/conditions">
        <div className="flex  items-center border-b lg:hover:bg-gray-100 lg:py-2 lg:px-2 pb-5 justify-between flex-row-reverse mt-8">
          <div>
            <div className="flex gap-1 items-center justify-end">
              <h2 className="text-lg font-semibold"> البيانات والخصوصية</h2>
              <IoDocumentTextOutline />
            </div>
          </div>
          <IoIosArrowBack />
        </div>
      </Link>

      <div className="lg:hover:bg-gray-100 lg:py-2 lg:px-4 mt-8 ">
        <button
          onClick={logoutUser}
          className="flex items-center gap-2 ml-auto text-lg font-semibold "
        >
          تسجيل خروج
          <span>
            <AiOutlineLogout />
          </span>
        </button>
      </div>
    </div>
  );
}
