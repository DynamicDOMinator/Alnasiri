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

// Define axiosInstance or use axios directly
const axiosInstance = axios; // Assuming you want to use axios directly

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
        setIsExistingUser(true); // Set existing user state based on the result
        setCurrentStep(steps.LOGIN); // Set to LOGIN step
        setShowPasswordInput(true); // Show password input if user exists
      } else {
        // Email not found, transition to registration step
        setCurrentStep(steps.REGISTER); // Set to REGISTER step
        setShowPasswordInput(false); // Hide password input if user does not exist
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (currentStep === steps.LOGIN) {
        // Submit only email and password for login
        const response = await axios.post(
          "https://theoretical-agatha-ahmedelsamman-4d2b79ac.koyeb.app/users/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );
        const res = response.data;
        const user = res.user;
        const token = res.token;

        // Store user data in local storage
        if (typeof window !== "undefined") {
          // Check if in browser
          localStorage.setItem("auth", token); // Store the token
          localStorage.setItem("username", user.username);
          localStorage.setItem("role", user.role);
        }

        // Call the onLogin function passed from Header
        onLogin(user);

        // Redirect to /Askquestion if role is user
        if (user.role === "user") {
          window.location.href = "/Askquestion";
        } else {
          // Close the modal for other roles
          onClose();
        }
      } else if (currentStep === steps.REGISTER) {
        // New registration logic
        const registrationData = {
          username: formData.username,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          acceptTerms: formData.acceptTerms,
          role: "user",
        };

        const response = await axios.post(
          "https://theoretical-agatha-ahmedelsamman-4d2b79ac.koyeb.app/users/register",
          registrationData
        );

        const res = response.data;
        const user = res.user;
        const token = res.token;

        // Store user data in local storage
        if (typeof window !== "undefined") {
          // Check if in browser
          localStorage.setItem("auth", token); // Store the token
          localStorage.setItem("username", user.username);
          localStorage.setItem("role", user.role);
        }

        // Call the onLogin function passed from Header
        onLogin(user);

        // Close the modal
        onClose();
      }
    } catch (err) {
      // Improved error handling
      console.error("Error during login:", err);
      if (err.response) {
        if (err.response.status === 400) {
          setError("البيانات المدخلة غير صحيحة، يرجى المحاولة مرة أخرى");
          return;
        }
      }
      setError(
        err.response?.data?.message || "حدث خطأ ما، يرجى المحاولة مرة أخرى"
      );
    } finally {
      setLoading(false);
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
              <p>قم بإدخال البريد الإلكتروني الخاص بك</p>

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

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          {loading && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
