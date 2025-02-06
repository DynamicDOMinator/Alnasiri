"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GoLaw } from "react-icons/go";
import { CiMoneyBill } from "react-icons/ci";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function QuestionDetails() {
  const router = useRouter();
  const params = useParams();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/question/get-question-by-uuid/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.question) {
          setQuestion(response.data.question);
        }
      } catch (error) {
        console.error('Error fetching question details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchQuestionDetails();
    }
  }, [params.id, BASE_URL]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/answers/store`,
        {
          question_uuid: params.id,
          answer: answer
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/Lawyer-dashboard/FreeQuestions");
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>لم يتم العثور على السؤال</p>
      </div>
    );
  }

  return (
    <div>
      <div dir="rtl" className="lg:max-w-3xl px-3 lg:px-0 mx-auto relative">
        <div className="sticky top-0 bg-white z-30 pb-2">
          <div className="pt-10">
            <div className="flex lg:flex-col items-center relative">
              <Link
                href="/Lawyer-dashboard/FreeQuestions"
                className="absolute right-0"
              >
                <FaArrowRight />
              </Link>
              <h1 className="lg:text-3xl font-bold lg:pt-10 w-full text-center lg:text-right">
                التفاصيل
              </h1>
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-300 px-10 py-7 mt-10 rounded-lg relative">
          <ul className="mt-2">
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              {question?.user?.name || "مستخدم غير معروف"}
              <span className="w-4 h-4 bg-green-600 rounded-full"></span>
            </li>

            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              {question?.question_city || "المدينة غير محددة"}
              <span>
                <FaLocationDot />
              </span>
            </li>
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              {question?.case_specialization || "التخصص غير محدد"}
              <span>
                <GoLaw />
              </span>
            </li>
          </ul>
          <div className="absolute top-4 left-3">
            {/* <p>{new Date(question.user.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p> */}
          </div>
        </div>

        <div className="pt-7 border-2 mb-10 border-gray-300 px-10 py-7 mt-10 rounded-lg">
          <div>
            <h3 className="font-bold">السؤال</h3>
            <p>{question.question_title}</p>
          </div>
          <div className="mt-5">
            <h3 className="font-bold">تفاصيل السؤال</h3>
            <p>{question.question_content}</p>
          </div>
        </div>

        
      </div>
      <form dir="rtl" onSubmit={handleSubmitAnswer} className=" bg-slate-100 sticky bottom-0">
          <div className="w-full px-10 py-7 mt-10 rounded-lg">
            <label className="block mb-2 font-bold">اكتب اجابتك</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full h-32 p-2 border-2 border-gray-300 rounded-lg resize-none"
              placeholder="اكتب اجابتك هنا..."
            ></textarea>
            <button
              type="submit"
              disabled={isSubmitting || !answer.trim()}
              className={`mt-4 mb-20 lg:mb-0 bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 ${
                (isSubmitting || !answer.trim()) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'جاري الإرسال...' : 'ارسال الاجابة'}
            </button>
          </div>
        </form>
    </div>
  );
}
