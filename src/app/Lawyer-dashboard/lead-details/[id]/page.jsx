"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { CgSandClock } from "react-icons/cg";
import { FaPhoneFlip } from "react-icons/fa6";
import { CiMoneyBill } from "react-icons/ci";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function LeadDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [leadData, setLeadData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_URL}/lawyer/get-lawyer-chances-by-uuid/${id}`
        );
        if (response.data && response.data.length > 0) {
          setLeadData(response.data[0]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLeadDetails();
    }
  }, [id, BASE_URL]);

  useEffect(() => {
    const saved = localStorage.getItem("seenLeads");
    const seenLeads = saved ? JSON.parse(saved) : [];

    if (!seenLeads.includes(Number(id))) {
      const updatedSeenLeads = [...seenLeads, Number(id)];
      localStorage.setItem("seenLeads", JSON.stringify(updatedSeenLeads));
    }
  }, [id]);

  const handlePurchaseLead = async () => {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL}/leads-purchace/create`,
        {
          lead_uuid: leadData.uuid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        router.push("/Lawyer-dashboard/MyForas");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  if (!leadData) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  return (
    <div>
      <div
        dir="rtl"
        className="lg:max-w-3xl md:max-w-xl px-10 md:px-0 mx-auto relative"
      >
        <div className="sticky top-0 bg-white pb-2">
          <div className="pt-10">
            <div className="flex lg:flex-col items-center relative">
              <Link href="/Lawyer-dashboard/" className="absolute right-0">
                <FaArrowRight />
              </Link>
              <h1 className="lg:text-3xl font-bold lg:pt-10 w-full text-center lg:text-right">
                التفاصيل
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full flex-row-reverse justify-end mt-10">
          <div>
            <p className="text-xl font-bold">{leadData.user.name ? leadData.user.name.split(' ')[0] : leadData.user.name?.split(' ')[0] || 'مستخدم غير معروف'}</p>
          </div>
        </div>

        <div className="mt-7">
          <p className="font-bold">بحث عن {leadData.case_specialization} </p>
        </div>
        <div className="border-b-2 border-gray-100 pb-10">
          <ul className="mt-2">
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              {leadData.question_city}
              <span>
                <FaLocationDot />
              </span>
            </li>
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              تم التسليم في{" "}
              {new Date(leadData.created_at).toLocaleDateString("ar-EG", {
                day: "numeric",
                month: "long",
              })}
              <span>
                <IoMdTime />
              </span>
            </li>
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              {leadData.question_time === "urgent"
                ? "الرغبة في تعيين محامي فوراً"
                : "     الرغبه في تعيين محامي خلال 30 يوم"}
              <span>
                <CgSandClock />
              </span>
            </li>
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              {leadData.contact_method === "call"
                ? "التواصل عبر الهاتف"
                : "التواصل عبر الرسائل"}
              <span>
                <FaPhoneFlip />
              </span>
            </li>
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              {leadData.price} ريال
              <span>
                <CiMoneyBill />
              </span>
            </li>
          </ul>
        </div>
        {leadData.question_title && (
          <div className="mt-10">
            <div className="border-b-2 border-gray-100 pb-2">
              <h3 className="font-bold pb-2">السؤال</h3>
              <p>{leadData.question_title}</p>
            </div>
          </div>
        )}

        <div className="mt-5">
          <div className="border-b-2 border-gray-100 pb-2">
            <h3 className="font-bold pb-2">تفاصيل السؤال</h3>
            <p className="text-right">{leadData.question_content}</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 lg:w-5/6 w-full bg-white border-t-2 py-4 border-gray-100 flex justify-center">
        <button
          onClick={handlePurchaseLead}
          disabled={isLoading}
          className={`bg-green-600 text-white py-3 px-10 rounded-lg hover:bg-green-700 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "...جاري المعالجة" : `عرض سعر ( ${leadData.price} ر.س )`}
        </button>
      </div>
    </div>
  );
}
