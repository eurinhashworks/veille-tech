import type { Metadata } from "next";
import "./globals.css"; // We will create this file next

export const metadata: Metadata = {
  title: "Eureka AI",
  description: "Application consolidée",
};

import { ToastProvider } from "@/components/Toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
