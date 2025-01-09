"use client";
import { useState } from "react";
import Image from "next/image";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [formData, setFormData] = useState({
    city: "القاهرة",
    officeName: "مكتب المحامي أحمد",
    priorities: ["القضايا الجنائية"],
    image: null,
    location: "",
    bio: {
      line1:
        "مرحبا انا المحامي أحمد مسئول عن القضاية الجنائية ومسئول عن اثبات البراءة",
      line2: "محقق اكتر من 100 قضية جنائية",
    },
  });

  const legalSpecialties = [
    "القضايا الجنائية",
    "قضايا الأسرة",
    "القضايا المدنية",
    "قضايا العمل",
    "القضايا التجارية",
    "قضايا الملكية الفكرية",
    "قضايا العقارات",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you'll add your API call
    setIsEditing(false);
  };

  const isValidGoogleMapsUrl = (url) => {
    return url.includes("google.com/maps") || url.includes("goo.gl/maps");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "location" && value && !isValidGoogleMapsUrl(value)) {
      setNotificationMessage("الرجاء إدخال رابط صحيح من خرائط جوجل");
      setShowNotification(true);
      // Auto hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriorityChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      // Don't add if already selected
      if (prev.priorities.includes(value)) {
        return prev;
      }
      // Only add if less than 7 items
      if (prev.priorities.length < 7) {
        return {
          ...prev,
          priorities: [...prev.priorities, value],
        };
      }
      return prev;
    });
  };

  const removePriority = (priorityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      priorities: prev.priorities.filter(
        (priority) => priority !== priorityToRemove
      ),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div dir="rtl" className=" lg:max-w-3xl mx-auto px-4">
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white border-r-4 border-red-500 shadow-lg rounded-lg px-4 py-3 flex items-center">
            <div className="text-red-500 rounded-full bg-red-100 p-1 mr-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="mr-2">
              <p className="text-gray-800">{notificationMessage}</p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="mr-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="mb-8 lg:pt-16 pt-10 bg-white z-30 sticky top-0">
        <h1 className="lg:text-3xl text-center lg:text-right font-bold text-gray-800">
          معلومات صفحتي الشخصية
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 bg-white rounded-xl p-6 shadow-sm">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-500">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-500" />
            )}
          </div>

          <label
            htmlFor="profile-image"
            className="cursor-pointer block text-center mt-4"
          >
            <span className="border-2 border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors inline-block">
              تعديل الصورة
            </span>
            <input
              type="file"
              id="profile-image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="text-center space-y-2 text-gray-700 max-w-2xl">
          <p>{formData.bio.line1}</p>
          <p>{formData.bio.line2}</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="block text-gray-700 font-medium mb-2">
              نبذة تعريفية:
            </span>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  name="bio.line1"
                  value={formData.bio.line1}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bio: { ...prev.bio, line1: e.target.value },
                    }))
                  }
                  className="w-full border-2 p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none mb-2"
                />
                <input
                  name="bio.line2"
                  value={formData.bio.line2}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bio: { ...prev.bio, line2: e.target.value },
                    }))
                  }
                  className="w-full border-2 p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="block p-2">{formData.bio.line1}</p>
                <p className="block p-2">{formData.bio.line2}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="block text-gray-700 font-medium mb-2">
              مدينة العمل:
            </span>
            {isEditing ? (
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border-2 p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            ) : (
              <span className="block p-2">{formData.city}</span>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="block text-gray-700 font-medium mb-2">
              اسم المكتب:
            </span>
            {isEditing ? (
              <input
                name="officeName"
                value={formData.officeName}
                onChange={handleChange}
                className="w-full border-2 p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            ) : (
              <span className="block p-2">{formData.officeName}</span>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="block text-gray-700 font-medium mb-2">
              التخصصات والأولويات:
            </span>
            {isEditing ? (
              <div className="space-y-3">
                <select
                  onChange={handlePriorityChange}
                  className="w-full border-2 p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  value=""
                >
                  <option value="" disabled>
                    اختر تخصص
                  </option>
                  {legalSpecialties.map((specialty) => (
                    <option
                      key={specialty}
                      value={specialty}
                      disabled={formData.priorities.includes(specialty)}
                    >
                      {specialty}
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2">
                  {formData.priorities.map((priority) => (
                    <span
                      key={priority}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {priority}
                      <button
                        type="button"
                        onClick={() => removePriority(priority)}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {formData.priorities.length === 7 && (
                  <p className="text-orange-500 text-sm">
                    لقد وصلت للحد الأقصى من التخصصات
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.priorities.map((priority) => (
                  <span
                    key={priority}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {priority}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="block text-gray-700 font-medium mb-2">
              موقع المكتب على خرائط جوجل:
            </span>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="...https://maps.google.com/"
                  className="w-full border-2 p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <p className="text-sm text-gray-500">
                  قم بنسخ رابط موقعك من خرائط جوجل والصقه هنا
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.location ? (
                  <span className="block p-2 text-blue-600 hover:underline">
                    <a
                      href={formData.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0C6.478 0 3.618 2.86 3.618 6.382c0 4.788 6.382 13.618 6.382 13.618s6.382-8.83 6.382-13.618C16.382 2.86 13.522 0 10 0zm0 9.764a3.382 3.382 0 110-6.764 3.382 3.382 0 010 6.764z" />
                      </svg>
                      عرض الموقع على الخريطة
                    </a>
                  </span>
                ) : (
                  <span className="block p-2 text-gray-500">
                    لم يتم إضافة موقع المكتب بعد
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {isEditing ? "إلغاء" : "تعديل"}
            </button>

            {isEditing && (
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                حفظ التغييرات
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
