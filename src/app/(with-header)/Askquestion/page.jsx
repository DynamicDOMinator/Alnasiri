"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQuestion } from "../../contexts/QuestionContext";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import AuthModel from "../../components/AuthModel";

export default function ClientForm() {
  const router = useRouter();
  const { setQuestion } = useQuestion();
  const [showDetails, setShowDetails] = useState(false);
  const [hireLawyer, setHireLawyer] = useState(null);
  const [hireTime, setHireTime] = useState("");
  const [contactMethod, setContactMethod] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    description: "",
    city: "",
    specialty: "",
  });
  const [errors, setErrors] = useState({});
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const featchSpecialties = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/speciality/get-all-speciality`
        );
        const speciality = res.data.map((speciality) => speciality.name);
        setSpecialties(speciality);
      } catch (error) {
        console.log("التخصصات غير متاحه", error);
      }
    };
    featchSpecialties();
  }, [BASE_URL]);

  useEffect(() => {
    const featchCities = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/lawyer/get-all-cities`);
        const cityNames = res.data.map((city) => city.name);
        setCities(cityNames);
      } catch (error) {}
    };
    featchCities();
  }, [BASE_URL]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.question.trim()) {
      newErrors.question = "الرجاء إدخال سؤالك";
    } else if (formData.question.length < 10) {
      newErrors.question = "يجب أن يكون السؤال أكثر من 10 أحرف";
    }
    if (!formData.description.trim()) {
      newErrors.description = "الرجاء إدخال وصف للمشكلة";
    } else if (formData.description.length < 20) {
      newErrors.description = "يجب أن يكون الوصف أكثر من 20 حرف";
    }
    if (!formData.city) {
      newErrors.city = "الرجاء اختيار المدينة";
    }
    if (!formData.specialty) {
      newErrors.specialty = "الرجاء اختيار تخصص القضية";
    }
    if (hireLawyer === null) {
      newErrors.hireLawyer = "الرجاء الرجاء الاجابة علي السؤال";
    }
    if (hireLawyer === true) {
      if (!hireTime) {
        newErrors.hireTime = "الرجاء الاجابة علي السؤال";
      }
      if (!contactMethod) {
        newErrors.contactMethod = "الرجاء اختيار طريقة التواصل";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      let token = null;

      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }

      if (!token) {
        setErrors({
          submit: "خطأ في معرف المستخدم. الرجاء تسجيل الدخول مرة أخرى.",
        });
        return;
      }

      const requestData = {
        question_title: formData.question,
        question_content: formData.description.replace(/\r\n/g, "\n"),
        question_city: formData.city,
        question_status: hireLawyer ? "yes" : "no",
        case_specialization: formData.specialty,
        ...(hireLawyer
          ? {
              contact_method: contactMethod,
              question_time: hireTime,
            }
          : {}),
      };

      const apiUrl = hireLawyer
        ? `${BASE_URL}/lawyer/create-lawyer-chance`
        : `${BASE_URL}/question/create`;

      const response = await axios.post(apiUrl, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (hireLawyer) {
        // Handle lawyer chance response
        if (response.data && response.data.uuid) {
          setQuestion(response.data.uuid, response.data);

          router.push(`/Askquestion/${response.data.uuid}`);
        } else {
          throw new Error("Invalid lawyer chance response");
        }
      } else {
        if (response.data?.question?.uuid) {
          setQuestion(response.data.question.uuid, response.data.question);
          router.push(`/Askquestion/${response.data.question.uuid}`);
        } else {
          throw new Error("Invalid question response");
        }
      }
    } catch (error) {
      setErrors({
        submit:
          error.response.data.error ||
          "حدث خطأ أثناء إرسال البيانات. الرجاء المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter cities based on search input
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="pt-36 py-10 bg-gray-100">
      <AuthModel
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <div dir="rtl" className="p-5 max-w-4xl mx-auto ">
        <h1 className="lg:text-[48px] text-xl font-bold text-center mb-20">
          اسال محامي مجاناً..!
        </h1>
        {/* How it works */}
        <div className="mb-5">
          <div
            className="flex justify-between items-center border-t-4 border-black bg-white shadow-md py-6 px-2 cursor-pointer"
            onClick={() => setShowDetails(!showDetails)}
          >
            <h2 className="text-xl font-semibold text-[#30B2B4F7] mb-2">
              كيف تسفيد من هذه الخدمة؟
            </h2>
            <div
              className={`text-blue-500 transform transition-transform duration-300 ${showDetails ? "rotate-180" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showDetails ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-white shadow-md px-2 pb-4">
              <ul className="list-disc mr-4 [&>li]:relative [&>li]:right-4">
                <li className="py-1">
                  اكتب سؤالك بكل سهوله-الخدمة مجانية و تحتفظ بخصوصيتك
                </li>

                <li className="py-1">سيتم اشعارك فور رد المحاميين علي سؤالك</li>
              </ul>
              <p className="font-bold py-4 mr-4">نصائح طرح الاسئله</p>
              <ul className="list-disc mr-4 [&>li]:relative [&>li]:right-4">
                <li className="py-1">
                  ركز على التفاصيل المهمة بدون الحاجه إلى اطالة
                </li>
                <li className="py-1">
                  اجعل سؤالك واضحاً و مباشراً ليسهل الرد عليك
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Question */}
          <div>
            <label className="block font-bold mb-1">
              أسال سؤالك<span className="text-red-600">*</span>
            </label>
            <textarea
              name="question"
              placeholder="أشرح وضعك او حالتك"
              value={formData.question}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md text-right ${
                errors.question ? "border-red-500" : ""
              }`}
            ></textarea>
            {errors.question && (
              <p className="text-red-500 text-sm mt-1">{errors.question}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold mb-1">
              اشرح حالتك<span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="قدم التفاصيل المهمة. لا داعي لأن تكون مثالية - يمكنك دائمًا  توضيح المزيد أو طرح أسئلة إضافية لاحقًا."
              rows={8}
              style={{ whiteSpace: "pre-wrap" }}
              className={`w-full p-2 border rounded-md text-right ${
                errors.description ? "border-red-500" : ""
              }`}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* City */}
          <div className="relative">
            <label className="block font-bold mb-1">
              المدينة<span className="text-red-600">*</span>
            </label>
            <div
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className={`w-full p-2 border rounded-md bg-white  text-right cursor-pointer flex justify-between items-center ${
                errors.city ? "border-red-500" : ""
              }`}
            >
              <span className={formData.city ? "" : "text-gray-400"}>
                {formData.city || "اختر مدينتك"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${showCityDropdown ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {showCityDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full p-2 border-b text-right"
                  placeholder="ابحث عن مدينة..."
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
                {filteredCities.map((city, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-right"
                    onClick={() => {
                      setFormData({ ...formData, city: city });
                      setShowCityDropdown(false);
                      setCitySearch("");
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* Specialty - New Addition */}
          <div>
            <label className="block font-bold mb-1">
              تخصص القضية<span className="text-red-600">*</span>
            </label>
            <select
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md text-right ${
                errors.specialty ? "border-red-500" : ""
              }`}
            >
              <option value="">اختر تخصص القضية</option>
              {specialties.map((speciality, index) => (
                <option key={index} value={speciality}>
                  {speciality}
                </option>
              ))}
              <option value={false}>لا أعلم</option>
            </select>
            <Link href="/legal-specializations">
              <p className="text-blue-500 hover:underline pt-5 text-right">
                اطلع علي شرح التخصصات
              </p>
            </Link>
            {errors.specialty && (
              <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>
            )}
          </div>

          {/* Hire Lawyer */}
          <div>
            <label className="block font-bold mb-1">
              هل تخطط لتوظيف محامٍ؟<span className="text-red-600">*</span>
            </label>
            <div className="space-x-4 flex flex-col gap-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="hireLawyer"
                  value="true"
                  onChange={() => setHireLawyer(true)}
                  className="form-radio ml-2"
                />
                <span>نعم</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="hireLawyer"
                  value="false"
                  onChange={() => {
                    setHireLawyer(false);
                    setHireTime("");
                    setContactMethod(null);
                  }}
                  className="form-radio ml-2"
                />
                <span>لا</span>
              </label>
            </div>
            {errors.hireLawyer && (
              <p className="text-red-500 text-sm mt-1">{errors.hireLawyer}</p>
            )}
          </div>

          {/* When to hire lawyer */}
          {hireLawyer === true && (
            <div>
              <label className="block font-bold mb-1">
                متى تخطط للحصول على مساعدة قانونية؟
                <span className="text-red-600">*</span>
              </label>
              <div className="space-x-4 flex flex-col gap-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hireTime"
                    value="urgent"
                    onChange={(e) => setHireTime(e.target.value)}
                    className="form-radio ml-2"
                  />
                  <span>فورًا</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hireTime"
                    value="with_in_30_days"
                    onChange={(e) => setHireTime(e.target.value)}
                    className="form-radio ml-2"
                  />
                  <span>خلال 30 يومًا</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hireTime"
                    value="not_sure"
                    onChange={(e) => setHireTime(e.target.value)}
                    className="form-radio ml-2"
                  />
                  <span>لست متأكد</span>
                </label>
              </div>
              {errors.hireTime && (
                <p className="text-red-500 text-sm mt-1">{errors.hireTime}</p>
              )}
              {/* Communication Method - Now conditional on hireTime having a value */}
              {hireTime && (
                <div className="pt-5">
                  <label className="block font-bold mb-1">
                    طريقة التواصل<span className="text-red-600">*</span>
                  </label>
                  <div className="space-x-4 flex flex-col gap-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="call"
                        onChange={() => setContactMethod("call")}
                        className="form-radio ml-2"
                      />
                      <span>مكالمة</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="message"
                        onChange={() => setContactMethod("message")}
                        className="form-radio ml-2"
                      />
                      <span>رسالة</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="none"
                        onChange={() => setContactMethod("none")}
                        className="form-radio ml-2"
                      />
                      <span>لا افضل التواصل</span>
                    </label>
                  </div>
                  {errors.contactMethod && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactMethod}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div>
            <p className="text-gray-600">
              نستخدم هذا السؤال للحصول على المساعدة من المحامين بشكل أسرع
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 w-full md:w-auto text-white py-2 px-16 rounded flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span dir="rtl">جاري الإرسال...</span>
              </>
            ) : (
              "إرسال"
            )}
          </button>
        </form>
        {errors.submit && (
          <div className="text-red-500 text-center mt-4">{errors.submit}</div>
        )}
      </div>
    </div>
  );
}
