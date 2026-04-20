"use client";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import nursingImg from "./nursing.png";

const schema = yup.object({
  mobile: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[0-9]+$/, "Only Mobile Number are allowed")
    .length(10, "Mobile number must be exactly 10 digits")
    .matches(/^[6-9]/, "Mobile number must start with 6-9"),
});

type FormData = {
  mobile: string;
};

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const mobileValue = watch("mobile");

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: data.mobile }),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      let visitorId = result?.data?.a10_web_id;

      const fp = await FingerprintJS.load();
      const fpResult = await fp.get();
      const currentVisitorId = fpResult.visitorId;

      if (visitorId && visitorId !== currentVisitorId) {
        toast.error("You are already logged in on another device");
        return;
      }

      if (!visitorId) {
        visitorId = currentVisitorId;

        await fetch("/api/auth/update-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            objectId: result.data.objectId,
            visitorId,
          }),
        });
      }

      const sendOtp = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: data.mobile }),
      });

      const otpResult = await sendOtp.json();

      if (otpResult.success === true) {
        toast.error(otpResult.message || "Failed to send OTP");
        return;
      }

      if (otpResult?.data.UserId) {
        localStorage.setItem("userId", JSON.stringify(otpResult.data.UserId));
        localStorage.setItem("mobileNo", JSON.stringify(data.mobile));
      }

      const userData = {
        ...result.data,
        a10_web_id: visitorId,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      document.cookie = `visitorId=${visitorId}; path=/; max-age=86400; SameSite=Lax`;

      toast.success("OTP sent successfully");

      router.push("/auth/verify");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen w-96 items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src={nursingImg}
            alt="logo"
            className="h-28 w-28 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="mb-6 text-center text-xl font-semibold text-gray-800 dark:text-white">
          Login with Mobile Number
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Mobile Input */}
          <div>
            <input
              type="tel"
              placeholder="Enter mobile number"
              {...register("mobile")}
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                !mobileValue
                  ? "border-gray-300" // empty
                  : errors.mobile
                    ? "border-red-500" // error
                    : mobileValue.length === 10
                      ? "border-primary" // valid
                      : "border-gray-300"
              } `}
            />

            {/* Error */}
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-500">
                {errors.mobile.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 text-white"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
