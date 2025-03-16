"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { IoMail } from "react-icons/io5";
import { FaClock } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { MdArrowBackIos } from "react-icons/md";

import Link from "next/link";
import { useQuestion } from "../../../contexts/QuestionContext";
import { useAuth } from "../../../contexts/AuthContext";
import Search from "../../../components/Search component/Search";
export default function QuestionSuccess() {
  const params = useParams();
  const { currentQuestionId, questionData, clearQuestion } = useQuestion();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionDetails, setQuestionDetails] = useState();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
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
          setQuestionDetails(questionData);
          setLoading(false);
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(
          `${apiUrl}/leads/get-lead-or-question-by-uuid/${params.id}`
        );

        if (response.data?.question || response.data?.lawyerChance) {
          const questionData =
            response.data.question || response.data.lawyerChance;

          setQuestionDetails(questionData);
        } else {
          throw new Error("No data found");
        }
      } catch (error) {
        setError(error.response?.data?.error || "حدث خطأ أثناء تحميل السؤال");
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
    <div className="pt-16 py-10 text-center " dir="rtl">

<div dir="rtl" className="bg-[#00447b]  pt-7 pb-6">
  <div className="md:flex   items-center max-w-6xl mx-auto   gap-2">
    <h1 className="text-[#008cc9] text-[14px] break-words whitespace-pre-wrap">
      <Link href="/legal-topics">
      النصائح القانونية</Link>
</h1>
<MdArrowBackIos className="text-white text-lg lg:block hidden" />

<h2 className="text-[#008cc9] px-1 lg:px-0 text-[14px] break-words whitespace-pre-wrap">
{questionDetails?.question_title}
</h2>



  </div>

  <h2 className="text-white text-2xl max-w-6xl mx-auto md:text-right text-center font-bold  pt-7">
  بشاره الأسئلة و الاجوبة
</h2>
<p className="text-white text-sm lg:text-lg max-w-6xl mx-auto md:text-right text-center  pt-2">احصل على الإجابات القانونية التي تحتاجها من محامين معتمدين.







</p>
</div>




      <div className="max-w-6xl mx-auto p-6 pt-16 ">
        <div className="text-6xl mb-4 text-green-500 w-fit mx-auto"><FaCheckCircle />
        </div>
        <h2 className="text-2xl font-bold mb-4  w-fit mx-auto">شكرا لك تم تلقي سؤالك</h2>
        <div className="flex flex-col gap-4  items-start mx-auto mt-5 mb-20 w-fit ">
          <p className="flex items-center gap-2">
            <span>
              <IoMail />
            </span>
            سيتم ارسال بريد الكتروني لك فور الاجابة على سؤالك.
          </p>
          <p className="flex items-center gap-2">
            <span>
              <FaClock />
            </span>
             تلقى محامينا سؤالك.
          </p>
          <p className="flex items-center gap-2">
            <span>
              <AiFillMessage />
            </span>
             ستتم الإجابة على سؤالك في اسرع وقت
          </p>
        </div>

        <div className="text-right p-4 relative rounded-lg mb-6 border border-gray-300 mt-10 px-8">
          <h2 className="mb-2 absolute -top-3 bg-[#e5f8f7] text-[#00b7af] px-3 rounded-md">
            السؤال
          </h2>
          <p className="text-2xl break-words font-semibold pt-9">
            {questionDetails?.question_title || "No Title"}
          </p>
          <p className="text-lg break-words mt-5 whitespace-pre-wrap">
            {questionDetails?.question_content || "No Content"}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            <p className="text-sm">
              {questionDetails?.question_city || "No City"}
            </p>
            <p className="text-gray-500 text-sm">|</p>
            <p className="text-sm">
            {questionDetails?.case_specialization === "false" ? "لا أعلم" : questionDetails?.case_specialization}
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

        <div className="flex justify-between md:flex-row flex-col gap-4 bg-white px-4 py-10 mt-10 rounded-lg shadow-[0px_2px_11px_0px_rgba(137,147,159,0.25)]">
          <div>
            <h3 className="lg:text-xl font-bold text-right">أسال سؤال اخر</h3>
            <p className="text-sm lg:text-lg font-bold text-right mt-2">
            احصل على رد فوري - و سريع من محامي معتمد ، مجاناً!
            </p>
          </div>
          <div className="flex md:flex-row flex-col gap-4 lg:h-fit">
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

        <hr className="mt-12 border-gray-300" />

        <div className="text-right py-10">
          <h3 className="text-xl font-semibold">لم يتم الرد من المحامين بعد</h3>
          <p>
            لم يتم الرد على استفسارك بعد - الرجاء التحقق بشكل دوري - سيصلك الرد
            قريبا.
          </p>
        </div>
        {/* search inputs  */}

        <div className="relative bg-white pb-4  rounded-lg shadow-lg">
          <div className="w-[90%] mx-auto my-10 h-3 rounded-lg bg-blue-900"></div>

          <div className="flex lg:flex-row flex-col gap-4 ">
            <div className="lg:w-1/2 lg:px-16 px-3">
              {/* search component */}
              <Search />
              {/* end of the component */}
            </div>

            <div className="lg:w-1/2 border-r-2  ">
              <div className="lg:px-16  h-full w-full relative">
                <p className="text-xl font-bold text-right px-3 lg:px-0">
                  لم تجد الاجابة التي تحتاجها؟ نحن هنا لمساعدتك
                </p>

                <p className="text-gray-600 text-right pt-5 px-3 lg:px-0">
                محاميك المعتمد جاهز لتقديم استشارة قانونية شاملة تُغطي كافة جوانب المسائل القانونية
                </p>
                <div className="lg:absolute bottom-0 right-0  w-[100%]">
                  <Link href="/Askquestion">
                    <button className="border-2  w-[90%]  py-3 my-5 hover:bg-gray-200 rounded-lg">
                      أسال محامي مجانا
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* search component */}
          </div>
        </div>
      </div>
    </div>
  );
}
