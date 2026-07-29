"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="rounded-md border bg-primary px-3 py-2 text-sm text-white"
      >
        ← Back
      </button>
    </div>
  );
}
