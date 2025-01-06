"use client";
import Image from "next/image";
import { LuPhone } from "react-icons/lu";
import { BsWallet2 } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Foras() {
  const router = useRouter();
  const [seenLeads, setSeenLeads] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("seenLeads");
    if (saved) {
      setSeenLeads(JSON.parse(saved));
    }
  }, []);

  const leadsData = [
    {
      id: 1,
      date: "17",
      month: "ديسمبر",
      name: "أحمد السيد",
      title: "بحث عن قضية جنائة",
      description: "البحث عن محامي ذو خبرة في انواع هذة القضاية",
      tags: ["عاجل", "حصرى", "تخصص جنائي"],
      contactCount: 5,
    },
    {
      id: 2,
      date: "18",
      month: "ديسمبر",
      name: "محمد علي",
      title: "قضية تجارية",
      description: "بحاجة إلى محامي متخصص في القضايا التجارية",
      tags: ["عاجل", "تخصص تجاري"],
      contactCount: 3,
    },
    {
      id: 3,
      date: "19",
      month: "ديسمبر",
      name: "فاطمة أحمد",
      title: "استشارة قانونية عقارية",
      description: "بحاجة إلى استشارة قانونية في مسائل الملكية العقارية",
      tags: ["عقاري", "استشارة"],
      contactCount: 2,
    },
    {
      id: 4,
      date: "20",
      month: "ديسمبر",
      name: "عمر محمود",
      title: "قضية أحوال شخصية",
      description: "يبحث عن محامي متخصص في قضايا الأحوال الشخصية",
      tags: ["أحوال شخصية", "عاجل"],
      contactCount: 4,
    },
    {
      id: 5,
      date: "21",
      month: "ديسمبر",
      name: "سارة خالد",
      title: "نزاع عمالي",
      description: "مشكلة قانونية متعلقة بحقوق العمال",
      tags: ["عمالي", "حصرى"],
      contactCount: 1,
    },
    {
      id: 6,
      date: "22",
      month: "ديسمبر",
      name: "ياسر محمد",
      title: "قضية إدارية",
      description: "بحاجة إلى محامي متخصص في القضايا الإدارية",
      tags: ["إداري", "تخصص إداري"],
      contactCount: 6,
    },
  
  ];

  const handleLeadClick = (leadId) => {
    router.push(`Lawyer-dashboard/lead-details/${leadId}`);
  };

  return (
    <div className="max-w-6xl  pb-24 lg:pb-0  ">
      <p className="lg:text-right text-center py-5 bg-white lg:bg-none lg:shadow-none shadow-md lg:pt-20 text-xl  md:text-3xl font-semibold">
        فرص
      </p>
      <div className="flex items-center justify-end pt-10 px-5 lg:px-0 gap-2">
        <button className="text-xl font-semibold flex items-center gap-2 border-2 border-gray-300 px-4 py-2 rounded-full">
          فلتر{" "}
          <span>
            <Image src="/images/filter.png" height={20} width={20} alt="فلتر" />
          </span>
        </button>
      </div>{" "}
      <div className="w-[80%] lg:mx-auto">
        <p className="flex items-center gap-1 w-fit px-4 rounded-lg">
          فرص <span>{leadsData.length}</span>
        </p>{" "}
      </div>
      {/* all leads display  */}
      <div className="flex flex-col gap-5 pb-10 justify-center items-center px-4 md:px-5 lg:px-0 mt-5">
        {leadsData.map((lead) => (
          <div
            key={lead.id}
            onClick={() => handleLeadClick(lead.id)}
            className="relative border-2 border-gray-300 rounded-lg lg:w-[80%] w-full md:px-10 px-3 py-6 cursor-pointer hover:border-blue-500 transition-colors"
          >
            {seenLeads.includes(lead.id) && (
              <span className="absolute top-3 left-8 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                تم المشاهدة
              </span>
            )}
            <div className="flex justify-between mt-4 items-center">
              <p className="flex items-center">
                {lead.month} <span>{lead.date}</span>
              </p>
              <p className="text-lg">{lead.name}</p>
            </div>
            <p className="text-right text-xl">{lead.title}</p>
            <p className="text-right text-lg text-gray-500">
              {lead.description}
            </p>
            <div className="flex flex-row-reverse flex-wrap md:flex-nowrap items-center gap-2 pt-4 text-white">
              {lead.tags.map((tag, index) => (
                <p
                  key={index}
                  className={`py-1 px-6 rounded-md ${
                    tag === "عاجل"
                      ? "bg-red-500"
                      : tag === "حصرى"
                        ? "bg-green-700"
                        : "bg-blue-800"
                  }`}
                >
                  {tag}
                </p>
              ))}
              <p className="flex gap-1 text-black bg-gray-300 py-1 px-2 rounded-md">
                مرات <span>{lead.contactCount}</span>
              </p>
              <LuPhone className="text-black text-2xl" />
            </div>
            <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-16">
              <button className="bg-orange-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-orange-600">
                تواصل مع العميل
              </button>
              <p className="flex items-center gap-1 text-lg text-gray-500">
                تم التواصل مع العميل مره واحدة
                <span>
                  <BsWallet2 />
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* end of the diplaying leads  */}
    </div>
  );
}
