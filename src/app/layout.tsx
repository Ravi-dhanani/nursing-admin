"use client";
import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { LanguageProvider } from "@/common/LanguageContext";
import { Header } from "@/components/Layouts/header";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { type PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import { Providers } from "./providers";

// export const metadata: Metadata = {
//   title: {
//     template: "%s |My Nursing App",
//     default: "My Nursing App - Learn, Practice & Succeed",
//   },
//   description:
//     "Nursing Study Hub offers free and premium courses for GNM, ANM, and BSc Nursing students. Practice MCQs, watch video lectures, and access study notes in one place.",
// };

export default function RootLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  // check if auth page
  const isAuthPage = pathname.startsWith("/auth");
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <LanguageProvider>
            <NextTopLoader color="#00858a" showSpinner={false} />
            <ToastContainer />

            {isAuthPage ? (
              // ✅ LOGIN PAGE (NO SIDEBAR / HEADER)
              <div className="flex min-h-screen items-center justify-center">
                {children}
              </div>
            ) : (
              // ✅ DASHBOARD LAYOUT
              <div className="flex min-h-screen">
                <Sidebar />

                <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
                  <Header />

                  <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-4">
                    {children}
                  </main>
                </div>
              </div>
            )}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
