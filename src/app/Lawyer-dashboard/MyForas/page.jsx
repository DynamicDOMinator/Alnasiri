"use client";
import { FaLocationDot } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { CiMoneyCheck1 } from "react-icons/ci";

import { LuPhone } from "react-icons/lu";
import { useState } from "react";

export default function MyForas() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <p className="lg:text-right text-center py-5 bg-white lg:bg-none lg:shadow-none shadow-md lg:pt-20 text-xl  md:text-3xl font-semibold">
        فرصي
      </p>

      <div className="w-[80%] lg:mx-auto mt-10 lg:mt-0">
        <p className="flex items-center gap-1 w-fit px-4 rounded-lg">
          اجابات<span>5</span>
        </p>{" "}
      </div>
      {/* all leads display  */}
      <div className="flex flex-col gap-2 justify-center items-center px-4 lg:px-0 mt-5">
        <div className="border-2 border-gray-300 rounded-lg lg:w-[80%] w-full md:px-10 px-3 py-6">
          <div className=" flex justify-between items-center ">
            <p className="flex items-center">
              {" "}
              ديسمبر <span>17</span>{" "}
            </p>
            <p className="text-lg">أحمد السيد</p>
          </div>
          <p className="text-right text-xl">بحث عن قضية جنائة</p>
          <p className="text-right text-lg text-gray-500">
            البحث عن محامي ذو خبرة في انواع هذة القضاية
          </p>
          <div className="flex flex-col gap-4 items-end pt-2">
            <p className="flex items-center gap-1 ">
              الرياض
              <span>
                <FaLocationDot />
              </span>
            </p>
            <p className="flex items-center flex-row-reverse gap-1 border-2 border-green-200 rounded-lg py-1 px-5 ">
              +966 575 585
              <span>
                {" "}
                <LuPhone className="text-green-400 text-2xl" />
              </span>
            </p>
          </div>
          <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-orange-600"
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      </div>
      {/* end of the diplaying leads  */}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="space-y-4 text-right">
              <h2 className="text-2xl font-semibold mb-4">التفاصيل</h2>

              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-2 justify-end">
                  الجمعة 23 يوليو 2024{" "}
                  <span>
                    <SlCalender />
                  </span>
                </p>

                <p className="flex items-center gap-1 justify-end">
                  البحيرات،مكة المكرمة{" "}
                  <span>
                    <FaLocationDot />
                  </span>
                </p>

                <p className="flex flex-row-reverse items-center gap-1">
                  {" "}
                  <CiMoneyCheck1 />
                  150
                  <span>ر.س</span>
                </p>
              </div>

              <div className="pt-6 border-t-2">
                <p className="font-semibold">ما نوع القضايا التي تحتاجها؟</p>
                <p>قضية جنائية</p>
              </div>

              <div className="pt-6 border-t-2">
                <p className="font-semibold">ما هي تفاصيل الطلب الخاص بك؟</p>
                <p>البحث عن محامي ذو خبرة في انواع هذة القضاية</p>
              </div>
              <div className="pt-3 border-t-2">
                <p className="font-semibold">رقم الطلب؟</p>
                <p>12345</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
