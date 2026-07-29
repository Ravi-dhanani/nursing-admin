"use client";

import Loading from "@/common/Loading";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

type ProfileForm = {
  name: string;
  email: string;
  city: string;
  mobile: string;
};

// Form Validation Schema
const schema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: yup.string().required("Email is required").email("Enter valid email"),
  city: yup.string().required("City is required"),
  mobile: yup.string().required("Mobile is required"),
});

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: yupResolver(schema),
  });

  // 1. Fetch profile data on page load
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const phone = storedUser?.a3_phone_number;

        if (!phone) {
          toast.error("User phone number not found.");
          setLoading(false);
          return;
        }

        // GET user data from API
        const res = await fetch(
          `/api/profile/details?a3_phone_number=${phone}`,
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load profile");

        // Format data (handle array or single object)
        const user = Array.isArray(data.data) ? data.data[0] : data;

        // Fill form with API response
        reset({
          name: user?.a1_name || "",
          email: user?.a2_email || user?.a2_email_address || "",
          city: user?.a4_city || user?.city || "",
          mobile: user?.a3_phone_number || phone,
        });
      } catch (err: any) {
        toast.error(err.message || "Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [reset]);

  // 2. Submit form updates
  const onSubmit = async (formData: ProfileForm) => {
    try {
      setIsSubmitting(true);

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          a1_name: formData.name,
          a2_email_address: formData.email,
          a4_city: formData.city,
          mobile: formData.mobile,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Sync LocalStorage
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...localUser,
          a1_name: formData.name,
          a2_email_address: formData.email,
          city: formData.city,
        }),
      );

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">Profile</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              {...register("name")}
              className="w-full rounded-lg border px-3 py-2"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full rounded-lg border px-3 py-2"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <input
              {...register("city")}
              className="w-full rounded-lg border px-3 py-2"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* Mobile (Disabled) */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Mobile Number
            </label>
            <input
              {...register("mobile")}
              disabled
              className="w-full cursor-not-allowed rounded-lg border bg-gray-100 px-3 py-2 text-gray-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary py-2 font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
