"use client";
import { CiSettings } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

import { IoMail } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";
import { TbLockPassword } from "react-icons/tb";
import { IoIosNotifications } from "react-icons/io";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto  px-4  mb-32 lg:mb-10">
      <div className="sticky top-0 bg-white py-16 ">
        <Link href="/Lawyer-dashboard/Settings">
        <FaArrowRightLong className="ml-auto mb-4" />
        </Link>
        <h1 className="lg:text-3xl text-xl text-center font-bold  lg:text-right">
          اعدادات الحساب{" "}
        </h1>
      </div>

      <Link href="/Lawyer-dashboard/change-phone">
        <div className="flex  items-center lg:hover:bg-gray-100 lg:py-2 lg:px-2 border-b pb-5 justify-between flex-row-reverse mt-8">
          <div>
            <div className="flex gap-1 items-center justify-end">
              <h2 className="text-lg font-semibold"> رقم الهاتف الجوال</h2>
              <CiSettings />
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

      <Link href="/Lawyer-dashboard/change-mail">
        <div className="flex  items-center border-b lg:hover:bg-gray-100 lg:py-2 lg:px-2 pb-5 justify-between flex-row-reverse mt-8">
          <div>
            <div className="flex gap-1 items-center justify-end">
              <h2 className="text-lg font-semibold">
                {" "}
                تغيير البريد الالكتروني
              </h2>

              <IoMail />

            </div>
            <div className="text-right">
              <p className="text-gray-500">
                لتحديث بياناتك الخاصة يرجي تعديل البريد الالكتروني
              </p>
            </div>
          </div>
          <IoIosArrowBack />
        </div>
      </Link>

      <Link href="/Lawyer-dashboard/change-password">
        <div className="flex  items-center border-b lg:hover:bg-gray-100 lg:py-2 lg:px-2 pb-5 justify-between flex-row-reverse mt-8">
          <div>
            <div className="flex gap-1 items-center justify-end">
              <h2 className="text-lg font-semibold"> تغير كلمة المرور</h2>
              <TbLockPassword />
            </div>
            <div className="text-right">
              <p className="text-gray-500">تحديث كلمة المرور</p>
            </div>
          </div>

          <IoIosArrowBack />
        </div>
      </Link>

      <Link href="/Lawyer-dashboard/leads-notifications">
        <div className="flex  items-center border-b lg:hover:bg-gray-100 lg:py-2 lg:px-2 pb-5 justify-between flex-row-reverse mt-8">
          <div>
            <div className="flex gap-1 items-center justify-end">
              <h2 className="text-lg font-semibold"> اشعارات الفرص</h2>
              <IoIosNotifications />

            </div>
          </div>
          <IoIosArrowBack />
        </div>
      </Link>
    </div>
  );
}
