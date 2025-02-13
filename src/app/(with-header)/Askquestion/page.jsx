"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQuestion } from "../../contexts/QuestionContext";
import { useAuth } from "../../contexts/AuthContext";

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
  const [showDialog, setShowDialog] = useState(false);
  const [cities, setCities] = useState([]);
  const [specialties, setSpecialties] = useState([]);

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
      newErrors.hireLawyer = "الرجاء اختيار ما إذا كنت تريد توظيف محامي";
    }
    if (hireLawyer === true) {
      if (!hireTime) {
        newErrors.hireTime = "الرجاء تحديد الوقت المناسب";
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
      setShowDialog(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

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
        question_content: formData.description,
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
    }
  };

  const CustomAlert = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-md text-center">
        <h2 className="text-lg font-bold">تنبيه</h2>
        <p>يجب عليك تسجيل الدخول قبل إرسال السؤال.</p>
        <button
          onClick={() => setShowDialog(false)}
          className="mt-4 bg-[#FF6624] text-white py-2 px-4 rounded"
        >
          حسناً
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-36 py-10">
      {showDialog && <CustomAlert />}
      <div dir="rtl" className="p-5 max-w-6xl mx-auto ">
        <h1 className="text-2xl font-bold text-center mb-5">
          اسال محامي مجاناً..!
        </h1>
        {/* How it works */}
        <div className="mb-5">
          <div className="flex justify-between items-center border-t-4 border-black bg-white shadow-md py-6 px-2">
            <h2 className="text-xl font-semibold text-[#30B2B4F7] mb-2">
              كيف تسفيد من هذه الخدمة؟
            </h2>
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
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
              )}
            </button>
          </div>
          {showDetails && (
            <div className="bg-white shadow-md px-2 pb-4 ">
              <ul className="list-disc mr-4 [&>li]:relative [&>li]:right-4">
                <li className="py-1">
                  اكتب سؤالك بكل سهوله-الخدمة مجانية و تحتفظ بخصوصيتك
                </li>

                <li className="py-1">سيتم اشعارك فور رد المحاميين علي سؤالك</li>
              </ul>
              <p className="font-semibold py-4 mr-4">نصائح طرح الاسئله</p>
              <ul className="list-disc mr-4 [&>li]:relative [&>li]:right-4">
                <li className="py-1">
                  ركز على التفاصيل المهمة بدون الحاجه إلى اطالة
                </li>
                <li className="py-1">
                  اجعل سؤالك واضحاً و مباشراً ليسهل الرد عليك
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question */}
          <div>
            <label className="block font-medium mb-1">
              أطرح سؤالا<span className="text-red-600">*</span>
            </label>
            <textarea
              name="question"
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
            <label className="block font-medium mb-1">
              اشرح وضعك أو حالتك<span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md text-right ${
                errors.description ? "border-red-500" : ""
              }`}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block font-medium mb-1">
              المدينة<span className="text-red-600">*</span>
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md text-right ${
                errors.city ? "border-red-500" : ""
              }`}
            >
              <option value="">اختر مدينتك</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* Specialty - New Addition */}
          <div>
            <label className="block font-medium mb-1">
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
            </select>
            {errors.specialty && (
              <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>
            )}
          </div>

          {/* Hire Lawyer */}
          <div>
            <label className="block font-medium mb-1">
              هل تخطط لتوظيف محامٍ؟
            </label>
            <div className="space-x-4 flex flex-col gap-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="hireLawyer"
                  value="true"
                  onChange={() => setHireLawyer(true)}
                  required
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
          </div>

          {/* When to hire lawyer */}
          {hireLawyer === true && (
            <div>
              <label className="block font-medium mb-1">
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

              {/* Communication Method - Now conditional on hireTime having a value */}
              {hireTime && (
                <div className="pt-5">
                  <p className="pb-4">
                    نستخدم هذا السؤال للحصول على المساعدة من المحامين بشكل أسرع.
                  </p>
                  <label className="block font-medium mb-1">
                    طريقة التواصل
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
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-[#16498C]  hover:bg-blue-900 w-full md:w-auto text-white py-2 px-16 rounded"
          >
            إرسال
          </button>
        </form>
        {errors.submit && (
          <div className="text-red-500 text-center mt-4">{errors.submit}</div>
        )}
      </div>
    </div>
  );
}
