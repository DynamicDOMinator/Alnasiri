"use client";
import { useState } from "react";
import axios from "axios";

const Lawyer = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username:"",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    bio: "",
  });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/register", formData);
      setStep(3);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm font-medium ${
                step >= 1 ? "text-blue-500" : "text-gray-400"
              }`}
            >
              الخطوة 1
            </span>
            <span
              className={`text-sm font-medium ${
                step >= 2 ? "text-blue-500" : "text-gray-400"
              }`}
            >
              الخطوة 2
            </span>
            <span
              className={`text-sm font-medium ${
                step === 3 ? "text-blue-500" : "text-gray-400"
              }`}
            >
              الخطوة 3
            </span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div
              className={`absolute h-2 bg-blue-500 rounded-full transition-all duration-300 ease-in-out ${
                step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"
              }`}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-center">التسجيل</h2>
            <form>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                التالي
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-center">
              معلومات الملف الشخصي
            </h2>
            <form>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  الاسم الأول
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  الاسم الأخير
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  نبذة
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  إرسال
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold">شكراً لتسجيلك!</h2>
            <p className="text-gray-700">تم إنشاء حسابك بنجاح.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lawyer;
