"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterModal({ isOpen, onClose, email }) {
  const router = useRouter();
  const { registerUser, verifyRegistrationOTP } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [registrationOtp, setRegistrationOtp] = useState(["", "", "", ""]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: email || "",
    password: "",
    acceptTerms: false,
  });

  useEffect(() => {
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, [email]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      const arabicOnly = value.replace(/[^\u0600-\u06FF\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: arabicOnly }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    const arabicNameRegex = /^[\u0600-\u06FF\s]+$/;
    if (!arabicNameRegex.test(formData.name)) {
      setError("الرجاء إدخال الاسم باللغة العربية فقط");
      return;
    }

    if (formData.phone.length > 9) {
      setError("رقم الجوال يجب أن لا يتجاوز 9 أرقام");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{9,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "كلمة المرور يجب أن تحتوي على: ٩ أحرف على الأقل، وحرف كبير، وحرف صغير، وأرقام"
      );
      return;
    }

    try {
      setIsLoading(true);
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: `+201${formData.phone}`,
        password: formData.password,
      };

      const response = await registerUser(userData);

      if (response.success) {
        setRegistrationData(response.data);
        setShowOtp(true);
        setError("");
      } else {
        setError(
          response.error === "Phone number already exists"
            ? "رقم الهاتف مستخدم بالفعل"
            : response.error
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 422) {
        setError(
          error.response.data.message === "Phone number already exists"
            ? "رقم الهاتف مستخدم بالفعل"
            : "يرجى التحقق من صحة البيانات المدخلة"
        );
      } else {
        setError("حدث خطأ أثناء التسجيل");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (registrationOtp.some((digit) => !digit)) {
      setError("الرجاء إدخال رمز التحقق كاملاً");
      return;
    }

    try {
      setIsLoading(true);
      const otp = registrationOtp.join("");

      const response = await verifyRegistrationOTP(otp);

      if (response.success) {
        onClose();
        router.push("/Askquestion");
      } else {
        setError(response.error || "رمز التحقق غير صحيح");
      }
    } catch (error) {
      setError("حدث خطأ في التحقق من الرمز");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full md:min-w-[500px] rounded-lg bg-white p-6">
          <button
            onClick={onClose}
            className="absolute top-2 left-2 text-gray-500 hover:text-gray-700"
          >
            <svg
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

          {showOtp ? (
            <div className="space-y-6 text-right">
              <div>
                <h2 className="text-xl font-bold text-[#FF883EE0] mb-2">
                  أدخل رمز التحقق
                </h2>
                <p className="text-sm text-gray-600">
                  تم إرسال رمز التحقق إلى بريدك الإلكتروني
                </p>
              </div>

              <div className="flex justify-center gap-3 mb-2 dir-rtl">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-14 h-14 text-center border-2 border-gray-300 rounded-lg text-xl font-semibold focus:border-[#3069B4] focus:ring-1 focus:ring-[#3069B4]"
                    value={registrationOtp[index]}
                    onChange={(e) => {
                      const newOtp = [...registrationOtp];
                      newOtp[index] = e.target.value;
                      setRegistrationOtp(newOtp);

                      if (e.target.value && index < 3) {
                        const nextInput =
                          e.target.parentElement.children[index + 1];
                        if (nextInput) nextInput.focus();
                      }
                    }}
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-right text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleOtpSubmit}
                disabled={isLoading || registrationOtp.some((digit) => !digit)}
                className="w-full bg-[#3069B4] text-white rounded-lg py-3 text-lg font-medium disabled:opacity-50 hover:bg-[#2859a0]"
              >
                {isLoading ? "جاري التحقق..." : "تأكيد"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-right">
              <h2 className="text-xl font-bold text-[#FF883EE0] mb-4">
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
                  أوافق على شروط الاستخدام وسياسة الخصوصية
                </span>
                <input
                  type="checkbox"
                  name="acceptTerms"
                  required
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-right">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#FF6624] text-white rounded-md py-2"
                disabled={isLoading}
              >
                {isLoading ? "جاري التسجيل..." : "التالي"}
              </button>
            </form>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
