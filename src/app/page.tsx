"use client";

import Link from "next/link";
import { Button } from "@/modules/ui/components/button";
import { useAuth } from "@/lib/auth-context";
import { ChevronRight } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center bg-[#fdfcfd] text-[#3c3c3c]">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center justify-center gap-10 px-4 py-8 lg:flex-row lg:gap-20">
        <div className="relative flex h-[180px] w-[180px] items-center justify-center lg:h-[280px] lg:w-[280px]">
          <div className="flex h-full w-full items-center justify-center">
            <img
              src="/tomato.png"
              alt="Learn with AI Health"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="flex w-full max-w-[480px] flex-col items-center gap-6">
          <h1 className="text-center text-[32px] font-extrabold leading-[1.1] text-[#4b4b4b] mb-2">
            Transforming health guidance into personalized, safe, and actionable
            care.
          </h1>

          <div className="flex w-full max-w-[330px] flex-col gap-4">
            <Link href={user ? "/intake" : "/signup"} className="w-full">
              <button className="h-[46px] w-full rounded-xl bg-[#ff4b4b] text-[15px] font-extrabold tracking-wide text-white shadow-[0_5px_0_#ea2b2b] transition active:shadow-none active:translate-y-[5px] uppercase hover:bg-[#ff5c5c] flex items-center justify-center gap-1">
                Get Started
                <ChevronRight className="h-5 w-5 stroke-[3]" />
              </button>
            </Link>

            <Link href="/signin" className="w-full">
              <button className="h-[46px] w-full rounded-xl border-2 border-[#e5e5e5] bg-white text-[15px] font-extrabold tracking-wide text-[#3E9001] shadow-[0_5px_0_#e5e5e5] transition hover:bg-slate-50 active:shadow-none active:translate-y-[5px] uppercase">
                I already have an account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
