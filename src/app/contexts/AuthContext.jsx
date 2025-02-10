"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function AuthProvider({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth data on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUserName = localStorage.getItem("userName");
      const storedUserType = localStorage.getItem("userType");

      if (storedToken && storedUserName && storedUserType) {
        setToken(storedToken);
        setUserName(storedUserName);
        setUserType(storedUserType);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    // Clear context state
    setToken(null);
    setUserName(null);
    setUserType(null);

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userType");
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);

      const response = await axios.post(`${API_BASE_URL}/login`, credentials, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.data) {
        if (
          response.data.message &&
          response.data.message.includes("OTP SENT")
        ) {
          return {
            success: true,
            requiresOTP: true,
            userData: response.data.data,
          };
        }

        // Direct login case
        const { user, token: newToken } = response.data;

        // Update context state
        setToken(newToken);
        setUserName(user.name);
        setUserType(user.user_type);

        if (user.user_type === "user") {
          router.push("/Askquestion");
        } else {
          router.push("/lawyer/dashboard");
        }

        // Persist in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("token", newToken);
          localStorage.setItem("userName", user.name);
          localStorage.setItem("userType", user.user_type);
        }

        return {
          success: true,
          requiresOTP: false,
          userData: user,
          token: newToken,
        };
      }
    } catch (error) {
      console.error("Login error details:", error.response?.data);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async ({ phone, otp }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/lawyer/verify-otp`,
        {
          otp: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data?.token) {
        // Update context state
        setToken(response.data.token);
        setUserName(response.data.user?.name);
        setUserType("lawyer"); // Since this is specifically for lawyer registration

        // Persist in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userName", response.data.user?.name);
          localStorage.setItem("userType", "lawyer");
        }

        return {
          success: true,
          userData: response.data.user,
          token: response.data.token,
        };
      }

      throw new Error("لم يتم استلام رمز التحقق");
    } catch (error) {
      console.error("OTP verification error:", error);
      throw new Error(error.response?.data?.message || "فشل التحقق من الرمز");
    }
  };

  const registerUser = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/user/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.message.includes("OTP SENT")) {
        return {
          success: true,
          requiresOTP: true,
          data: response.data.data,
          message: response.data.message,
        };
      }
      return { success: false, error: "Registration failed" };
    } catch (error) {
      console.error("Registration error details:", error.response?.data);

      if (error.response?.status === 422) {
        const errorMessage = error.response.data.message;
        if (typeof errorMessage === "object") {
          const firstError = Object.values(errorMessage)[0];
          return {
            success: false,
            error: Array.isArray(firstError) ? firstError[0] : errorMessage,
          };
        }
        return {
          success: false,
          error: errorMessage || "يرجى التحقق من صحة البيانات المدخلة",
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || "حدث خطأ أثناء التسجيل",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, userType = "user") => {
    return registerUser(userData);
  };

  const checkEmail = async (email) => {
    try {
      console.log("Making check-email request for:", email);

      const response = await axios.get(
        `${API_BASE_URL}/check-email/check-email`,
        {
          params: { email },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Check email response:", response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Check email error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "حدث خطأ في التحقق من البريد الإلكتروني",
      };
    }
  };

  const value = {
    token,
    userName,
    userType,
    register,
    registerUser,
    logout: handleLogout,
    loginUser: handleLogin,
    checkEmail,
    isAuthenticated: !!token,
    loading,
    verifyOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
