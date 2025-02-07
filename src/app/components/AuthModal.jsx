"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

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
  const { loginUser, registerUser, registerLawyer } = useAuth();
  const router = useRouter();
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
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState(["", "", "", ""]);
  const [otpFormData, setOtpFormData] = useState({
    password: "",
    password_confirmation: "",
  });

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
    setError("");

    // Validate email is not empty
    if (!formData.email || formData.email.trim() === "") {
      setError("الرجاء إدخال البريد الإلكتروني");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/check-email/check-email`,
        {
          params: { email: formData.email },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // If we receive a 200 response with user data, it means the user exists
      if (response.data.email && response.data.user_type) {
        setIsExistingUser(true);
        setCurrentStep(steps.LOGIN);
        setShowPasswordInput(true);
        setIsLoginRequest(true);
      } else {
        setIsExistingUser(false);
        setCurrentStep(steps.REGISTER);
        setShowPasswordInput(false);
        setIsLoginRequest(false);
      }
    } catch (error) {
      if (
        error.response?.status === 404 &&
        error.response?.data?.message === "Email does not exist"
      ) {
        setIsExistingUser(false);
        setCurrentStep(steps.REGISTER);
        setShowPasswordInput(false);
        setIsLoginRequest(false);
      } else {
        console.error("Email check error:", error);
        setError("حدث خطأ في التحقق من البريد الإلكتروني");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for name field to only allow Arabic characters
    if (name === "name") {
      // Arabic letters and spaces only
      const arabicOnly = value.replace(/[^\u0600-\u06FF\s]/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: arabicOnly,
      }));
      return;
    }

    // Normal handling for other fields
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
        setIsLoading(true);
        if (!formData.email || !formData.password) {
          setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
          return;
        }

        const credentials = {
          email: formData.email,
          password: formData.password,
        };

        const response = await loginUser(credentials);

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
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    // Add validation for Arabic name
    const arabicNameRegex = /^[\u0600-\u06FF\s]+$/;
    if (!arabicNameRegex.test(formData.name)) {
      setError("الرجاء إدخال الاسم باللغة العربية فقط");
      return;
    }

    // Add validation for phone number
    if (formData.phone.length > 9) {
      setError("رقم الجوال يجب أن لا يتجاوز 9 أرقام");
      return;
    }

    // Add password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{9,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "كلمة المرور يجب أن تحتوي على: ٩ أحرف على الأقل، وحرف كبير، وحرف صغير، وأرقام"
      );
      return;
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.acceptTerms
    ) {
      setError("الرجاء إكمال جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsLoading(true);
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      const registerResponse = await registerUser(userData);

      if (registerResponse.success) {
        onClose();
        router.push("/Askquestion");
      } else {
        setError(registerResponse.error || "حدث خطأ أثناء التسجيل");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 422) {
        if (error.response.data.message === "Phone number already exists") {
          setError("رقم الهاتف مستخدم بالفعل");
        } else {
          setError(
            error.response.data.message || "يرجى التحقق من صحة البيانات المدخلة"
          );
        }
      } else {
        setError("حدث خطأ أثناء التسجيل");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");

      const response = await axios.post(
        `${API_BASE_URL}/password-recovery/send-otp`,
        {
          email: forgotPasswordEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setCurrentStep(steps.VERIFY_OTP);
      } else {
        setError(
          response.data.message || "حدث خطأ ما. يرجى المحاولة مرة أخرى."
        );
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(
        err.response?.data?.message ||
          "حدث خطأ في إرسال رمز التحقق. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (forgotPasswordOtp.some((digit) => !digit)) {
      setError("الرجاء إدخال رمز التحقق كاملاً");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const otp = forgotPasswordOtp.join("");

      // Just validate the OTP format and move to password step
      if (otp.length === 4 && /^\d+$/.test(otp)) {
        setCurrentStep(steps.NEW_PASSWORD);
        setError("");
      } else {
        setError("الرجاء إدخال رمز تحقق صحيح مكون من 4 أرقام");
      }
    } catch (error) {
      setError("حدث خطأ في التحقق من الرمز");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!otpFormData.password || !otpFormData.password_confirmation) {
      setError("الرجاء إدخال كلمة المرور وتأكيدها");
      return;
    }

    if (otpFormData.password !== otpFormData.password_confirmation) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const otp = forgotPasswordOtp.join("");

      // Send all data in one request
      const response = await axios.post(
        `${API_BASE_URL}/password-recovery/verify-otp`,
        {
          email: forgotPasswordEmail,
          otp: parseInt(otp),
          password: otpFormData.password,
          password_confirmation: otpFormData.password_confirmation,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        // Reset all states and go back to login
        setOtpFormData({ password: "", password_confirmation: "" });
        setForgotPasswordOtp(["", "", "", ""]);
        setForgotPasswordEmail("");
        setCurrentStep(steps.LOGIN);
        setError("تم تغيير كلمة المرور بنجاح");
      } else {
        const attemptsMatch = response.data.message?.match(
          /Attempts remaining: (\d+)/
        );
        const remainingAttempts = attemptsMatch ? attemptsMatch[1] : null;

        if (remainingAttempts) {
          setCurrentStep(steps.VERIFY_OTP); // Go back to OTP step if invalid
          setError(
            `رمز التحقق غير صحيح. المحاولات المتبقية: ${remainingAttempts}`
          );
        } else {
          setError(response.data.message || "حدث خطأ في تغيير كلمة المرور");
        }
      }
    } catch (error) {
      console.error("Password reset error:", error.response?.data);
      if (error.response?.data?.message?.includes("Invalid OTP")) {
        const attemptsMatch = error.response.data.message.match(
          /Attempts remaining: (\d+)/
        );
        const remainingAttempts = attemptsMatch ? attemptsMatch[1] : null;
        setCurrentStep(steps.VERIFY_OTP); // Go back to OTP step if invalid
        setError(
          remainingAttempts
            ? `رمز التحقق غير صحيح. المحاولات المتبقية: ${remainingAttempts}`
            : "رمز التحقق غير صحيح"
        );
      } else {
        setError(
          error.response?.data?.message || "حدث خطأ في تغيير كلمة المرور"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...forgotPasswordOtp];
    newOtp[index] = value;
    setForgotPasswordOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleClose = () => {
    setCurrentStep(steps.INITIAL);
    setForgotPasswordEmail("");
    setForgotPasswordOtp(["", "", "", ""]);
    setOtpFormData({ password: "", password_confirmation: "" });
    setError("");
    onClose();
  };

  return (
    <>
      {/* Main Auth Modal */}
      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
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

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEmailCheck();
                  }}
                  className="space-y-4"
                >
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

                  {error && (
                    <div className="text-red-500 text-sm text-right">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#3069B4] text-white rounded-lg py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري التحقق..." : "التالي"}
                  </button>
                </form>
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
                  disabled={isLoading}
                  className={`w-full bg-[#3069B4] text-white rounded-lg py-2 relative ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      <span className="mr-2">جاري التحميل...</span>
                    </div>
                  ) : (
                    "تسجيل الدخول"
                  )}
                </button>

                <div className="text-center space-y-2">
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
                  placeholder="الاسم باللغة العربية"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.name}
                  onChange={handleInputChange}
                  // Optional: prevent paste of non-Arabic text
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData("text");
                    const arabicOnly = pastedText.replace(
                      /[^\u0600-\u06FF\s]/g,
                      ""
                    );
                    setFormData((prevData) => ({
                      ...prevData,
                      name: arabicOnly,
                    }));
                  }}
                />

                <input
                  dir="rtl"
                  type="tel"
                  name="phone"
                  placeholder="رقم الجوال (9 أرقام كحد أقصى)"
                  required
                  maxLength={9}
                  className="w-full p-2 border rounded-md"
                  value={formData.phone}
                  onChange={handleInputChange}
                />

                <input
                  dir="rtl"
                  type="password"
                  name="password"
                  placeholder="كلمة المرور (٩ أحرف، حرف كبير، حرف صغير، وأرقام)"
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
                </div>
              </form>
            )}

            {currentStep === steps.FORGOT_PASSWORD && (
              <form
                onSubmit={handleForgotPasswordSubmit}
                className="space-y-4 text-right"
              >
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
                  {isLoading ? "...جاري الارسال" : "إرسال رمز التحقق"}
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
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !e.target.value &&
                              index > 0
                            ) {
                              const prevInput = document.querySelector(
                                `input[name=otp-${index - 1}]`
                              );
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
                    disabled={
                      isLoading || forgotPasswordOtp.some((digit) => !digit)
                    }
                    className="w-full bg-[#3069B4] text-white rounded-lg py-3 text-lg font-medium disabled:opacity-50 hover:bg-[#2859a0] transition-colors mt-2"
                  >
                    {isLoading ? "جاري التحقق..." : "التالي"}
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
                      value={otpFormData.password}
                      onChange={(e) =>
                        setOtpFormData({
                          ...otpFormData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      dir="rtl"
                      type="password"
                      placeholder="تأكيد كلمة المرور"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3069B4] focus:ring-1 focus:ring-[#3069B4] transition-colors"
                      value={otpFormData.password_confirmation}
                      onChange={(e) =>
                        setOtpFormData({
                          ...otpFormData,
                          password_confirmation: e.target.value,
                        })
                      }
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
                    disabled={
                      isLoading ||
                      !otpFormData.password ||
                      !otpFormData.password_confirmation
                    }
                    className="w-full bg-[#3069B4] text-white rounded-lg py-3 text-lg font-medium disabled:opacity-50 hover:bg-[#2859a0] transition-colors"
                  >
                    {isLoading ? "جاري التغيير..." : "تغيير كلمة المرور"}
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
