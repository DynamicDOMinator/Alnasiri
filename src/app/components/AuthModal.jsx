"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";

const steps = {
  INITIAL: 1,
  LOGIN: 2,
  REGISTER: 3,
  OTP: 4,
};

export default function AuthModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(steps.INITIAL);
  const [loginMethod, setLoginMethod] = useState("email");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    acceptTerms: false,
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [isExistingUser, setIsExistingUser] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(steps.INITIAL);
      setLoginMethod("email");
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        acceptTerms: false,
      });
      setOtp("");
      setError("");
      setOtpValues(["", "", "", "", "", ""]);
      setIsExistingUser(false);
    }
  }, [isOpen]);

  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(`/api/check-email?email=${email}`);
      return response.data.exists;
    } catch (err) {
      setError("حدث خطأ أثناء التحقق من البريد الإلكتروني");
      return false;
    }
  };

  const handleEmailSubmit = async () => {
    if (!formData.email) {
      setError("الرجاء إدخال البريد الإلكتروني");
      return;
    }

    const exists = await checkEmailExists(formData.email);
    setIsExistingUser(exists);
    setCurrentStep(exists ? steps.LOGIN : steps.REGISTER);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (currentStep === steps.LOGIN) {
        // Handle login
        const response = await axios.post("/api/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("authToken", response.data.token);
        onClose();
      } else if (currentStep === steps.REGISTER) {
        setCurrentStep(steps.OTP);
      } else if (currentStep === steps.OTP) {
        // Send both registration data and OTP for verification
        const response = await axios.post("/api/register", {
          ...formData,
          otp,
        });

        // Handle successful registration and verification
        onClose();
        // Store the token in localStorage
        localStorage.setItem("authToken", response.data.token);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "حدث خطأ ما، يرجى المحاولة مرة أخرى"
      );
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Only allow numbers

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    setOtp(newOtpValues.join("")); // Update the main OTP state

    // Auto focus next input
    if (value !== "" && index < 5) {
      const nextInput = document.querySelector(
        `input[name='otp-${index + 1}']`
      );
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[name='otp-${index - 1}']`
      );
      prevInput?.focus();
    }
  };

  return (
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
              <p className="">قم بإدخال البريد الالكتروني الخاص بك</p>

              <input
                dir="rtl"
                type="email"
                placeholder="البريد الإلكتروني"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <button
                onClick={handleEmailSubmit}
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
                placeholder="البريد الإلكتروني"
                required
                className="w-full p-2 border rounded-md"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <input
                dir="rtl"
                type="password"
                placeholder="كلمة المرور"
                required
                className="w-full p-2 border rounded-md"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <button
                type="submit"
                className="w-full bg-[#3069B4] text-white rounded-lg py-2"
              >
                تسجيل الدخول
              </button>

              <div className="text-center space-y-2">
                <p className="text-sm">
                  هل أنت محامي؟{" "}
                  <a
                    href="/lawyer-registration"
                    className="text-[#FF883EE0] hover:underline"
                  >
                    سجل من هنا
                  </a>
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
                placeholder="الاسم"
                required
                className="w-full p-2 border rounded-md"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                dir="rtl"
                type="tel"
                placeholder="رقم الجوال"
                required
                className="w-full p-2 border rounded-md"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <input
                dir="rtl"
                type="password"
                placeholder="كلمة المرور"
                required
                className="w-full p-2 border rounded-md"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <div className="flex justify-end items-center gap-2">
                <span className="text-sm">
                  أوافق على شروط الاستخدام وسياسة الخصوصية
                </span>
                <input
                  type="checkbox"
                  required
                  checked={formData.acceptTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, acceptTerms: e.target.checked })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF6624] text-white rounded-md py-2"
              >
                التالي
              </button>

              <div className="text-center space-y-2">
                <p className="text-sm">
                  هل أنت محامي؟{" "}
                  <a
                    href="/lawyer-registration"
                    className="text-[#FF883EE0] hover:underline"
                  >
                    سجل من هنا
                  </a>
                </p>
              </div>
            </form>
          )}

          {currentStep === steps.OTP && (
            <form onSubmit={handleSubmit} className="space-y-4 text-right">
              <h2 className="text-xl font-bold text-[#FF883EE0]">
                إدخال رمز التحقق
              </h2>

              <p className="text-sm text-gray-600 mb-4">
                تم ارسال رمز التحقق من 6 ارقام إلي بريدك الالكتروني
                <br />
                يرجي إدخاله ادناه لإكمال عملية التسجيل
              </p>

              <div className="flex justify-center gap-2">
                {otpValues.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`otp-${index}`}
                    maxLength={1}
                    className="w-12 h-12 text-center border rounded-md text-lg focus:outline-none focus:border-[#FF8D4D] focus:border-2"
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    dir="ltr"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-[#3069B4] text-white rounded-md py-2"
              >
                تأكيد
              </button>
            </form>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </div>
      </div>
    </Dialog>
  );
}
