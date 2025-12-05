import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Health Clinical Assistant",
  description: "AI-powered health clinical assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
