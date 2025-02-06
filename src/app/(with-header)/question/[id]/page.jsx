"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaUser, FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Search from "@/app/components/Search component/Search";

export default function QuestionDetails() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [showPhones, setShowPhones] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLawyer, setIsLawyer] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    // Check authentication status and user type
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      const checkUserType = async () => {
        try {
          const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axios.get(
            `${BASE_URL}/user_type/get`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsLawyer(response.data.user_type === "lawyer");
        } catch (error) {
          console.error("Error checking user type:", error);
          setIsLawyer(false);
        }
      };
      checkUserType();
    }
  }, []);

  const handleShowPhone = async (lawyerUuid) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setShowPhones(prev => ({
      ...prev,
      [lawyerUuid]: !prev[lawyerUuid]
    }));
  };

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        setLoading(true);
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(
          `${BASE_URL}/question/get-question-by-uuid/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuestion(response.data.question);
      } catch (error) {
        console.error("Error fetching question details:", error);
        setError("حدث خطأ في جلب تفاصيل السؤال");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchQuestionDetails();
    }
  }, [params.id]);

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

  const ProfileImage = ({ src, size = 100 }) => {
    const hasError = imageErrors.has(src);

    if (!src || hasError) {
      return (
        <div
          className="bg-gray-100 rounded-full flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <FaUser className="text-gray-400" style={{ fontSize: size * 0.5 }} />
        </div>
      );
    }

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src={src}
          alt="profile"
          width={size}
          height={size}
          className="rounded-full object-cover"
          onError={() => {
            setImageErrors((prev) => new Set([...prev, src]));
          }}
        />
      </div>
    );
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    if (!isLawyer) {
      alert("عذراً، فقط المحامين يمكنهم الإجابة على الأسئلة");
      return;
    }

    try {
      setSubmitting(true);
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      await axios.post(
        `${BASE_URL}/answers/store`,
        {
          question_uuid: params.id,
          answer: answerContent
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // Reset form and refresh question data
      setAnswerContent("");
      setShowAnswerForm(false);
      window.location.reload(); // Refresh to show new answer
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 pt-24">
        <div className="absolute inset-0 flex justify-center items-center">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-100 pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p>لم يتم العثور على السؤال</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-blue-900 text-white py-4 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-2 text-sm sm:text-base">
              <span className="text-blue-100">النصائح القانونية</span>
              <span className="text-blue-100">←</span>
              <span className="text-blue-100 break-all">{question.question_title}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">أسئلة وأجوبة</h1>
            <p className="text-xs sm:text-sm mt-1">
              احصل على إجابة مجانية من خلال المحامين
            </p>
          </div>
        </div>
      </div>

      {/* Login Alert Modal */}
      {showLoginAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full" dir="rtl">
            <h3 className="text-lg font-semibold mb-4">تسجيل الدخول مطلوب</h3>
            <p className="text-gray-600 mb-6">
              يجب عليك تسجيل الدخول أولاً لإضافة إجابة
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/login")}
                className="flex-1 bg-blue-800 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => setShowLoginAlert(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div dir="rtl">
          {/* Question Section */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-md mb-4 sm:mb-6">
              <div className="p-4 sm:p-6">
                <div className="mb-4 relative border-2 rounded-lg">
                  <p className="text-xs sm:text-sm mb-1 absolute -top-4 right-3 bg-green-100 p-1 rounded-lg text-green-700">
                    السؤال
                  </p>
                  <input
                    type="text"
                    value={question.question_title}
                    readOnly
                    className="w-full text-lg sm:text-xl font-bold pt-4 p-2 text-gray-700"
                    dir="rtl"
                  />
                  <input
                    type="text"
                    value={question.question_content}
                    readOnly
                    className="w-full px-1 text-sm sm:text-base text-gray-700"
                    dir="rtl"
                  />
                  <div className="text-gray-500 pb-2 text-xs sm:text-sm mt-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                      <div className="flex flex-wrap items-center px-1 gap-1">
                        <p className="">
                          {question.question_city}
                        </p>
                        <p className="border-r-2 pr-1">
                          {formatDate(question.created_at)}
                        </p>
                        <p className="border-r-2 pr-1">
                         إجابات {question.answers?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ask Another Question Card */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">اسأل سؤال آخر</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">
                    احصل على رد خلال من خلال محامين متخصصين مجاناً
                  </p>
                </div>
                <button
                  onClick={() => router.push("/Askquestion")}
                  className="w-full sm:w-auto bg-blue-800 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors text-sm sm:text-base"
                >
                  اسأل محامي مجاناً
                </button>
              </div>
            </div>
         
          
            {/* Answers Section */}
            {question.answers?.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold mb-6">
                    {question.answers_count} جواب من محامي
                  </h2>
                  {question.answers?.map((answer) => (
                    <div key={answer.uuid} className="border-2  relative rounded-lg p-4">
                      <p className="text-xs sm:text-sm mb-1 absolute -top-4 right-3 bg-gray-200 py-1 px-3 rounded-lg text-blue-700">
                      إجابة
                      </p>
                      <div className="flex flex-col pt-2 sm:flex-row justify-between items-start gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <ProfileImage src={answer.lawyer?.image} size={80} />
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">
                              {answer.lawyer?.name}
                            </h3>
                            <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                              <FaLocationDot className="ml-1" />
                              <span>{answer.lawyer?.city}</span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              مصرح له {answer.lawyer?.experience} منذ سنوات 
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col w-full sm:w-auto gap-2">
                          <button
                            onClick={() => handleShowPhone(answer.lawyer?.uuid)}
                            className="flex items-center justify-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors text-sm sm:text-base"
                          >
                            <FaPhone />
                            <span>
                              {showPhones[answer.lawyer?.uuid]
                                ? `05${answer.lawyer?.phone}`
                                : "عرض الهاتف المحمول"}
                            </span>
                          </button>
                          <button
                            onClick={() => router.push(`/lawyer-profile/${answer.lawyer?.uuid}`)}
                            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                          >
                            <FaUser />
                            <span>الملف الشخصي</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap mb-4 text-sm sm:text-base">
                        {answer.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-8 text-center">
                  <div className="mb-4">
                    <FaUser className="mx-auto text-4xl text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    لا توجد إجابات بعد
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    كن أول من يجيب على هذا السؤال وساعد في تقديم المشورة القانونية
                  </p>
                </div>
              </div>
            )}
            {/* Add Answer Button and Form - Only show for lawyers */}
            {isLawyer && (
              <div className="bg-white rounded-lg shadow-md mt-4 p-4 sm:p-6 mb-4 sm:mb-6">
                {!showAnswerForm ? (
                  <button
                    onClick={() => setShowAnswerForm(true)}
                    className="w-full bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors text-sm sm:text-base"
                  >
                    أضف إجابتك
                  </button>
                ) : (
                  <form onSubmit={handleSubmitAnswer} className="space-y-4">
                    <div>
                      <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                        اكتب اجابتك
                      </label>
                      <textarea
                        id="answer"
                        rows={6}
                        value={answerContent}
                        onChange={(e) => setAnswerContent(e.target.value)}
                        className="w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
                        placeholder="اكتب اجابتك هنا..."
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`flex-1 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors text-sm sm:text-base ${
                          submitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {submitting ? "جاري الإرسال..." : "إرسال الإجابة"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAnswerForm(false);
                          setAnswerContent("");
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
          <div className="relative bg-white p-4 sm:p-6 mt-6 rounded-lg shadow-lg">
            <div className="w-[90%] mx-auto my-6 sm:my-10 h-2 sm:h-3 rounded-lg bg-blue-900"></div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-4">
              <div className="w-full lg:w-1/2 px-4 sm:px-8 lg:px-16">
                {/* search component */}
                <Search />
                {/* end of the component */}
              </div>

              <div className="w-full lg:w-1/2 lg:border-r-2 px-4 sm:px-8 lg:px-16">
                <div className="w-full relative min-h-[200px] h-full flex flex-col">
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-right">
                      لم تجد الاجابة التي تحتاجها؟ نحن هنا لمساعدتك
                    </p>

                    <p className="text-gray-600 text-right pt-3 sm:pt-5 text-sm sm:text-base">
                      المحامون المرخصون متاحون وجاهزون لتقديم المشورة بشأن مجموعة
                      واسعه من المسائل القانونية
                    </p>
                  </div>
                  <div className="absolute bottom-4 right-0 w-full">
                    <Link href="/Askquestion" className="block">
                      <button className="w-full border-2 py-2 sm:py-3 hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base">
                        أسال محامي مجانا
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
