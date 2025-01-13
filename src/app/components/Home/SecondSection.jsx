import React from "react";
import { MdQuestionMark } from "react-icons/md";
import Link from "next/link";
function SecondSection() {
  return (
    <div className="bg-blue-50  ">
      <div className="text-center pt-10 md:px-48 ">
        <p className="md:text-3xl px-6 md:p-0 text-2xl font-bold">
          {" "}
          كرسنا جهودنا لنقدم لك معلومات محايدة عن المحاميين <br /> في السعودية 
          و الإجراءات القانونية
        </p>
      </div>

      <div className="flex flex-wrap md:flex-nowrap px-4  items-center justify-center gap-10 mt-16  py-10 ">
        <div className="bg-white shadow rounded-lg text-right px-4 pl-6  py-8 w-full md:w-auto md:min-w-[380px]">
          <h2 className="flex items-top gap-2  font-semibold text-lg justify-end">
            اسأل سؤال لمحامي مجانا <br /> و احصل على اجابة مجانية
            <span className="bg-[#16498C] h-fit px-1 py-1 rounded-2xl">
              <MdQuestionMark className="text-white" />
            </span>
          </h2>

          <ul className="flex flex-col gap-2 py-4 pr-10 text-gray-600">
            <li>استشارة قانونية مجانية</li>
            <li>إجابة سريعة</li>
            <li>سهولة التواصل</li>
            <li>خدمة متاحة لجميع القضايا</li>
          </ul>

          <Link href="/Askquestion">
            <button className="mt-4 flex items-center justify-center gap-2 hover:bg-blue-50 text-lg border-2 w-full py-3 rounded-md border-gray-400 hover:border-gray-600">
              أطرح سؤالاً
              <span className="bg-gray-400 py-1 px-1 rounded-2xl border-black border-2">
                <MdQuestionMark className="text-black" />
              </span>
            </button>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg text-right px-4 pl-6  py-8 w-full md:w-auto md:min-w-[380px]">
          <h2 className="flex items-top gap-2  font-semibold text-lg justify-end">
            ابحث عن محاميين موثقين في وزارة <br /> العدل و حاصلين على رخص مهنية
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
            <li>لتوثيق من وزارة العدل</li>
            <li>بحث حسب التخصص</li>
            <li>المحامين المعتمدين</li>
            <li>سهولة الوصول</li>
          </ul>

          <button className="mt-4 flex items-center justify-center gap-1 hover:bg-blue-50  text-lg border-2 w-full py-3 rounded-md border-gray-400 hover:border-gray-600">
            ابداء البحث
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5 text-black "
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SecondSection;
