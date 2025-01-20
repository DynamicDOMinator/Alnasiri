"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import { MdOutlineMailOutline } from "react-icons/md";
// import { IoIosNotifications } from "react-icons/io";
// import { FaRegClock } from "react-icons/fa";
import axios from "axios";

import Link from "next/link";
import { useQuestion } from "../../../contexts/QuestionContext";
import { useAuth } from "../../../contexts/AuthContext";

export default function QuestionSuccess() {
  const params = useParams();
  const { currentQuestionId, questionData, clearQuestion } = useQuestion();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionDetails, setQuestionDetails] = useState();

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

        if (questionData && currentQuestionId === params.id) {
          console.log("Using cached question data:", questionData);
          setQuestionDetails(questionData);
          setLoading(false);
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        try {
          // First try the chances endpoint
          const chanceResponse = await axios.get(
            `${apiUrl}/lawyer/get-lawyer-chances-by-uuid/${params.id}`
          );

          if (
            chanceResponse.data &&
            Object.keys(chanceResponse.data).length > 0
          ) {
            const chanceData = Array.isArray(chanceResponse.data)
              ? chanceResponse.data[0]
              : chanceResponse.data;
            console.log("Setting chance data:", chanceData);
            setQuestionDetails(chanceData);
          } else {
            throw new Error("No chance data found");
          }
        } catch (chanceError) {
          const questionResponse = await axios.get(
            `${apiUrl}/question/get-question-by-uuid/${params.id}`
          );

          if (questionResponse.data) {
            const questionData = Array.isArray(questionResponse.data)
              ? questionResponse.data[0]
              : questionResponse.data;
            console.log("Setting question data:", questionData);
            setQuestionDetails(questionData);
          } else {
            throw new Error("No question data found");
          }
        }
      } catch (error) {
        console.error("Final error:", error);
        setError(error.message || "حدث خطأ أثناء تحميل السؤال");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();

    return () => {
      clearQuestion();
    };
  }, [
    params.id,
    currentQuestionId,
    questionData,
    clearQuestion,
    isAuthenticated,
    user?.uuid,
  ]);

  if (error) {
    return (
      <div className="pt-36 py-10 text-center" dir="rtl">
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-6xl mb-4 text-red-500">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Link
            href="/Askquestion"
            className="bg-[#16498C] text-white px-6 py-3 rounded-lg hover:bg-blue-900 inline-block mt-4"
          >
            العودة إلى صفحة الأسئلة
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-36 py-10 text-center" dir="rtl">
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="max-w-sm mx-auto space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="mt-10 p-4 border border-gray-200 rounded-lg">
              <div className="h-5 w-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!questionDetails) {
    return null;
  }

  return (
    <div className="pt-36 py-10 text-center" dir="rtl">
      <div className="max-w-6xl mx-auto p-6 ">
        <div className="text-6xl mb-4 text-green-500 animate-bounce">✓</div>
        <h1 className="text-2xl font-bold mb-4">شكرا لك تم تلقي سؤالك.</h1>

      

        <div className="text-right p-4 relative rounded-lg mb-6 border border-gray-300 mt-10">
          <h2 className="mb-2 absolute -top-3 bg-white px-2">السؤال</h2>
          <p className="text-xl font-semibold mt-2">
            {questionDetails?.question_title || "No Title"}
          </p>
          <p className="text-sm mt-2">
            {questionDetails?.question_content || "No Content"}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <p className="text-sm">
              {questionDetails?.question_city || "No City"}
            </p>
            <p className="text-gray-500 text-sm">|</p>
            <p className="text-sm">
              {questionDetails?.case_specialization || "No Specialization"}
            </p>
            {questionDetails?.created_at && (
              <>
                <p className="text-gray-500 text-sm">|</p>
                <p className="text-sm">
                  {formatDate(questionDetails.created_at)}
                </p>
              </>
            )}
          </div>

        </div>

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
        <div className="text-right py-10">
          <h3 className="text-xl font-semibold">لم يتم الرد من المحامين بعد</h3>
          <p>
            لم يتم الرد على استفسارك بعد - الرجاء التحقق بشكل دوري - سيصلك الرد
            قريبا.
          </p>
        </div>
        {/* search inputs  */}
        <div className="flex justify-between bg-red-500">
          <div></div>
          <div>
            <p>
              لم تجد الاجابة التي تحتاجها؟ نحن هنا <br /> لمساعدتك
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
