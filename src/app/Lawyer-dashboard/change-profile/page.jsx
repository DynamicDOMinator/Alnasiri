"use client";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { BiErrorCircle } from "react-icons/bi";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ChangeProfile() {
  const [cities, setCities] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    license_number: "",
    city: "",
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(`${baseUrl}/lawyer/get-all-cities`);
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem("token");
      const fullName =
        `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim();

      const payload = {
        name: fullName,
        license_number: formData.license_number,
        city: formData.city,
      };

      await axios.post(`${baseUrl}/lawyer/edit-lawyer-data`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("userName", fullName);

      // Store notification in sessionStorage before reload
      sessionStorage.setItem(
        "profileUpdateNotification",
        JSON.stringify({
          show: true,
          message: "تم تحديث البيانات بنجاح",
          type: "success",
        })
      );

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        show: true,
        message: "حدث خطأ أثناء تحديث البيانات",
        type: "error",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  // Check for notification in sessionStorage on component mount
  useEffect(() => {
    const savedNotification = sessionStorage.getItem(
      "profileUpdateNotification"
    );
    if (savedNotification) {
      setNotification(JSON.parse(savedNotification));
      // Clear the stored notification
      sessionStorage.removeItem("profileUpdateNotification");
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArabicInput = (e) => {
    // Arabic Unicode range regex
    const arabicRegex = /^[\u0600-\u06FF\s]*$/;
    if (!arabicRegex.test(e.target.value)) {
      e.target.value = e.target.value.replace(/[^\u0600-\u06FF\s]/g, "");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10 mb-32 lg:mt-16 min-h-screen relative">
      {notification.show && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex flex-row-reverse items-center gap-2 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <FaCheckCircle className="text-green-500 text-xl" />
          ) : (
            <BiErrorCircle className="text-red-500 text-xl" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <Link href="/Lawyer-dashboard/account-settings">
        {" "}
        <FaArrowRightLong className="ml-auto" />{" "}
      </Link>

      <h1 className="lg:text-3xl pt-5 text-xl text-center font-bold lg:text-right">
        تعديل المعلومات الشخصية
      </h1>
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="border rounded-md p-2 w-full text-right"
              onInput={handleArabicInput}
              placeholder="ادخل الاسم الأول باللغة العربية"
            />
            <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
              الاسم الاول
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="border rounded-md p-2 w-full text-right"
              onInput={handleArabicInput}
              placeholder="ادخل اسم الوسط باللغة العربية"
            />
            <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
              اسم الوسط
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border rounded-md p-2 w-full text-right"
              onInput={handleArabicInput}
              placeholder="ادخل الاسم الأخير باللغة العربية"
            />
            <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
              الاسم الاخير
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              className="border rounded-md p-2 w-full text-right"
              maxLength={6}
            />
            <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
              رقم رخصة المحاماة
            </span>
          </div>

          <div className="relative">
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="border rounded-md p-2 w-full text-right"
            >
              <option value="">اختر المدينة</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
              مدينة العمل
            </span>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-1/2 bg-green-700 text-white py-2 rounded-md hover:bg-green-800"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
