import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import { User } from "../types/user";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface AccountUpdateData {
  name: string;
  username?: string;
  email: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export default function ManageAccount() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    fetchUserData();
  }, [isAuthenticated, token, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const userData = await apiService.get<User>("/api/user", { headers });
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountUpdateData>({
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: AccountUpdateData) => {
    setIsSubmitting(true);
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const updatePayload: Partial<AccountUpdateData> = {
        name: data.name,
        username: data.username,
        email: data.email,
        phone: data.phone,
      };

      if (data.password) {
        if (data.password !== data.confirmPassword) {
          toast.error("Passwords do not match.");
          setIsSubmitting(false);
          return;
        }
        updatePayload.password = data.password;
      }

      const updatedUserData = await apiService.patch<User>(
        `/api/users/${user?.id}`,
        updatePayload,
        { headers }
      );

      setUser(updatedUserData);
      toast.success("Account updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Account update error:", error);
      toast.error(error.message || "Failed to update account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#e82574]/20 border-t-[#e82574] mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600 text-sm sm:text-base font-medium">User data not available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-white to-[#e82574]/5">
      <div className="max-w-4xl mx-auto px-4! sm:px-6! lg:px-8! py-8! sm:py-10! lg:py-12!">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#e82574]/10 mb-8! overflow-hidden">
          <div className="bg-gradient-to-r from-[#e82574] to-[#bc1c5c] px-6! sm:px-8! lg:px-10! py-6! sm:py-8!">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4!">
              <div className="flex items-center gap-4!">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    My Account
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base mt-1!">
                    Manage your personal information and preferences
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className="w-full sm:w-auto bg-white text-[#e82574] hover:bg-white/90 border-0 shadow-md hover:shadow-lg transition-all duration-200 px-6! py-2.5! font-medium"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>

        {/* Account Content Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#e82574]/10 overflow-hidden">
          <div className="p-6! sm:p-8! lg:p-10!">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <div className="mb-6!">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1!">Personal Information</h2>
                  <p className="text-sm text-gray-500">Update your personal details and contact information</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6!">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      className="!h-11 border-gray-300 focus:border-[#e82574] focus:ring-[#e82574] !rounded-lg transition-colors"
                      {...register("name", { required: "Name is required" })}
                      readOnly={!isEditing}
                      disabled={!isEditing}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1!">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      className="h-11! border-gray-300 focus:border-[#e82574] focus:ring-[#e82574] rounded-lg! transition-colors"
                      {...register("username")}
                      readOnly={!isEditing}
                      disabled={!isEditing}
                    />
                    {errors.username && (
                      <p className="text-xs text-red-500 mt-1!">{errors.username.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="h-11! border-gray-300 focus:border-[#e82574] focus:ring-[#e82574] rounded-lg! transition-colors"
                      {...register("email", { 
                        required: "Email is required", 
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Please enter a valid email address"
                        }
                      })}
                      readOnly={!isEditing}
                      disabled={!isEditing}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1!">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      className="h-11! border-gray-300 focus:border-[#e82574] focus:ring-[#e82574] rounded-lg! transition-colors"
                      {...register("phone")}
                      readOnly={!isEditing}
                      disabled={!isEditing}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1!">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              {isEditing && (
                <div className="border-t border-gray-200 pt-8!">
                  <div className="mb-6!">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1!">Change Password</h2>
                    <p className="text-sm text-gray-500">Leave blank if you don't want to change your password</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6!">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        New Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        className="!h-11 border-gray-300 focus:border-[#e82574] focus:ring-[#e82574] !rounded-lg transition-colors"
                        {...register("password", {
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                          }
                        })}
                        placeholder="Enter new password"
                      />
                      {errors.password && (
                        <p className="text-xs text-red-500 mt-1!">{errors.password.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="h-11! border-gray-300 focus:border-[#e82574] focus:ring-[#e82574] rounded-lg! transition-colors"
                        {...register("confirmPassword")}
                        placeholder="Confirm new password"
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1!">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Account Details Section */}
              <div className="border-t border-gray-200 pt-8!">
                <div className="mb-6!">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1!">Account Details</h2>
                  <p className="text-sm text-gray-500">Your account information and status</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6!">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Account Status</Label>
                    <Input 
                      value={user.status?.toUpperCase() || "ACTIVE"} 
                      readOnly 
                      className="!h-11 bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed !rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Account Role</Label>
                    <Input 
                      value={user.role?.toUpperCase() || "CUSTOMER"} 
                      readOnly 
                      className="!h-11 bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed !rounded-lg"
                    />
                  </div>
                  {user.google_id && (
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-medium text-gray-700">Google Account</Label>
                      <Input 
                        value={user.google_id} 
                        readOnly 
                        className="!h-11 bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed !rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row justify-end gap-3! pt-6! border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="px-6! py-2.5! rounded-lg! border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-md hover:shadow-lg transition-all duration-200 px-8! py-2.5! rounded-lg! font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2!">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

