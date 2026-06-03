"use client";

import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import DevToolsBlocker from "@/common/DevToolsBlocker";
import { LanguageProvider } from "@/common/LanguageContext";
import { Header } from "@/components/Layouts/header";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import { Providers } from "./providers";

export default function ClientRootLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DevToolsBlocker />
        <Providers>
          <LanguageProvider>
            <NextTopLoader color="#00858a" showSpinner={false} />
            <ToastContainer />

            {isAuthPage ? (
              <div className="flex min-h-screen items-center justify-center">
                {children}
              </div>
            ) : (
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
