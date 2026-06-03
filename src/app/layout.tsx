import type { Metadata } from "next";
import ClientRootLayout from "./ClientRootLayout";

export const metadata: Metadata = {
  title: {
    template: "%s | My Nursing App",
    default: "My Nursing App - Learn, Practice & Succeed",
  },
  description:
    "Nursing Study Hub offers free and premium courses for GNM, ANM, and BSc Nursing students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientRootLayout>{children}</ClientRootLayout>;
}
