"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GoLaw } from "react-icons/go";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function AnswersDetails() {
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [answerData, setAnswerData] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState("");

  useEffect(() => {
    const fetchAnswerDetails = async () => {
      const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      try {
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
          // Find the specific answer using the UUID from params
          const answer = data.data.find((a) => a.uuid === params.answerId);
          if (answer) {
            setAnswerData(answer);
            // Find the corresponding question
            const question = data.questions.find(
              (q) => q.question_uuid === answer.question_uuid
            );
            setQuestionData(question);
          }
        }
      } catch (error) {
        console.error("Error fetching answer details:", error);
      }
    };

    if (params.answerId) {
      fetchAnswerDetails();
    }
  }, [params.answerId]);

  useEffect(() => {
    if (answerData) {
      setEditedAnswer(answerData.answer);
    }
  }, [answerData]);

  // Keeping the mock data for fields we don't have yet
  const mockData = {
    location: "الرياض",
    deliveryDate: "17 ديسمبر 2023",
    appointmentPreference: "استشارة عن بعد",
    cost: "500",
    questions: [
      {
        question: "ما هو نوع القضية؟",
        answer: "قضية جنائية",
      },
    ],
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${Base_URL}/answers/edit`,
        {
          answer_uuid: answerData.uuid,
          answer: editedAnswer.replace(/\r\n/g, '\n')
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnswerData({ ...answerData, answer: editedAnswer });
      setIsEditing(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating answer:", error);
      setIsLoading(false);
    }
  };

  if (!answerData || !questionData) {
    return  <div className="fixed inset-0 flex justify-center items-center bg-white">
    <AiOutlineLoading3Quarters className="animate-spin text-4xl text-green-600" />
  </div>;
  }

  return (
    <div className="px-5 lg:px-0">
      <div dir="rtl" className="lg:max-w-3xl mx-auto  relative ">
        <div className="sticky top-0 bg-white z-30 pb-2">
          <div className="pt-10">
            <div className="flex lg:flex-col  items-center relative">
              <Link
                href="/Lawyer-dashboard/MyAnswers"
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

        <div className="border-2  border-gray-300 px-10 py-7 mt-10 rounded-lg relative">
          <ul className="mt-2">
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
            {answerData?.user_name ? answerData.user_name.split(' ')[0] : answerData.name?.split(' ')[0] || 'مستخدم غير معروف'}
              <span className="w-4 h-4 bg-green-600 rounded-full"></span>
            </li>

            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              {mockData.location}
              <span>
                <FaLocationDot />
              </span>
            </li>
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              تخصص قضيه جنائيه
              <span>
                <GoLaw />
              </span>
            </li>
          </ul>
          <div className="absolute top-4 left-3  ">
            <p>
              {new Date(answerData.created_at).toLocaleDateString("ar-EG", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
            </p>
          </div>
        </div>

        <div className="pt-7 border-2 mb-10 border-gray-300 px-10 py-7 mt-10 rounded-lg">
          {questionData.question_title && (
            <div>
              <p className="font-bold break-words">السؤال</p>
              <h3 className="font-bold pt-2">{questionData.question_title}</h3>
            </div>
          )}
          <div>
            <div className="mt-5">
              <p className="font-bold">الاجابة</p>
              <p className="pt-2 whitespace-pre-wrap">{answerData.answer}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        dir="rtl"
        className="sticky mb-32 lg:mb-0 lg:max-w-3xl mx-auto bottom-0 bg-white shadow-lg border-t-2 pb-5 px-4 md:px-10"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex  flex-col items-start gap-2 py-4">
            <h4 className="font-bold text-lg">اجابتك</h4>
            <p className="flex gap-1 items-center text-sm text-gray-600">
              الاجابة <span className="text-red-500">*</span>
            </p>
          </div>

          {isEditing ? (
            <div className="space-y-4 ">
              <textarea
                className="w-full min-h-[120px] md:min-h-[150px] p-4 text-right resize-none border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                placeholder="...اكتب اجابتك هنا"
              />
              <div className="flex justify-end flex-row-reverse gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الحفظ..." : "حفظ"}
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="w-full min-h-[120px] md:min-h-[150px] break-words p-4 text-right bg-gray-50 rounded-lg border-2 border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{answerData.answer}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 left-4 text-blue-500 hover:text-blue-600 transition-colors z-10 bg-gray-50 px-2 py-1"
              >
                تعديل
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
