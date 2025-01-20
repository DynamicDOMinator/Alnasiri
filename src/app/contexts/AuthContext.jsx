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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem("token"));
      setUserName(localStorage.getItem("userName"));
      setUserType(localStorage.getItem("userType"));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    } else {
      localStorage.removeItem("userName");
    }
  }, [userName]);

  useEffect(() => {
    if (userType) {
      localStorage.setItem("userType", userType);
    } else {
      localStorage.removeItem("userType");
    }
  }, [userType]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    setToken(null);
    setUserName(null);
    setUserType(null);
    router.push("/");
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
        const { user, token: newToken } = response.data;

        if (!user || !newToken) {
          throw new Error("No user data or token received");
        }

        localStorage.setItem("token", newToken);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userType", user.user_type);

        setToken(newToken);
        setUserName(user.name);
        setUserType(user.user_type);

        if (user.user_type === "user") {
          router.push("/Askquestion");
        } else if (user.user_type === "lawyer") {
          return null;
        }

        return response.data;
      }
    } catch (error) {
      console.error("Login error details:", error.response?.data);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, userType = "user") => {
    try {
      setLoading(true);
      const endpoint =
        userType === "lawyer"
          ? `${API_BASE_URL}/lawyer/register`
          : `${API_BASE_URL}/user/register`;

      const formattedData =
        userType === "lawyer"
          ? {
              name: userData.name,
              email: userData.email,
              city: userData.city,
              password: userData.password,
              phone: userData.phone,
              experience: userData.experience || 0,
              license_number: userData.license_number,
            }
          : {
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              password: userData.password,
            };

      const response = await axios.post(endpoint, formattedData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", userType);
        localStorage.setItem("userName", response.data.data.name);

        if (userType === "lawyer") {
          
          window.location.reload();
        }

        setToken(response.data.token);
        setUserName(response.data.data.name);
        setUserType(userType);

        return {
          success: true,
          data: response.data,
          status: response.status,
        };
      }

      return {
        success: false,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkEmail = async (email) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/check-email/check-email`,
        {
          params: { email },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error("Email check error:", error);
      return false;
    }
  };

  const value = {
    token,
    userName,
    userType,
    register,
    logout: handleLogout,
    loginUser: handleLogin,
    checkEmail,
    isAuthenticated: !!token,
    loading,
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
