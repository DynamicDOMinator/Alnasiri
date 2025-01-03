"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CiUser } from "react-icons/ci";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div>
      {/* desktop screen */}
      <div className="hidden lg:block gap-4 relative border-l-2 w-fit ml-auto h-screen">
        <div className="flex flex-col items-end gap-1 border-b-2  pr-6 pb-10  pt-20 text-xl ">
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl hover:bg-[rgba(217,217,217,0.31)] ${
              pathname === "/Lawyer-dashboard"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard "
          >
            فرص
            <Image src="/images/icon1.png" alt=" فرص" width={15} height={15} />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl hover:bg-[rgba(217,217,217,0.31)] ${
              pathname === "/Lawyer-dashboard/MyForas"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard/MyForas"
          >
            فرصي
            <Image src="/images/icon2.png" alt="فرصي" width={15} height={15} />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl hover:bg-[rgba(217,217,217,0.31)] ${
              pathname === "/Lawyer-dashboard/FreeQuestions"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard/FreeQuestions"
          >
            الاسئلة المجانية
            <Image
              src="/images/icon3.png"
              alt="الاسئلة المجانية"
              width={15}
              height={15}
            />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl hover:bg-[rgba(217,217,217,0.31)] ${
              pathname === "/Lawyer-dashboard/MyAnswers"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard/MyAnswers"
          >
            أجوبتي
            <Image
              src="/images/icon4.png"
              alt="أجوبتي"
              width={15}
              height={15}
            />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl hover:bg-[rgba(217,217,217,0.31)] ${
              pathname === "/Lawyer-dashboard/Profile"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard/Profile"
          >
            صفحتي الشخصية
            <Image
              src="/images/icon5.png"
              alt="profile"
              width={15}
              height={15}
            />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl hover:bg-[rgba(217,217,217,0.31)] ${
              pathname === "/Lawyer-dashboard/Balance"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard/Balance"
          >
            رصيدي
            <Image
              src="/images/icon6.png"
              alt="balance"
              width={15}
              height={15}
            />
          </Link>
        </div>
        {/* Modified settings section */}
        <div className="absolute flex items-center gap-4 w-full justify-center bottom-5">
          <div>
            <p className="text-lg font-semibold">أحمد السيد</p>
            <p className="text-sm text-right">الاعدادات</p>
          </div>
          <div>
            <Image
              className="w-14"
              src="/images/imgse.png"
              alt="settings"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>

      {/* Mobile and medium screen navigation */}
      <div className="lg:hidden fixed bottom-0 right-0 left-0 bg-white border-t-2 py-4 px-4">
        <div className="flex flex-row-reverse justify-between items-center">
          <Link
            className={`flex flex-col items-center gap-1 ${
              pathname === "/Lawyer-dashboard" ? "text-primary" : ""
            }`}
            href="/Lawyer-dashboard"
          >
            <Image src="/images/icon1.png" alt="فرص" width={20} height={20} />
            <span className="text-xs">فرص</span>
          </Link>

          <Link
            className={`flex flex-col items-center gap-1 ${
              pathname === "/Lawyer-dashboard/MyForas" ? "text-primary" : ""
            }`}
            href="/Lawyer-dashboard/MyForas"
          >
            <Image src="/images/icon2.png" alt="فرصي" width={20} height={20} />
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
    </div>
  );
}
