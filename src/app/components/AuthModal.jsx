"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import Link from "next/link";

const steps = {
  INITIAL: 1,
  LOGIN: 2,
  REGISTER: 3,
  OTP: 4,
};

// Define axiosInstance or use axios directly

export default function AuthModal({ isOpen, onClose, onLogin }) {
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
  const [loading, setLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLoginRequest, setIsLoginRequest] = useState(false);

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
      setError("");
      setIsExistingUser(false);
    }
  }, [isOpen]);

  const findByEmail = async (email) => {
    try {
      const response = await axios.get(
        `https://theoretical-agatha-ahmedelsamman-4d2b79ac.koyeb.app/users/find/email/${email}`
      );
      return response.data;
    } catch {
      return null;
    }
  };

  // Controller-like function to handle email check
  const handleEmailCheck = async () => {
    setLoading(true);
    try {
      const user = await findByEmail(formData.email);

      if (user) {
        setIsExistingUser(true);
        setCurrentStep(steps.LOGIN);
        setShowPasswordInput(true);
        setIsLoginRequest(true);
      } else {
        setCurrentStep(steps.REGISTER);
        setShowPasswordInput(false);
        setIsLoginRequest(false);
      }
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Log input values whenever they change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      return updatedData;
    });
  };

  // Function to handle OTP submission
  const handleOtpSubmit = async () => {
    // Logic to verify OTP code
    console.log("OTP Code Submitted:", otpCode);
    try {
      const response = await axios.post(
        "https://theoretical-agatha-ahmedelsamman-4d2b79ac.koyeb.app/users/verify/otp",
        {
          email: formData.email, // Send the OTP code
          otp: otpCode, // Include personalId if needed
        }
      );
      console.log(response);
      if (response.status === 200) {
        // Proceed to the next step if OTP verification is successful
        setCurrentStep(steps.REGISTER); // or whatever step you want to go to
        setIsOtpModalOpen(false);
      } else {
        setError("فشل في التحقق من الرمز"); // "Failed to verify the code"
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "حدث خطأ أثناء التحقق من الرمز"; // "An error occurred while verifying the code"
      setError(errorMessage);
    }
  };

  // Function to handle OTP input change
  const handleOtpChange = (index, value) => {
    // Check if the value is a digit (0-9)
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otpCode.split("")]; // Convert the current OTP string to an array
      newOtp[index] = value; // Update the specific index with the new value
      setOtpCode(newOtp.join("")); // Join the array back to a string

      // Move to the next input if the value is filled
      if (value && index < 5) {
        // Use setTimeout to ensure the state is updated before focusing
        setTimeout(() => {
          const nextInput = document.getElementById(`otp-input-${index + 1}`);
          if (nextInput) {
            nextInput.focus();
          }
        }, 0);
      }
    }
  };

  // Function to handle key down event for moving focus
  const handleKeyDown = (e, index) => {
    // Move to the previous input if Backspace is pressed and current input is empty
    if (e.key === "Backspace" && index > 0 && !otpCode[index]) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
    // Move to the next input if a digit is entered
    if (e.key.length === 1 && /^\d$/.test(e.key) && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;
      if (isLoginRequest && currentStep === steps.LOGIN) {
        response = await axios.post(
          "https://theoretical-agatha-ahmedelsamman-4d2b79ac.koyeb.app/users/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        if (response.status === 200) {
          if (typeof window !== "undefined") {
            localStorage.setItem("auth", response.data.token);
            localStorage.setItem("user", response.data.user.firstName);
            localStorage.setItem("role", response.data.user.role);
            window.location.reload();
          }
        }
      } else if (currentStep === steps.REGISTER) {
        response = await axios.post(
          "https://theoretical-agatha-ahmedelsamman-4d2b79ac.koyeb.app/users/register",
          {
            firstName: formData.name,
            lastName: "السمان",
            email: formData.email,
            phoneNumber: `+966${formData.phone}`,
            password: formData.password,
            role: "user",
          }
        );
      }

      console.log("Response:", response);

      if (response.status === 200) {
        console.log("Login successful");
      } else if (response.status === 201) {
        console.log("Registration successful, moving to OTP step");
        setCurrentStep(steps.OTP);
      } else {
        setError("حدث خطأ أثناء العملية");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "حدث خطأ أثناء العملية";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add OTP modal rendering
  const renderOtpModal = () => {
    console.log("Rendering OTP Modal with phone number:", formData.phone);
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${isOtpModalOpen ? "block" : "hidden"}`}
      >
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={() => setIsOtpModalOpen(false)}
        ></div>
        <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-11/12 md:w-1/2 lg:w-1/3">
          <h2 className="text-xl font-semibold text-center mb-4">
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
      </div>
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

                <button
                  type="submit"
                  className="w-full bg-[#3069B4] text-white rounded-lg py-2"
                >
                  تسجيل الدخول
                </button>

                <div className="text-center space-y-2">
                  <p className="text-sm">
                    هل أنت محامي؟ 
                    <Link
                      href="/Register-Lawyer"
                      className="text-[#FF883EE0] hover:underline"
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
                    أوافق لى شروط الاستخدام وسياسة الخصوصي
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
                    ل أنت محامي؟{" "}
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

            {loading && (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500 border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
      {renderOtpModal()}
    </>
  );
}
