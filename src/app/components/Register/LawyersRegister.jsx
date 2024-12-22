"use client"
"use client";
import React, { useState } from "react";
import axios from "axios";
import moment from "moment-hijri"; // Importing moment-hijri

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    personalNumber: "",
    licenseNumber: "",
    experienceYears: "",
  });

  const [errors, setErrors] = useState({});

  // Get the current Hijri year dynamically
  const currentHijriYear = moment().iYear();

  const validateForm = () => {
    const newErrors = {};

    // Validate fields
    if (!formData.firstName.match(/^[\u0600-\u06FF\s]+$/)) {
      newErrors.firstName = "يجب أن يحتوي الاسم الأول على حروف عربية فقط.";
    }
    if (!formData.lastName.match(/^[\u0600-\u06FF\s]+$/)) {
      newErrors.lastName = "يجب أن يحتوي اسم العائلة على حروف عربية فقط.";
    }
    if (!formData.city) {
      newErrors.city = "يجب اختيار المدينة.";
    }
    if (!formData.personalNumber.match(/^[0-9]+$/)) {
      newErrors.personalNumber = "يجب أن يحتوي الرقم الشخصي على أرقام فقط.";
    }
   
   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLicenseChange = (e) => {
    const license = e.target.value;

    // Ensure the input contains only numbers and does not exceed 6 digits
    if (/^\d{0,6}$/.test(license)) {
      setFormData({ ...formData, licenseNumber: license });

      // Calculate experience years if the license number is at least 2 digits
      if (license.length >= 2) {
        const yearPrefix = parseInt(license.substring(0, 2)); // Extract the first two digits
        const lastTwoDigits = yearPrefix % 100; // Get only the last two digits
        let experience = currentHijriYear - (1400 + lastTwoDigits);

        // Adjust if experience is negative (cross-century calculation)
        if (experience < 0) {
          experience += 100;
        }
        if (experience == 0) {
            experience = 1;
          }

        setFormData({ ...formData, licenseNumber: license, experienceYears: experience });
      } else {
        setFormData({ ...formData, licenseNumber: license, experienceYears: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("/api/register", formData);
        alert("تم التسجيل بنجاح!");
        setFormData({
          firstName: "",
          lastName: "",
          city: "",
          personalNumber: "",
          licenseNumber: "",
          experienceYears: "",
        });
      } catch (error) {
        console.error("خطأ أثناء إرسال البيانات:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex pt-32 items-center justify-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-lg bg-white p-8 rounded shadow-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">تسجيل جديد</h1>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">الاسم الأول</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="أدخل الاسم الأول"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">اسم العائلة</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="أدخل اسم العائلة"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">المدينة</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">اختر المدينة</option>
            <option value="الرياض">الرياض</option>
            <option value="جدة">جدة</option>
            <option value="الدمام">الدمام</option>
          </select>
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">الرقم الشخصي</label>
          <input
            type="text"
            name="personalNumber"
            value={formData.personalNumber}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${
              errors.personalNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="أدخل الرقم الشخصي"
          />
          {errors.personalNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.personalNumber}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">رقم الترخيص</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleLicenseChange}
            className={`w-full px-4 py-2 border rounded ${
              errors.licenseNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="أدخل رقم الترخيص"
          />
          {errors.licenseNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">سنوات الخبرة</label>
          <input
            type="text"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${
              errors.experienceYears ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="أدخل سنوات الخبرة"
            readOnly
          />
          {errors.experienceYears && (
            <p className="text-red-500 text-xs mt-1">{errors.experienceYears}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          تسجيل
        </button>
      </form>
    </div>
  );
}
