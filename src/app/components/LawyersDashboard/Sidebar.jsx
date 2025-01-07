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
      <div className="   lg:fixed hidden lg:block gap-4 right-0 z-50 border-l-2 w-fit ml-auto h-screen">
        <h2 className="mt-20  justify-center text-3xl font-bold flex items-center gap-2 pb-10">
          نصيري{" "}
          <span>
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
          </span>
        </h2>
        <div className="flex flex-col items-end gap-1 border-b-2  px-6 pb-10   ">
          <Link
            className={`flex gap-2 items-center w-full  p-2 rounded-3xl hover:bg-[rgba(217,217,217,0.31)] ${
              pathname === "/Lawyer-dashboard"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard "
          >
            <p className="w-full text-right">فرص</p>

            <Image src="/images/icon1.png" alt=" فرص" width={15} height={15} />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl w-full hover:bg-[rgba(217,217,217,0.31)] ${
              pathname === "/Lawyer-dashboard/MyForas"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard/MyForas"
          >
            <p className="w-full text-right">فرصي</p>
            <Image src="/images/icon2.png" alt="فرصي" width={15} height={15} />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl w-full hover:bg-[rgba(217,217,217,0.31)] ${
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
            />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl w-full hover:bg-[rgba(217,217,217,0.31)] ${
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
            />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl w-full hover:bg-[rgba(217,217,217,0.31)] ${
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
            />
          </Link>
          <Link
            className={`flex gap-2 items-center p-2 pl-10 rounded-3xl w-full hover:bg-[rgba(217,217,217,0.31)] ${
              pathname === "/Lawyer-dashboard/Balance"
                ? "bg-[rgba(217,217,217,0.31)]"
                : ""
            }`}
            href="/Lawyer-dashboard/Balance"
          >
            <p className="w-full text-right">رصيدي</p>
            <Image
              src="/images/icon6.png"
              alt="balance"
              width={15}
              height={15}
            />
          </Link>
        </div>
        {/* Modified settings section */}
        <div className="absolute flex items-center gap-4 w-full justify-end pr-5 bottom-5">
          <div>
            <p className="text-sm font-semibold">أحمد السيد</p>
            <p className="text-sm text-right">الاعدادات</p>
          </div>
          <div>
            <Image
              className="w-12"
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
