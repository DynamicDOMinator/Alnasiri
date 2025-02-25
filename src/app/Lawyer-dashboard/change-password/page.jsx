"use client";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import ForgotPasswordModal from "@/app/components/ForgotPasswordModal";

export default function ChangePassword() {
  const [passwords, setPasswords] = useState({
    old_password: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });

    // Clear success message when user starts typing
    setSuccess("");

    // Only show validation errors after user has typed something
    if (value.trim() !== "") {
      if (name === "password") {
        const passwordError = validatePassword(value);
        setErrors((prev) => ({
          ...prev,
          password: passwordError,
        }));
      } else if (name === "confirmPassword") {
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            value !== passwords.password ? "كلمات المرور غير متطابقة" : "",
        }));
      }
    } else {
      // Clear error when field is empty
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return "يجب أن تحتوي كلمة المرور على حروف كبيرة وصغيرة وأرقام";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    const newErrors = {
      old_password: !passwords.old_password.trim() ? "هذا الحقل مطلوب" : "",
      password: !passwords.password.trim()
        ? "هذا الحقل مطلوب"
        : validatePassword(passwords.password),
      confirmPassword: !passwords.confirmPassword.trim()
        ? "هذا الحقل مطلوب"
        : passwords.password !== passwords.confirmPassword
          ? "كلمات المرور غير متطابقة"
          : "",
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/change-data/change-password`,
        {
          old_password: passwords.old_password,
          password: passwords.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setSuccess("تم تغيير كلمة المرور بنجاح");
        setPasswords({ old_password: "", password: "", confirmPassword: "" });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "فشل تغيير كلمة المرور";
      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault(); // Prevent form submission
    setIsModalOpen(true);
  };

  return (
    <div dir="rtl">
      <div className="max-w-4xl mx-auto  px-4 mt-10 mb-32 lg:mt-16">
        <Link href="/Lawyer-dashboard/account-settings">
          {" "}
          <FaArrowRightLong />{" "}
        </Link>

        <h1 className="lg:text-3xl pt-5 text-xl text-center font-bold  lg:text-right">
          تغير كلمة المرور
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full mt-10">
            <label
              className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
              htmlFor="old_password"
            >
              كلمة المرور القديمة
            </label>
            <input
              className={`bg-gray-100 py-2 focus:outline-none w-full h-full px-3 ${
                errors.old_password ? "border-red-500" : ""
              }`}
              type="password"
              name="old_password"
              value={passwords.old_password}
              onChange={handleChange}
            />
            {errors.old_password && (
              <p className="text-red-500 text-xs mt-1">{errors.old_password}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleForgotPasswordClick}
            className="text-blue-700 pt-2 hover:underline"
          >
            هل نسيت كلمة المرور ؟
          </button>
          <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full my-10">
            <label
              className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
              htmlFor="password"
            >
              كلمة المرور الجديدة
            </label>
            <input
              className={`bg-gray-100 py-2 focus:outline-none w-full h-full px-3 ${
                errors.password ? "border-red-500" : ""
              }`}
              type="password"
              name="password"
              value={passwords.password}
              onChange={handleChange}
            />

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full my-10">
            <label
              className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
              htmlFor="confirmPassword"
            >
              تاكيد كلمة المرور الجديدة
            </label>
            <input
              className={`bg-gray-100 py-2 focus:outline-none w-full h-full px-3 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.general && (
            <p className="text-red-500 mb-4">{errors.general}</p>
          )}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <button
            type="submit"
          className="bg-green-700 mt-10  text-white  hover:bg-green-800 px-14 py-3 rounded-md"
          >
            حفظ التغيرات
          </button>
        </form>

        <ForgotPasswordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
