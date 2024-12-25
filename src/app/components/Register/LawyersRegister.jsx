"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaBriefcase, FaCheckCircle } from "react-icons/fa";
import moment from "moment-hijri";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Constants (should ideally be moved to a separate file)
const saudiCities = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "تبوك",
  "أبها",
  "الطائف",
  "بريدة",
  "نجران",
  "جازان",
  "ينبع",
  "حائل",
  "الجبيل",
  "الخرج",
  "الأحساء",
  "القطيف",
  "خميس مشيط",
  "حفر الباطن",
];

const specialtyCategories = {
  "القانون التجاري": ["عقود تجارية", "شركات", "إفلاس"],
  "القانون المدني": ["عقود مدنية", "تعويضات", "ملكية"],
  "قانون الأسرة": ["زواج", "طلاق", "حضانة", "نفقة"],
  "القانون الجنائي": ["دفاع جنائي", "جرائم مالية"],
  "قانون العمل": ["عقود عمل", "نزاعات عمالية", "تأمينات"],
  "القانون الإداري": ["عقو�� إدارية", "قرارات إدارية"],
  "الملكية الفكرية": ["علامات تجارية", "براءات اختراع", "حقوق مؤلف"],
  التحكيم: ["تحكيم تجاري", "تحكيم دولي"],
  "القانون البنكي": ["عمليات بنكية", "تمويل"],
  "القانون العقاري": ["عقود إيجار", "ملكية عقارية", "نزاعات عقارية"],
};

