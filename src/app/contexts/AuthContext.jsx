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
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUserName = localStorage.getItem("userName");
      const storedUserType = localStorage.getItem("userType");

      setToken(storedToken);
      setUserName(storedUserName);
      setUserType(storedUserType);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (userName) {
        localStorage.setItem("userName", userName);
      } else {
        localStorage.removeItem("userName");
      }
    }
  }, [userName]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (userType) {
        localStorage.setItem("userType", userType);
      } else {
        localStorage.removeItem("userType");
      }
    }
  }, [userType]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userType");
      localStorage.removeItem("profileImage");

      setToken(null);
      setUserName(null);
      setUserType(null);
      router.push("/");
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
        const { user, token: newToken } = response.data;

        if (!user || !newToken) {
          throw new Error("No user data or token received");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("token", newToken);
          localStorage.setItem("userName", user.name);
          localStorage.setItem("userType", user.user_type);
        }

        setToken(newToken);
        setUserName(user.name);
        setUserType(user.user_type);

        if (user.user_type === "user") {
          router.push("/Askquestion");
        } else if (user.user_type === "lawyer") {
          router.push("/Lawyer-dashboard");
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

      if (response.data) {
        const { data: user, token } = response.data;

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("userName", user.name);
          localStorage.setItem("userType", "user");
        }

        setToken(token);
        setUserName(user.name);
        setUserType("user");

        router.push("/Askquestion");
        return { data: response.data };
      }
      return { data: response.data };
    } catch (error) {
      console.error("User registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerLawyer = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/lawyer/register`,
        {
          name: userData.name,
          email: userData.email,
          city: userData.city,
          password: userData.password,
          phone: userData.phone,
          experience: userData.experience || 0,
          license_number: userData.license_number,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        const { data: user, token } = response.data;

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("userName", user.name);
          localStorage.setItem("userType", "lawyer");
        }

        setToken(token);
        setUserName(user.name);
        setUserType("lawyer");

        return {
          data: response.data,
        };
      }

      return {
        data: response.data,
      };
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, userType = "user") => {
    if (userType === "lawyer") {
      return registerLawyer(userData);
    }
    return registerUser(userData);
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
      return null;
    }
  };

  const value = {
    token,
    userName,
    userType,
    register,
    registerUser,
    registerLawyer,
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
