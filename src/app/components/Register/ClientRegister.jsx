"use client";
import { useState } from "react";
import axios from "axios";
import moment from "moment-hijri";
import Link from "next/link";

const ClientRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    isLookingForLawyer: false,
    isLawyer: false,
    licenseStartDate: "",
    specialization: "",
    licenseNumber: "",
    experienceYears: "",
  });

  const [errors, setErrors] = useState({});

  const currentHijriYear = moment().iYear(); // السنة الهجرية الحالية باستخدام moment-hijri

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "isLookingForLawyer" || name === "isLawyer") {
      setFormData((prevData) => ({
        ...prevData,
        isLookingForLawyer: name === "isLookingForLawyer" ? checked : false,
        isLawyer: name === "isLawyer" ? checked : false,
      }));
    } else if (name === "licenseNumber") {
      // Handle license number input to calculate experience
      if (/^\d{0,6}$/.test(value)) {
        setFormData((prevData) => {
          const updatedData = { ...prevData, licenseNumber: value };
          if (value.length >= 2) {
            const yearPrefix = parseInt(value.substring(0, 2));
            const lastTwoDigits = yearPrefix % 100;
            let experience = currentHijriYear - (1400 + lastTwoDigits);

            if (experience < 0) {
              experience += 100;
            }
            if (experience == 0) {
              experience += 1;
            }

            updatedData.experienceYears = experience;
          }
          return updatedData;
        });
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const regexArabic = /^[\u0600-\u06FF\s]+$/; // Regex for Arabic letters only

    if (!formData.firstName || !regexArabic.test(formData.firstName))
      newErrors.firstName = "الاسم الأول يجب أن يكون باللغة العربية";
    if (!formData.lastName || !regexArabic.test(formData.lastName))
      newErrors.lastName = "الاسم الأخير يجب أن يكون باللغة العربية";

    if (!regexEmail.test(formData.email))
      newErrors.email = "البريد الإلكتروني غير صالح";
    if (!regexPassword.test(formData.password))
      newErrors.password =
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف و رقم";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword =
        "كلمة المرور وتأكيد كلمة المرور غير متطابقتين";
    if (!formData.isLookingForLawyer && !formData.isLawyer)
      newErrors.lawyerChoice =
        "يجب اختيار نوع المستخدم (هل أنت محامي أو تبحث عن محامي)";

    if (formData.isLawyer) {
      if (!formData.licenseType) newErrors.licenseType = "نوع الرخصة مطلوب";
      if (!formData.licenseStartDate)
        newErrors.licenseStartDate = "تاريخ إصدار الرخصة مطلوب";
      if (!formData.specialization) newErrors.specialization = "التخصص مطلوب";
    }

    if (!formData.licenseNumber || !formData.experienceYears)
      newErrors.licenseInfo = "يرجى إدخال رقم الترخيص وحساب سنين الخبرة";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form data submitted:", formData);
      axios
        .post("/api-endpoint", formData)
        .then((response) => {
          console.log("Response:", response);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className=" pb-10 px-3 pt-28 gap-5 bg-slate-100">
      <div className="md:flex  justify-center ">
        <div className="md:flex  justify-center">
          <div
            className="bg-white hidden md:block md:basis-1/2 lg:basis-1/3 md:bg-cover md:bg-center rounded-t-lg shadow px-4 py-4"
            style={{
              backgroundImage: "url(/images/signup-two.jpg)",
            }}
          >
            <h2 className="md:text-3xl text-xl  font-bold text-center">
              {" "}
              أهلا بك في النصيري
            </h2>
            <p className="text-center pt-6 text-sm text-gray-700">
              مرحباً بك في منصتك القانونية الموثوقة التي تربط بين المحامين
              والعملاء بكل سهولة واحترافية. سواء كنت محامياً تسعى لتوسيع نطاق
              عملك وعرض خبراتك، أو شخصاً يبحث عن استشارة قانونية أو دعم قانوني
              متخصص، النصيري هو المكان الأنسب لك
            </p>
          </div>

          <div className="lg:basis-1/3 relative md:basis-1/2 bg-white px-4  md:pb-10 py-4 shadow">
            <h1 className="text-center text-2xl font-semibold pb-6">
              إنشاء حساب
            </h1>
            <form
              onSubmit={handleSubmit}
              className="text-end w-full   relative "
            >
              <div className="md:flex gap-5 flex-row-reverse">
                <div className="mb-4 basis-1/2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    الاسم الأول
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="الاسم الأول"
                    value={formData.firstName}
                    onChange={handleChange}
                    dir="rtl"
                    lang="ar"
                    pattern="[\u0600-\u06FF\s]+"
                    className="mt-1 p-2 w-full border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs">{errors.firstName}</p>
                  )}
                </div>

                <div className="mb-4 basis-1/2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    الاسم الأخير
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="الاسم الأخير"
                    value={formData.lastName}
                    onChange={handleChange}
                    dir="rtl"
                    lang="ar"
                    pattern="[\u0600-\u06FF\s]+"
                    className="mt-1 p-2 w-full border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4 basis-1/2">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    رقم الهاتف
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="رقم الهاتف السعودي"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    dir="rtl"
                    className="mt-1 p-2 w-full border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="mb-4 basis-1/2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={handleChange}
                    dir="rtl"
                    lang="ar"
                    className="mt-1 p-2 w-full border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4 basis-1/2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={handleChange}
                    dir="rtl"
                    lang="ar"
                    className="mt-1 p-2 w-full border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password}</p>
                  )}
                </div>

                <div className="mb-4 basis-1/2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="تأكيد كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    dir="rtl"
                    lang="ar"
                    className="mt-1 p-2 w-full border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="pb-2">
                  بإنشائك حسابًا، فإنك توافق على الشروط والأحكام وسياسة الخصوصية
                  الخاصة بنا
                </p>
                <p className="pb-2">
                  هل أنت محامي؟{" "}
                  <Link href="/Register-Lawyer">
                    <span className="text-blue-500 underline">
                      {" "}
                      قم بإنشاء حساب
                    </span>
                  </Link>
                </p>
              </div>

              <div className="md:flex flex-row-reverse justify-between items-center">
                <div>
                  <p className="pb-2">
                    لديك حساب بالفعل؟{" "}
                    <span className="text-blue-500 underline">
                      قم بتسجيل الدخول
                    </span>{" "}
                  </p>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    إنشاء حساب
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegister;
