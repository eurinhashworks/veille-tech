import type { Metadata } from "next";
import "./globals.css"; // We will create this file next

export const metadata: Metadata = {
  title: "Eureka AI",
  description: "Application consolidée",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
