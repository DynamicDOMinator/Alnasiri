"use client";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { BiErrorCircle } from "react-icons/bi";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-hijri";

export default function ChangeProfile() {
  const [cities, setCities] = useState([]);
  const [userData, setUserData] = useState("");
  const [currentName, setCurrentName] = useState({
    firstName: "",
    middleName: "",
    lastName: ""
  });
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
  const [experienceYears, setExperienceYears] = useState("");

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(`${baseUrl}/user/get-profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(response.data.data);
        
        // Split the full name into components
        if (response.data.data.name) {
          const nameParts = response.data.data.name.split(" ");
          setCurrentName({
            firstName: nameParts[0] || "",
            middleName: nameParts[1] || "",
            lastName: nameParts[2] || ""
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      // Create payload only with changed values
      const payload = {};
      
      // Check if any name components changed
      const hasNameChange = formData.firstName || formData.middleName || formData.lastName;
      if (hasNameChange) {
        const fullName = `${formData.firstName || currentName.firstName} ${formData.middleName || currentName.middleName} ${formData.lastName || currentName.lastName}`.trim();
        payload.name = fullName;
      }

      // Add other fields only if they were changed
      if (formData.license_number) payload.license_number = formData.license_number;
      if (experienceYears) payload.experience = experienceYears;
      if (formData.city) payload.city = formData.city;

      // Validate that at least one field has been changed
      if (Object.keys(payload).length === 0) {
        setNotification({
          show: true,
          message: "يجب تغيير حقل واحد على الأقل",
          type: "error",
        });

        setTimeout(() => {
          setNotification({ show: false, message: "", type: "" });
        }, 3000);
        return;
      }

      // Only make the API call if there are changes
      await axios.post(`${baseUrl}/lawyer/edit-lawyer-data`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (payload.name) {
        localStorage.setItem("userName", payload.name);
      }

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

    // Calculate experience when license number changes
    if (name === "license_number") {
      if (/^\d{0,6}$/.test(value)) {
        if (value.length >= 2) {
          const yearPrefix = parseInt(value.substring(0, 2));
          const lastTwoDigits = yearPrefix % 100;
          const currentHijriYear = moment().iYear();
          let experience = currentHijriYear - (1400 + lastTwoDigits);
          
          if (experience < 0) {
            experience += 100;
          }
          setExperienceYears(experience);
        } else {
          setExperienceYears("");
        }
      }
    }
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
        className="flex items-center justify-center w-full"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
        <form className="space-y-4 w-full " onSubmit={handleSubmit}>
          {/* Current Data Section */}
          <div className="bg-gray-50 mt-20 p-4 rounded-lg mb-6 space-y-4">
          
            
            {/* First Name */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={currentName.firstName}
                  className="border text-gray-500 rounded-md p-2 w-full text-right"
                  readOnly
                />
                <span className="absolute  -top-3 right-5 bg-white px-1 text-sm">
                  الاسم الأول الحالي
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border rounded-md p-2 w-full text-right"
                  onInput={handleArabicInput}
                  placeholder="ادخل الاسم الأول الجديد"
                />
                <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
                  الاسم الأول الجديد
                </span>
              </div>
            </div>

            {/* Middle Name */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={currentName.middleName}
                  className="border text-gray-500 rounded-md p-2 w-full text-right"
                  readOnly
                />
                <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
                  اسم الوسط الحالي
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
                  placeholder="ادخل اسم الوسط الجديد"
                />
                <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
                  اسم الوسط الجديد
                </span>
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={currentName.lastName}
                  className="border text-gray-500 rounded-md p-2 w-full text-right"
                  readOnly
                />
                <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
                  الاسم الأخير الحالي
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
                  placeholder="ادخل الاسم الأخير الجديد"
                />
                <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
                  الاسم الأخير الجديد
                </span>
              </div>
            </div>

            {/* License Number */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={userData.license_number || ""}
                  className="border text-gray-500 rounded-md p-2 w-full text-right"
                  readOnly
                />
                <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
                  رقم الترخيص الحالي
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  className="border rounded-md p-2 w-full text-right"
                  maxLength="6"
                  pattern="[0-9]*"
                  placeholder="ادخل رقم الترخيص الجديد"
                />
                <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
                  رقم الترخيص الجديد
                </span>
              </div>
            </div>

            {/* City */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={userData.city || ""}
                  className="border text-gray-500 rounded-md p-2 w-full text-right"
                  readOnly
                />
                <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
                  المدينة الحالية
                </span>
              </div>
              <div className="relative">
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="border rounded-md p-2 w-full text-right"
                >
                  <option value="">اختر المدينة الجديدة</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <span className="absolute -top-3 right-5 bg-white px-1 text-sm">
                  المدينة الجديدة
                </span>
              </div>
            </div>

     
          </div>

     
           
              <div className="flex justify-center pt-10 lg:sticky bottom-5 lg:w-1/2 mx-auto">
                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800"
                >
                  حفظ
                </button>
              </div>
            
        </form>
      </div>
    </div>
  );
}
