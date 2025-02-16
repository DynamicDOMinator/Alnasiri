"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";

export default function MyAnswers() {
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${Base_URL}/answers/get-answers-by-lawyer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.message === "success get answers") {
          setAnswers(data.data);
          // Create a map of questions for easy lookup
          const questionMap = {};
          data.questions.forEach((q) => {
            questionMap[q.question_uuid] = q;
          });
          setQuestions(questionMap);
        }
      } catch (error) {
        console.error("Error fetching answers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  return (
    <div className="w-full pb-24 lg:pb-0 max-w-3xl mx-auto relative">
      {/* Sticky header */}
      <div className="sticky top-0 w-full max-w-3xl py-5 lg:py-0 bg-white z-10">
        <p className="lg:text-right text-center pb-5 lg:pb-0 lg:bg-transparent lg:shadow-none shadow-none lg:pt-16 text-xl  font-bold">
          اجوبتي
        </p>
        <div className="lg:pb-5">
          <p className="flex items-center mt-10 lg:mt-0 gap-1 w-fit px-4 rounded-lg">
            اجوبه <span>{answers.length}</span>
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      {answers.length > 0 ? (
        <div className="space-y-4 lg:mt-4">
          {answers.map((answer) => {
            const question = questions[answer.question_uuid] || {};
            const date = new Date(answer.created_at);

            return (
              <div
                key={answer.id}
                className="border-2 rounded-lg p-4 relative"
              >
                <div className="flex justify-between mt-4 items-center pt-2">
                  <p className="flex items-center">
                    {date.toLocaleDateString("ar-EG", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="font-semibold">{answer.user_name || "المستخدم"}</p>
                </div>
                {question.question_title && (
                  <p className="text-right font-semibold break-words whitespace-normal">
                    {question.question_title.length > 50
                      ? `...${question.question_title.substring(0, 50)}`
                      : question.question_title}
                  </p>
                )}
                <p className="text-right text-gray-500 break-words whitespace-normal overflow-hidden">
                  {question.question_content?.length > 50
                    ? `...${question.question_content.substring(0, 50)}`
                    : question.question_content}
                </p>

                <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-10">
                  <Link
                    href={`/Lawyer-dashboard/Answers/${answer.uuid}`}
                    className="bg-blue-500 w-full text-center md:w-auto text-white py-2 px-6 rounded-md hover:bg-blue-600"
                  >
                    اعرض جوابي
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full py-20 text-center">
          <div className="bg-gray-100 p-5 rounded-full mb-4">
            <IoSearchOutline className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            لا توجد اجوبة حتى الآن
          </h3>
          <p className="text-gray-500 mb-6">
            لم تقم بالإجابة على أي استشارات بعد
          </p>
          <Link
            href="/Lawyer-dashboard"
            className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
          >
            استكشف الاستشارات المتاحة
          </Link>
        </div>
      )}
    </div>
  );
}
