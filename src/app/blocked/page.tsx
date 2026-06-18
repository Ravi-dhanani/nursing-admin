"use client";
import Link from "next/link";

export default function BlockedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M5.07 19H18.93C20.54 19 21.55 17.25 20.74 15.84L13.81 3.84C13.01 2.44 10.99 2.44 10.19 3.84L3.26 15.84C2.45 17.25 3.46 19 5.07 19Z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Access Blocked
        </h1>

        <p className="mb-6 text-gray-600">
          Developer tools or restricted browser actions were detected. Access to
          this page has been blocked for security reasons.
        </p>

        <div className="space-y-3">
          <Link
            href="/auth/sign-in"
            className="block w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90"
          >
            Go To back
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Security Code: ERR_DEVTOOLS_DETECTED
        </p>
      </div>
    </div>
  );
}
