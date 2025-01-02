"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaBriefcase, FaCheckCircle } from "react-icons/fa";
import moment from "moment-hijri";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

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
  "القانون الإداري": ["عقود إدارية", "قرارات إدارية"],
  "الملكية الفكرية": ["علامات تجارية", "براءات اختراع", "حقوق مؤلف"],
  التحكيم: ["تحكيم تجاري", "تحكيم دولي"],
  "القانون البنكي": ["عمليات بنكية", "تمويل"],
  "القانون العقاري": ["عقود إيجار", "ملكية عقارية", "نزاعات عقارية"],
};

// Add these validation helper functions at the top of the file
const isArabicText = (text) => /^[\u0600-\u06FF\s]+$/.test(text);
const isValidSaudiPhone = (phone) => /^5\d{8}$/.test(phone);
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
    password: "",
    confirmPassword: "",
    specializations: [],
    speaksEnglish: false,
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

  // Add this state for categories
  const [categories, setCategories] = useState([]);

  // Add useEffect to fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://theoretical-agatha-ahmedelsamman-4d2b79ac.koyeb.app/main-categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("حدث خطأ في تحميل التخصصات");
      }
    };

    fetchCategories();
  }, []);

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
        { name: "personalId", label: "الرقم الشخصي" },
        { name: "licenseNumber", label: "رقم رخصة المحاماة" },
        { name: "email", label: "البريد الإلكتروني" },
        { name: "password", label: "كلمة المرور" },
        { name: "confirmPassword", label: "تأكيد كلمة المرور" },
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

      // Additional validation for password confirmation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "كلمة المرور غير متطابقة";
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
        newErrors.phone = "يجب أن يبدأ رقم الهاتف بـ +966 ويتكون من 13 رقمًا";
        isValid = false;
      }

      if (formData.whatsapp && !isValidSaudiPhone(formData.whatsapp)) {
        newErrors.whatsapp =
          "يجب أن يبدأ رقم الواتساب بـ +966 ويتكون من 13 رقمًا";
        isValid = false;
      }

      // Validate password
      if (formData.password && formData.password.length < 8) {
        newErrors.password = "يجب أن يتكون كلمة المرور من 8 أحرف على الأقل";
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

  // Update handleNext to skip OTP and go directly to step 1
  const handleNext = () => {
    if (activeStep === 0) {
      if (validateStep(activeStep)) {
        // Remove OTP check and directly move to next step
        setActiveStep((prev) => prev + 1);
      } else {
        toast.error("يرجى تصحيح الأخطاء قبل المتابعة."); // "Please correct the errors before proceeding."
      }
    } else if (activeStep === 1) {
      handleSubmit(); // Call handleSubmit if on step 1
    } else if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };
  // fassffsdfsffs
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
      if (experience == 0) {
        experience = 1;
      }
      console.log("Experience Years:", experience); // Log the experience years
      return experience; // Convert to string for display
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
        if (value === "" || /^[+\d]{0,13}$/.test(value)) {
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
          console.log("License Number:", value); // Log the license number
        }
        break;

      case "personalId":
        // Allow any input but validate on blur or when the input is complete
        setFormData((prev) => ({ ...prev, personalId: value }));

        // Log the personalId value
        console.log("Personal ID:", value); // Log the value of personalId

        // Validate only if the input is complete (9 digits)
        if (value.length === 9) {
          if (/^5\d{8}$/.test(value)) {
            setErrors((prev) => ({ ...prev, personalId: "" })); // Clear error if valid
          } else {
            setErrors((prev) => ({
              ...prev,
              personalId: "رقم الهوية يجب أن يتكون من 9 أرقام ويبدأ بـ 5",
            })); // Set error if invalid
          }
        } else {
          // Clear error if the input is not yet complete
          setErrors((prev) => ({ ...prev, personalId: "" }));
        }
        break;

      default:
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Update handleSpecialtyChange function
  const handleSpecialtyChange = (id, value) => {
    // First, create the updated selections array
    const updatedSelections = specialtySelections.map((selection) =>
      selection.id === id ? { ...selection, value } : selection
    );

    // Update specialtySelections state
    setSpecialtySelections(updatedSelections);

    // Immediately calculate the new specializations array using the updated selections
    const updatedSpecializations = updatedSelections
      .map((selection) => selection.value)
      .filter(Boolean); // This removes any empty values

    // Update formData with the new specializations
    setFormData((prev) => ({
      ...prev,
      specializations: updatedSpecializations,
    }));

    // Log the updated specializations immediately
    console.log("Selected Specializations:", updatedSpecializations);
  };

  // Move the loading state to the top level with other state declarations
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Update handleSubmit to remove OTP-related logic
  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Log both phone numbers before sending
      console.log("Contact Number being sent:", `+966${formData.personalId}`);
      console.log("WhatsApp Number being sent:", `+966${formData.whatsapp}`);
      console.log("phone Number being sent:", `+966${formData.phone}`);

      console.log("Specializations being sent:", formData.specializations);

      const response = await axios.post(
        "https://theoretical-agatha-ahmedelsamman-4d2b79ac.koyeb.app/users/register",
        {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: `+966${formData.personalId}`, // Contact number
          whatsappNumber: `+966${formData.whatsapp}`, // WhatsApp number
          personalNumber: `+966${formData.phone}`, // WhatsApp number
          password: formData.password,
          role: "lawyer",
          licenseNumber: formData.licenseNumber,
          experienceYears: formData.experienceYears,
          city: formData.city,
          mainCategories: formData.specializations,
        }
      );

      if (response.status === 201) {
        console.log("Success");
        toast.success("تم التسجيل بنجاح!");
      } else {
        throw new Error("فشل في عملية التسجيل");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "حدث خطأ أثناء التسجيل";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // دالة للتحقق النهائي من البيانات
  const validateFinalData = (data) => {
    // التحقق من صحة البريد الإلكتروني
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
      toast.error("يجب اختيار تخصص واحد على الأقل");
      return false;
    }

    return true;
  };

  const addSpecialtySelection = () => {
    // Check if we've reached the maximum number of specialties (7)
    if (specialtySelections.length >= 7) {
      toast.error("لا يمكن إضافة أكثر من 7 تخصصات"); // "Cannot add more than 7 specialties"
      return;
    }

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
              بعد أن تؤكد منصة نصيي حالة ترخيصك، ستم تضمين ملفك الشخصي في دليلنا
              ونتائج البحث
            </p>
            <p className="text-right">
              <span className="text-red-500"> لاحظه:</span>إذا كان تسجيل ترخيصك
              باسم مختلف عن الاسم الذي تستخدمه حا يًا (مثل اسم العائلة قبل
              الزواج)، ق بإدخال ذلك الاسم في هذا النموذج{" "}
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

              {/* Email - Moved to be after First, Middle, and Last Name */}
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

              {/* Personal ID */}
              <div className="order-7 relative flex flex-col">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  رقم شخصي <span className="text-red-500">*مطلوب</span>
                </label>
                <span className="absolute left-3 top-4  bg-white px-1 text-sm text-gray-600 pointer-events-none">
                  966+
                </span>
                <input
                  type="text"
                  name="personalId"
                  value={formData.personalId}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  maxLength="9" // Limit to 9 digits
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4 pl-12
                    ${errors.personalId ? "border-red-500" : "border-gray-300"}`}
                  placeholder="5XXXXXXXX" // Indicate that only digits should be entered
                  style={{ paddingLeft: "2.5rem" }} // Adjust padding to ensure text is not hidden behind the span
                  autoComplete="off" // Prevent browser autocomplete
                />
                {errors.personalId && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.personalId}
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
            <h2 className="text-2xl font-semibold text-right">الملف الشخصي</h2>

            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              {/* Office Name */}
              <div className="relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  مكتب المحاماة
                </label>
                <input
                  type="text"
                  name="officeName"
                  value={formData.officeName}
                  onChange={handleInputChange}
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

              {/* Phone Number */}
              <div className="relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  رقم الاتصال
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  maxLength={9}
                  onChange={handleInputChange}
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
                  رقم الواتساب
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  maxLength={9}
                  value={formData.whatsapp}
                  onChange={handleInputChange}
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
                التخصصات حسب الأولوية:
              </label>

              <div className="grid grid-cols-2 gap-4">
                {specialtySelections.map((selection, index) => {
                  const row = Math.floor(index / 2);
                  const isRight = index % 2 === 0;
                  const order = row * 2 + (isRight ? 0 : 1);

                  const toArabicNumerals = (num) => {
                    const arabicNumerals = [
                      "",
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
                        {categories.map((category) => (
                          <option
                            key={category._id}
                            value={category._id}
                            disabled={specialtySelections.some(
                              (s) => s.value === category._id
                            )}
                          >
                            {category.name}
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
                className={`w-full p-3 border border-dashed border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 text-right ${
                  specialtySelections.length >= 7
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
                disabled={specialtySelections.length >= 7}
              >
                {specialtySelections.length >= 7
                  ? "تم الوصول إلى الحد الأقصى للتخصصات"
                  : "+ إضافة تخصص آخر"}
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
          onClick={activeStep === 1 ? handleSubmit : handleNext}
          className="px-6 py-3 bg-[#E57733E0] text-white rounded-md hover:bg-orange-500 w-full sm:w-auto"
        >
          {activeStep === 1 ? "التأكيد" : activeStep === 2 ? "تأكيد" : "التالي"}
        </button>
      </div>
      {submitError && (
        <p className="text-red-500 text-sm mt-2 text-center">{submitError}</p>
      )}
    </div>
  );
}

export default LawyersRegister;
