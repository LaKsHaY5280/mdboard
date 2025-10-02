"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { LOGIN, DASHBOARD } from "@/routes";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  role?: string;
  avatar?: string;
  interests?: string;
  createdAt?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Fetch current user on hook initialization
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setUser(response.data.user);
      } catch (error: any) {
        // If fetching user fails, they're likely not authenticated
        console.log("No authenticated user found");
      } finally {
        setIsInitialized(true);
      }
    };

    fetchCurrentUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser(response.data.user);
      return response.data.user;
    } catch (error: any) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      return null;
    }
  };

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/login", data);
      setUser(response.data.user);
      toast.success("Welcome back!");
      router.push(DASHBOARD);
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/signup", data);
      setUser(response.data.user);
      toast.success("Account created successfully!");
      router.push(DASHBOARD);
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.error || "Signup failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      router.push(LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
      // Still clear user and redirect even if API call fails
      setUser(null);
      router.push(LOGIN);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    login,
    signup,
    logout,
    fetchUser,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
  };
}
