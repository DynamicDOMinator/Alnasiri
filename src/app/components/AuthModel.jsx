"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AuthModel({ isOpen, onClose }) {
  const { login, register, verifyLoginOTP } = useAuth();
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
  const [oldPassword, setOldPassword] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const startTimer = useCallback(() => {
    // Clear any existing interval
    setIntervalId((currentIntervalId) => {
      if (currentIntervalId) {
        clearInterval(currentIntervalId);
      }
      return null;
    });

    setTimer(120);
    setCanResend(false);

    // Create new interval
    const id = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(id);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    setIntervalId(id);
  }, []); // Remove intervalId from dependencies

  useEffect(() => {
    if (isOpen && step === "otp") {
      startTimer();
    }
    return () => {
      setIntervalId((currentIntervalId) => {
        if (currentIntervalId) {
          clearInterval(currentIntervalId);
        }
        return null;
      });
    };
  }, [isOpen, step, startTimer]);

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

  const handleResendOTP = async () => {
    try {
      let response;

      if (isForgotPassword) {
        // For email OTP
        response = await axios.post(
          `${API_BASE_URL}/lawyer/resend-otp-by-email`,
          { email },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
      } else {
        // For phone OTP (existing logic)
        response = await axios.post(
          `${API_BASE_URL}/lawyer/resend-otp`,
          { phone: userData?.phone },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
      }

      if (response.data) {
        startTimer();
        setError("");
      }
    } catch (error) {
      setError(error.response?.data?.message || "حدث خطأ في إعادة إرسال الرمز");
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 4).split("");
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 4) newOtp[index] = digit;
    });
    setOtp(newOtp);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailCheck = async () => {
    try {
      // Validate email is not empty
      if (!email) {
        setError("البريد الإلكتروني مطلوب");
        return;
      }

      // Validate email format
      if (!validateEmail(email)) {
        setError("الرجاء إدخال بريد إلكتروني صحيح");
        return;
      }

      if (showPassword) {
        if (!password) {
          setError("كلمة المرور مطلوبة");
          return;
        }

        const result = await login(email, password);
        if (result.success) {
          resetForm();
          onClose();
        } else if (result.requireOTP) {
          setError("");
          setStep("otp");
          setUserData(result.userData);
          setIsForgotPassword(false);
        } else {
          setError(result.error);
        }
      } else {
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
            setError("");
          }
        } catch (err) {
          if (!showPassword && err.response && err.response.status === 404) {
            setStep("register");
            setError("");
          } else {
            setError(
              err.response?.data?.message ||
                "خطأ في التحقق من البريد الإلكتروني"
            );
          }
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "حدث خطأ غير متوقع");
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setName("");
    setPhone("");
    setOtp(["", "", "", ""]);
    setError("");
    setRegisterPassword("");
    setConfirmPassword("");
    setUserData(null);
    setIsForgotPassword(false);
    setNewPassword("");
    setNewPasswordConfirmation("");
    setOldPassword("");
    setVerifiedOtp("");
    setStep("email");
    setTimer(120);
    setCanResend(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^5\d{8}$/; // Starts with 5 and followed by 8 digits
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 9;
  };

  const validateArabicName = (name) => {
    const arabicRegex = /^[\u0600-\u06FF\s]+$/; // Arabic Unicode range
    return arabicRegex.test(name);
  };

  const handleRegister = async () => {
    try {
      // Validate empty fields
      if (!name || !email || !phone || !registerPassword) {
        setError("جميع الحقول مطلوبة");
        return;
      }

      // Validate email format
      if (!validateEmail(email)) {
        setError("الرجاء إدخال بريد إلكتروني صحيح");
        return;
      }

      // Validate Arabic name
      if (!validateArabicName(name)) {
        setError("يجب أن يكون الاسم باللغة العربية فقط");
        return;
      }

      // Validate phone number
      if (!validatePhone(phone)) {
        setError("رقم الجوال يجب أن يبدأ بـ 5 ويتكون من 9 أرقام");
        return;
      }

      // Validate password
      if (!validatePassword(registerPassword)) {
        setError("كلمة المرور يجب أن تحتوي على 9 أحرف على الأقل");
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
        startTimer();
      }
    } catch (error) {
      let errorMessage =
        error.response?.data?.message || "حدث خطأ أثناء التسجيل";

      // If phone number already exists error
      if (error.response?.data?.message === "رقم الهاتف مستخدم بالفعل") {
        try {
          // Fixed: Send phone as query parameter
          const hintResponse = await axios.get(
            `${API_BASE_URL}/user/hint-email?phone=${phone}`,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          if (hintResponse.data?.email) {
            errorMessage = `${hintResponse.data.email}رقم الهاتف مستخدم بالفعل مع البريد الإلكتروني `;
          }
        } catch (hintError) {
          console.error("Error fetching email hint:", hintError);
        }
      }

      setError(errorMessage);
    }
  };

  const handleForgotPasswordRequest = async () => {
    try {
      // Validate email is not empty
      if (!email) {
        setError("البريد الإلكتروني مطلوب");
        return;
      }

      // Validate email format
      if (!validateEmail(email)) {
        setError("الرجاء إدخال بريد إلكتروني صحيح");
        return;
      }

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
        startTimer();
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في إرسال رمز التحقق");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const otpString = otp.join("");

      if (isForgotPassword) {
        // Just validate OTP format and move to next step
        if (otpString.length === 4) {
          setVerifiedOtp(otpString);
          setStep("change-password");
          setError("");
        } else {
          setError("الرجاء إدخال رمز التحقق كاملاً");
        }
      } else {
        // Regular OTP verification (phone OTP)
        const result = await verifyLoginOTP(otpString);
        if (result.success) {
          resetForm();
          onClose();
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "خطأ في التحقق من الرمز");
    }
  };

  const handlePasswordChange = async () => {
    try {
      // Send the password change request with OTP and new passwords
      const response = await axios.post(
        `${API_BASE_URL}/password-recovery/verify-otp`,
        {
          email,
          otp: parseInt(verifiedOtp),
          password: newPassword,
          password_confirmation: newPasswordConfirmation,
        }
      );

      if (response.data.status === "success") {
        setError("");

        setSuccessMessage(response.data.message);

        setNewPassword("");
        setNewPasswordConfirmation("");
        setVerifiedOtp("");

        setStep("login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في تغيير كلمة المرور");
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setName("");
    setPhone("");
    setOtp(["", "", "", ""]);
    setError("");
    setRegisterPassword("");
    setConfirmPassword("");
    setUserData(null);
    setIsForgotPassword(false);
    setNewPassword("");
    setNewPasswordConfirmation("");
    setOldPassword("");
    setVerifiedOtp("");
    setSuccessMessage("");
    onClose();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
        onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <Dialog.Content className="mx-auto w-full  md:w-[600px] rounded-xl bg-white p-8 relative shadow-2xl">
            <Dialog.Title className="sr-only">
              نافذة تسجيل الدخول والتسجيل
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              &#10005;
            </button>
            <h2 className="text-2xl text-[#FF883EE0] font-bold text-right mb-6">
              {step === "email" && "تسجيل الدخول أو إنشاء حساب"}
              {step === "register" && "إكمال بيانات الحساب"}
              {step === "otp" && "إدخال رمز التحقق"}
              {step === "change-password" && "تغيير كلمة المرور"}
              {step === "login" && "تسجيل الدخول"}
            </h2>
            {error && (
              <p className="text-red-500 text-sm text-right p-3 bg-red-50 rounded-lg mb-4">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="text-green-600 text-sm text-right p-3 bg-green-50 rounded-lg mb-4">
                {successMessage}
              </p>
            )}
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
                  <p
                    dir="rtl"
                    className="text-gray-600 text-sm text-center mb-6"
                  >
                    تم إرسال رمز التحقق إلى رقم الهاتف{" "}
                    <span dir="ltr" className="font-medium">
                      {userData?.phone}
                    </span>
                  </p>
                )}
                <div className="flex justify-center gap-4 dir-rtl">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      type="text"
                      id={`otp-${index}`}
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-blue-800 focus:outline-none text-lg"
                    />
                  ))}
                </div>
                <div className="text-center space-y-2">
                  {timer > 0 && (
                    <p className="text-gray-600 text-sm">
                      إعادة إرسال الرمز خلال {formatTime(timer)}
                    </p>
                  )}
                  {canResend && (
                    <button
                      onClick={handleResendOTP}
                      className="text-blue-800 hover:text-blue-600 text-sm"
                    >
                      إعادة إرسال رمز التحقق
                    </button>
                  )}
                </div>
                {error && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {error}
                  </p>
                )}
                <div className="flex justify-center">
                  <button
                    onClick={handleVerifyOtp}
                    className="bg-blue-800 text-white px-8 py-2 w-full rounded-lg hover:bg-bluee-700 transition-colors"
                  >
                    {isForgotPassword ? "التالي" : "تحقق"}
                  </button>
                </div>
              </div>
            )}
            {step === "email" && (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="البريد الإلكتروني (example@domain.com)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right [&::placeholder]:text-right"
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
                  style={{ margin: 0, padding: 0 }}
                >
                  {showPassword && (
                    <div className="bg-transparent space-y-2">
                      <input
                        type="password"
                        placeholder="كلمة المرور"
                        className="w-full p-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        dir="rtl"
                      />
                      <button
                        onClick={() => {
                          setStep("email");
                          handleForgotPasswordRequest();
                        }}
                        className="text-blue-800 text-sm hover:text-[#e57a38] transition-colors text-right w-full"
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
                  {showPassword ? "تأكيد" : "التالي"}
                </button>
              </div>
            )}
            {step === "register" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="الاسم الكامل (باللغة العربية)"
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
                <input
                  type="email"
                  placeholder="البريد الإلكتروني (example@domain.com)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="rtl"
                />
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="رقم الجوال (يبدأ بـ 5)"
                    className="w-full p-3 pl-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-left [&::placeholder]:text-right"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        value === "" ||
                        (/^\d{0,9}$/.test(value) &&
                          (value === "" || value.startsWith("5")))
                      ) {
                        setPhone(value);
                      }
                    }}
                    maxLength={9}
                    dir="ltr"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    +966
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="كلمة المرور (9 أحرف على الأقل)"
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
            {step === "change-password" && (
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
                  placeholder="تأكيد كلمة المرور الجديدة"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right"
                  value={newPasswordConfirmation}
                  onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                  dir="rtl"
                />
                {error && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {error}
                  </p>
                )}
                <button
                  onClick={handlePasswordChange}
                  className="w-full bg-blue-800 hover:bg-blue-700 transition-colors text-white rounded-lg py-3 font-medium"
                >
                  تغيير كلمة المرور
                </button>
              </div>
            )}
            {step === "login" && (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="rtl"
                />
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 focus:ring-offset-0 focus:border-blue-800 bg-white transition-all text-right"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="rtl"
                />
                {error && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {error}
                  </p>
                )}
                <button
                  onClick={handleEmailCheck}
                  className="w-full bg-blue-800 hover:bg-blue-700 transition-colors text-white rounded-lg py-3 font-medium"
                >
                  تسجيل الدخول
                </button>
              </div>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
