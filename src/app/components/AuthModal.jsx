"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

const steps = {
  INITIAL: 1,
  LOGIN: 2,
  REGISTER: 3,
  OTP: 4,
};

const OTP_API_URL = process.env.NEXT_PUBLIC_OTP_API_URL;
export default function AuthModal({ isOpen, onClose }) {
  const { loginUser: handleLogin, register, checkEmail } = useAuth();
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
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setCurrentStep(steps.INITIAL);
    setLoginMethod("email");
    setError("");
    setIsExistingUser(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      password: "",
      acceptTerms: false,
    });
  };

  const handleEmailCheck = async () => {
    try {
      if (!formData.email) {
        setError("الرجاء إدخال البريد الإلكتروني");
        return;
      }

      const emailExists = await checkEmail(formData.email);
      console.log("Email check result:", emailExists);

      setIsExistingUser(emailExists);
      setCurrentStep(emailExists ? steps.LOGIN : steps.REGISTER);
      setShowPasswordInput(emailExists);
      setIsLoginRequest(emailExists);
    } catch (error) {
      console.error("Email check error:", error);
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

  const handleOtpSubmit = async () => {
    if (otpCode.length !== 6) {
      setError("الرجاء إدخال رمز التحقق المكون من 6 أرقام");
      return;
    }

    try {
      const response = await axios.post(OTP_API_URL, {
        email: formData.email,
        otp: otpCode,
      });

      if (response.status === 200) {
        setCurrentStep(steps.REGISTER);
        setIsOtpModalOpen(false);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "حدث خطأ أثناء التحقق من الرمز"
      );
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Update OTP value
    const newOtp = otpCode.split("");
    newOtp[index] = value;
    setOtpCode(newOtp.join(""));

    // Move to next input if a digit was entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
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

        if (response) {
          onClose();
          resetForm();
        }
      } else if (currentStep === steps.REGISTER) {
        await handleRegister();
      }
    } catch (error) {
      console.error("Login error:", error);
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
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      if (typeof window === "undefined") {
        throw new Error("Cannot access localStorage on the server");
      }

      await register(userData, "user");
      setIsOtpModalOpen(true);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Failed to register");
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

  const renderOtpModal = () => {
    return (
      <Dialog
        open={isOtpModalOpen}
        onClose={() => {}}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold text-center mb-4">
              أدخل رمز التحقق
            </h2>
            <p className="text-center pb-3" dir="rtl">
              تم الارسال علي{" "}
              {formData.phone && (
                <span className="font-bold" dir="ltr">
                  +966 {formData.phone}
                </span>
              )}
            </p>
            <div className="flex justify-center gap-2 rtl">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otpCode[index] || ""}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ))}
            </div>
            <button
              onClick={handleOtpSubmit}
              className="w-full bg-orange-600 text-white rounded-md py-2 hover:bg-blue-600 mt-4"
            >
              تأكيد
            </button>
          </div>
        </div>
      </Dialog>
    );
  };
  return (
    <>
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

            {currentStep === steps.OTP && (
              <div className="space-y-4 text-right">
                <h2 className="text-xl font-bold text-[#FF883EE0]">
                  أدخل رمز التحقق
                </h2>
                <p className="text-center pb-3">
                  <span>
                    {formData.phone ? `+966${formData.phone}` : "رقم غير متوفر"}
                  </span>{" "}
                  تم الارسال علي
                </p>
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      value={otpCode[index] || ""}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      maxLength="1"
                      className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  ))}
                </div>
                <button
                  onClick={handleOtpSubmit}
                  className="w-full bg-orange-600 text-white rounded-md py-2 hover:bg-blue-600 mt-4"
                >
                  تأكيد
                </button>
              </div>
            )}
          </div>
        </div>
      </Dialog>
      {renderOtpModal()}
    </>
  );
}
