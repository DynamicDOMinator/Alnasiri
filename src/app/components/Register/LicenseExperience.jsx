"use client";
import React, { useState } from "react";
import moment from "moment-hijri"; // استيراد مكتبة moment-hijri

const LicenseExperience = () => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  // الحصول على السنة الهجرية الحالية بشكل ديناميكي
  const currentHijriYear = moment().iYear(); // السنة الهجرية الحالية باستخدام moment-hijri

  const handleLicenseChange = (e) => {
    const license = e.target.value;

    // تأكد من أن الإدخال يحتوي فقط على أرقام وأنه لا يتجاوز 6 أرقام
    if (/^\d{0,6}$/.test(license)) {
      setLicenseNumber(license);

      // تأكد من أن الرقم يحتوي على ما لا يقل عن 2 أرقام
      if (license.length >= 2) {
        const yearPrefix = parseInt(license.substring(0, 2)); // أول رقمين من الترخيص

        // الحصول على آخر رقمين فقط من السنة الهجرية في الترخيص
        const lastTwoDigits = yearPrefix % 100; // هذه الخطوة ستعطينا آخر رقمين فقط

        // حساب سنين الخبرة
        let experience = currentHijriYear - (1400 + lastTwoDigits); // طرح السنة الهجرية الأصلية من سنة الترخيص

        // التأكد من أن سنين الخبرة لا تكون قيمة سالبة أو كبيرة جدًا
        if (experience < 0) {
          experience += 100; // إذا كانت النتيجة سالبة، إضافة 100 لتصحيحها
        }

        // تحديث الـ input الخاص بسنة الخبرة
        setExperienceYears(experience);
      }
    }
  };

  return (
    <div>
      <label htmlFor="licenseNumber">رقم الترخيص:</label>
      <input
        type="text"
        id="licenseNumber"
        value={licenseNumber}
        onChange={handleLicenseChange}
        maxLength="6" // تحديد الحد الأقصى لعدد الأرقام بـ 6
        pattern="[0-9]*" // التأكد من أن الإدخال يحتوي فقط على أرقام
      />
      <br />
      <label htmlFor="experienceYears">سنين الخبرة:</label>
      <input
        type="number"
        id="experienceYears"
        value={experienceYears}
        readOnly
      />
    </div>
  );
};

export default LicenseExperience;
