import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { SiteHeader } from "@/components/SiteHeader";
<<<<<<< HEAD
=======
import { SiteFooter } from "@/components/SiteFooter";
>>>>>>> 99d4ba6 (feat(polishes): i think this is probably how much this project can go)
import { Analytics } from "@vercel/analytics/next"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sola AI",
  description: "AI-powered health clinical assistant",
  icons: {
<<<<<<< HEAD
    icon: "/tomato.png",
=======
    icon: "/app-icon.png",
>>>>>>> 99d4ba6 (feat(polishes): i think this is probably how much this project can go)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} min-h-screen bg-background text-foreground antialiased font-sans`}
      >
        <AuthProvider>
          <div className="relative min-h-screen flex flex-col">
            <SiteHeader />
            <main className="flex-1 flex flex-col pt-[70px]">{children}</main>
            <SiteFooter />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
