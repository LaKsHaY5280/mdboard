"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import {
  profileUpdateSchema,
  passwordChangeSchema,
  type ProfileUpdateValues,
  type PasswordChangeValues,
} from "@/lib/schema/profile";
import { useAuth } from "./useAuth";

export function useProfile() {
  const { user, fetchUser, logout } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileForm = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: user?.bio || "",
      interests: user?.interests || "",
    },
  });

  const passwordForm = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form defaults when user data changes
  const resetProfileForm = () => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio || "",
        interests: user.interests || "",
      });
    }
  };

  // Calculate profile completion percentage
  const getProfileCompletion = () => {
    if (!user) return 0;

    let completion = 0;
    const totalFields = 6; // firstName, lastName, email, bio, interests, createdAt

    if (user.firstName) completion += 1;
    if (user.lastName) completion += 1;
    if (user.email) completion += 1;
    if (user.bio) completion += 1;
    if (user.interests) completion += 1;
    if (user.createdAt) completion += 1;

    return Math.round((completion / totalFields) * 100);
  };

  // Calculate account age
  const getAccountAge = () => {
    if (!user?.createdAt) return "Unknown";
    const now = new Date();
    const created = new Date(user.createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  // Get account status based on age
  const getAccountStatus = () => {
    const age = getAccountAge();
    if (age.includes("days") && parseInt(age) < 7)
      return { label: "New", color: "bg-blue-500" };
    if (age.includes("days") && parseInt(age) < 30)
      return { label: "Active", color: "bg-green-500" };
    if (age.includes("months"))
      return { label: "Established", color: "bg-purple-500" };
    return { label: "Veteran", color: "bg-amber-500" };
  };

  // Get user role display configuration
  const getRoleDisplay = () => {
    const role = user?.role || "member";
    const roleConfig = {
      admin: { label: "Admin", color: "bg-red-500" },
      member: { label: "Member", color: "bg-blue-500" },
      premium: { label: "Premium", color: "bg-purple-500" },
    };
    return roleConfig[role as keyof typeof roleConfig] || roleConfig.member;
  };

  // Handle profile update
  const handleProfileUpdate = async (values: ProfileUpdateValues) => {
    setIsUpdatingProfile(true);
    try {
      await axios.put("/api/auth/profile", values);
      await fetchUser(); // Refresh user data
      setIsEditingProfile(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to update profile";
      toast.error(message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (values: PasswordChangeValues) => {
    setIsChangingPassword(true);
    try {
      await axios.put("/api/auth/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      passwordForm.reset();
      toast.success("Password changed successfully!");
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Failed to change password";
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle account deletion
  const handleAccountDeletion = async () => {
    setIsDeletingAccount(true);
    try {
      await axios.delete("/api/auth/profile");
      toast.success("Account deleted successfully");
      await logout();
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to delete account";
      toast.error(message);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // Start editing profile
  const startEditing = () => {
    setIsEditingProfile(true);
    resetProfileForm();
  };

  // Cancel editing profile
  const cancelEditing = () => {
    setIsEditingProfile(false);
    resetProfileForm();
  };

  return {
    // User data
    user,

    // Profile completion and stats
    profileCompletion: getProfileCompletion(),
    accountAge: getAccountAge(),
    accountStatus: getAccountStatus(),
    roleDisplay: getRoleDisplay(),

    // Forms
    profileForm,
    passwordForm,
    resetProfileForm,

    // UI state
    isEditingProfile,
    isUpdatingProfile,
    isChangingPassword,
    isDeletingAccount,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,

    // Actions
    handleProfileUpdate,
    handlePasswordChange,
    handleAccountDeletion,
    startEditing,
    cancelEditing,

    // UI state setters
    setShowCurrentPassword,
    setShowNewPassword,
    setShowConfirmPassword,
  };
}
