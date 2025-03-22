import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import LawyerRegisterBtn from "./LawyerRegisterBtn";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#16498C] lg:mt-0 lg:py-16 md:py-12 py-10">
      <div dir="rtl" className="container flex flex-col mx-auto px-4">
        <div className="grid grid-cols-2 justify-between w-full gap-6 lg:gap-8 lg:grid-cols-4 lg:w-10/12 md:gap-8 md:grid-cols-2 mx-auto">
          {/* About Section */}
          <div className="col-span-1 mb-8 md:mb-8">
            <h5 className="border-b-2 border-white text-base text-white w-fit font-semibold lg:text-xl md:text-lg pb-2">
              عن النصيري
            </h5>
            <ul className="text-sm text-white lg:text-base md:text-base pt-4 space-y-2">
              <li className="cursor-pointer hover:text-gray-300">فريقنا</li>
              <li className="cursor-pointer hover:text-gray-300">
                إمكانية الوصول{" "}
              </li>
              <li className="cursor-pointer hover:text-gray-300">
                <a
                  href="mailto:support@bisharh.com"
                  className="hover:text-gray-300"
                >
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>

          {/* Find Lawyer Section */}
          <div className="col-span-1 mb-8 md:mb-8">
            <h5 className="flex border-b-2 border-white text-base text-white w-fit font-semibold gap-1 items-center lg:text-xl md:text-lg pb-2">
              ابحث عن محامي
              <ChevronDownIcon className="text-white rotate-90 size-3" />
            </h5>
            <ul className="text-sm text-white lg:text-base md:text-base pt-4 space-y-2">
              <li className="cursor-pointer hover:text-gray-300">حسب الموقع</li>
              <li className="cursor-pointer hover:text-gray-300">
                حسب القضية القانونية{" "}
              </li>
              <li className="cursor-pointer hover:text-gray-300">
                حسب ملفات المحامين{" "}
              </li>
              <li className="cursor-pointer hover:text-gray-300">حسب الاسم</li>
            </ul>
          </div>

          {/* Popular Locations Section */}
          <div className="col-span-1 mb-8 md:mb-8">
            <h5 className="flex border-b-2 border-white text-base text-white w-fit font-semibold gap-1 items-center lg:text-xl md:text-lg pb-2">
              اشهر المواقع
              <ChevronDownIcon className="text-white rotate-90 size-3" />
            </h5>
            <ul className="text-sm text-white lg:text-base pt-4 space-y-2">
              <li className="cursor-pointer hover:text-gray-300">الرياض</li>
              <li className="cursor-pointer hover:text-gray-300">جدة</li>
              <li className="cursor-pointer hover:text-gray-300">
                مكة المكرمة
              </li>
              <li className="cursor-pointer hover:text-gray-300">
                المدينة المنورة
              </li>
              <li className="cursor-pointer hover:text-gray-300">الدمام</li>
              <li className="cursor-pointer hover:text-gray-300">الخبر</li>
            </ul>
          </div>

          {/* Browse Site Section */}
          <div className="col-span-1">
            <h5 className="flex border-b-2 border-white text-base text-white w-fit font-semibold gap-1 items-center lg:text-xl md:text-lg pb-2">
              تصفح موقعنا
              <ChevronDownIcon className="text-white rotate-90 size-3" />
            </h5>
            <ul className="text-sm text-white lg:text-base pt-4 space-y-2">
              <li className="cursor-pointer hover:text-gray-300">
                ابحث عن محام
              </li>
              <li className="cursor-pointer hover:text-gray-300">
                قم بمراجعة محاميك
              </li>
              <li className="cursor-pointer hover:text-gray-300">
                المشورة القانونية
              </li>
              <li className="cursor-pointer hover:text-gray-300">للمحامين</li>

              <li className="cursor-pointer hover:text-gray-300">
                <Link href="/Blog">المدونة</Link>
              </li>
            </ul>

            <LawyerRegisterBtn />
          </div>
        </div>

        <div className="border-t border-white/20 w-full lg:w-10/12 mt-8 mx-auto pt-6">
          <div className="flex flex-col justify-center gap-4 items-center md:flex-row">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-white">تابعنا علي</span>
              <div className="flex gap-3">
                <a href="#" className="text-white hover:text-gray-300">
                  <FaFacebookF className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <FaLinkedinIn className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="flex text-sm text-white gap-4 items-center">
              <span className="text-white/40">|</span>
              <Link href="/privacy" className="hover:text-gray-300">
                سياسة الخصوصية
              </Link>
              <span className="text-white/40">|</span>
              <Link href="/terms" className="hover:text-gray-300">
                الشروط والاحكام
              </Link>
            </div>
          </div>
          <div className="flex justify-center text-sm text-white gap-4 items-center mt-10">
            <Image
              className="rounded-lg"
              src="/images/visa.png"
              alt="logo"
              width={50}
              height={50}
            />
            <span className="text-white/40">|</span>
            <Image
              className="rounded-lg"
              src="/images/mastercard.png"
              alt="logo"
              width={50}
              height={50}
            />
            <span className="text-white/40">|</span>
            <Image
              className="rounded-lg"
              src="/images/applepay.png"
              alt="logo"
              width={50}
              height={50}
            />
            <span className="text-white/40">|</span>
            <Image
              className="rounded-lg"
              src="/images/mada.png"
              alt="logo"
              width={50}
              height={50}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
