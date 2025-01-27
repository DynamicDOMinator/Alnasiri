"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaBriefcase, FaCheckCircle } from "react-icons/fa";
import moment from "moment-hijri";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

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

// Add this validators object at the top of your file, after imports
const validators = {
  isArabicText: (text) => {
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    return arabicRegex.test(text);
  },
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  isValidLicenseNumber: (license) => {
    return /^\d{6}$/.test(license);
  },
};

function LawyersRegister() {
  // Add auth context
  const { register, isAuthenticated } = useAuth();

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

  // Consolidate all state into a single object
  const [state, setState] = useState({
    formData: initialFormData,
    errors: {},
    activeStep: isAuthenticated ? 1 : 0, // Set initial step based on authentication
    isLoading: false,
    submitError: "",
    specialtySelections: [
      { id: 1, value: "", isRequired: true },
      { id: 2, value: "", isRequired: false },
      { id: 3, value: "", isRequired: false },
      { id: 4, value: "", isRequired: false },
    ],
    categories: [],
    registrationSuccessful: false,
    errorMessage: "",
  });

  // Add useEffect to handle authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      updateState({ activeStep: 1 });
    }
  }, [isAuthenticated]);

  // Create helper function to update state
  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Simplified handleInputChange
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      updateState({ formData: { ...state.formData, [name]: checked } });
      return;
    }

    // Special handling for Arabic-only fields (excluding email)
    if (["firstName", "middleName", "lastName"].includes(name)) {
      if (value && !validators.isArabicText(value)) {
        toast.error("يرجى الكتابة باللغة العربية فقط");
        return;
      }
    }

    // Email field should update directly without validation during typing
    if (name === "email") {
      updateState({ formData: { ...state.formData, [name]: value } });
      return;
    }

    // Validate input based on field type
    const isValid = validateFieldInput(name, value);
    if (!isValid) {
      toast.error("إدخال غير صالح");
      return;
    }

    // Special handling for license number
    if (name === "licenseNumber") {
      const experienceYears = calculateExperienceYears(value);
      updateState({
        formData: {
          ...state.formData,
          licenseNumber: value,
          experienceYears,
        },
      });
      return;
    }

    updateState({ formData: { ...state.formData, [name]: value } });
  };

  // Helper function to update form data
  const updateFormData = (updates) => {
    updateState({
      formData: { ...state.formData, ...updates },
    });
  };

  // Simplified validation function
  const validateFieldInput = (name, value) => {
    const validationRules = {
      firstName: () => {
        if (!value) return true;
        return validators.isArabicText(value);
      },
      middleName: () => {
        if (!value) return true;
        return validators.isArabicText(value);
      },
      lastName: () => {
        if (!value) return true;
        return validators.isArabicText(value);
      },
      phone: () => /^[+\d]{0,13}$/.test(value),
      licenseNumber: () => /^\d{0,6}$/.test(value),
      // Remove email from validation rules during typing
      // Email will be validated during form submission instead
    };

    return !validationRules[name] || validationRules[name]();
  };

  const router = useRouter();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(
          `${API_BASE_URL}/speciality/get-all-speciality`
        );
        setCategories(response.data);
      } catch (error) {
        toast.error("حدث خطأ في تحميل التخصصات");
      }
    };

    fetchCategories();
  }, []);

  const validateStep = (step) => {
    let isValid = true;
    let newErrors = {};

    if (step === 0) {
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
        if (!state.formData[name] || state.formData[name].trim() === "") {
          newErrors[name] = `${label} مطلوب`;
          isValid = false;
        } else if (
          ["firstName", "middleName", "lastName"].includes(name) &&
          !validators.isArabicText(state.formData[name])
        ) {
          newErrors[name] = "يجب إدخال النص باللغة العربية فقط";
          isValid = false;
        }
      });

      // Additional validation for license number
      if (
        state.formData.licenseNumber &&
        !validators.isValidLicenseNumber(state.formData.licenseNumber)
      ) {
        newErrors.licenseNumber = "يجب أن يتكون رقم الرخصة من 6 أرقام";
        isValid = false;
      }

      if (!state.formData.acceptTerms) {
        newErrors.acceptTerms = "يجب الموافقة على الشروط والأحكام";
        isValid = false;
      }

      // Additional validation for password confirmation
      if (state.formData.password !== state.formData.confirmPassword) {
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
        if (!state.formData[name] || state.formData[name].trim() === "") {
          newErrors[name] = `${label} مطلوب`;
          isValid = false;
        }
      });

      // Validate email format
      if (
        state.formData.email &&
        !validators.isValidEmail(state.formData.email)
      ) {
        newErrors.email = "البريد الإلكتروني غير صحيح";
        isValid = false;
      }

      // Validate password
      if (state.formData.password && state.formData.password.length < 8) {
        newErrors.password = "يجب أن يتكون كلمة المرور من 8 أحرف على الأقل";
        isValid = false;
      }

      // Validate password confirmation
      if (state.formData.password !== state.formData.confirmPassword) {
        newErrors.confirmPassword = "كلمة المرور غير متطابقة";
        isValid = false;
      }

      // Validate at least one specialization is selected
      if (!state.specialtySelections[0].value) {
        newErrors.specializations = "يجب اختيار تخصص رئيسي واحد على الأقل";
        isValid = false;
      }
    }

    // Update errors state with all new errors
    updateState({ errors: newErrors });
    return isValid;
  };

  // Update handleNext to include final validation
  const handleNext = async () => {
    if (state.activeStep === 0) {
      if (validateStep(state.activeStep)) {
        try {
          setState((prev) => ({ ...prev, isLoading: true }));

          const fullName =
            `${state.formData.firstName} ${state.formData.middleName} ${state.formData.lastName}`.trim();
          const phoneNumber = state.formData.personalId.replace(/\D/g, "");
          const formattedPhone = `+966${phoneNumber.slice(-9)}`;

          const registerData = {
            name: fullName,
            email: state.formData.email,
            city: state.formData.city,
            password: state.formData.password,
            phone: formattedPhone,
            experience: calculateExperienceYears(state.formData.licenseNumber),
            license_number: state.formData.licenseNumber,
          };

          if (!validateFinalData(registerData)) {
            setState((prev) => ({ ...prev, isLoading: false }));
            return;
          }

          const result = await register(registerData, "lawyer");

          if (result.data && result.data.token) {
            setState((prev) => ({
              ...prev,
              activeStep: 1,
              isLoading: false,
              registrationSuccessful: true,
            }));
            toast.success("تم التسجيل بنجاح!");
          } else {
            throw new Error("Registration response missing token");
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "حدث خطأ أثناء التسجيل";
          toast.error(errorMessage);
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } else {
        toast.error("يرجى تصحيح الأخطاء قبل المتابعة.");
      }
    } else if (state.activeStep === 1) {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));

        // Check if running in the browser before accessing localStorage
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }
        }

        // Format specialties array from specialtySelections
        const specialtiesArray = state.specialtySelections
          .map((selection) => selection.value)
          .filter((value) => value !== "");

        const officeData = {
          bio: "",
          profile_image: "",
          google_map: "",
          law_office: state.formData.officeName,
          call_number: state.formData.phone,
          whatsapp_number: state.formData.whatsapp,
          specialties: specialtiesArray,
          speaking_english: state.formData.speaksEnglish,
        };
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API_BASE_URL}/lawyer/create-lawyer-office`,
          officeData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          router.push("/Lawyer-dashboard");
        }

        setState((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        toast.error(
          error.response?.data?.message || "حدث خطأ أثناء إنشاء الملف الشخصي"
        );
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }
  };

  // fassffsdfsffs
  const handleBack = () => updateState({ activeStep: state.activeStep - 1 });

  // Update calculateExperienceYears to return a number
  const calculateExperienceYears = (license) => {
    if (license && license.length >= 2) {
      const currentHijriYear = moment().iYear();
      const yearPrefix = parseInt(license.substring(0, 2));
      const lastTwoDigits = yearPrefix % 100;
      let experience = currentHijriYear - (1400 + lastTwoDigits);

      if (experience < 0) {
        experience += 100;
      }
      if (experience === 0) {
        experience = 1;
      }
      return experience; // Return as number
    }
    return 0; // Return 0 as default
  };

  // Update handleSpecialtyChange function to store specialty IDs instead of names
  const handleSpecialtyChange = (selectionId, value) => {
    setState((prev) => {
      const updatedSelections = prev.specialtySelections.map((selection) =>
        selection.id === selectionId ? { ...selection, value } : selection
      );

      return {
        ...prev,
        specialtySelections: updatedSelections,
      };
    });
  };

  // Simplified handleSubmit
  const handleSubmit = async () => {
    try {
      // Combine the name parts into a single name
      const fullName = `${state.formData.firstName} ${state.formData.middleName} ${state.formData.lastName}`;

      const lawyerData = {
        name: fullName, // Combined name
        email: state.formData.email,
        city: state.formData.city,
        password: state.formData.password,
        phone: state.formData.personalId,
        experience: calculateExperienceYears(state.formData.licenseNumber),
        license_number: state.formData.licenseNumber,
      };

      await register(lawyerData, "lawyer");
      // Handle successful registration
    } catch (error) {
      updateState({
        errorMessage: error.response?.data?.message || "Failed to register",
      });
      toast.error(error.response?.data?.message || "Failed to register");
    }
  };

  // Update validateFinalData to handle both registration data and form data
  const validateFinalData = (data) => {
    // Check if email exists
    if (!data.email || !validators.isValidEmail(data.email)) {
      toast.error("البريد الإلكتروني غير صالح");
      return false;
    }

    // Remove phone number validation
    // Only check if specializations exist (for step 1)
    if (data.specializations && data.specializations.length === 0) {
      toast.error("يجب اختيار تخصص واحد على الأقل");
      return false;
    }

    return true;
  };

  const addSpecialtySelection = () => {
    // Check if we've reached the maximum number of specialties (7)
    if (state.specialtySelections.length >= 7) {
      toast.error("لا يمكن إضافة أكثر من 7 تخصصات"); // "Cannot add more than 7 specialties"
      return;
    }

    updateState({
      specialtySelections: [
        ...state.specialtySelections,
        {
          id: state.specialtySelections.length + 1,
          value: "",
          isRequired: false,
        },
      ],
    });
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

            <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              {/* First Row */}
              {/* First Name - Right */}
              <div className="order-1 relative ">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  الاسم الأول <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={state.formData.firstName}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${state.errors.firstName ? "border-red-500" : "border-gray-300"}`}
                />
                {state.errors.firstName && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {state.errors.firstName}
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
                  value={state.formData.middleName}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${state.errors.middleName ? "border-red-500" : "border-gray-300"}`}
                />
                {state.errors.middleName && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {state.errors.middleName}
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
                  value={state.formData.lastName}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${state.errors.lastName ? "border-red-500" : "border-gray-300"}`}
                />
                {state.errors.lastName && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {state.errors.lastName}
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
                  value={state.formData.email}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${state.errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {state.errors.email && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {state.errors.email}
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
                  value={state.formData.city}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${state.errors.city ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">اختر المدينة</option>
                  {saudiCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {state.errors.city && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {state.errors.city}
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
                  value={state.formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  maxLength="6"
                  pattern="[0-9]*"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${state.errors.licenseNumber ? "border-red-500" : "border-gray-300"}`}
                />
                {state.errors.licenseNumber && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {state.errors.licenseNumber}
                  </p>
                )}
              </div>

              {/* Experience Years - Hidden but still calculated */}
              {/* <div className="order-6 relative">
                <label className="absolute right-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                  سنوات الخبرة <span className="text-red-500">*مطلوب</span>
                </label>
                <input
                  type="text"
                  name="experienceYears"
                  value={state.formData.experienceYears || ""}
                  readOnly
                  dir="rtl"
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 cursor-default focus:outline-none"
                  placeholder="سيتم الحساب تلقائياً"
                />
              </div> */}

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
                  value={state.formData.personalId}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  maxLength="9" // Limit to 9 digits
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4 pl-12
                    ${state.errors.personalId ? "border-red-500" : "border-gray-300"}`}
                  placeholder="5XXXXXXXX" // Indicate that only digits should be entered
                  style={{ paddingLeft: "2.5rem" }} // Adjust padding to ensure text is not hidden behind the span
                  autoComplete="off" // Prevent browser autocomplete
                />
                {state.errors.personalId && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {state.errors.personalId}
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
                  value={state.formData.password}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${state.errors.password ? "border-red-500" : "border-gray-300"}`}
                />
                {state.errors.password && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {state.errors.password}
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
                  value={state.formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${state.errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                />
                {state.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {state.errors.confirmPassword}
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
                checked={state.formData.acceptTerms}
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
                  value={state.formData.officeName}
                  onChange={handleInputChange}
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${state.errors.officeName ? "border-red-500" : "border-gray-300"}`}
                />
                {state.errors.officeName && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {state.errors.officeName}
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
                  value={state.formData.phone}
                  maxLength={9}
                  onChange={handleInputChange}
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${state.errors.phone ? "border-red-500" : "border-gray-300"}`}
                />
                {state.errors.phone && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {state.errors.phone}
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
                  value={state.formData.whatsapp}
                  onChange={handleInputChange}
                  dir="rtl"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pt-4
                    ${state.errors.whatsapp ? "border-red-500" : "border-gray-300"}`}
                />
                {state.errors.whatsapp && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {state.errors.whatsapp}
                  </p>
                )}
              </div>
            </div>

            {/* Specializations error message */}
            {state.errors.specializations && (
              <p className="text-red-500 text-sm mt-1 text-right">
                {state.errors.specializations}
              </p>
            )}

            {/* Specializations Section */}
            <div dir="rtl" className="space-y-4">
              <label className="block text-right mb-2 text-lg">
                التخصصات حسب الأولوية:
              </label>

              <div className="grid grid-cols-2 gap-4">
                {state.specialtySelections.map((selection, index) => {
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
                      key={`specialty-${selection.id}`}
                      className="flex flex-col gap-2"
                      style={{ order: order }}
                    >
                      <p className="text-gray-600 text-right">
                        {`أولوية ${toArabicNumerals(index)}`}
                      </p>
                      <select
                        key={`select-${selection.id}`}
                        value={selection.value}
                        onChange={(e) => handleSpecialtyChange(selection.id, e.target.value)}
                        dir="rtl"
                        className={`w-full p-2 border rounded-md ${
                          selection.isRequired && !selection.value
                            ? "border-red-500"
                            : ""
                        }`}
                      >
                        <option value="">اختر التخصص</option>
                        {categories.map((category) => (
                          <option
                            key={`category-${category.id}-selection-${selection.id}`}
                            value={category.id}
                            disabled={state.specialtySelections.some(
                              (s) =>
                                s.value === String(category.id) &&
                                s.id !== selection.id
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
                  state.specialtySelections.length >= 7
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
                disabled={state.specialtySelections.length >= 7}
              >
                {state.specialtySelections.length >= 7
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
                    checked={!state.formData.speaksEnglish}
                    onChange={(e) =>
                      updateFormData({
                        speaksEnglish: false,
                      })
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
                    checked={state.formData.speaksEnglish}
                    onChange={(e) =>
                      updateFormData({
                        speaksEnglish: true,
                      })
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
              state.activeStep === index
                ? "bg-[#FF883E17]"
                : state.activeStep > index
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
                  state.activeStep === 2 && index === 2
                    ? "text-green-500"
                    : state.activeStep === index
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
      {renderStepContent(state.activeStep)}
      {/* Error Message Display */}
      {state.errorMessage && (
        <div className="fixed bottom-4 left-4 right-4 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg z-40">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="mr-3">
              <p className="text-sm text-red-700" dir="rtl">
                {state.errorMessage}
              </p>
            </div>
            <button
              onClick={() => updateState({ errorMessage: "" })}
              className="mr-auto text-red-500 hover:text-red-700"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* Loading spinner */}
      {state.isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#E57733E0] border-t-transparent"></div>
            <p className="mt-3 text-gray-700">جاري التحميل...</p>
          </div>
        </div>
      )}
      {/* Button section */}
      <div className="flex justify-end mt-8">
        <button
          onClick={state.activeStep === 0 ? handleSubmit : handleNext}
          disabled={state.isLoading}
          className={`px-6 py-3 bg-[#E57733E0] text-white rounded-md hover:bg-orange-500 w-full sm:w-auto ${
            state.isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {state.isLoading
            ? "جاري التحميل..."
            : state.activeStep === 0
              ? "التالي"
              : "تأكيد"}
        </button>
      </div>
      {state.submitError && (
        <p className="text-red-500 text-sm mt-2 text-center">
          {state.submitError}
        </p>
      )}
    </div>
  );
}

export default LawyersRegister;
