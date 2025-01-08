"use client";
import Image from "next/image";
import { LuPhone } from "react-icons/lu";
import { BsWallet2 } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Foras() {
  const router = useRouter();
  const [seenLeads, setSeenLeads] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [leadsData, setLeadsData] = useState([
    {
      id: 1,
      date: "17",
      month: "ديسمبر",
      name: "أحمد السيد",
      title: "بحث عن قضية جنائة",
      description: "البحث عن محامي ذو خبرة في انواع هذة القضاية",
      tags: ["عاجل", "حصرى", "تخصص جنائي"],
      contactCount: 5,
      contactStatus: "5 تواصل مع العميل",
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
      contactStatus: "3 تواصل مع العميل",
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
      contactStatus: "2 تواصل مع العميل",
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
      contactStatus: "4 تواصل مع العميل",
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
      contactStatus: "1 تواصل مع العميل",
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
      contactStatus: "6 تواصل مع العميل",
    },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("seenLeads");
    if (saved) {
      setSeenLeads(JSON.parse(saved));
    }
  }, []);

  const handleLeadClick = (leadId) => {
    router.push(`Lawyer-dashboard/lead-details/${leadId}`);
  };

  const handleSelectLead = (e, leadId) => {
    e.stopPropagation();
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter((id) => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };

  const handleDeleteSelected = () => {
    const updatedLeads = leadsData.filter(
      (lead) => !selectedLeads.includes(lead.id)
    );
    setLeadsData(updatedLeads);
    setIsSelectionMode(false);
    setSelectedLeads([]);
  };

  return (
    <div className="w-full pb-24 lg:pb-0 max-w-3xl mx-auto relative cairo-font">
      <div className="sticky top-0 w-full max-w-3xl bg-white z-10">
        <p className="lg:text-right text-center py-5 lg:bg-transparent lg:shadow-none shadow-md lg:pt-16 text-xl md:text-3xl font-bold">
          فرص
        </p>
        <div className="flex items-center justify-between pt-1 flex-row-reverse bg-white ">
          <div className="flex items-center justify-end px-5 lg:px-0 gap-2">
            {isSelectionMode && (
              <button
                onClick={handleDeleteSelected}
                className="font-bold flex items-center gap-2 border-2 border-red-500 text-red-500 px-4 py-2 rounded-full"
              >
                حذف المحدد ({selectedLeads.length})
              </button>
            )}
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedLeads([]);
              }}
              className="font-bold flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400  px-4 py-2 rounded-full"
            >
              {isSelectionMode ? "إلغاء" : "تحديد"}
            </button>
            <button className="font-bold flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-full">
              فلتر{" "}
              <span>
                <Image
                  src="/images/filter.png"
                  height={15}
                  width={15}
                  alt="فلتر"
                />
              </span>
            </button>
          </div>
          <p className="flex items-center gap-1 w-fit px-4 rounded-lg">
            فرص <span>{leadsData.length}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 pb-10 justify-center items-center px-4 md:px-5 lg:px-0 pt-2">
        {leadsData.map((lead) => (
          <div
            key={lead.id}
            onClick={() => !isSelectionMode && handleLeadClick(lead.id)}
            className="relative border-2 border-gray-300  max-w-3xl rounded-lg w-full md:px-10 px-3 pt-4 pb-3 cursor-pointer hover:border-blue-500 transition-colors [direction:ltr]"
          >
            {isSelectionMode && (
              <input
                type="checkbox"
                className="absolute top-3 right-3 h-5 w-5 cursor-pointer"
                checked={selectedLeads.includes(lead.id)}
                onChange={(e) => handleSelectLead(e, lead.id)}
              />
            )}
            {seenLeads.includes(lead.id) && (
              <span className="absolute top-3 md:left-8 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                تم المشاهدة
              </span>
            )}
            <div className="flex justify-between mt-4 items-center pt-2">
              <p className="flex items-center">
                {lead.month} <span>{lead.date}</span>
              </p>
              <p className="font-semibold ">{lead.name}</p>
            </div>
            <p className="text-right  font-semibold">{lead.title}</p>
            <p className="text-right  text-gray-500">{lead.description}</p>
            <div className="flex flex-row-reverse flex-wrap md:flex-nowrap items-center gap-2 pt-2 text-white">
              {lead.tags.map((tag, index) => (
                <p
                  key={index}
                  className={`py-1 px-6 rounded-md ${
                    tag === "عاجل"
                      ? "bg-red-500"
                      : tag === "حصرى"
                        ? "bg-green-700"
                        : "bg-gray-300 text-black"
                  }`}
                >
                  {tag}
                </p>
              ))}

              <LuPhone className="text-black text-2xl" />
            </div>
            <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-2">
              <button className="bg-blue-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-blue-600">
                تواصل مع العميل
              </button>
              <p
                dir="rtl"
                className="flex flex-row-reverse items-center gap-2 text-lg text-gray-500"
              >
                {lead.contactCount === 0
                  ? "لم يتم التواصل مع العميل"
                  : `${lead.contactCount} تواصل مع العميل`}
                <span>
                  <BsWallet2 />
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
