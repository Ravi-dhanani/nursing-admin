"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

type ProfileForm = {
  name: string;
  email: string;
  city: string;
  mobile: string;
};

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    reset({
      name: user.a1_name || "",
      email: user.a2_email_address || "",
      city: user.city || "",
      mobile: user.a3_phone_number || "",
    });
  }, [reset]);

  const onSubmit = async (data: ProfileForm) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          a1_name: data.name,
          a2_email_address: data.email,
          a4_city: data.city,
          mobile: data.mobile,
        }),
      });

      const result = await res.json();

      console.log(result);

      if (!res.ok || !result.success) {
        toast.error(result.message || "Profile update failed");
        return;
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

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

          {/* Mobile Disabled */}
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

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 font-semibold text-white"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
