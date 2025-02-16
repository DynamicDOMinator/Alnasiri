"use client";
import { FaLocationDot } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { CiMoneyCheck1 } from "react-icons/ci";
import { LuPhone } from "react-icons/lu";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function MyForas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchMyForas = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/leads-purchace/get-all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data) {
          setOpportunities(response.data);
        }
      } catch (error) {
        console.error("Error fetching my foras:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyForas();
  }, [BASE_URL]);

  return (
    <div className="min-h-screen relative">
      {isLoading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-white">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-green-600" />
        </div>
      ) : (
        <div
          dir="rtl"
          className="lg:max-w-3xl  lg:mt-8 md:max-w-xl px-3 mb-32 lg:px-0 md:px-0 mx-auto relative"
        >
          <div className="sticky top-0 bg-white pb-2">
            <div className="lg:pt-10 pt-5">
              <div className="flex lg:flex-col justify-center lg:items-right relative">
                <h1 className="lg:text-3xl text-xl font-bold  lg:text-right  mb-4">فرصي</h1>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {opportunities.length > 0 ? (
            opportunities.map((item) => (
              <div
                key={item.id}
                className="border-2 border-gray-300 rounded-lg w-full md:px-10 px-3 py-6 mb-4"
              >
                <div className="flex flex-row-reverse justify-between items-center">
                  <p className="flex items-center">
                    {new Date(item.lead.created_at).toLocaleDateString(
                      "ar-EG",
                      { month: "long", day: "numeric" }
                    )}
                  </p>
                  <p className="font-semibold ">{item.lead.user.name}</p>
                </div>
                <p className="font-semibold text-right">
                  بحث عن {item.lead.case_specialization}
                </p>
                <p className="text-right text-gray-500">
                  {item.lead.question_content.length > 50
                    ? `${item.lead.question_content.substring(0, 50)}...`
                    : item.lead.question_content}
                </p>
                <div className="flex flex-col gap-4 items-start pt-2">
                  <p className="flex flex-row-reverse items-center gap-1">
                    {item.lead.question_city}
                    <span>
                      <FaLocationDot />
                    </span>
                  </p>
                  <a
                    href={`tel:${item.lead.user.phone}`}
                    className="flex items-center mb-5 lg:mb-0 flex-row-reverse gap-1 border-2 border-green-200 rounded-lg py-1 px-5 hover:bg-green-50 transition-colors"
                  >
                    {item.lead.user.phone}
                    <span>
                      <LuPhone className="text-green-400 text-2xl" />
                    </span>
                  </a>
                </div>
                <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between ">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsModalOpen(true);
                    }}
                    className="bg-blue-500 mr-auto w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-blue-600"
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-20 text-center">
              <div className="bg-gray-100 p-5 rounded-full mb-4">
                <IoSearchOutline className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                لا توجد فرص حتى الآن
              </h3>
              <p className="text-gray-500 mb-6">
                لم تقم بشراء أي فرص قانونية بعد
              </p>
              <Link
                href="/Lawyer-dashboard"
                className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
              >
                استكشف الفرص المتاحة
              </Link>
            </div>
          )}
        </div>
      )}
      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed z-[60] inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedItem(null);
              }}
              className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="space-y-4 text-right">
              <h2 className="text-2xl font-semibold mb-4">التفاصيل</h2>

              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-2 justify-end">
                  {new Date(selectedItem.lead.created_at).toLocaleDateString(
                    "ar-EG",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                  <span>
                    <SlCalender />
                  </span>
                </p>

                <p className="flex items-center gap-1 justify-end">
                  {selectedItem.lead.question_city}
                  <span>
                    <FaLocationDot />
                  </span>
                </p>

                <a
                  href={`tel:${selectedItem.lead.user.phone}`}
                  className="flex ml-auto items-center gap-1 border-2 border-green-200 rounded-lg py-1 px-5 hover:bg-green-50 transition-colors w-fit "
                >
                  <LuPhone className="text-green-400 text-2xl" />
                  {selectedItem.lead.user.phone}
                </a>
              </div>
              {selectedItem.lead.question_title && (
                <div className="pt-6 border-t-2">
                  <p className="font-semibold">السؤال</p>
                  <p>{selectedItem.lead.question_title}</p>
                </div>
              )}

              <div className="pt-6 border-t-2">
                <p className="font-semibold">تفاصيل السؤال</p>
                <p>{selectedItem.lead.question_content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
