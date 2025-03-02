"use client";
import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegStar, FaUser } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { AiOutlineFileDone } from "react-icons/ai";
import { FiPhone } from "react-icons/fi";
import { BiLike } from "react-icons/bi";
import { BsQuestionCircle } from "react-icons/bs";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { FaUserTie } from "react-icons/fa6";
import { useAuth } from "@/app/contexts/AuthContext";
import { FaLock } from "react-icons/fa";
import { useUserType } from "@/app/contexts/UserTypeContext";
// Auth Modal Component
const AuthModal = ({ isOpen, onClose }) => {
  const { userType } = useUserType();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full relative">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <FaLock className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">تنبيه</h3>
          <p className="text-gray-600 mb-6">يجب تسجيل الدخول لتسليم المراجعة</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
            >
              موافق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

const getMapEmbedUrl = (mapUrl) => {
  try {
    if (!mapUrl) return null;
    const coordsMatch = mapUrl.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch) {
      const [_, lat, lng] = coordsMatch;
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${lat},${lng}&zoom=15`;
    }
    return null;
  } catch (error) {
    console.error("Error processing map URL:", error);
    return null;
  }
};

const ProfileImage = ({ src, size = 100 }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || !isValidUrl(src) || hasError) {
    return (
      <div
        className={`bg-gray-100 rounded-full flex items-center justify-center`}
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
        alt="lawyer profile"
        fill
        className="rounded-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default function LawyerProfile() {
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleQAs, setVisibleQAs] = useState(3);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const {  isAuthenticated } = useAuth();
  const { userType } = useUserType();

  const handleAction = (action) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (action === "phone") {
      window.location.href = `tel:${lawyer.phone}`;
    } else if (action === "review") {
      router.push(`/submit-review/${lawyer.uuid}`);
    }
  };

  useEffect(() => {
    const fetchLawyerProfile = async () => {
      try {
        const uuid = params.id;
        console.log("Fetching lawyer profile with UUID:", uuid);
        const response = await axios.get(
          `${BASE_URL}/lawyer/getLawyerProfileByUUID/${uuid}`
        );
        console.log("API Response:", response.data);
        setLawyer(response.data);
      } catch (error) {
        console.error("Error fetching lawyer profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLawyerProfile();
    }
  }, [params.id]);

  const getFirstSpecialty = () => {
    try {
      if (!lawyer?.office?.specialties?.length) return null;
      return lawyer.office.specialties[0].name;
    } catch (error) {
      console.error("Error getting first specialty:", error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-2xl w-28 h-28 border-b-2 border-blue-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 rounded-full p-6 mb-6">
          <BsSearch className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">
          لم يتم العثور على المحامي
        </h2>
        <p className="text-gray-500">
          عذراً، لم نتمكن من العثور على المحامي المطلوب.
        </p>
      </div>
    );
  }

  const firstSpecialty = getFirstSpecialty();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="h-[160px] w-full  pt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex  flex-wrap-reverse items-center md:gap-2 justify-end max-w-7xl mx-auto">
          {lawyer.city && (
            <>
              <p
                className="text-blue-500 text-lg sm:text-xl font-bold text-right mt-3 cursor-pointer hover:text-blue-200 transition-colors"
                onClick={() => router.push(`/Find-Lawyer?city=${lawyer.city}`)}
              >
                {lawyer.city}
              </p>
              <p className="text-blue-500 text-lg sm:text-xl font-bold text-right mt-3">
                <IoIosArrowBack />
              </p>
            </>
          )}
          {firstSpecialty && (
            <>
              <p
                className="text-blue-500 text-lg sm:text-xl font-bold text-right mt-3 cursor-pointer hover:text-blue-200 transition-colors"
                onClick={() =>
                  router.push(`/Find-Lawyer?specialties=${firstSpecialty}`)
                }
              >
                {firstSpecialty}
              </p>
              <p className="text-blue-500 text-lg sm:text-xl font-bold text-right mt-3">
                <IoIosArrowBack />
              </p>
            </>
          )}
          <h1
            className="text-blue-500 text-lg sm:text-xl font-bold text-right mt-3 cursor-pointer hover:text-blue-200 transition-colors"
            onClick={() => router.push("/Find-Lawyer")}
          >
            البحث عن محامي
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div
          dir="rtl"
          className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border-2 p-4 sm:p-6 rounded-lg shadow-md"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className=" border-2 px-4 py-10">
              <ProfileImage src={lawyer.profile_image_link} size={120} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-center md:text-right">
                {lawyer.name}
              </h2>
              <div className="flex flex-col gap-2 mt-2">
                <p className="flex items-center justify-center sm:justify-start gap-1">
                  <span>
                    <FaRegStar />
                  </span>
                  {lawyer.reviews_count || 0} تقيما
                </p>
                <p className="flex items-center gap-2 ">
                  <span>
                    <IoLocationSharp />
                  </span>
                  {lawyer.city}
                </p>

                <p className="flex items-center justify-center sm:justify-start gap-1">
                  <span>
                    <AiOutlineFileDone />
                  </span>
                  مصرح له منذ
                  <span>{lawyer.experience || 0}</span> سنة
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col gap-3">
            {lawyer.phone && isAuthenticated ? (
              <button
                onClick={() => handleAction("phone")}
                className="bg-blue-900 text-white px-6 py-3 rounded flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors"
              >
                <span>0{lawyer.phone}</span>
                <FiPhone />
              </button>
            ) : (
              <button
                onClick={() => handleAction("phone")}
                className="bg-blue-900 text-white px-6 py-3 rounded flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors"
              >
                <span>اظهار رقم الهاتف</span>
                <FiPhone />
              </button>
            )}
          </div>
        </div>

        {lawyer.office?.bio && (
          <div className="mt-6 ">
            <h3 className="text-xl border-r-4 border-blue-900 pr-2 font-semibold mb-7 text-right">
              <span> {lawyer.name} </span>
              عن
            </h3>
            <div className="bg-white p-6  rounded-lg shadow-lg">
              <div>
                <p className="text-lg flex items-center justify-end gap-2 font-semibold mb-4 text-right">
                  السيره الذاتية
                  <span className="text-white rounded-full  bg-orange-400 px-3 py-3">
                    <FaUserTie />
                  </span>
                </p>
                <p className="text-gray-600 text-right leading-relaxed">
                  {lawyer.office.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {lawyer.experience && (
          <div className="mt-6 ">
            <h3 className="text-xl border-r-4 border-blue-900 pr-2 font-semibold mb-7 text-right">
              رخصة المحاماه
            </h3>
            <div className="bg-white p-6  rounded-lg shadow-lg">
              <div>
                <p className="text-lg flex border-b-2 pb-4 items-center justify-end gap-2 font-semibold mb-4 text-right">
                  سنة <span>{lawyer.experience}</span> محامي صرح له منذ{" "}
                  <span>
                    {" "}
                    <AiOutlineFileDone />{" "}
                  </span>
                </p>
                <p className="flex items-center  flex-row-reverse gap-2 text-gray-600">
                  <span>
                    <IoLocationSharp />
                  </span>
                  {lawyer.city}
                </p>
              </div>
            </div>
          </div>
        )}

        {lawyer.office?.google_map && (
          <div className="mt-10">
            <h3 className="text-xl pb-2 border-r-4 border-blue-900 pr-2 font-semibold mb-4 text-right">
              موقع المكتب
            </h3>
            <div>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <iframe
                  src={getMapEmbedUrl(lawyer.office.google_map)}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-10">
          <h3 className="text-xl pb-2 border-r-4 border-blue-900 pr-2 font-semibold mb-4 text-right">
            
            <span className="px-1">{lawyer.reviews_count}</span>
            {lawyer.reviews_count < 3 ? "تقييم" : "تقييمات"}
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {lawyer.reviews_count > 0 ? (
              <div>
                {lawyer.reviews_data.map((review, index) => (
                  <div key={index} className="mb-6 p-4 border-2  rounded-lg">
                    <div className="flex items-center  justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BiLike
                          className={`${
                            review.lawyer_consult === 1
                              ? "text-green-500 bg-green-100"
                              : "text-red-500 bg-red-100 rotate-180"
                          } w-16 px-4 py-2 h-10 rounded-lg`}
                        />
                      </div>
                      <div className=" flex justify-between items-center gap-2 text-sm">
                        <p className="text-gray-500 hidden lg:block ">
                          {new Date(review.created_at).toLocaleDateString(
                            "ar-eg"
                          )}
                        </p>
                        <p className="text-lg text-right ">
                          تم النشر بواسطة {review.user?.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-right whitespace-pre-wrap break-words w-full">{review.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                لا توجد تقييمات حتى الآن
              </p>
            )}
            {userType === "user" && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => handleAction("review")}
                className="bg-blue-900 w-full md:w-auto text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
              >
                تسليم المراجعة
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Answers Section */}
        <div className="mt-10">
          <h3 className="text-xl pb-2 border-r-4 border-blue-900 pr-2 font-semibold mb-4 text-right">
            التفاعل
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-center flex flex-col text-lg font-semibold">
              <span className="px-1">{lawyer.answers_count}</span>
              {lawyer.answers_count < 3 ? "إجابة" : "إجابات"}
            </p>
          </div>

          {/* Questions and Answers Section */}
          {lawyer.questions_and_answers &&
            lawyer.questions_and_answers.length > 0 && (
              <div className="mt-6">
                <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
                  {lawyer.questions_and_answers
                    .slice(0, visibleQAs)
                    .map((qa, index) => (
                      <div key={index} className="border-2 rounded-lg p-4">
                        {/* Question */}
                        <div className="mb-4">
                          <div className="flex items-center flex-row-reverse justify-between mb-2">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                              {qa.question.question_city} -{" "}
                              {qa.question.case_specialization}
                              <IoLocationSharp className="text-blue-800" />
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-sm">
                                {new Date(
                                  qa.question.created_at
                                ).toLocaleDateString("ar-eg")}
                              </span>
                              <BsQuestionCircle className="text-blue-900 text-xl" />
                            </div>
                          </div>
                          <h4 className="text-xl font-semibold mb-2 text-right whitespace-pre-wrap break-words">
                            {qa.question.question_title}
                          </h4>
                          <p className="text-gray-700 text-right whitespace-pre-wrap break-words">
                            {qa.question.question_content}
                          </p>
                        </div>

                        {/* Answer */}
                        <div className="mt-4 border-r-4 border-blue-900 pr-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 text-sm">
                              {new Date(qa.created_at).toLocaleDateString(
                                "ar-eg"
                              )}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">الإجابة</span>
                              <MdOutlineQuestionAnswer className="text-green-600 text-xl" />
                            </div>
                          </div>
                          <p className="text-gray-700  text-right whitespace-pre-wrap break-words">
                            {qa.answer}
                          </p>
                        </div>
                      </div>
                    ))}

                  {/* Show More Button */}
                  {lawyer.questions_and_answers.length > visibleQAs && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setVisibleQAs((prev) => prev + 3)}
                        className="bg-white border-2 border-blue-900 text-blue-900 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        عرض المزيد
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
