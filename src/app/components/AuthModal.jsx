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
  FORGOT_PASSWORD: 4,
  VERIFY_OTP: 5,
  NEW_PASSWORD: 6,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      
      const response = await axios.post(`${API_BASE_URL}/password-recovery/send-otp`, {
        email: forgotPasswordEmail
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === "success") {
        setCurrentStep(steps.VERIFY_OTP);
      } else {
        setError(response.data.message || "حدث خطأ ما. يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || "حدث خطأ في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = () => {
    if (forgotPasswordOtp.some(digit => !digit)) {
      setError("الرجاء إدخال رمز التحقق كاملاً");
      return;
    }
    setError("");
    setCurrentStep(steps.NEW_PASSWORD);
  };

  const handlePasswordReset = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (newPassword !== confirmPassword) {
        setError("كلمات المرور غير متطابقة");
        return;
      }

      const otp = forgotPasswordOtp.join('');
      
      const response = await axios.post(`${API_BASE_URL}/password-recovery/verify-otp`, {
        email: forgotPasswordEmail,
        otp: parseInt(otp),
        password: newPassword,
        password_confirmation: confirmPassword
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === "success") {
        // Reset all states
        setForgotPasswordEmail("");
        setForgotPasswordOtp(["", "", "", ""]);
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        // Go back to login
        setCurrentStep(steps.LOGIN);
      } else {
        setError(response.data.message || "حدث خطأ ما. يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.response?.data?.message || "حدث خطأ في تغيير كلمة المرور. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...forgotPasswordOtp];
    newOtp[index] = value;
    setForgotPasswordOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
      if (nextInput) nextInput.focus();
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

  const handleClose = () => {
    setCurrentStep(steps.INITIAL);
    setForgotPasswordEmail("");
    setForgotPasswordOtp(["", "", "", ""]);
    setError("");
    onClose();
  };

  return (
    <>
      {/* Main Auth Modal */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="mx-auto max-w-2xl md:min-w-[500px] rounded-lg bg-white p-6 relative">
            <button
              onClick={handleClose}
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
                  <>
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
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(steps.FORGOT_PASSWORD)}
                        className="text-[#3069B4] text-sm hover:underline"
                      >
                        هل نسيت كلمة المرور؟
                      </button>
                    </div>
                  </>
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

            {currentStep === steps.FORGOT_PASSWORD && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-right">
                <h2 className="text-xl font-bold text-[#FF883EE0]">
                  استعادة كلمة المرور
                </h2>
                <p className="text-sm text-gray-600">
                  أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق
                </p>

                <input
                  dir="rtl"
                  type="email"
                  name="email"
                  placeholder="البريد الإلكتروني"
                  required
                  className="w-full p-2 border rounded-md"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-right">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#3069B4] text-white rounded-lg py-2 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "...جاري الارسال"  : "إرسال رمز التحقق"}
                </button>
              </form>
            )}

            {currentStep === steps.VERIFY_OTP && (
              <div className="space-y-6 text-right">
                <div>
                  <h2 className="text-xl font-bold text-[#FF883EE0] mb-2">
                    أدخل رمز التحقق
                  </h2>
                  <p className="text-sm text-gray-600">
                    تم إرسال رمز التحقق إلى بريدك الإلكتروني
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="flex justify-center gap-3 mb-2 dir-rtl">
                      {[0, 1, 2, 3].map((index) => (
                        <input
                          key={index}
                          type="text"
                          name={`otp-${index}`}
                          maxLength={1}
                          className="w-14 h-14 text-center border-2 border-gray-300 rounded-lg text-xl font-semibold focus:border-[#3069B4] focus:ring-1 focus:ring-[#3069B4] transition-colors"
                          value={forgotPasswordOtp[index]}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                              const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
                              if (prevInput) prevInput.focus();
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-right text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleOtpSubmit}
                    disabled={forgotPasswordOtp.some(digit => !digit)}
                    className="w-full bg-[#3069B4] text-white rounded-lg py-3 text-lg font-medium disabled:opacity-50 hover:bg-[#2859a0] transition-colors mt-2"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}

            {currentStep === steps.NEW_PASSWORD && (
              <div className="space-y-6 text-right">
                <div>
                  <h2 className="text-xl font-bold text-[#FF883EE0] mb-2">
                    كلمة المرور الجديدة
                  </h2>
                  <p className="text-sm text-gray-600">
                    الرجاء إدخال كلمة المرور الجديدة
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <input
                      dir="rtl"
                      type="password"
                      placeholder="كلمة المرور الجديدة"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3069B4] focus:ring-1 focus:ring-[#3069B4] transition-colors"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <input
                      dir="rtl"
                      type="password"
                      placeholder="تأكيد كلمة المرور"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3069B4] focus:ring-1 focus:ring-[#3069B4] transition-colors"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-right text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handlePasswordReset}
                    disabled={isLoading || !newPassword || !confirmPassword}
                    className="w-full bg-[#3069B4] text-white rounded-lg py-3 text-lg font-medium disabled:opacity-50 hover:bg-[#2859a0] transition-colors"
                  >
                    {isLoading ? "...جاري التغيير" : "تغيير كلمة المرور"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
