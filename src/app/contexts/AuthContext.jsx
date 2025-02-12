"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
   
    if (token && name) {
      setIsAuthenticated(true);
      setUserName(name);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        if (response.data.token) {
          const { token, user } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("userName", user.name);
          setUserName(user.name);
          setIsAuthenticated(true);
          setError(null);
          
          // Force a page reload to ensure all contexts are updated
          window.location.reload();
          
          return { success: true };
        } else if (response.data.message && response.data.message.includes("OTP SENT")) {
          return { 
            success: false, 
            requireOTP: true, 
            userData: response.data.data 
          };
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "خطأ في تسجيل الدخول");
      return { 
        success: false, 
        error: err.response?.data?.message || "خطأ في تسجيل الدخول" 
      };
    }
  };

  const verifyLoginOTP = async (otp) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/lawyer/verify-otp`,
        { otp },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        const { token, message: userData } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", userData.name);
        setUserName(userData.name);
        setIsAuthenticated(true);
        setError(null);
        
        // Force a page reload to ensure all contexts are updated
        window.location.reload();
        
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || "خطأ في التحقق من الرمز");
      return { 
        success: false, 
        error: err.response?.data?.message || "خطأ في التحقق من الرمز" 
      };
    }
  };

  const register = async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/lawyer/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.message === "OTP SENT") {
        return {
          success: true,
          requireOTP: true,
          userData: response.data.data,
        };
      }
      
      return { success: false, error: "Unexpected response format" };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "خطأ في التسجيل";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const verifyRegisterOTP = async (otp, userData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/lawyer/verify-register-otp`,
        { otp, ...userData },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.token) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.name);
        setUserName(user.name);
        setIsAuthenticated(true);
        setError(null);
        
        // Force a reload of the page to update the header
        window.location.reload();
        
        return { success: true };
      }
      
      return { success: false, error: "Unexpected response format" };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "خطأ في التحقق من الرمز";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUserName("");
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        error,
        userName,
        login,
        verifyLoginOTP,
        register,
        verifyRegisterOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
