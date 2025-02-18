"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaUser, FaPhone, FaSearch } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Search from "@/app/components/Search component/Search";
import { SiAnswer } from "react-icons/si";

export default function QuestionDetails() {
  const params = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [isuser, setIsUser] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLawyer, setIsLawyer] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showPhones, setShowPhones] = useState({});

  useEffect(() => {
    // Check authentication status and user type
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      const checkUserType = async () => {
        try {
          const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axios.get(`${BASE_URL}/user_type/get`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setIsLawyer(response.data.user_type === "lawyer");
          setIsUser(response.data.user_type === "user");
        } catch (error) {
          console.error("Error checking user type:", error);
          setIsLawyer(false);
          setIsUser(false);
        }
      };
      checkUserType();
    }
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

        // Check if the param is a UUID (you might want to add a proper UUID validation)
        const isUUID = params.id.includes("-");

        const endpoint = isUUID
          ? `/question/get-question-by-uuid/${params.id}`
          : `/question/search-question/${params.id}`;

        const response = await axios.get(`${BASE_URL}${endpoint}`);

        // Handle different response structures based on endpoint
        const questionData = isUUID
          ? [response.data.question] // Wrap single question in array to maintain consistency
          : response.data.questions;

        setQuestions(questionData);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("لم نجد أسئلة متعلقة ببحثك");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchQuestions();
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
          answer: answerContent,
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

  const handleShowPhone = (lawyerId) => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }
    setShowPhones((prev) => ({
      ...prev,
      [lawyerId]: true,
    }));
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
      <div className="min-h-screen bg-slate-100 pt-24 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4">
          <div
            className="bg-white p-8 rounded-lg shadow-md text-center"
            dir="rtl"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl text-gray-400">
                <FaSearch />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                لم نجد أسئلة متعلقة ببحثك
              </h2>
              <p className="text-gray-600 mb-6">
                عذراً، لم نتمكن من العثور على أسئلة مشابهة. يمكنك طرح سؤالك
                للحصول على المساعدة القانونية المجانية من محامينا.
              </p>
              <button
                onClick={() => router.push("/Askquestion")}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
              >
                اطرح سؤالك الآن
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-slate-100 pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div
            className="bg-white p-8 rounded-lg shadow-md text-center"
            dir="rtl"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl text-gray-400">
                <FaUser />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                لم يتم العثور على السؤال
              </h2>
              <p className="text-gray-600 mb-6">
                عذراً، لم نتمكن من العثور على السؤال الذي تبحث عنه. يمكنك طرح
                سؤال جديد للحصول على المساعدة القانونية.
              </p>
              <button
                onClick={() => router.push("/Askquestion")}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
              >
                اطرح سؤالاً جديداً
              </button>
            </div>
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
              <span className="text-blue-100 break-all">
                {questions[0].question_title}
              </span>
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
              يجب عليك تسجيل الدخول أولاً لعرض رقم الهاتف
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
          {/* Questions Section */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-md mb-4 sm:mb-6">
              <div className="p-4 sm:p-6">
                <div className="mb-4 relative border-2 rounded-lg">
                  <p className="text-xs sm:text-sm mb-1 absolute -top-4 right-3 bg-green-100 p-1 rounded-lg text-green-700">
                    السؤال
                  </p>
                  <div className="flex items-start gap-4 pt-4 p-2">
                    <div className="flex-shrink-0">
                      {questions[0]?.user?.profile_image ? (
                        <Image
                          src={questions[0].user.profile_image}
                          alt="User"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-[50px] h-[50px] bg-gray-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-gray-400 text-xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-700">
                        {questions[0].question_title}
                      </h2>
                      <p className="text-sm sm:text-base whitespace-pre-wrap text-gray-700 mt-2">
                        {questions[0].question_content}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-500 pb-2 text-xs sm:text-sm mt-4 px-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-1">
                        <FaLocationDot />
                        <span>{questions[0].question_city}</span>
                      </div>
                      <span className="border-r-2 pr-2">
                        {formatDate(questions[0].created_at)}
                      </span>
                      <span className="border-r-2 pr-2">
                        إجابات {questions[0].answers_count || 0}
                      </span>
                      <span className="border-r-2 pr-2">
                        {questions[0].case_specialization}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Answers Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {questions[0]?.answers?.length || 0} جواب من محامي
              </h3>

              {questions[0]?.answers?.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-4 sm:p-6">
                    {questions[0].answers.map((answer) => (
                      <div
                        key={answer.uuid}
                        className="border-2 relative rounded-lg p-4 mb-4"
                      >
                        <p className="text-xs sm:text-sm mb-1 absolute -top-4 right-3 bg-gray-200 py-1 px-3 rounded-lg text-blue-700">
                          إجابة
                        </p>
                        <div className="flex flex-col pt-2 sm:flex-row justify-between items-start gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            {answer.lawyer_profile_image ? (
                              <Image
                                src={answer.lawyer_profile_image}
                                alt={answer.lawyer.name}
                                width={80}
                                height={80}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-[80px] h-[80px] bg-gray-100 rounded-full flex items-center justify-center">
                                <FaUser className="text-gray-400 text-3xl" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-sm sm:text-base">
                                {answer.lawyer.name}
                              </h3>
                              <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                                <FaLocationDot className="ml-1" />
                                <span>{answer.lawyer.city}</span>
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500">
                                مصرح له {answer.lawyer.experience} منذ سنوات
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col w-full sm:w-auto gap-2">
                            <button
                              onClick={() =>
                                handleShowPhone(answer.lawyer?.uuid)
                              }
                              className="flex items-center justify-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors text-sm sm:text-base"
                            >
                              <FaPhone />
                              <span>
                                {isAuthenticated ||
                                showPhones[answer.lawyer?.uuid]
                                  ? answer.lawyer?.phone
                                  : "عرض الهاتف المحمول"}
                              </span>
                            </button>
                            <button
                              onClick={() =>
                                router.push(
                                  `/lawyer-profile/${answer.lawyer?.uuid}`
                                )
                              }
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
                      <SiAnswer className="mx-auto text-4xl text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد إجابات بعد
                    </h3>
                    {isLawyer ? (
                      <p className="text-gray-600 text-sm mb-4">
                        كن أول من يجيب على هذا السؤال وساعد في تقديم المشورة
                        القانونية
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm mb-4">
                        لم يتم العثور على أي إجابات استشير محامي مجانا
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Ask Another Question Card */}
            {isuser && (
              <div className="bg-gray-50  rounded-lg p-4 sm:p-6 my-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">
                      اسأل سؤال آخر
                    </h2>
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
            )}

            {isLawyer && (
              <div className="mt-4 ">
                {!showAnswerForm ? (
                  <button
                    onClick={() => setShowAnswerForm(true)}
                    className="bg-blue-800 text-white px-4 w-full py-4 md:text-lg rounded-lg hover:bg-blue-900 transition-colors text-sm"
                  >
                    إضافة إجابة
                  </button>
                ) : (
                  <form onSubmit={handleSubmitAnswer} className="space-y-4">
                    <textarea
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      placeholder="اكتب إجابتك هنا..."
                      className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors disabled:bg-gray-400"
                      >
                        {submitting ? "جاري الإرسال..." : "إرسال الإجابة"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAnswerForm(false);
                          setAnswerContent("");
                        }}
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
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
                      المحامون المرخصون متاحون وجاهزون لتقديم المشورة بشأن
                      مجموعة واسعه من المسائل القانونية
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
