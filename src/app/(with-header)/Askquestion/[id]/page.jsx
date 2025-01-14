"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { FaRegClock } from "react-icons/fa";

import Link from "next/link";

export default function QuestionSuccess() {
  const params = useParams();
  const [questionDetails, setQuestionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(
          `${apiUrl}/question/get-question-by-uuid/${params.id}`
        );
        const data = await response.json();
        setQuestionDetails(data);
      } catch (error) {
        console.error("خطأ في جلب تفاصيل السؤال:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [params.id]);

  return (
    <div className="pt-36 py-10 text-center" dir="rtl">
      <div className="max-w-6xl mx-auto p-6 ">
        <div className="text-6xl mb-4 text-green-500 animate-bounce">✓</div>
        <h1 className="text-2xl font-bold mb-4">شكرا لك تم تلقي سؤالك.</h1>
        <div className="text-sm  max-w-sm mx-auto">
          <p className="flex gap-1 items-center justify-end flex-row-reverse">
            {" "}
            سيتم اشعارك عبر البريد الإلكتروني بعد الرد على سؤالك.
            <span>
              <MdOutlineMailOutline />
            </span>
          </p>
          <p className="flex gap-1 items-center justify-end mt-2 flex-row-reverse">
            {" "}
            استلم محامونا سؤالك وسيتم الرد عليه قريبًا.
            <span>
              <IoIosNotifications />
            </span>
          </p>
          <p className="flex gap-1 items-center justify-end mt-2 flex-row-reverse">
            سيقوم فريقنا بالرد على سؤالك في أقرب وقت ممكن.
            <span>
              <FaRegClock />
            </span>
          </p>
        </div>

        {loading ? (
          <div className="text-right p-4 relative rounded-lg mb-6 border border-gray-300 mt-10">
            <h2 className="mb-2 absolute -top-3 bg-white px-2">السؤال</h2>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mt-2"></div>
              <div className="h-20 bg-gray-200 rounded w-full mt-4"></div>
              <div className="mt-6 flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <p className="text-gray-500 text-sm">|</p>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ) : (
          questionDetails && (
            <div className="text-right p-4 relative rounded-lg mb-6 border border-gray-300 mt-10">
              <h2 className="mb-2 absolute -top-3 bg-white px-2"> السؤال </h2>
              <p className="text-xl font-semibold mt-2">
                {questionDetails.question_title}
              </p>
              <p className="text-sm mt-2">{questionDetails.question_content}</p>

              <div className="mt-6 flex items-center gap-2">
                <p className="text-sm">{questionDetails.question_city}</p>
                <p className="text-gray-500 text-sm">|</p>
                <p className="text-sm">
                  {formatDate(questionDetails.created_at)}
                </p>
              </div>
            </div>
          )
        )}

        <div className="flex justify-between md:flex-row flex-col gap-4 bg-white px-4 py-10 rounded-lg shadow-lg">
          <div>
            <h3 className="text-xl font-semibold text-right">أسال سؤال اخر</h3>
            <p className="text-sm text-right mt-2">
              ابحث علي رد فوري من محام مرخص مجانا
            </p>
          </div>
          <div className="flex md:flex-row flex-col gap-4">
            <Link
              href="/Askquestion"
              className="bg-[#16498C] text-white px-6 py-3 md:h-fit w-full md:w-fit rounded-lg hover:bg-blue-900"
            >
              اسال عن محامي مجانا
            </Link>
            <Link
              href="/"
              className=" border border-gray-300 text-gray-700 px-6 py-3 w-full md:w-fit rounded-lg hover:bg-gray-200"
            >
              ابحث عن محام
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
