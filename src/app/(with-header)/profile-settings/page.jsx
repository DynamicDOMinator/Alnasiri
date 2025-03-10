"use client";
import { useState, useEffect } from "react";
import { TiEdit } from "react-icons/ti";
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import ForgotPasswordModal from "@/app/components/ForgotPasswordModal";
import { useUserType } from "@/app/contexts/UserTypeContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ProfileSettings() {
  const { logout, isAuthenticated } = useAuth();
  const { userType, isLoading: userTypeLoading } = useUserType();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userTypeLoading && (!isAuthenticated || userType === "lawyer")) {
      window.location.href = "/";
    }
  }, [isAuthenticated, userType, userTypeLoading]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [editingField, setEditingField] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [tempNotificationStatus, setTempNotificationStatus] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  let token = "";

  if (typeof window !== "undefined") {
    token = window.localStorage.getItem("token");
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/user/get-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData({
          name: response.data.data.name || "",
          email: response.data.data.email || "",
          phone: response.data.data.phone || "",
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [BASE_URL, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleEditClick = (fieldName) => {
    if (editingField === fieldName) {
      setEditingField(null);
      setEditedValues({});
    } else {
      setEditingField(fieldName);
      setEditedValues({ ...editedValues, [fieldName]: "" });
    }
  };

  // Add validation functions
  const validatePassword = (password) => {
    if (password.length !== 9) {
      return {
        isValid: false,
        message: "كلمة المرور يجب أن تكون 9 أحرف",
      };
    }
    return { isValid: true };
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: "البريد الإلكتروني غير صالح",
      };
    }
    return { isValid: true };
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^5\d{8}$/; // Starts with 5 followed by exactly 8 digits

    if (!phoneRegex.test(phone)) {
      return {
        isValid: false,
        message: "رقم الجوال يجب أن يبدأ ب 5 ويتكون من 9 أرقام",
      };
    }
    return { isValid: true };
  };

  const validateName = (name) => {
    // Check for any English characters
    if (/[a-zA-Z]/.test(name)) {
      return {
        isValid: false,
        message: "لا يمكن استخدام الحروف الإنجليزية في الاسم",
      };
    }

    const arabicNameRegex = /^[\u0600-\u06FF\s]+$/; // Arabic Unicode range

    if (!arabicNameRegex.test(name)) {
      return {
        isValid: false,
        message: "يجب أن يحتوي الاسم على حروف عربية فقط",
      };
    }
    if (name.length < 2) {
      return {
        isValid: false,
        message: "يجب أن يحتوي الاسم على حرفين على الأقل",
      };
    }
    return { isValid: true };
  };

  const [validationError, setValidationError] = useState("");

  const handleSaveField = async (fieldName) => {
    try {
      setValidationError(""); // Clear any previous validation errors

      if (fieldName === "name") {
        const nameValidation = validateName(editedValues[fieldName]);
        if (!nameValidation.isValid) {
          setMessage({
            type: "error",
            text: nameValidation.message,
          });
          return;
        }

        const response = await axios.post(
          `${BASE_URL}/change-data/change-name`,
          { name: editedValues[fieldName] },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.message) {
          // Update local storage with new name
          localStorage.setItem("userName", editedValues[fieldName]);

          // Update form data
          setFormData((prev) => ({
            ...prev,
            name: editedValues[fieldName],
          }));

          setMessage({
            type: "success",
            text: response.data.message,
          });

          // Clear editing state
          setEditingField(null);
          setEditedValues({});

          // Add a small delay before reloading to show the success message
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }

      if (fieldName === "phone") {
        const phoneValidation = validatePhone(editedValues[fieldName]);
        if (!phoneValidation.isValid) {
          setMessage({
            type: "error",
            text: phoneValidation.message,
          });
          return;
        }
      }

      if (fieldName === "email") {
        const emailValidation = validateEmail(editedValues[fieldName]);
        if (!emailValidation.isValid) {
          setMessage({
            type: "error",
            text: emailValidation.message,
          });
          return;
        }

        const response = await axios.post(
          `${BASE_URL}/change-data/change-email`,
          { email: editedValues[fieldName] },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 || response.data.success) {
          setMessage({
            type: "success",
            text: "تم تحديث البريد الإلكتروني بنجاح",
          });

          setTimeout(() => {
            setMessage({ type: "", text: "" });
            logout();
          }, 2000);
        }
      }

      if (fieldName === "password") {
        // Validate passwords match first
        if (editedValues.new_password !== editedValues.confirm_password) {
          setValidationError("كلمات المرور غير متطابقة");
          setMessage({
            type: "error",
            text: "كلمات المرور غير متطابقة",
          });
          return;
        }

        // Only check password length if passwords match
        const passwordValidation = validatePassword(editedValues.new_password);
        if (!passwordValidation.isValid) {
          setValidationError(passwordValidation.message);
          setMessage({
            type: "error",
            text: passwordValidation.message,
          });
          return;
        }

        const response = await axios.post(
          `${BASE_URL}/change-data/change-password`,
          {
            old_password: editedValues.old_password,
            password: editedValues.new_password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 || response.data.success) {
          setMessage({
            type: "success",
            text: "تم تحديث كلمة المرور بنجاح",
          });

          setTimeout(() => {
            setMessage({ type: "", text: "" });
            logout();
          }, 2000);
        }
      }

      setEditingField(null);
      setEditedValues({});
      setValidationError("");
    } catch (error) {
      console.error("Error details:", error.response || error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "حدث خطأ أثناء التحديث",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditedValues({});
    setValidationError(""); // Clear validation error when canceling
  };

  // Update renderPasswordHelperText to show the current validation error
  const renderPasswordHelperText = () => (
    <div className="text-sm text-red-500 mt-1 text-right">
      {validationError}
    </div>
  );

  const [notificationStatus, setNotificationStatus] = useState(false);

  // Fetch notification status on component mount
  useEffect(() => {
    const fetchNotificationStatus = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/stop-notification/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotificationStatus(response.data.notification_status === 1);
      } catch (error) {
        console.error("Error fetching notification status:", error);
      }
    };

    if (token) {
      fetchNotificationStatus();
    }
  }, [token, BASE_URL]);

  // Update the notification toggle handler
  const handleNotificationToggle = () => {
    setEditingField("notifications");
    setTempNotificationStatus(!notificationStatus);
  };

  // Add new handler for saving notification status
  const handleSaveNotifications = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/stop-notification/start-stop`,
        {
          notification_status: tempNotificationStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        setNotificationStatus(tempNotificationStatus);
        setMessage({
          type: "success",
          text: "تم تحديث حالة الإشعارات بنجاح",
        });

        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 2000);
      }
      setEditingField(null);
    } catch (error) {
      console.error("Error updating notification status:", error);
      setMessage({
        type: "error",
        text: "حدث خطأ أثناء تحديث حالة الإشعارات",
      });
    }
  };

  // Add handler for canceling notification edit
  const handleCancelNotifications = () => {
    setEditingField(null);
    setTempNotificationStatus(notificationStatus);
  };

  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

  const renderField = (fieldName, label, type = "text") => {
    const isEditing = editingField === fieldName;
    const isPassword = fieldName === "password";
    const isPhone = fieldName === "phone";

    const handleNameInput = (e) => {
      // Only allow Arabic characters and spaces
      const arabicValue = e.target.value.replace(/[^\u0600-\u06FF\s]/g, "");
      setEditedValues({
        ...editedValues,
        [fieldName]: arabicValue,
      });
    };

    return (
      <div className="space-y-2">
        <div className="relative py-2">
          <div className="relative">
            {/* Regular fields (including password) */}
            <input
              id={fieldName}
              type={type}
              dir="rtl"
              value={
                isPassword
                  ? "********"
                  : isPhone
                    ? ` 0${formData[fieldName]}`
                    : formData[fieldName]
              }
              readOnly
              className="w-full px-4 py-2 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 bg-gray-100"
            />
            <label
              className="absolute -top-2 right-4 px-1 bg-white text-sm text-gray-600"
              htmlFor={fieldName}
            >
              {label}
            </label>
            <button
              type="button"
              onClick={() => handleEditClick(fieldName)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <TiEdit className="w-6 h-6" />
            </button>
          </div>

          {/* Add Forgot Password link for password field */}
          {fieldName === "password" && !isEditing && (
            <button
              type="button"
              onClick={() => setIsForgotPasswordModalOpen(true)}
              className="text-blue-700 text-right w-full pt-2 hover:underline"
            >
              هل نسيت كلمة المرور ؟
            </button>
          )}

          {/* Edit mode */}
          {isEditing && (
            <div className="mt-4">
              {isPassword ? (
                // Password change fields
                <div className="space-y-4">
                  {/* Current Password Input */}
                  <div className="relative">
                    <input
                      id="old-password"
                      type="password"
                      dir="rtl"
                      value={editedValues.old_password || ""}
                      onChange={(e) =>
                        setEditedValues({
                          ...editedValues,
                          old_password: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="ادخل كلمة المرور الحالية"
                    />
                    <label className="absolute -top-2 right-4 px-1 bg-white text-sm text-gray-600">
                      كلمة المرور الحالية
                    </label>
                  </div>

                  {/* New Password Input */}
                  <div className="relative">
                    <input
                      id="new-password"
                      type="password"
                      dir="rtl"
                      value={editedValues.new_password || ""}
                      onChange={(e) =>
                        setEditedValues({
                          ...editedValues,
                          new_password: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="كلمة المرور يجب انت تكون علي الاقل 9 خانات"
                    />
                    <label className="absolute -top-2 right-4 px-1 bg-white text-sm text-gray-600">
                      كلمة المرور الجديدة
                    </label>
                  </div>

                  {/* Confirm New Password Input */}
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type="password"
                      dir="rtl"
                      value={editedValues.confirm_password || ""}
                      onChange={(e) =>
                        setEditedValues({
                          ...editedValues,
                          confirm_password: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="كلمة المرور الجديدة"
                    />
                    <label className="absolute -top-2 right-4 px-1 bg-white text-sm text-gray-600">
                      تأكيد كلمة المرور
                    </label>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {isPhone && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      +966
                    </span>
                  )}
                  <input
                    id={`${fieldName}-edit`}
                    type={type}
                    dir={isPhone ? "ltr" : "rtl"}
                    value={editedValues[fieldName] || ""}
                    onChange={(e) => {
                      if (isPhone) {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 9) {
                          setEditedValues({
                            ...editedValues,
                            [fieldName]: value,
                          });
                        }
                      } else if (fieldName === "name") {
                        handleNameInput(e);
                      } else {
                        setEditedValues({
                          ...editedValues,
                          [fieldName]: e.target.value,
                        });
                      }
                    }}
                    className={`w-full px-4 py-2 ${
                      isPhone ? "text-left" : "text-right"
                    } border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                      isPhone ? "pl-16" : ""
                    }`}
                    placeholder={
                      fieldName === "name"
                        ? "الاسم كامل باللغة العربية"
                        : fieldName === "password"
                        ? "كلمة المرور يجب انت تكون علي الاقل 9 خانات"
                        : `ادخل ${label} الجديد`
                    }
                  />
                  <label
                    className="absolute -top-2 right-4 px-1 bg-white text-sm text-gray-600"
                    htmlFor={`${fieldName}-edit`}
                  >
                    {`${label} الجديد`}
                  </label>
                </div>
              )}

              {/* Only show password requirements when there's a validation error */}
              {isEditing && isPassword && renderPasswordHelperText()}

              {/* Only show save/cancel buttons when editing */}
              {isEditing && (
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                  >
                    الغاء
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveField(fieldName)}
                    className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    حفظ
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const [message, setMessage] = useState({ type: "", text: "" });

  return (
    <div className="container mx-auto p-6 max-w-2xl my-14 min-h-screen">
      {isLoading || userTypeLoading ? (
        <div className="absolute inset-0 flex justify-center items-center">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
        </div>
      ) : (
        <div>
          {message.text && (
            <div
              className={`mb-4 p-4 rounded-md text-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <h1 className="text-2xl font-bold mb-8 text-right">اعدادات الحساب</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {renderField("name", "الاسم")}
              {renderField("email", "البريد الالكتروني", "email")}
              {renderField("phone", "رقم الجوال", "tel")}
              {renderField("password", "كلمة المرور", "password")}

              {/* Notification Checkbox */}
              <div className="space-y-4">
                <div className="flex items-center flex-row-reverse justify-start space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={
                      editingField === "notifications"
                        ? tempNotificationStatus
                        : notificationStatus
                    }
                    onChange={handleNotificationToggle}
                    className="w-6 h-6  accent-blue-500 focus:outline-none  "
                  />
                  <label
                    htmlFor="notifications"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    الاشتراك في الإشعارات علي البريد الالكتروني
                  </label>
                </div>

                {/* Add Save/Cancel buttons for notifications */}
                {editingField === "notifications" && (
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={handleCancelNotifications}
                      className="px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                    >
                      الغاء
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNotifications}
                      className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      حفظ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>

          <ForgotPasswordModal
            isOpen={isForgotPasswordModalOpen}
            onClose={() => setIsForgotPasswordModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
