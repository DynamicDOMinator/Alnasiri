import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { FaUserTie } from "react-icons/fa";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#16498C] md:py-12 lg:py-16 py-10 lg:mt-20">
      <div dir="rtl" className="container mx-auto px-4 flex flex-col">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-8 lg:w-10/12 w-full mx-auto justify-between">
          {/* About Section */}
          <div className="col-span-1 mb-8 md:mb-8">
            <h5 className="font-semibold text-base md:text-lg lg:text-xl text-white border-b-2 w-fit border-white pb-2">
              عن النصيري
            </h5>
            <ul className="pt-4 text-white space-y-2 text-sm md:text-base lg:text-base">
              <li className="hover:text-gray-300 cursor-pointer">فريقنا</li>
              <li className="hover:text-gray-300 cursor-pointer">
                إمكانية الوصول{" "}
              </li>
              <li className="hover:text-gray-300 cursor-pointer">اتصل بنا</li>
            </ul>
          </div>

          {/* Find Lawyer Section */}
          <div className="col-span-1 mb-8 md:mb-8">
            <h5 className="font-semibold text-base md:text-lg lg:text-xl text-white border-b-2 w-fit border-white pb-2 flex items-center gap-1">
              ابحث عن محامي
              <ChevronDownIcon className="size-3 text-white rotate-90" />
            </h5>
            <ul className="pt-4 text-white space-y-2 text-sm md:text-base lg:text-base">
              <li className="hover:text-gray-300 cursor-pointer">حسب الموقع</li>
              <li className="hover:text-gray-300 cursor-pointer">
                حسب القضية القانونية{" "}
              </li>
              <li className="hover:text-gray-300 cursor-pointer">
                حسب ملفات المحامين{" "}
              </li>
              <li className="hover:text-gray-300 cursor-pointer">حسب الاسم</li>
            </ul>
          </div>

          {/* Popular Locations Section */}
          <div className="col-span-1 mb-8 md:mb-8">
            <h5 className="font-semibold text-base md:text-lg lg:text-xl text-white border-b-2 w-fit border-white pb-2 flex items-center gap-1">
              اشهر المواقع
              <ChevronDownIcon className="size-3 text-white rotate-90" />
            </h5>
            <ul className="pt-4 text-white space-y-2 text-sm lg:text-base">
              <li className="hover:text-gray-300 cursor-pointer">الرياض</li>
              <li className="hover:text-gray-300 cursor-pointer">جدة</li>
              <li className="hover:text-gray-300 cursor-pointer">
                مكة المكرمة
              </li>
              <li className="hover:text-gray-300 cursor-pointer">
                المدينة المنورة
              </li>
              <li className="hover:text-gray-300 cursor-pointer">الدمام</li>
              <li className="hover:text-gray-300 cursor-pointer">الخبر</li>
            </ul>
          </div>

          {/* Browse Site Section */}
          <div className="col-span-1">
            <h5 className="font-semibold text-base md:text-lg lg:text-xl text-white border-b-2 w-fit border-white pb-2 flex items-center gap-1">
              تصفح موقعنا
              <ChevronDownIcon className="size-3 text-white rotate-90" />
            </h5>
            <ul className="pt-4 text-white space-y-2 text-sm lg:text-base">
              <li className="hover:text-gray-300 cursor-pointer">
                ابحث عن محام
              </li>
              <li className="hover:text-gray-300 cursor-pointer">
                قم بمراجعة محاميك
              </li>
              <li className="hover:text-gray-300 cursor-pointer">
                المشورة القانونية
              </li>
              <li className="hover:text-gray-300 cursor-pointer">للمحامين</li>
            </ul>
            <Link href="/Register-Lawyer">
              <button className="bg-[#FF6624] hover:bg-[#e55a20] text-white gap-2 rounded-md flex mt-8 items-center justify-center flex-row-reverse py-2.5 px-4 text-center w-full md:w-2/3 lg:w-auto mx-auto lg:mx-0 text-sm md:text-base">
              تسجيل كمحامي
                <FaUserTie />
              </button>
            </Link>
          </div>
        </div>

        {/* Updated footer bottom section */}
        <div className="border-t border-white/20 mt-8 pt-6 lg:w-10/12 mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">تابعنا علي</span>
              <div className="flex gap-3">
                <a href="#" className="text-white hover:text-gray-300">
                  <FaFacebookF className="w-5 h-5" />
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <FaLinkedinIn className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 text-white text-sm">
              <a href="#" className="hover:text-gray-300">
                شروط الاستخدام
              </a>
              <span className="text-white/40">|</span>
              <a href="#" className="hover:text-gray-300">
                سياسة الخصوصية
              </a>
              <span className="text-white/40">|</span>
              <a href="#" className="hover:text-gray-300">
                ملف تعريف الارتباط
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
