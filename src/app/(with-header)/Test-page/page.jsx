"use client";
import { useState } from "react";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AuthPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  const handleOtpChange = (index, value) => {
    if (!/\d/.test(value) && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    } else if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleEmailCheck = async () => {
    try {
      if (showPassword) {
        const response = await axios.post(
          `${API_BASE_URL}/login`,
          {
            email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        
        if (response.data) {
          if (response.data.token) {
            setIsOpen(false);
          } else if (response.data.message && response.data.message.includes("OTP SENT")) {
            setError("");
            setStep("otp");
            setUserData(response.data.data);
          }
        }
      } else {
        const response = await axios.get(
          `${API_BASE_URL}/check-email/check-email`,
          {
            params: { email },
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        if (response.data.email && response.data.user_type) {
          setShowPassword(true);
        }
      }
    } catch (err) {
      if (!showPassword && err.response && err.response.status === 404) {
        setStep("register");
      } else {
        setError(err.response?.data?.message || "خطأ في تسجيل الدخول");
      }
    }
  };

  const handleRegister = async () => {
    try {
      
      if (!name || !email || !phone || !registerPassword) {
        setError("جميع الحقول مطلوبة");
        return;
      }

      if (registerPassword !== confirmPassword) {
        setError("كلمات المرور غير متطابقة");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/user/register`,
        {
          name,
          email,
          phone,
          password: registerPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        setStep("otp");
        setError("");
        setUserData({ ...response.data.data, phone });
        setIsForgotPassword(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء التسجيل");
    }
  };

  const handleForgotPasswordRequest = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/password-recovery/send-otp`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        setStep("otp");
        setIsForgotPassword(true);
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في إرسال رمز التحقق");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const otpString = otp.join("");

      if (isForgotPassword) {
        // Password recovery verification (email OTP)
        const response = await axios.post(
          `${API_BASE_URL}/password-recovery/verify-otp`,
          {
            email,
            otp: parseInt(otpString),
            password: newPassword,
            password_confirmation: newPasswordConfirmation,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response.data) {
          setIsOpen(false);
          // Handle success (maybe show a success message)
        }
      } else {
        // Regular OTP verification (phone OTP)
        const response = await axios.post(
          `${API_BASE_URL}/lawyer/verify-otp`,
          {
            otp: otpString,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response.data) {
          setIsOpen(false);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "خطأ في التحقق من الرمز");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#FF6624] hover:bg-[#e55a20] transition-colors mt-20 text-white px-6 py-3 rounded-lg font-medium"
      >
        فتح النافذة
      </button>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Content className="mx-auto w-full max-w-2xl md:min-w-[500px] rounded-xl bg-white p-8 relative shadow-2xl">
              <Dialog.Title className="sr-only">
                نافذة تسجيل الدخول والتسجيل
              </Dialog.Title>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setStep("email");
                  setEmail("");
                  setPassword("");
                  setShowPassword(false);
                  setName("");
                  setPhone("");
                  setRegisterPassword("");
                  setConfirmPassword("");
                  setOtp(["", "", "", ""]);
                  setError("");
                }}
                className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                &#10005;
              </button>
              <h2 className="text-2xl text-[#FF883EE0] font-bold text-right mb-6">
                {step === "email" && "تسجيل الدخول أو إنشاء حساب"}
                {step === "register" && "إكمال بيانات الحساب"}
                {step === "otp" && "إدخال رمز التحقق"}
              </h2>
              {step === "otp" && (
                <div className="space-y-6">
                  {isForgotPassword ? (
                    <p
                      dir="rtl"
                      className="text-gray-600 text-sm text-center mb-6"
                    >
                      تم إرسال رمز التحقق إلى البريد الإلكتروني{" "}
                      <span dir="ltr" className="font-medium">
                        {email}
                      </span>
                    </p>
                  ) : (
                    userData && (
                      <p
                        dir="rtl"
                        className="text-gray-600 text-sm text-center mb-6"
                      >
                        تم إرسال رمز التحقق إلى الرقم{" "}
                        <span dir="ltr" className="font-medium">
                          {userData.phone}
                        </span>
                      </p>
                    )
                  )}
                  <div className="flex justify-center gap-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6624] focus:ring-offset-0 focus:border-[#FF6624] bg-white transition-all"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                      />
                    ))}
                  </div>
                  {isForgotPassword ? (
                    <button
                      onClick={() => {
                        const otpString = otp.join("");
                        if (otpString.length === 4) {
                          setStep("resetPassword");
                        } else {
                          setError("الرجاء إدخال رمز التحقق كاملاً");
                        }
                      }}
                      className="w-full bg-[#FF6624] hover:bg-[#e55a20] transition-colors text-white rounded-lg py-3 font-medium mt-6"
                    >
                      التالي
                    </button>
                  ) : (
                    <button
                      onClick={handleVerifyOtp}
                      className="w-full bg-[#FF6624] hover:bg-[#e55a20] transition-colors text-white rounded-lg py-3 font-medium mt-6"
                    >
                      تأكيد
                    </button>
                  )}
                </div>
              )}
              {step === "resetPassword" && (
                <div className="space-y-6">
                  <p
                    dir="rtl"
                    className="text-gray-600 text-lg font-bold text-center mb-6"
                  >
                    الرجاء إدخال كلمة المرور الجديدة
                  </p>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="كلمة المرور الجديدة"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6624] focus:ring-offset-0 focus:border-[#FF6624] bg-white transition-all text-right"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      dir="rtl"
                    />
                    <input
                      type="password"
                      placeholder="تأكيد كلمة المرور"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6624] focus:ring-offset-0 focus:border-[#FF6624] bg-white transition-all text-right"
                      value={newPasswordConfirmation}
                      onChange={(e) =>
                        setNewPasswordConfirmation(e.target.value)
                      }
                      dir="rtl"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const otpString = otp.join("");
                        const response = await axios.post(
                          `${API_BASE_URL}/password-recovery/verify-otp`,
                          {
                            email,
                            otp: parseInt(otpString),
                            password: newPassword,
                            password_confirmation: newPasswordConfirmation,
                          },
                          {
                            headers: {
                              "Content-Type": "application/json",
                              Accept: "application/json",
                            },
                          }
                        );

                        if (response.data) {
                          setIsOpen(false);
                          // Handle success (maybe show a success message)
                        }
                      } catch (err) {
                        setError(
                          err.response?.data?.message ||
                            "خطأ في تغيير كلمة المرور"
                        );
                      }
                    }}
                    className="w-full bg-[#FF6624] hover:bg-[#e55a20] transition-colors text-white rounded-lg py-3 font-medium mt-6"
                  >
                    تأكيد
                  </button>
                </div>
              )}
              {error && (
                <p className="text-red-500 text-sm text-right mb-4 bg-red-50 p-3 rounded-lg">
                  {error}
                </p>
              )}
              {step === "email" && (
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6624] focus:ring-offset-0 focus:border-[#FF6624] bg-white transition-all text-right"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="rtl"
                  />
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={
                      showPassword
                        ? { opacity: 1, height: "auto" }
                        : { opacity: 0, height: 0 }
                    }
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-transparent"
                    style={{ margin: 0, padding: 0 }}
                  >
                    {showPassword && (
                      <div className="bg-transparent space-y-2">
                        <input
                          type="password"
                          placeholder="كلمة المرور"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6624] focus:ring-offset-0 focus:border-[#FF6624] bg-white transition-all text-right"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          dir="rtl"
                        />
                        <button
                          onClick={() => {
                            setStep("email");
                            handleForgotPasswordRequest();
                          }}
                          className="text-[#FF6624] text-sm hover:text-[#e55a20] transition-colors text-right w-full"
                        >
                          نسيت كلمة المرور؟
                        </button>
                      </div>
                    )}
                  </motion.div>
                  <button
                    onClick={handleEmailCheck}
                    className="w-full bg-[#FF6624] hover:bg-[#e55a20] transition-colors text-white rounded-lg py-3 font-medium"
                  >
                    التالي
                  </button>
                </div>
              )}
              {step === "register" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="الاسم الكامل"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6624] focus:ring-offset-0 focus:border-[#FF6624] bg-white transition-all text-right"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    dir="rtl"
                  />
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="رقم الجوال"
                      className="w-full p-3 pl-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6624] focus:ring-offset-0 focus:border-[#FF6624] bg-white transition-all text-left [&::placeholder]:text-right"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      +966
                    </span>
                  </div>
                  <input
                    type="password"
                    placeholder="كلمة المرور"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6624] focus:ring-offset-0 focus:border-[#FF6624] bg-white transition-all text-right"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    dir="rtl"
                  />
                  <input
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6624] focus:ring-offset-0 focus:border-[#FF6624] bg-white transition-all text-right"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    dir="rtl"
                  />
                  <button
                    onClick={handleRegister}
                    className="w-full bg-[#FF6624] hover:bg-[#e55a20] transition-colors text-white rounded-lg py-3 font-medium"
                  >
                    التالي
                  </button>
                </div>
              )}
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
