import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { SiteHeader } from "@/components/SiteHeader";

// If you want to use a local font:
// 1. Place your font file (e.g., my-font.woff2) in public/fonts/
// 2. Uncomment the localFont import and usage below
// 3. Comment out the Inter import and usage

/*
import localFont from "next/font/local";
const customFont = localFont({
  src: [
    {
      path: "../../public/fonts/your-font-file.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});
*/

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        // Use inter.variable by default. If using local font, change to customFont.variable
        className={`${nunito.variable} min-h-screen bg-background text-foreground antialiased font-sans`}
      >
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
