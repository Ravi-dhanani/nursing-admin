"use client";
import { usePathname, useRouter } from "next/navigation";

export default function page() {
  const pathname = usePathname();
  const router = useRouter();
  const routeName = pathname.split("/").filter(Boolean).join(" ");
  return (
    <div className="min-h-screen overflow-auto bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {/* content - start */}
          <div className="flex flex-col items-center justify-center sm:items-start md:py-24 lg:py-32">
            <p className="text-grey-500 mb-4 text-sm font-semibold uppercase md:text-xl">
              Error 404
            </p>
            <h1 className="mb-2 text-center text-2xl font-bold text-primary sm:text-left md:text-3xl">
              Page not found
            </h1>
            <p className="mb-8 text-center text-gray-500 sm:text-left md:text-lg">
              {routeName} page you’re looking for doesn’t exist.
            </p>
            <button
              onClick={() => router.push("/")}
              className="inline-block rounded-lg bg-primary px-8 py-3 text-center text-sm font-semibold text-white outline-none transition duration-100 md:text-base"
            >
              Go home
            </button>
          </div>
          {/* content - end */}
          {/* image - start */}
          <div className="relative h-80 w-auto overflow-hidden bg-gray-100 md:h-auto">
            <img
              src="/assets/images/not_found.png"
              loading="lazy"
              alt="not found"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          {/* image - end */}
        </div>
      </div>
    </div>
  );
}