// Add these validation helper functions at the top of the file
const isArabicText = (text) => /^[\u0600-\u06FF\s]+$/.test(text);
const isValidSaudiPhone = (phone) => /^(05)[0-9]{8}$/.test(phone);
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function LawyersRegister() {
  // Consolidate all initial state into a single object for better organization
  const initialFormData = {
    // Personal Information
    firstName: "",
    middleName: "",
    lastName: "",
    city: "",
    personalId: "",
    licenseNumber: "",
    acceptTerms: false,

    // Professional Information
    officeName: "",
    whatsapp: "",
    phone: "",
    email: "",
    specializations: [],
    speaksEnglish: false,
    password: "",
    confirmPassword: "",
  };

  // Group related state together
  const [formData, setFormData] = useState(initialFormData);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    city: "",
    licenseNumber: "",
    officeName: "",
    phone: "",
    whatsapp: "",
    email: "",
    password: "",
    confirmPassword: "",
    specializations: "",
    acceptTerms: "",
  });

  const [specialtySelections, setSpecialtySelections] = useState([
    { id: 1, value: "", isRequired: true },
    { id: 2, value: "", isRequired: false },
    { id: 3, value: "", isRequired: false },
    { id: 4, value: "", isRequired: false },
  ]);

  const router = useRouter();

  // Move constants to a separate file (e.g., constants.js)
  // specialtyCategories, saudiCities should be moved

  // Simplified form validation without debugging
  const validateStep = (step) => {
    let isValid = true;
    let newErrors = {};

    if (step === 0) {
      // Check all required fields in step 0
      const requiredFields = [
        { name: "firstName", label: "الاسم الأول" },
        { name: "middleName", label: "الاسم الأوسط" },
        { name: "lastName", label: "اسم العائلة" },
        { name: "city", label: "المدينة" },
        { name: "licenseNumber", label: "ر��م رخصة المحاماة" },
      ];

      requiredFields.forEach(({ name, label }) => {
        if (!formData[name] || formData[name].trim() === "") {
          newErrors[name] = `${label} مطلوب`;
          isValid = false;
        } else if (
          ["firstName", "middleName", "lastName"].includes(name) &&
          !isArabicText(formData[name])
        ) {
          newErrors[name] = "يجب إدخال النص باللغة العربية فقط";
          isValid = false;
        }
      });

      // Additional validation for license number
      if (formData.licenseNumber && !/^\d{6}$/.test(formData.licenseNumber)) {
        newErrors.licenseNumber = "يجب أن يتكون رقم الرخصة من 6 أرقام";
        isValid = false;
      }

      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "يجب الموافقة على الشروط والأحكام";
        isValid = false;
      }
    } else if (step === 1) {
      // Check all required fields in step 1
      const requiredFields = [
        { name: "officeName", label: "مكتب المحاماة" },
        { name: "email", label: "البريد الإلكتروني" },
        { name: "phone", label: "رقم الاتصال" },
        { name: "whatsapp", label: "رقم الواتساب" },
        { name: "password", label: "كلمة المرور" },
        { name: "confirmPassword", label: "تأكيد كلمة المرور" },
      ];

      requiredFields.forEach(({ name, label }) => {
        if (!formData[name] || formData[name].trim() === "") {
          newErrors[name] = `${label} مطلوب`;
          isValid = false;
        }
      });

      // Validate email format
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        newErrors.email = "البريد الإلكتروني غير صحيح";
        isValid = false;
      }

      // Validate phone numbers format
      if (formData.phone && !isValidSaudiPhone(formData.phone)) {
        newErrors.phone = "يجب أن يبدأ رقم الهاتف بـ 05 ويتكون من 10 أرقام";
        isValid = false;
      }

      if (formData.whatsapp && !isValidSaudiPhone(formData.whatsapp)) {
        newErrors.whatsapp =
          "يجب أن يبدأ رقم الواتساب بـ 05 ويتكون من 10 أرقام";
        isValid = false;
      }

      // Validate password
      if (formData.password && formData.password.length < 8) {
        newErrors.password = "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل";
        isValid = false;
      }

      // Validate password confirmation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "كلمة المرور غير متطابقة";
        isValid = false;
      }

      // Validate at least one specialization is selected
      if (!specialtySelections[0].value) {
        newErrors.specializations = "يجب اختيار تخصص رئيسي واحد على الأقل";
        isValid = false;
      }
    }

    // Update errors state with all new errors
    setErrors(newErrors);
    return isValid;
  };

  // Simplified handlers
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Update the calculateExperienceYears function to be more robust
  const calculateExperienceYears = (license) => {
    if (license && license.length >= 2) {
      const currentHijriYear = moment().iYear();
      const yearPrefix = parseInt(license.substring(0, 2));
      const lastTwoDigits = yearPrefix % 100;
      let experience = currentHijriYear - (1400 + lastTwoDigits);

      if (experience < 0) {
        experience += 100;
      }

      return experience.toString(); // Convert to string for display
    }
    return "";
  };

  // Update handleInputChange to remove console.log
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox separately
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    // Validate based on field type
    switch (name) {
      case "firstName":
      case "middleName":
      case "lastName":
      case "officeName":
        if (value === "" || isArabicText(value)) {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
        break;

      case "phone":
      case "whatsapp":
        if (value === "" || /^[0-9]{0,10}$/.test(value)) {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
        break;

      case "licenseNumber":
        if (/^\d{0,6}$/.test(value)) {
          const experienceYears = calculateExperienceYears(value);
          setFormData((prev) => ({
            ...prev,
            licenseNumber: value,
            experienceYears: experienceYears,
          }));
        }
        break;

      default:
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSpecialtyChange = (id, value) => {
    setSpecialtySelections((prev) =>
      prev.map((selection) =>
        selection.id === id ? { ...selection, value } : selection
      )
    );

    // Update specializations in formData
    const updatedSpecializations = specialtySelections
      .map((selection) => selection.value)
      .filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      specializations: updatedSpecializations,
    }));
  };

  // Move the loading state to the top level with other state declarations
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      // Remove the useState declaration and just use setIsLoading
      setIsLoading(true);

      // 2. تنظيف وتجهيز البيانات
      const specializations = specialtySelections
        .filter((selection) => selection.value)
        .map((selection) => selection.value);

      // 3. حذف البيانات غير الضرورية
      const { confirmPassword, acceptTerms, ...cleanedFormData } = formData;

      // 4. تنسيق البيانات النهائية
      const finalFormData = {
        ...cleanedFormData,
        specializations,
        // 5. إضافة بيانات إضافية مفيدة
        registrationDate: new Date().toISOString(),
        fullName:
          `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
        // 6. تنظيف أرقام الهواتف
        phone: formData.phone.replace(/\s/g, ""),
        whatsapp: formData.whatsapp.replace(/\s/g, ""),
      };

      // 7. التحقق النهائي من البيانات
      if (!validateFinalData(finalFormData)) {
        throw new Error("البيانات غير صالحة");
      }

      // 8. إرسال البيانات
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        throw new Error("فشل في عملية التسجيل");
      }

      // 9. معالجة الاستجابة بنجاح
      const result = await response.json();
      toast.success("تم التسجيل بنجاح!");

      // 10. التوجيه للصفحة التالية
      router.push("/dashboard");
    } catch (error) {
      // 11. معالجة الأخطاء
      toast.error(error.message || "حدث خطأ أثناء التسجيل");
      console.error("خطأ في التسجيل:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // دالة للتحقق النهائي من البيانات
  const validateFinalData = (data) => {
    // التحقق من صحة البريد الإلك��روني
    if (!isValidEmail(data.email)) {
      toast.error("البريد الإلكتروني غير صالح");
      return false;
    }

    // التحقق من صحة أرقام الهواتف
    if (!isValidSaudiPhone(data.phone) || !isValidSaudiPhone(data.whatsapp)) {
      toast.error("أرقام الهواتف غير صالحة");
      return false;
    }

    // التحقق من وجود تخصص واحد على الأقل
    if (data.specializations.length === 0) {
      toast.error("ي��ب اختيار تخصص واحد على الأقل");
      return false;
    }

    return true;
  };

  const addSpecialtySelection = () => {
    setSpecialtySelections((prev) => [
      ...prev,
      { id: prev.length + 1, value: "", isRequired: false },
    ]);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <p className="text-right font-bold text-2xl">
              أدخل معلومات ترخيص نقابة المحاماة الخاصة بك
            </p>
            <p className="text-right">
              بعد أن تؤكد منصة نصيي حالة ترخيصك، سيتم تضمين ملفك الشخصي في
              دليلنا ونتائج البحث
            </p>
            <p className="text-right">
              <span className="text-red-500">ملاحظه:</span>إذا كان تسجيل ترخيصك
              باسم مختلف عن الاسم الذي تستخدمه حاليًا (مثل اسم العائلة قبل
              الزواج)، قم بإدخال ذلك الاسم في هذا النموذج{" "}
            </p>
            <h2 className="text-2xl py-2 font-semibold text-right">
              المعلومات الشخصية
            </h2>

            <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Row */}
              {/* First Name - Right */}
              <div className="order-1 relative ">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  الاسم الأول <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Middle Name - Left */}
              <div className="order-2 relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  الاسم الأوسط <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${errors.middleName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.middleName && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.middleName}
                  </p>
                )}
              </div>

              {/* Second Row */}
              {/* Last Name - Right */}
              <div className="order-3 relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  اسم العائلة <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* City - Left */}
              <div className="order-4 relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  المدينة <span className="text-red-500">*مطلوب</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${errors.city ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">اختر المدينة</option>
                  {saudiCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.city}
                  </p>
                )}
              </div>

              {/* License Number */}
              <div className="order-5 relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  رقم رخصة المحاماة <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  maxLength="6"
                  pattern="[0-9]*"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${errors.licenseNumber ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.licenseNumber && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.licenseNumber}
                  </p>
                )}
              </div>

              {/* Experience Years - Auto-calculated */}
              <div className="order-6 relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  سنوات الخبرة <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="text"
                  name="experienceYears"
                  value={formData.experienceYears || ""}
                  readOnly
                  dir="rtl"
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 cursor-default focus:outline-none"
                  placeholder="سيتم الحساب تلقائياً"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <label className="text-right">
                أوافق على جميع الشروط والأحكام
              </label>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="h-4 w-4"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-right">الملف الشخ��ي</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Office Name */}
              <div className="relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  مكتب المحاماة <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="text"
                  name="officeName"
                  value={formData.officeName}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${errors.officeName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.officeName && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.officeName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  البريد الإلكتروني <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  رقم الاتصال <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div className="relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  رقم الواتساب <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${errors.whatsapp ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.whatsapp && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.whatsapp}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  كلمة المرور <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${errors.password ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  تأكيد كلمة المرور <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Specializations error message */}
            {errors.specializations && (
              <p className="text-red-500 text-sm mt-1 text-right">
                {errors.specializations}
              </p>
            )}

            {/* Specializations Section */}
            <div dir="rtl" className="space-y-4">
              <label className="block text-right mb-2 text-lg">
                التخصصات حسب الاولوية:
              </label>

              <div className="grid grid-cols-2 gap-4">
                {specialtySelections.map((selection, index) => {
                  const row = Math.floor(index / 2);
                  const isRight = index % 2 === 0;
                  const order = row * 2 + (isRight ? 0 : 1);

                  const toArabicNumerals = (num) => {
                    const arabicNumerals = [
                      "٠",
                      "١",
                      "٢",
                      "٣",
                      "٤",
                      "٥",
                      "٦",
                      "٧",
                      "٨",
                      "٩",
                    ];
                    return (num + 1)
                      .toString()
                      .split("")
                      .map((digit) => arabicNumerals[digit])
                      .join("");
                  };

                  return (
                    <div
                      key={selection.id}
                      className="flex flex-col gap-2"
                      style={{ order: order }}
                    >
                      <p className="text-gray-600 text-right">
                        {`أولوية ${toArabicNumerals(index)}`}
                      </p>
                      <select
                        value={selection.value}
                        onChange={(e) =>
                          handleSpecialtyChange(selection.id, e.target.value)
                        }
                        dir="rtl"
                        className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required={selection.isRequired}
                      >
                        <option value="">
                          {selection.isRequired
                            ? "اختر التخصص الرئيسي"
                            : "اختر التخصص"}
                        </option>
                        {Object.keys(specialtyCategories).map((category) => (
                          <option
                            key={category}
                            value={category}
                            disabled={specialtySelections.some(
                              (s) => s.value === category
                            )}
                          >
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={addSpecialtySelection}
                className="w-full p-3 border border-dashed border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 text-right"
              >
                + إضافة تخصص آخر
              </button>
            </div>

            {/* English Speaking Radio Buttons */}
            <div className="mt-4">
              <label className="block text-right mb-3">
                هل تتحدث الإنجليزية؟
              </label>
              <div className="flex justify-end gap-6">
                <div className="flex items-center gap-2">
                  <label className="text-right">لا</label>
                  <input
                    type="radio"
                    name="speaksEnglish"
                    value="false"
                    checked={!formData.speaksEnglish}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        speaksEnglish: false,
                      }))
                    }
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-right">نعم</label>
                  <input
                    type="radio"
                    name="speaksEnglish"
                    value="true"
                    checked={formData.speaksEnglish}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        speaksEnglish: true,
                      }))
                    }
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6" dir="rtl">
            <h2 className="text-2xl font-semibold text-right mb-6">
              <FaCheckCircle className="inline ml-2 text-green-500" />
              مراجعة وتأكيد المعلومات
            </h2>

            {/* Personal Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="h-px flex-grow bg-gray-200"></div>
                <h3 className="text-xl font-medium px-4 flex items-center">
                  <FaUser className="ml-2 text-[#E57733]" />
                  المعلومات الشخصية
                </h3>
                <div className="h-px flex-grow bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">الاسم الكامل:</p>
                  <p className="font-medium">{`${formData.firstName} ${formData.middleName} ${formData.lastName}`}</p>
                </div>
                <div>
                  <p className="text-gray-600">المدينة:</p>
                  <p className="font-medium">{formData.city}</p>
                </div>
                <div>
                  <p className="text-gray-600">رقم رخصة المحاماة:</p>
                  <p className="font-medium">{formData.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">سنوات الخبرة:</p>
                  <p className="font-medium">{formData.experienceYears}</p>
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="h-px flex-grow bg-gray-200"></div>
                <h3 className="text-xl font-medium px-4 flex items-center">
                  <FaBriefcase className="ml-2 text-[#E57733]" />
                  معلومات المكتب والتواصل
                </h3>
                <div className="h-px flex-grow bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">اسم المكتب:</p>
                  <p className="font-medium">{formData.officeName}</p>
                </div>
                <div>
                  <p className="text-gray-600">البريد الإلكتروني:</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">رقم الهاتف:</p>
                  <p className="font-medium">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">رقم الواتساب:</p>
                  <p className="font-medium">{formData.whatsapp}</p>
                </div>
              </div>
            </div>

            {/* Specializations Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="h-px flex-grow bg-gray-200"></div>
                <h3 className="text-xl font-medium px-4 flex items-center">
                  <FaCheckCircle className="ml-2 text-[#E57733]" />
                  التخصصات والمهارات
                </h3>
                <div className="h-px flex-grow bg-gray-200"></div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-2">التخصصات:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="bg-[#FF883E17] text-[#E57733] px-3 py-1 rounded-full text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">يتحدث الإنجليزية:</p>
                  <p className="font-medium">
                    {formData.speaksEnglish ? "نعم" : "لا"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600">
                <span className="font-bold">ملاحظة:</span> يرجى التأكد من صحة
                جميع المعلومات قبل التأكيد النهائي
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    // This code will only run in the browser
    const storedData = localStorage.getItem("yourKey");
    // Do something with storedData
  }, []); // Empty dependency array means this runs once after the component mounts

  return (
    <div className="max-w-3xl px-4 mx-auto my-8 p-4 sm:p-8 bg-white rounded-lg shadow-md md:mt-20 mt-32">
      <div className="flex flex-col sm:flex-row-reverse justify-between mb-8 bg-white shadow-md">
        {[
          {
            label: "المعلومات الشخصية",
            icon: <FaUser className="mr-2" />,
          },
          {
            label: "الملف الشخصي",
            icon: <FaBriefcase className="mr-2" />,
          },
          {
            label: "التأكيد",
            icon: <FaCheckCircle className="mr-2" />,
          },
        ].map((step, index) => (
          <div
            key={index}
            className={`flex-1 p-2 sm:p-4 ${
              activeStep === index
                ? "bg-[#FF883E17]"
                : activeStep > index
                  ? "bg-white"
                  : "bg-white"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm sm:text-base font-semibold text-black">
                {step.label}
              </span>
              <div
                className={
                  activeStep === 2 && index === 2
                    ? "text-green-500"
                    : activeStep === index
                      ? "text-[#FF883E]"
                      : "text-black"
                }
              >
                {step.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderStepContent(activeStep)}

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-8">
        <button
          disabled={activeStep === 0}
          onClick={handleBack}
          className={`px-6 py-3 rounded-md w-full sm:w-auto ${
            activeStep === 0
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          السابق
        </button>
        <button
          onClick={activeStep === 2 ? handleSubmit : handleNext}
          className="px-6 py-3 bg-[#E57733E0] text-white rounded-md hover:bg-orange-500 w-full sm:w-auto"
        >
          {activeStep === 2 ? "تأكيد" : "التالي"}
        </button>
      </div>
    </div>
  );
}

export default LawyersRegister;
