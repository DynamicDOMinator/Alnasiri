"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { BiLike } from "react-icons/bi";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SubmitReview() {
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommend, setRecommend] = useState(null);
  const [hired, setHired] = useState(false);
  const params = useParams();
  const router = useRouter();


  useEffect(() => {
    const fetchLawyerProfile = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/lawyer/getLawyerProfileByUUID/${params.id}`
        );
        setLawyer(response.data);
      } catch (error) {
        console.error("Error fetching lawyer profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerProfile();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (recommend === null) {
      setError("الرجاء اختيار ما إذا كنت تنصح بالتعامل مع المحامي");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const reviewData = {
        lawyer_uuid: params.id,
        text: reviewText,
        rate: recommend,
        lawyer_consult: hired,
      };
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/lawyer/create-review`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.push(`/lawyer-profile/${params.id}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("حدث خطأ أثناء إرسال التقييم. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {/* Lawyer Profile Header */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden relative mb-2">
              {lawyer?.profile_image_link ? (
                <Image
                  src={lawyer.profile_image_link}
                  alt={lawyer.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <CiUser className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                </div>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-right">
              {lawyer?.name}
            </h2>
            <div className="flex items-center justify-end gap-2 text-gray-600 mt-2">
              <span className="text-sm sm:text-base">{lawyer?.city}</span>
              <IoLocationSharp />
            </div>
            <p className="text-gray-600 text-sm sm:text-base text-right mt-1">
              محامي مصرح له منذ {lawyer?.experience} سنة
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-right">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-right mb-2">
                كيف كانت تجربتك؟
              </h3>
              <textarea
                rows={4}
                className="w-full border-2 rounded-lg p-3 text-right resize-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
                value={reviewText}
                onChange={(e) => {
                  if (e.target.value.length <= 70) {
                    setReviewText(e.target.value);
                  }
                }}
                required
                placeholder="مطلوب"
              />
              <div className="text-left text-xs sm:text-sm text-gray-500 mt-1">
                اقل من 70 حرف
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-right mb-4">
                هل تنصح بالتعامل معه؟
              </h3>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setRecommend(false);
                    setError("");
                  }}
                  className={`py-3  lg:w-1/2 sm:py-4 px-4 rounded-lg border-2 flex flex-col-reverse items-center justify-center gap-2 transition-colors ${
                    recommend === false
                      ? "bg-blue-50 border-blue-900 text-blue-900"
                      : "border-gray-200 hover:border-blue-900 hover:bg-blue-50"
                  }`}
                >
                  لا انصح بالتعامل معه{" "}
                  <span>
                    {" "}
                    <BiLike
                      className={`${"text-red-500 bg-red-100 rotate-180"} w-16 px-4 py-2 h-10 rounded-lg`}
                    />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecommend(true);
                    setError("");
                  }}
                  className={`py-3 lg:w-1/2 sm:py-4 px-4 rounded-lg border-2 flex flex-col-reverse items-center justify-center gap-2 transition-colors ${
                    recommend === true
                      ? "bg-blue-50 border-blue-900 text-blue-900"
                      : "border-gray-200 hover:border-blue-900 hover:bg-blue-50"
                  }`}
                >
                  انصح بالتعامل معه
                  <BiLike
                    className={`${"text-green-500 bg-green-100"} w-16 px-4 py-2 h-10 rounded-lg`}
                  />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-right mb-4">
                هل قمت باستشارة أو تعيين المحامي؟
              </h3>
              <div className="flex justify-end gap-4 sm:gap-8 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hired"
                    value={false}
                    checked={hired === false}
                    onChange={(e) => setHired(false)}
                    className="w-4 h-4 text-blue-900 focus:ring-blue-900"
                  />
                  <span className="text-sm sm:text-base">لا</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hired"
                    value={true}
                    checked={hired === true}
                    onChange={(e) => setHired(true)}
                    className="w-4 h-4 text-blue-900 focus:ring-blue-900"
                  />
                  <span className="text-sm sm:text-base">نعم</span>
                </label>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-blue-900 text-white px-8 sm:px-16 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "جاري الإرسال..." : "تقييم"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
