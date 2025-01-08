"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const legalSpecialties = [
  "القانون التجاري",
  "قانون العمل",
  "القانون الجنائي",
  "قانون الأحوال الشخصية",
  "القانون العقاري",
  "قانون الشركات",
  "الملكية الفكرية",
  "القانون البنكي",
  "قانون التأمين",
  "قضايا الأسرة",
  "القانون الإداري",
  "قانون المنافسة",
  "التحكيم التجاري",
  "قضايا الإفلاس",
  "حقوق الإنسان",
];

const citiesInKSA = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الظهران",
  "تبوك",
  "أبها",
  "الطائف",
  "بريدة",
  "نجران",
  "جازان",
  "حائل",
  "الجبيل",
  "الأحساء",
  "القطيف",
  "خميس مشيط",
];

const HeroSection = () => {
  const [step, setStep] = useState(1); //following the steps
  const [selectedCity, setSelectedCity] = useState(""); //choose the city

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div className=" mx-auto flex flex-col gap-5 items-center justify-center md:m-0 px-10 pt-6 pb-16 rounded-md bg-white relative  md:ml-auto shadow-lg lg:min-h-[370px]">
            <p className="text-2xl text-right text-black font-bold mb-6">
              ماذا تريد أن تفعل؟
            </p>
            <div className=" w-full ">
              <button
                className=" flex my-5 items-center flex-row-reverse gap-1 text-blue-500 w-full font-semibold border-2 border-blue-500 hover:underline px-6 py-3 text-right rounded-md shadow "
                onClick={() => setStep(2)}
              >
                البحث عن محامي
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3  flex-none text-blue-500 rotate-90"
                />
              </button>

              <Link href="/Askquestion">
                <button className=" flex items-center flex-row-reverse gap-1 text-blue-500 w-full font-semibold border-2 border-blue-500 hover:underline px-6 py-3 text-right rounded-md shadow ">
                  اسال محامي مجانا
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="size-3 flex-none text-blue-500 rotate-90"
                  />
                </button>
              </Link>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="px-10 pt-6 pb-10 rounded-md bg-white ml-auto shadow-lg lg:min-h-[370px]">
            <p className="text-2xl font-semibold mb-6 text-black text-right">
              ماذا تريد أن تفعل؟
            </p>
            <div className="flex flex-col gap-6 ">
              <button
                className=" flex items-center flex-row-reverse gap-1 text-blue-500 font-semibold text-right border-2 border-blue-500 hover:underline px-6 py-3 rounded shadow"
                onClick={() => setStep(7)}
              >
                من ذوي الخبرة في مسألة قانونية
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className=" flex items-center flex-row-reverse gap-1 text-blue-500 font-semibold border-2 text-right border-blue-500 hover:underline px-6 py-3 rounded shadow"
                onClick={() => setStep(6)}
              >
                أبحث بالاسم
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className=" flex items-center flex-row-reverse gap-1 text-blue-500 font-semibold border-2 text-right border-blue-500 hover:underline px-6 py-3 rounded shadow"
                onClick={() => setStep(5)}
              >
                ابحث بالقرب مني
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
            </div>
            <button
              className=" flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
              onClick={() => setStep(1)}
            >
              العودة
              <ChevronDownIcon
                aria-hidden="true"
                className="size-3 flex-none text-blue-500 rotate-90"
              />
            </button>
          </div>
        );

      case 5:
        return (
          <div className="md:px-10 px-4 pt-6 pb-4 rounded-md bg-white ml-auto shadow-lg lg:min-h-[370px]">
            <p className="text-2xl  mb-6 text-black text-right">
              أريد ان اجد محامي ذو خبرة في
            </p>

            <label
              htmlFor="citySelect"
              className="block text-black text-lg text-right mb-2"
            >
              المدينة (اختياري)
            </label>
            <select
              id="citySelect"
              className="border-2 border-[#16498C]  rounded-lg px-4 py-2 mb-6 w-full text-black text-right"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">اختر المدينة</option>
              {citiesInKSA.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <div className="flex justify-between items-center lg:pt-20 pt-10">
              <button
                className=" flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
                onClick={() => setStep(2)}
              >
                العودة
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="bg-[#FF6624] text-white px-3 py-3 rounded shadow hover:bg-orange-600"
                onClick={() =>
                  alert(
                    `تم اختيار المدينة: ${
                      selectedCity || "لم يتم اختيار مدينة"
                    }`
                  )
                }
              >
                ابحث عن محامي
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="md:px-10 px-4 pt-6 pb-4 rounded-md bg-white ml-auto shadow-lg lg:min-h-[370px]">
            <p className="text-2xl  mb-6 text-black text-right">
              اريد ان ابحث عن محامٍ بالاسم
            </p>

            <label
              htmlFor="nameSearch"
              className="block text-black text-lg text-right mb-2"
            >
              ابحث عن الاسم
            </label>
            <div className="relative">
              <input
                id="nameSearch"
                type="text"
                className="border-2 border-[#16498C] rounded-lg px-10 py-2 mb-6 w-full text-black text-right"
                placeholder="بحث"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 absolute right-3 top-3 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <button
                className="absolute left-3 top-3"
                onClick={() =>
                  (document.getElementById("nameSearch").value = "")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 px-1 py-1 rounded-3xl text-white  bg-[#0C3468C9]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-between items-center lg:pt-20 pt-10">
              <button
                className="flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
                onClick={() => setStep(2)}
              >
                العودة
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="bg-[#FF6624] text-white px-3 py-3 rounded shadow hover:bg-orange-600"
                onClick={() => alert("تم البحث عن المحامي")}
              >
                ابحث عن محامي
              </button>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="md:px-10 px-4 pt-6 pb-4 rounded-md bg-white ml-auto shadow-lg lg:min-h-[370px]">
            <p className="text-2xl  mb-6 text-black text-right">
              أريد ان اجد محامي ذو خبرة في
            </p>

            <label
              htmlFor="citySelect"
              className="block text-black text-lg text-right mb-2"
            >
              التخصص القانوني
            </label>
            <select
              id="citySelect"
              className="border-2 border-[#16498C]  rounded-lg px-4 py-2 mb-6 w-full text-black text-right"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">اختر التخصص</option>
              {legalSpecialties.map((specialty, index) => (
                <option key={index} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            <div className="flex justify-between items-center lg:pt-20 pt-10">
              <button
                className=" flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
                onClick={() => setStep(2)}
              >
                العودة
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="bg-[#FF6624] text-white px-3 py-3 rounded shadow hover:bg-orange-600"
                onClick={() =>
                  alert(
                    `تم اختيار المدينة: ${
                      selectedCity || "لم يتم اختيار مدينة"
                    }`
                  )
                }
              >
                ابحث عن محامي
              </button>
            </div>
          </div>
        );
      default:
        return <p className="text-white">خطوة غير معروفة</p>;
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row-reverse bg-[#264360]  mt-20 overflow-hidden  h-fit w-full    text-white">
      <div
        className=" md:basis-1/2 pt-10 w-full bg-left  bg-cover"
        style={{ backgroundImage: `url("/images/bg-heroSection.png")` }}
      >
        <Image
          className="mx-auto md:h-[600px] h-[350px] w-auto"
          src="/images/Lawyer.png"
          alt="Lawyer"
          width={500}
          height={500}
          priority
        />
      </div>

      <div className="  md:basis-1/2 flex flex-col md:gap-16 gap-10 md:items-end items-center justify-center">
        <div className="pt-16 md:pt-10  ">
          <h1 className="md:text-5xl text-2xl font-bold md:text-right text-center ">
            الحلول القانونية تبدأ من هنا
          </h1>
          <p className="md:text-lg md:text-right text-center  pt-2 px-2 md:pt-8 md:px-0">
            النصيري هو المصدر الأول للمعلومات والموارد القانونية المجانية على
            الإنترنت
          </p>
        </div>

        <div className="lg:w-[70%] md:w-[90%] w-[100vw] px-4 md:p-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
