"use client";
import React from "react";
import { MdQuestionMark } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

function SecondSection() {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-blue-50  ">
      <div className="text-center pt-10 max-w-6xl mx-auto  ">
        <p className="md:text-[40px] md:leading-[50px] md:p-0 text-2xl leading-7 font-bold">
          {" "}
          كرسنا جهودنا لتقديم معلومات قانونية دقيقة  عن نظام القضاء السعودي ، و مراجعات حقيقية وموثقة
        </p>
      </div>

      <div>
        <Image
          src={"/images/sectionOne.png"}
          alt="logo"
          width={1000}
          height={1000}
          className="mx-auto"
        />
      </div>

      <div className="flex flex-wrap md:flex-nowrap px-4  items-center justify-center gap-10 mt-16  py-10 ">
        <div className="bg-white relative shadow rounded-lg text-right px-4 pl-6 py-8 w-full md:w-[380px] lg:h-[340px] md:h-[370px] flex flex-col">
          <div className="flex-grow">
            <h2 className="flex items-top gap-2 font-semibold text-xl justify-end">
              اسال محامي مجانا
              <span className="bg-[#16498C] h-fit px-1 py-1 rounded-2xl">
                <MdQuestionMark className="text-white" />
              </span>
            </h2>

            <ul className="flex flex-col gap-2 py-4 pr-10 text-gray-600">
              <li dir="rtl" className="flex items-center gap-2"><span>*</span> اسال محامي عن اي مشكلتك القانونية</li>
              <li dir="rtl" className="flex items-center gap-2"><span>*</span> احصل على إجابة سريعة و دقيقة</li>
              <li dir="rtl" className="flex items-center gap-2"><span>*</span> خدمة متاحة لجميع القضايا</li>
            </ul>
          </div>

          <Link href="/Askquestion" className="mt-auto w-full">
            <button className="w-full py-3 rounded-md border-2 border-gray-400 hover:border-gray-600 transition-all duration-300 hover:bg-blue-50 text-lg">
              استشارة مجانية
            </button>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg text-right px-4 pl-6 py-8 w-full md:w-[380px] lg:h-[340px] md:h-[370px] flex flex-col">
          <div className="flex-grow">
            <h2 className="flex items-top gap-2 font-semibold text-lg justify-end">
              ابحث عن محامي متخصص في قضيتك
              <span className="bg-[#16498C] h-fit px-1 py-1 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </h2>

            <ul className="flex flex-col gap-2 py-4 pr-9 text-gray-600">
              <li dir="rtl" className="flex items-center gap-2"><span>*</span> جميع المحامين في بشارة متخصصين في مجالات قانونية حسب خبراتهم و مؤهلاتهم </li>
              <li dir="rtl" className="flex items-center gap-2"><span>*</span> جميع المراجعات في بشارة موثقة</li>
              <li dir="rtl" className="flex items-center gap-2"><span>*</span> المحامين المعتمدين</li>
              <li dir="rtl" className="flex items-center gap-2"><span>*</span> جميع المحامين مرخصين من وزارة العدل</li>
            </ul>
          </div>

          <button onClick={scrollToTop} className="w-full py-3 rounded-md border-2 transition-all duration-300 border-gray-400 hover:border-gray-600 hover:bg-blue-50 text-lg mt-auto">
            ابدأ في البحث
          </button>
        </div>
      </div>
    </div>
  );
}

export default SecondSection;
