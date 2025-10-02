"use client";

import { useProfile } from "@/hooks/useProfile";

// Import modular components
import { ProfileView } from "./_components/ProfileView";
import { ProfileEditForm } from "./_components/ProfileEditForm";
import { PasswordChangeForm } from "./_components/PasswordChangeForm";
import { AccountOverview } from "./_components/AccountOverview";
import { DangerZone } from "./_components/DangerZone";

export default function ProfilePage() {
  const {
    user,
    profileCompletion,
    accountAge,
    accountStatus,
    roleDisplay,
    profileForm,
    passwordForm,
    isEditingProfile,
    isUpdatingProfile,
    isChangingPassword,
    isDeletingAccount,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    handleProfileUpdate,
    handlePasswordChange,
    handleAccountDeletion,
    startEditing,
    cancelEditing,
    setShowCurrentPassword,
    setShowNewPassword,
    setShowConfirmPassword,
  } = useProfile();

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Profile Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            {!isEditingProfile ? (
              <ProfileView
                user={user}
                accountStatus={accountStatus}
                profileCompletion={profileCompletion}
                onEditClick={startEditing}
              />
            ) : (
              <ProfileEditForm
                profileForm={profileForm}
                isUpdatingProfile={isUpdatingProfile}
                onSubmit={handleProfileUpdate}
                onCancel={cancelEditing}
              />
            )}

            {/* Password Change Section */}
            <PasswordChangeForm
              passwordForm={passwordForm}
              isChangingPassword={isChangingPassword}
              showCurrentPassword={showCurrentPassword}
              showNewPassword={showNewPassword}
              showConfirmPassword={showConfirmPassword}
              onSubmit={handlePasswordChange}
              onToggleCurrentPassword={() =>
                setShowCurrentPassword(!showCurrentPassword)
              }
              onToggleNewPassword={() => setShowNewPassword(!showNewPassword)}
              onToggleConfirmPassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Account Overview */}
            <AccountOverview
              user={user}
              accountAge={accountAge}
              profileCompletion={profileCompletion}
              accountStatus={accountStatus}
              roleDisplay={roleDisplay}
            />

            {/* Danger Zone */}
            <DangerZone onDeleteAccount={handleAccountDeletion} />
          </div>
        </div>
      </div>
    </div>
  );
}
