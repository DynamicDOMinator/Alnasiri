"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

const steps = {
  INITIAL: 1,
  LOGIN: 2,
  REGISTER: 3,
};

const OTP_API_URL = process.env.NEXT_PUBLIC_OTP_API_URL;
export default function AuthModal({ isOpen, onClose }) {
  const {
    loginUser: handleLogin,
    checkEmail,
    registerUser,
    registerLawyer,
  } = useAuth();
  const [currentStep, setCurrentStep] = useState(steps.INITIAL);
  const [loginMethod, setLoginMethod] = useState("email");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    acceptTerms: false,
  });
  const [error, setError] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const resetForm = useCallback(() => {
    if ([steps.INITIAL, steps.LOGIN, steps.REGISTER].includes(currentStep)) {
      setCurrentStep(steps.INITIAL);
      setLoginMethod("email");
      setError("");
      setIsExistingUser(false);
      setShowPasswordInput(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        acceptTerms: false,
      });
    }
  }, [currentStep]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleEmailCheck = async () => {
    try {
      if (!formData.email) {
        setError("الرجاء إدخال البريد الإلكتروني");
        return;
      }

      const emailExists = await checkEmail(formData.email);

      setIsExistingUser(emailExists);
      setCurrentStep(emailExists ? steps.LOGIN : steps.REGISTER);
      setShowPasswordInput(emailExists);
      setIsLoginRequest(emailExists);
    } catch (error) {
      setError("حدث خطأ أثناء التحقق من البريد الإلكتروني");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLoginRequest && currentStep === steps.LOGIN) {
        setAuthLoading(true);
        if (!formData.email || !formData.password) {
          setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
          return;
        }

        const credentials = {
          email: formData.email,
          password: formData.password,
        };

        const response = await handleLogin(credentials);

        if (response && typeof window !== "undefined") {
          onClose();
          resetForm();
        }
      } else if (currentStep === steps.REGISTER) {
        await handleRegister();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else if (error.response?.status === 422) {
        setError("يرجى التحقق من صحة البيانات المدخلة");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("حدث خطأ أثناء العملية");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setAuthLoading(true);
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      const registerResponse = await registerUser(userData);

      if (registerResponse) {
        onClose();
        return;
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to register");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLawyerRegister = async () => {
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        city: formData.city,
        experience: formData.experience,
        license_number: formData.license_number,
      };

      const registerResponse = await registerLawyer(userData);

      if (registerResponse?.success) {
        setCurrentStep(steps.OTP);
        return;
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to register");
    } finally {
      setAuthLoading(false);
    }
  };

  const LawyerRegistrationLink = () => (
    <p className="text-sm">
      هل أنت محامي؟
      <Link
        href="/Register-Lawyer"
        onClick={onClose}
        className="text-[#FF883EE0] hover:underline pr-2"
      >
        سجل من هنا
      </Link>
    </p>
  );

  return (
    <>
      {/* Main Auth Modal */}
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="mx-auto max-w-2xl md:min-w-[500px] rounded-lg bg-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-2 left-2 text-white bg-red-600 rounded-md hover:text-gray-200"
              aria-label="Close dialog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Main Auth Steps */}
            {currentStep === steps.INITIAL && (
              <div className="space-y-4 text-right">
                <h2 className="text-xl text-[#FF883EE0] font-bold">
                  تسجيل الدخول أو انشاء حساب
                </h2>
                <p>قم بدخال البريد الإلكتروني الخاص بك</p>

                <input
                  dir="rtl"
                  type="email"
                  name="email"
                  placeholder="البريد الإلكتروني"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formData.email}
                  onChange={handleInputChange}
                />

                <button
                  onClick={handleEmailCheck}
                  className="w-full bg-[#3069B4] text-white rounded-lg py-2"
                >
                  التالي
                </button>
              </div>
            )}

            {currentStep === steps.LOGIN && (
              <form onSubmit={handleSubmit} className="space-y-4 text-right">
                <h2 className="text-xl font-bold text-[#FF883EE0]">
                  تسجيل الدخول
                </h2>

                <input
                  dir="rtl"
                  type="email"
                  name="email"
                  placeholder="البريد الإلكتروني"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.email}
                  onChange={handleInputChange}
                />

                {showPasswordInput && (
                  <input
                    dir="rtl"
                    type="password"
                    name="password"
                    placeholder="كلمة المرور"
                    required
                    className="w-full p-2 border rounded-md"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                )}

                {/* Error message display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-right">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className={`w-full bg-[#3069B4] text-white rounded-lg py-2 relative ${
                    authLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {authLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      <span className="mr-2">جاري التحميل...</span>
                    </div>
                  ) : (
                    "تسجيل الدخول"
                  )}
                </button>

                <div className="text-center space-y-2">
                  <LawyerRegistrationLink />
                </div>
              </form>
            )}

            {currentStep === steps.REGISTER && (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 text-right max-w-2xl w-[350px] md:mix-w-[500px] mx-auto md:min-w-[500px] "
              >
                <h2 className="text-xl font-bold text-[#FF883EE0]">
                  إكمال بيانات الحساب
                </h2>

                <input
                  dir="rtl"
                  type="text"
                  name="name"
                  placeholder="الاسم"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.name}
                  onChange={handleInputChange}
                />

                <input
                  dir="rtl"
                  type="tel"
                  name="phone"
                  placeholder="رقم الجوال"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.phone}
                  onChange={handleInputChange}
                />

                <input
                  dir="rtl"
                  type="password"
                  name="password"
                  placeholder="كلمة المرور"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.password}
                  onChange={handleInputChange}
                />

                <div className="flex justify-end items-center gap-2">
                  <span className="text-sm">
                    أوافق لى شروط الاستخدام وسياسة الخصوصية
                  </span>
                  <input
                    type="checkbox"
                    required
                    checked={formData.acceptTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        acceptTerms: e.target.checked,
                      })
                    }
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#FF6624] text-white rounded-md py-2"
                >
                  التالي
                </button>

                <div className="text-center space-y-2">
                  <LawyerRegistrationLink />
                </div>
              </form>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
