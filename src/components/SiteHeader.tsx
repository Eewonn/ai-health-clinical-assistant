"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/modules/ui/components/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
      show: false, // Hidden as per user request
    },
    {
      href: "/intake",
      label: "Intake",
      active: pathname === "/intake",
      show: false, // Hidden as per user request
    },
    {
      href: "/rag-demo",
      label: "RAG Demo",
      active: pathname === "/rag-demo",
      show: false, // Hidden globally as per user requests
    },
  ];

  return (
    <header className="fixed flex items-center justify-center top-0 z-50 w-full bg-[#fdfcfd] border-b border-gray-300">
      <div className="mx-auto flex h-[70px] w-full max-w-[1000px] items-center justify-between px-4 lg:px-0">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/header-icon.png"
            alt="Icon"
            className="w-8 h-8 -rotate-12"
          />
          <span className="text-2xl font-extrabold tracking-tight text-[#ff4b4b]">
            Sola
          </span>
        </Link>

        {/* Navigation - Centered/Flexible */}
        <div className="hidden md:flex flex-1 justify-center">
          <nav className="flex items-center gap-4 text-sm font-bold uppercase tracking-wide text-gray-500 lg:gap-8">
            {routes
              .filter((route) => route.show)
              .map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "transition-colors hover:text-[#ff4b4b]",
                    route.active ? "text-[#ff4b4b]" : "text-gray-400",
                  )}
                >
                  {route.label}
                </Link>
              ))}
          </nav>
        </div>

        {/* Auth / Right Side */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Button variant="ghost" size="sm" disabled>
              Loading...
            </Button>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-extrabold tracking-wide text-gray-700 hidden sm:inline-block">
                {user.email}
              </span>
              <button
                onClick={async () => {
                  await signOut();
                  router.push("/signin");
                }}
                className="h-[45px] w-[110px] rounded-xl border-2 border-[#e5e5e5] bg-white text-[13px] font-extrabold tracking-wider text-[#3E9001] shadow-[0_4px_0_#e5e5e5] transition hover:bg-slate-50 active:shadow-none active:translate-y-[4px] uppercase"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/signin">
                <button className="h-[45px] w-[110px] rounded-xl border-2 border-[#e5e5e5] bg-white text-[13px] font-extrabold tracking-wider text-[#3E9001] shadow-[0_4px_0_#e5e5e5] transition hover:bg-slate-50 active:shadow-none active:translate-y-[4px] uppercase">
                  Sign in
                </button>
              </Link>
              <Link href="/signup">
                <button className="h-[45px] w-[110px] rounded-xl bg-[#ff4b4b] text-[13px] font-extrabold tracking-widest text-white shadow-[0_4px_0_#ea2b2b] transition active:shadow-none active:translate-y-[4px] uppercase hover:bg-[#ff5c5c]">
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
