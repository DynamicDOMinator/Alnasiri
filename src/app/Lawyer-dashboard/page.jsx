"use client";
import Image from "next/image";
import { LuPhone } from "react-icons/lu";
import { BsWallet2 } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Foras() {
  const router = useRouter();
  const [seenLeads, setSeenLeads] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [leads, setLeads] = useState([]);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const saved = localStorage.getItem("seenLeads");
    if (saved) {
      const parsedLeads = JSON.parse(saved);
      // Filter out null values and ensure unique IDs
      const cleanLeads = [...new Set(parsedLeads.filter(id => id !== null))];
      setSeenLeads(cleanLeads);
      // Update localStorage with clean data
      localStorage.setItem("seenLeads", JSON.stringify(cleanLeads));
    }
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/lawyer/get-all-lawyer-chances`);
        setLeads(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLeads();
  }, [BASE_URL]);

  const handleLeadClick = (uuid) => {
    // Add the UUID to seenLeads when clicking
    const updatedSeenLeads = [...new Set([...seenLeads, uuid])];
    setSeenLeads(updatedSeenLeads);
    localStorage.setItem("seenLeads", JSON.stringify(updatedSeenLeads));
    router.push(`/Lawyer-dashboard/lead-details/${uuid}`);
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
    const updatedLeads = leads.filter(
      (lead) => !selectedLeads.includes(lead.id)
    );
    setLeads(updatedLeads);
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
            فرص <span>{leads.length}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 pb-10 justify-center items-center px-4 md:px-5 lg:px-0 pt-2">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => !isSelectionMode && handleLeadClick(lead.uuid)}
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
            {seenLeads.includes(lead.uuid) && (
              <span className="absolute top-3 md:left-8 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                تم المشاهدة
              </span>
            )}
            <div className="flex justify-between mt-4 items-center pt-2">
              <p className="flex items-center">
                {new Date(lead.created_at).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric' })}
              </p>
              <p className="font-semibold ">{lead.user.name}</p>
            </div>
            <p className="text-right font-semibold">{lead.question_title}</p>
            <p className="text-right text-gray-500">{lead.question_content}</p>
            <div className="flex flex-row-reverse flex-wrap md:flex-nowrap items-center gap-2 pt-2 text-white">
              {[lead.day_name, lead.sell_status, lead.case_specialization].filter(Boolean).map((tag, index) => (
                <p
                  key={index}
                  className={`py-1 px-6 rounded-md ${
                    tag === "عاجل"
                      ? "bg-red-500"
                      : tag === "حصري"
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
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLeadClick(lead.uuid);
                }}
                className="bg-blue-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-blue-600"
              >
                تواصل مع العميل
              </button>
              <p
                dir="rtl"
                className="flex flex-row-reverse items-center gap-2 text-lg text-gray-500"
              >
                {lead.sell_number === 0
                  ? "لم يتم التواصل مع العميل"
                  : `${lead.sell_number} تواصل مع العميل`}
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
