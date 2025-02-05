"use client";
import { useState } from "react";
import { TiEdit } from "react-icons/ti";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [editingField, setEditingField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  const handleEditClick = (fieldName) => {
    setEditingField(editingField === fieldName ? null : fieldName);
  };

  const handleSaveField = (fieldName) => {
    // Here you can add logic to save the specific field
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const renderField = (fieldName, label, type = "text") => {
    const isEditing = editingField === fieldName;
    
    return (
      <div className="space-y-2 ">
        <div className="relative py-2">
          <div className="relative">
            <input
              id={fieldName}
              type={type}
              dir="rtl"
              value={formData[fieldName]}
              onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
              className="w-full px-4 py-2 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
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
          {isEditing && (
            <div className="flex justify-end gap-2 mt-2">
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
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8 text-right">اعدادات الحساب</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {renderField("name", "الاسم")}
          {renderField("email", "البريد الالكتروني", "email")}
          {renderField("phone", "رقم الجوال", "tel")}
          {renderField("oldPassword", "كلمة المرور القديمة", "password")}
          {renderField("newPassword", "كلمة المرور الجديدة", "password")}
          {renderField("confirmNewPassword", "اعادة كتابة كلمة المرور الجديدة", "password")}
        </div>

        <div className="flex justify-end gap-4 mt-8">
        
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            الغاء
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            حفظ
          </button>
        </div>
      </form>
    </div>
  );
}