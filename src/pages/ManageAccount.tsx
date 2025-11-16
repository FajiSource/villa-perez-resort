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
    <div className="min-h-screen w-screen overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
      <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8 !py-6 sm:!py-8 lg:!py-12 relative">
        {/* Header Section */}
        <div className="bg-white shadow-xl border border-[#e82574]/20 !mb-6 sm:!mb-8 w-screen">
          <div className="!px-6 sm:!px-8 lg:!px-10 !py-3 sm:!py-2 lg:!py-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between !gap-4 sm:!gap-6">
              <div className="space-y-2">
                <div className="flex items-center !gap-3">
                  <div className="w-12 h-12 bg-[#e82574] flex items-center justify-center shadow-md">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#bc1c5c]">
                      My Account
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base !mt-1">
                      View and manage your personal account details
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "secondary" : "default"}
                className="w-full sm:w-auto bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-md hover:shadow-lg transition-all duration-200 !px-6 !py-2.5"
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>

        {/* Account Content Section */}
        <div className="bg-white shadow-xl border border-[#e82574]/20 overflow-hidden w-screen">
          <div className="!p-6 sm:!p-8 lg:!p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 !gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    className="border-gray-300 focus:border-[#e82574] focus:ring-[#e82574]"
                    {...register("name", { required: "Name is required" })}
                    readOnly={!isEditing}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    className="border-gray-300 focus:border-[#e82574] focus:ring-[#e82574]"
                    {...register("username")}
                    readOnly={!isEditing}
                  />
                  {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="border-gray-300 focus:border-[#e82574] focus:ring-[#e82574]"
                    {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
                    readOnly={!isEditing}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    className="border-gray-300 focus:border-[#e82574] focus:ring-[#e82574]"
                    {...register("phone")}
                    readOnly={!isEditing}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>
              </div>

              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 !gap-6 border-t border-gray-200 !pt-6 !mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">New Password (optional)</Label>
                    <Input
                      id="password"
                      type="password"
                      className="border-gray-300 focus:border-[#e82574] focus:ring-[#e82574]"
                      {...register("password")}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="border-gray-300 focus:border-[#e82574] focus:ring-[#e82574]"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 !gap-6 border-t border-gray-200 !pt-6 !mt-6">
                <div className="space-y-2">
                  <Label className="text-gray-700">Account Status</Label>
                  <Input value={user.status?.toUpperCase() || "N/A"} readOnly className="bg-gray-100" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Role</Label>
                  <Input value={user.role?.toUpperCase() || "CUSTOMER"} readOnly className="bg-gray-100" />
                </div>
                {user.google_id && (
                  <div className="space-y-2">
                    <Label className="text-gray-700">Google ID</Label>
                    <Input value={user.google_id} readOnly className="bg-gray-100" />
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end !gap-4 !pt-6">
                  <Button
                    type="submit"
                    className="bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-md hover:shadow-lg transition-all duration-200 !px-8 !py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
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

