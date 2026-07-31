// "use client";

// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import nursingImg from "../sign-in/nursing.png";

// import { getDeviceId } from "@/lib/utils";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import * as yup from "yup";

// // ✅ validation schema
// const schema = yup.object({
//   otp: yup
//     .string()
//     .required("OTP is required")
//     .matches(/^\d{6}$/, "OTP must be 6 digits"),
// });

// type FormData = {
//   otp: string;
// };

// export default function VerifyPage() {
//   const router = useRouter();
//   const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
//   const [timer, setTimer] = useState(30);
//   const [isResendAvailable, setIsResendAvailable] = useState(false);

//   const {
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors, isValid },
//   } = useForm<FormData>({
//     resolver: yupResolver(schema),
//     mode: "onChange",
//     defaultValues: { otp: "" },
//   });

//   const otpValue = watch("otp") || "";

//   const handleChange = (value: string, index: number) => {
//     if (!/^\d?$/.test(value)) return;

//     const otpArray = otpValue.split("").concat(Array(6).fill("")).slice(0, 6);
//     otpArray[index] = value;

//     const newOtp = otpArray.join("");

//     setValue("otp", newOtp, {
//       shouldValidate: true,
//       shouldDirty: true,
//       shouldTouch: true,
//     });

//     if (value && index < 5) {
//       inputsRef.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number,
//   ) => {
//     if (e.key === "Backspace" && !otpValue[index] && index > 0) {
//       inputsRef.current[index - 1]?.focus();
//     }
//   };

//   // const onSubmit = async (data: FormData) => {
//   //   try {
//   //     const userId = localStorage.getItem("userId");

//   //     const mobile = localStorage.getItem("mobileNo");

//   //     if (!userId) {
//   //       toast.error("User not found");
//   //       return;
//   //     }

//   //     const res = await fetch("/api/auth/verify-otp", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         OTP: data.otp,
//   //         UserId: userId,
//   //       }),
//   //     });

//   //     const result = await res.json();

//   //     console.log(result);

//   //     toast.success(result.message || "OTP verified successfully");

//   //     inputsRef.current[0]?.focus();

//   //     document.cookie = `isVerified=true; path=/; max-age=86400; SameSite=Lax; Secure`;

//   //     if (result.data.status) {
//   //       const res = await fetch("/api/auth/sign-in", {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({ mobile: mobile }),
//   //       });

//   //       const result = await res.json();

//   //       console.log(result, "success api call");

//   //       if (!result.success) {
//   //         toast.error(result.message);
//   //         return;
//   //       }

//   //       const dbVisitorId = result?.data?.a10_web_id;
//   //       const isNewUser = !dbVisitorId;

//   //       const currentDeviceId = getDeviceId();

//   //       if (dbVisitorId && dbVisitorId !== currentDeviceId) {
//   //         toast.error("You are already logged in on another device");
//   //         return;
//   //       }

//   //       document.cookie = `visitorId=${currentDeviceId}; path=/; max-age=86400; SameSite=Lax; Secure`;

//   //       if (isNewUser) {
//   //         console.log("enter isnew user");
//   //         await fetch("/api/auth/update-visitor", {
//   //           method: "POST",
//   //           headers: {
//   //             "Content-Type": "application/json",
//   //           },
//   //           body: JSON.stringify({
//   //             objectId: result.data.objectId,
//   //             visitorId: currentDeviceId,
//   //             a9_device_id: "APP",
//   //           }),
//   //         });
//   //         toast.success("Sign In successfully");
//   //       }

//   //       router.push("/courses");
//   //     }
//   //   } catch (error) {
//   //     toast.error("Something went wrong");
//   //   }
//   // };

//   const onSubmit = async (data: FormData) => {
//     try {
//       const rawUserId = localStorage.getItem("userId");
//       const rawMobile = localStorage.getItem("mobileNo");

//       if (!rawUserId || !rawMobile) {
//         toast.error("Session expired. Please sign in again.");
//         router.push("/auth/sign-in");
//         return;
//       }

//       // Safely parse JSON values if stored using JSON.stringify
//       let userId = rawUserId;
//       let mobile = rawMobile;

//       try {
//         userId = JSON.parse(rawUserId);
//       } catch {}

