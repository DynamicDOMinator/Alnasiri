"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserTypeContext = createContext();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useUserType() {
  return useContext(UserTypeContext);
}

export function UserTypeProvider({ children }) {
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkUserType = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserType(null);
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/user_type/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('User type response:', response.data);

      if (response.data && response.data.user_type) {
        setUserType(response.data.user_type);
      } else {
        setUserType(null);
      }
    } catch (err) {
      console.error('Error fetching user type:', err);
      setError(err.message);
      setUserType(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Watch for token changes in localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        if (e.newValue) {
          checkUserType();
        } else {
          setUserType(null);
          setIsLoading(false);
        }
      }
    };

    // Check initial state
    const token = localStorage.getItem("token");
    if (token) {
      checkUserType();
    } else {
      setUserType(null);
      setIsLoading(false);
    }

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add a manual token check interval
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && !userType) {
        checkUserType();
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [userType]);

  const value = {
    userType,
    isLoading,
    error,
    checkUserType,
  };

  return (
    <UserTypeContext.Provider value={value}>
      {children}
    </UserTypeContext.Provider>
  );
}
