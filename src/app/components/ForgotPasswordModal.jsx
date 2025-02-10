import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const router = useRouter();
  const [step, setStep] = useState("email"); // email, otp, password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState({
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);

  const getProfile = async () => {
    setError(""); // Reset error state before making the request
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("يرجى تسجيل الدخول أولاً");
        return;
      }

      const response = await axios.get(`${BASE_URL}/user/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userEmail = response.data.data.email;
      setEmail(userEmail);

      // Send OTP using the email directly
      try {
        await axios.post(`${BASE_URL}/password-recovery/send-otp`, {
          email: userEmail,
        });
        setSuccess("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
        setStep("otp");
      } catch (err) {
        setError(err.response?.data?.message || "فشل في إرسال رمز التحقق");
      }
    } catch (err) {
      setError("فشل في الحصول على البريد الإلكتروني");
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

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    setOtp(newOtpValues.join(""));

    // Move to next input if current input is filled
    if (value !== "") {
      if (index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
        setOtp(newOtpValues.join(""));
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    // Combine OTP values and check if complete
    const completeOtp = otpValues.join("");
    if (completeOtp.length !== 4) {
      setError("الرجاء إدخال رمز التحقق كاملاً");
      return;
    }

    setSuccess("تم التحقق من الرمز بنجاح");
    setStep("password");
    setOtp(completeOtp); // Store the OTP for later use
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword.password || !newPassword.password_confirmation) {
      setError("الرجاء إدخال كلمة المرور وتأكيدها");
      return;
    }

    const passwordError = validatePassword(newPassword.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword.password !== newPassword.password_confirmation) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      await axios.post(`${BASE_URL}/password-recovery/verify-otp`, {
        email,
        otp: parseInt(otp),
        password: newPassword.password,
        password_confirmation: newPassword.password_confirmation,
      });
      setSuccess("تم تغيير كلمة المرور بنجاح");
      setTimeout(() => {
        localStorage.removeItem("token");
        router.push("/");
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "فشل في تغيير كلمة المرور");
    }
  };

  // Add this function to reset OTP values
  const resetForm = () => {
    setOtpValues(["", "", "", ""]);
    setOtp("");
    setNewPassword({
      password: "",
      password_confirmation: "",
    });
    setError("");
    setSuccess("");
    setStep("email");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div
        className="bg-white p-8 rounded-lg max-w-md w-full mx-4 relative"
        dir="rtl"
      >
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <IoMdClose size={24} />
        </button>
        <h2 className="text-xl font-bold mb-6">استعادة كلمة المرور</h2>

        {step === "email" && (
          <div>
            <p className="mb-4">
              سيتم إرسال رمز التحقق إلى بريدك الإلكتروني {email}
            </p>
            <button
              type="button"
              onClick={getProfile}
              className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-900 w-full"
            >
              إرسال رمز التحقق
            </button>
          </div>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="flex justify-center flex-row-reverse gap-2 mb-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  dir="ltr"
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className="w-12 h-12 text-center text-2xl border-2 rounded-lg bg-gray-100 focus:outline-none focus:border-blue-500"
                  value={otpValues[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>

            <button
              type="submit"
              className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-900 w-full"
            >
              التحقق من الرمز
            </button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="border-2 relative rounded-lg">
              <label className="absolute -top-2.5 right-3 bg-white px-1 text-sm text-gray-600">
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                className="bg-gray-100 py-2 px-3 w-full focus:outline-none"
                value={newPassword.password}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, password: e.target.value })
                }
              />
            </div>

            <div className="border-2 relative rounded-lg">
              <label className="absolute -top-2.5 right-3 bg-white px-1 text-sm text-gray-600">
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                type="password"
                className="bg-gray-100 py-2 px-3 w-full focus:outline-none"
                value={newPassword.password_confirmation}
                onChange={(e) =>
                  setNewPassword({
                    ...newPassword,
                    password_confirmation: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-900 w-full"
            >
              تغيير كلمة المرور
            </button>
          </form>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
}