//       try {
//         mobile = JSON.parse(rawMobile);
//       } catch {}

//       // 1. VERIFY OTP
//       const otpRes = await fetch("/api/auth/verify-otp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           OTP: data.otp,
//           UserId: userId,
//         }),
//       });

//       const otpResult = await otpRes.json();

//       console.log(otpResult);

//       // Check if OTP verification failed
//       if (!otpRes.ok || !otpResult?.data?.status) {
//         toast.error(
//           otpResult?.message || otpResult?.data?.message || "Invalid OTP",
//         );
//         return;
//       }

//       toast.success("OTP verified successfully!");

//       // 2. SIGN IN / CREATE USER IN PARSE DB
//       const signInRes = await fetch("/api/auth/sign-in", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ mobile: mobile }),
//       });

//       const signInResult = await signInRes.json();

//       if (!signInRes.ok || !signInResult.success) {
//         toast.error(signInResult.message || "Sign-in failed");
//         return;
//       }

//       const currentDeviceId = getDeviceId();
//       const dbVisitorId = signInResult?.data?.a10_web_id;
//       const isNewUser = !dbVisitorId;

//       // Device lock check
//       if (dbVisitorId && dbVisitorId !== currentDeviceId) {
//         toast.error("You are already logged in on another device");
//         return;
//       }

//       // Set auth cookies for Next.js Middleware
//       document.cookie = `visitorId=${currentDeviceId}; path=/; max-age=86400; SameSite=Lax; Secure`;
//       document.cookie = `isVerified=true; path=/; max-age=86400; SameSite=Lax; Secure`;

//       // 3. REGISTER NEW DEVICE ID IF NEW USER
//       if (isNewUser) {
//         await fetch("/api/auth/update-visitor", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             objectId: signInResult.data.objectId,
//             visitorId: currentDeviceId,
//             a9_device_id: "APP",
//           }),
//         });

//         signInResult.data.a10_web_id = currentDeviceId;
//       }

//       // Save user object to LocalStorage
//       localStorage.setItem("user", JSON.stringify(signInResult.data));

//       toast.success("Sign In successfully");

//       // Refresh middleware context and redirect
//       router.refresh();
//       setTimeout(() => {
//         router.push("/courses");
//       }, 100);
//     } catch (error) {
//       console.error("Verification submit error:", error);
//       toast.error("Something went wrong");
//     }
//   };

//   const handleResendOtp = async () => {
//     try {
//       const mobileNo = JSON.parse(localStorage.getItem("mobileNo") || "");

//       if (!mobileNo) {
//         toast.error("Mobile number not found");
//         return;
//       }

//       const res = await fetch("/api/auth/send-otp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ mobile: mobileNo }),
//       });

//       const result = await res.json();

//       if (result.success === true) {
//         toast.error(result.message || "Failed to resend OTP");
//         return;
//       }

//       toast.success("OTP resent successfully");
//       setValue("otp", ""); // clear form
//       inputsRef.current[0]?.focus();
//       setTimer(30);
//       setIsResendAvailable(false);
//     } catch (error) {
//       toast.error("Something went wrong");
//     }
//   };

//   useEffect(() => {
//     if (timer === 0) {
//       setIsResendAvailable(true);
//       return;
//     }

//     const interval = setInterval(() => {
//       setTimer((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval); // ✅ cleanup
//   }, [timer]);

//   useEffect(() => {
//     inputsRef.current[0]?.focus();
//   }, []);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
//         <div className="mb-6 flex justify-center">
//           <Image src={nursingImg} alt="logo" width={112} height={112} />
//         </div>

//         <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
//           Verify OTP
//         </h2>

//         <p className="mb-6 text-center text-sm text-gray-500">
//           Enter the 6-digit code sent to your mobile
//         </p>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="mb-4 flex justify-between gap-2">
//             {Array.from({ length: 6 }).map((_, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 maxLength={1}
//                 value={otpValue[index] || ""}
//                 ref={(el) => {
//                   inputsRef.current[index] = el;
//                 }}
//                 onChange={(e) => handleChange(e.target.value, index)}
//                 onKeyDown={(e) => handleKeyDown(e, index)}
//                 className="h-12 w-10 rounded-lg border text-center text-lg outline-none focus:border-primary"
//               />
//             ))}
//           </div>

