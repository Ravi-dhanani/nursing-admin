"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import nursingImg from "../sign-in/nursing.png";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

// ✅ validation schema
const schema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be 6 digits"),
});

type FormData = {
  otp: string;
};

export default function VerifyPage() {
  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(30);
  const [isResendAvailable, setIsResendAvailable] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp") || "";

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const otpArray = otpValue.split("").concat(Array(6).fill("")).slice(0, 6);
    otpArray[index] = value;

    const newOtp = otpArray.join("");

    setValue("otp", newOtp, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("User not found");
        return;
      }

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          OTP: data.otp,
          UserId: userId,
        }),
      });

      const result = await res.json();

      toast.success(result.message || "OTP verified successfully");

      inputsRef.current[0]?.focus();

      document.cookie = `isVerified=true; path=/; max-age=86400; SameSite=Lax; Secure`;

      router.push("/courses");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleResendOtp = async () => {
    try {
      const mobileNo = JSON.parse(localStorage.getItem("mobileNo") || "");

      if (!mobileNo) {
        toast.error("Mobile number not found");
        return;
      }

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: mobileNo }),
      });

      const result = await res.json();

      if (result.success === true) {
        toast.error(result.message || "Failed to resend OTP");
        return;
      }

      toast.success("OTP resent successfully");
      setValue("otp", ""); // clear form
      inputsRef.current[0]?.focus();
      setTimer(30);
      setIsResendAvailable(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (timer === 0) {
      setIsResendAvailable(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // ✅ cleanup
  }, [timer]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex justify-center">
          <Image src={nursingImg} alt="logo" width={112} height={112} />
        </div>

        <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
          Verify OTP
        </h2>

        <p className="mb-6 text-center text-sm text-gray-500">
          Enter the 6-digit code sent to your mobile
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex justify-between gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otpValue[index] || ""}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-12 w-10 rounded-lg border text-center text-lg outline-none focus:border-primary"
              />
            ))}
          </div>

          {errors.otp && (
            <p className="mb-3 text-center text-sm text-red-500">
              {errors.otp.message}
            </p>
          )}
          <div className="mb-4 text-center text-sm">
            {!isResendAvailable ? (
              <span className="text-gray-500">
                Resend OTP in{" "}
                <span className="font-semibold text-primary">{timer}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-semibold text-primary"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full rounded-lg py-3 text-white transition ${
              isValid ? "bg-primary" : "cursor-not-allowed bg-gray-400"
            }`}
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
