"use client";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiQuestionnaireLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useUserType } from "@/app/contexts/UserTypeContext";
import Link from "next/link";
export default function MyQuestions() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { userType, isLoading: userTypeLoading } = useUserType();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!userTypeLoading && (!isAuthenticated || userType === "lawyer")) {
      router.push("/");
    }
  }, [isAuthenticated, userType, userTypeLoading, router]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/user/my-questions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.questions) {
          setQuestions(response.data.questions);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [BASE_URL]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="bg-slate-100 pt-24 pb-10 min-h-screen">
      {isLoading || userTypeLoading ? (
        <div className="absolute inset-0 flex justify-center items-center">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
        </div>
      ) : (
        <div dir="rtl" className="max-w-7xl mx-auto px-4">
          <div>
            <h1 className="lg:text-3xl text-xl font-bold">الأسئلة المطروحة</h1>
          </div>

          {questions.length > 0 ? (
            <div className="flex  mt-10 items-start flex-col-reverse lg:flex-row-reverse gap-6">
              <div className="border-t-4 lg:w-1/3 w-full border-blue-800 h-fit pb-5 bg-white p-2 flex flex-col items-center shadow-md">
                <h2 className="text-lg font-bold mt-2">أسأل سؤال مجاني</h2>
                <p className="text-gray-800 mt-2">
                  اطرح سؤالاً واحصل على مشورة مجانية من عدة محامين
                </p>
                <button className="bg-blue-800 mt-10 hover:bg-blue-900 text-white px-4 py-2 rounded">
                  <Link href="/Askquestion">اسأل سؤال مجاني</Link>
                </button>
              </div>

              <div className="flex flex-col w-full gap-4 flex-1">
                {questions.map((question) => (
                  <div key={question.uuid} className="p-4 bg-white shadow-md">
                    <p>
                      {question.user?.created_at
                        ? formatDate(question.user.created_at)
                        : "تاريخ غير متوفر"}
                    </p>
                    <h2 className="text-lg font-semibold mt-2">
                      {question.question_title}
                    </h2>
                    <p className="mt-2">
                      عدد الاجابات
                      <span> {question.answer_count}</span>
                    </p>
                    <div className="mt-5">
                      <button
                        onClick={() =>
                          router.push(`/question/${question.uuid}`)
                        }
                        className="flex items-center gap-1 text-blue-700 hover:underline"
                      >
                        مشاهدة الاجابات
                        <IoIosArrowBack />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 p-8 bg-white shadow-md rounded-lg">
              <RiQuestionnaireLine className="text-6xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                لا توجد أسئلة حتى الآن
              </h3>
              <p className="text-gray-500 mb-6 text-center">
                لم تقم بطرح أي أسئلة بعد. ابدأ بطرح سؤالك الأول واحصل على إجابات
                من محامين متخصصين
              </p>
              <button
                onClick={() => router.push("/Askquestion")}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                اطرح سؤالاً
                <IoIosArrowBack />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