//           {errors.otp && (
//             <p className="mb-3 text-center text-sm text-red-500">
//               {errors.otp.message}
//             </p>
//           )}
//           <div className="mb-4 text-center text-sm">
//             {!isResendAvailable ? (
//               <span className="text-gray-500">
//                 Resend OTP in{" "}
//                 <span className="font-semibold text-primary">{timer}s</span>
//               </span>
//             ) : (
//               <button
//                 type="button"
//                 onClick={handleResendOtp}
//                 className="font-semibold text-primary"
//               >
//                 Resend OTP
//               </button>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={!isValid}
//             className={`w-full rounded-lg py-3 text-white transition ${
//               isValid ? "bg-primary" : "cursor-not-allowed bg-gray-400"
//             }`}
//           >
//             Verify OTP
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import nursingImg from "../sign-in/nursing.png";

import { getDeviceId } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

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
  const [isLoading, setIsLoading] = useState(false);

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
    if (isLoading) return;
    setIsLoading(true);

    try {
      const rawUserId = localStorage.getItem("userId");
      const rawMobile = localStorage.getItem("mobileNo");

      if (!rawUserId || !rawMobile) {
        toast.error("Session expired. Please sign in again.");
        setIsLoading(false);
        router.push("/auth/sign-in");
        return;
      }

      let userId = rawUserId;
      let mobile = rawMobile;

      try {
        userId = JSON.parse(rawUserId);
      } catch {}

      try {
        mobile = JSON.parse(rawMobile);
      } catch {}

      // 1. VERIFY OTP
      const otpRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          OTP: data.otp,
          UserId: userId,
        }),
      });

      const otpResult = await otpRes.json();

      if (!otpRes.ok || !otpResult?.data?.status) {
        toast.error(
          otpResult?.message || otpResult?.data?.message || "Invalid OTP",
        );
        setIsLoading(false);
        return;
      }

      toast.success("OTP verified successfully!");

      // 2. SIGN IN / CREATE USER IN PARSE DB
      const signInRes = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: mobile }),
      });

      const signInResult = await signInRes.json();

      if (!signInRes.ok || !signInResult.success) {
        toast.error(signInResult.message || "Sign-in failed");
        setIsLoading(false);
        return;
      }

      const currentDeviceId = getDeviceId();
      const dbVisitorId = signInResult?.data?.a10_web_id;
      const isNewUser = !dbVisitorId;

      if (dbVisitorId && dbVisitorId !== currentDeviceId) {
        toast.error("You are already logged in on another device");
        setIsLoading(false);
        return;
      }

      // Set cookies for Middleware
      document.cookie = `visitorId=${currentDeviceId}; path=/; max-age=86400; SameSite=Lax; Secure`;
      document.cookie = `isVerified=true; path=/; max-age=86400; SameSite=Lax; Secure`;

      // 3. REGISTER NEW DEVICE ID IF NEW USER
      if (isNewUser) {
        await fetch("/api/auth/update-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            objectId: signInResult.data.objectId,
            visitorId: currentDeviceId,
            a9_device_id: "APP",
          }),
        });

        signInResult.data.a10_web_id = currentDeviceId;
      }

      localStorage.setItem("user", JSON.stringify(signInResult.data));

      toast.success("Sign In successfully");

      router.refresh();
      setTimeout(() => {
        router.push("/courses");
      }, 100);
    } catch (error) {
      console.error("Verification submit error:", error);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const rawMobile = localStorage.getItem("mobileNo");

      if (!rawMobile) {
        toast.error("Mobile number not found");
        return;
      }

      let mobileNo = rawMobile;
      try {
        mobileNo = JSON.parse(rawMobile);
      } catch {}

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: mobileNo }),
      });

      const result = await res.json();

      console.log(result.data.UserId, "success");

      // CRITICAL FIX: Save the NEW UserId returned by the resend API
      localStorage.setItem("userId", JSON.stringify(result.data.UserId));

      toast.success("OTP resent successfully");
      setValue("otp", "", { shouldValidate: true }); // Clear input field
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

    return () => clearInterval(interval);
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
            disabled={!isValid || isLoading}
            className={`w-full rounded-lg py-3 text-white transition ${
              isValid && !isLoading
                ? "bg-primary"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
