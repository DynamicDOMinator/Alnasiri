"use client";
import { FaLocationDot } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { CiMoneyCheck1 } from "react-icons/ci";
import { LuPhone } from "react-icons/lu";
import { useState } from "react";

export default function MyForas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const opportunities = [
    {
      id: 1,
      date: "ديسمبر 17",
      clientName: "أحمد السيد",
      title: "بحث عن قضية جنائية",
      description: "البحث عن محامي ذو خبرة في انواع هذة القضاية",
      location: "الرياض",
      phone: "+966 575 585",
      details: {
        date: "الجمعة 23 يوليو 2024",
        fullLocation: "البحيرات،مكة المكرمة",
        price: "150",
        caseType: "قضية جنائية",
        requestDetails: "البحث عن محامي ذو خبرة في انواع هذة القضاية",
        requestNumber: "12345",
      },
    },
    {
      id: 2,
      date: "ديسمبر 20",
      clientName: "محمد عبدالله",
      title: "استشارة قانونية تجارية",
      description: "بحاجة إلى استشارة قانونية في عقود الشركات",
      location: "جدة",
      phone: "+966 555 1234",
      details: {
        date: "الأحد 25 يوليو 2024",
        fullLocation: "الحمراء، جدة",
        price: "200",
        caseType: "استشارة تجارية",
        requestDetails: "مراجعة عقود تأسيس شركة ومستندات قانونية",
        requestNumber: "12346",
      },
    },
    {
      id: 3,
      date: "ديسمبر 22",
      clientName: "سارة العمري",
      title: "قضية أحوال شخصية",
      description: "بحاجة إلى محامي متخصص في قضايا الأحوال الشخصية",
      location: "الدمام",
      phone: "+966 505 9876",
      details: {
        date: "الثلاثاء 27 يوليو 2024",
        fullLocation: "العزيزية، الدمام",
        price: "300",
        caseType: "أحوال شخصية",
        requestDetails: "قضية طلاق وحضانة أطفال",
        requestNumber: "12347",
      },
    },
  ];

  return (
    <div className="w-full pb-24 lg:pb-0 max-w-3xl mx-auto relative">
      {/* Sticky header */}
      <div className="sticky top-0 w-full max-w-3xl bg-white z-10">
        <p className="lg:text-right text-center  lg:bg-transparent lg:shadow-none shadow-md lg:pt-16 text-xl md:text-3xl font-bold">
          فرصي
        </p>
        <div className="flex items-center  flex-row-reverse  pb-5">
          <p className="flex items-center mr-auto gap-1 w-fit px-4 rounded-lg">
            اجابات <span>5</span>
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex flex-col gap-2 justify-center items-center px-4 lg:px-0 pb-10">
        {opportunities.map((item) => (
          <div
            key={item.id}
            className="border-2 border-gray-300 rounded-lg w-full md:px-10 px-3 py-6"
          >
            <div className="flex justify-between items-center">
              <p className="flex items-center">{item.date}</p>
              <p className="font-semibold ">{item.clientName}</p>
            </div>
            <p className="font-semibold  text-right">{item.title}</p>
            <p className="text-right  text-gray-500">
              {item.description}
            </p>
            <div className="flex flex-col gap-4 items-end pt-2">
              <p className="flex items-center gap-1">
                {item.location}
                <span>
                  <FaLocationDot />
                </span>
              </p>
              <p className="flex items-center flex-row-reverse gap-1 border-2 border-green-200 rounded-lg py-1 px-5">
                {item.phone}
                <span>
                  <LuPhone className="text-green-400 text-2xl" />
                </span>
              </p>
            </div>
            <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between ">
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setIsModalOpen(true);
                }}
                className="bg-blue-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-blue-600"
              >
                عرض التفاصيل
              </button>
            </div>
          </div>
        ))}
      </div>

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
                  {selectedItem.details.date}{" "}
                  <span>
                    <SlCalender />
                  </span>
                </p>

                <p className="flex items-center gap-1 justify-end">
                  {selectedItem.details.fullLocation}{" "}
                  <span>
                    <FaLocationDot />
                  </span>
                </p>

                <p className="flex flex-row-reverse items-center gap-1">
                  <CiMoneyCheck1 />
                  {selectedItem.details.price}
                  <span>ر.س</span>
                </p>
              </div>

              <div className="pt-6 border-t-2">
                <p className="font-semibold">ما نوع القضايا التي تحتاجها؟</p>
                <p>{selectedItem.details.caseType}</p>
              </div>

              <div className="pt-6 border-t-2">
                <p className="font-semibold">ما هي تفاصيل الطلب الخاص بك؟</p>
                <p>{selectedItem.details.requestDetails}</p>
              </div>
              <div className="pt-3 border-t-2">
                <p className="font-semibold">رقم الطلب؟</p>
                <p>{selectedItem.details.requestNumber}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
