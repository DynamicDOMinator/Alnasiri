"use client";
import { useState } from "react";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AuthModel({ isOpen, onClose }) {
  const { loginUser, checkEmail, registerUser, verifyOTP } = useAuth();
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
  const [successMessage, setSuccessMessage] = useState("");

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

  const validateArabicName = (value) => {
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    return arabicRegex.test(value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailCheck = async () => {
    try {
      if (!email.trim()) {
        setError("الرجاء إدخال البريد الإلكتروني");
        return;
      }

      if (!validateEmail(email)) {
        setError("الرجاء إدخال بريد إلكتروني صحيح");
        return;
      }

      if (showPassword && !password.trim()) {
        setError("الرجاء إدخال كلمة المرور");
        return;
      }

      console.log("Checking email:", email);

      if (showPassword) {
        // Login attempt
        try {
          const result = await loginUser({
            email,
            password,
          });

          console.log("Login response:", result);

          if (result.success) {
            if (result.requiresOTP) {
              setError("");
              setStep("otp");
              setUserData(result.userData);
              setIsForgotPassword(false);
            } else {
              // Clear form states
              setEmail("");
              setPassword("");
              setShowPassword(false);
              setError("");

              // Close modal
              onClose(false);
            }
          }
        } catch (err) {
          console.error("Login error:", err);
          setError(err.response?.data?.message || "خطأ في تسجيل الدخول");
        }
      } else {
        // Email check
        console.log("Calling checkEmail");
        try {
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
        } catch (err) {
          if (err.response && err.response.status === 404) {
            console.log("Email not found, moving to register step");
            setStep("register");
          } else {
            throw err;
          }
        }
      }
    } catch (err) {
      console.error("Error in handleEmailCheck:", err);
      setError(err.response?.data?.message || "خطأ في تسجيل الدخول");
    }
  };

  const handleRegister = async () => {
    try {
      // Enhanced validation
      if (
        !name.trim() ||
        !email.trim() ||
        !phone.trim() ||
        !registerPassword.trim()
      ) {
        setError("جميع الحقول مطلوبة");
        return;
      }

      if (!validateArabicName(name)) {
        setError("الرجاء إدخال الاسم باللغة العربية فقط");
        return;
      }

      if (!validateEmail(email)) {
        setError("الرجاء إدخال بريد إلكتروني صحيح");
        return;
      }

      if (registerPassword.length < 6) {
        setError("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
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

      console.log("Register response:", response.data); // Debug log

      if (response.data && response.data.message.includes("OTP SENT")) {
        setStep("otp");
        setError("");
        setUserData(response.data.data);
        setIsForgotPassword(false);
      }
    } catch (err) {
      console.error("Register error:", err);
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
        // Validate OTP and passwords before sending
        if (!otpString || isNaN(otpString)) {
          setError("الرجاء إدخال رمز التحقق بشكل صحيح");
          return;
        }

        if (!newPassword || !newPasswordConfirmation) {
          setError("الرجاء إدخال كلمة المرور وتأكيدها");
          return;
        }

        if (newPassword !== newPasswordConfirmation) {
          setError("كلمات المرور غير متطابقة");
          return;
        }

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

        if (
          response.data.status === "success" &&
          response.data.message === "Password reset successfully"
        ) {
          // Reset form states
          setError("");
          setNewPassword("");
          setNewPasswordConfirmation("");
          setOtp(["", "", "", ""]);
          setIsForgotPassword(false);

          // Go back to login step
          setStep("email");
          setShowPassword(true);

          // Show success message
          setSuccessMessage(
            "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول"
          );
        }
      } else {
        // Changed: Pass the OTP in the correct format
        const result = await verifyOTP({
          otp: otpString,
        });

        if (result.success) {
          // Clear form states
          setEmail("");
          setPassword("");
          setOtp(["", "", "", ""]);
          setError("");
          setShowPassword(false);

          // Close modal
          onClose(false);
        }
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMessage =
        err.response?.data?.message || "خطأ في التحقق من الرمز";
      if (
        err.response?.data?.status === "error" &&
        errorMessage.includes("Attempts remaining")
      ) {
        setError(
          `رمز التحقق غير صحيح. المحاولات المتبقية: ${errorMessage.split(": ")[1]}`
        );
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm " />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content className="mx-auto w-full max-w-[500px] md:min-w-[500px] rounded-xl bg-white p-8 relative shadow-2xl">
            <Dialog.Title className="sr-only">
              نافذة تسجيل الدخول والتسجيل
            </Dialog.Title>

            <Dialog.Description className="sr-only">
              نافذة للتسجيل وتسجيل الدخول وإدارة كلمة المرور
            </Dialog.Description>
            <button
              onClick={() => {
                onClose(false);
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
                      className="w-14 h-14 text-center text-xl font-semibold border  border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all"
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
                    className="w-full bg-blue-800 hover:bg-blue-700 transition-colors text-white rounded-lg py-3 font-medium mt-6"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    onClick={handleVerifyOtp}
                    className="w-full bg-blue-800 hover:bg-blue-700 transition-colors text-white rounded-lg py-3 font-medium mt-6"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    dir="rtl"
                  />
                  <input
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right"
                    value={newPasswordConfirmation}
                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
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

                      if (
                        response.data.status === "success" &&
                        response.data.message === "Password reset successfully"
                      ) {
                        // Reset form states
                        setError("");
                        setNewPassword("");
                        setNewPasswordConfirmation("");
                        setOtp(["", "", "", ""]);
                        setIsForgotPassword(false);

                        // Go back to login step
                        setStep("email");
                        setShowPassword(true);

                        // Show success message
                        setSuccessMessage(
                          "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول"
                        );
                      }
                    } catch (err) {
                      setError(
                        err.response?.data?.message ||
                          "خطأ في تغيير كلمة المرور"
                      );
                    }
                  }}
                  className="w-full bg-blue-800 hover:bg-blue-700 transition-colors text-white rounded-lg py-3 font-medium mt-6"
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
            {successMessage && (
              <p className="text-green-600 text-sm text-right mb-4 bg-green-50 p-3 rounded-lg">
                {successMessage}
              </p>
            )}
            {step === "email" && (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right"
                  value={email}
                  onChange={(e) => {
                    console.log("Email changed:", e.target.value);
                    setEmail(e.target.value);
                  }}
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
                  className=" "
                  style={{ margin: 0, padding: 0 }}
                >
                  {showPassword && (
                    <div className="bg-transparent space-y-2">
                      <input
                        type="password"
                        placeholder="كلمة المرور"
                        className="w-full p-3 border mt-4 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        dir="rtl"
                      />
                      <button
                        onClick={() => {
                          setStep("email");
                          // Clear password fields
                          setPassword("");
                          setNewPassword("");
                          setNewPasswordConfirmation("");
                          handleForgotPasswordRequest();
                        }}
                        className="text-blue-800 text-sm hover:text-blue-700 transition-colors text-right w-full"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    </div>
                  )}
                </motion.div>
                <button
                  onClick={handleEmailCheck}
                  className="w-full bg-blue-800 hover:bg-blue-700 transition-colors text-white rounded-lg py-3 font-medium"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right"
                  value={name}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || validateArabicName(value)) {
                      setName(value);
                    }
                  }}
                  dir="rtl"
                />
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="رقم الجوال"
                    className="w-full p-3 pl-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-left [&::placeholder]:text-right"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  dir="rtl"
                />
                <input
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  dir="rtl"
                />
                <button
                  onClick={handleRegister}
                  className="w-full bg-blue-800 hover:bg-blue-700 transition-colors text-white rounded-lg py-3 font-medium"
                >
                  التالي
                </button>
              </div>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
