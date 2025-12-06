"use client";

import Link from "next/link";
import { Button } from "@/modules/ui/components/button";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfcfd] text-[#3c3c3c]">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center justify-center gap-4 px-4 py-14 lg:flex-row lg:gap-16">
        <div className="relative flex h-[300px] w-[300px] items-center justify-center lg:h-[424px] lg:w-[424px] lg:-mt-12">
          <div className="flex h-full w-full items-center justify-center">
            <img
              src="/tomato.png"
              alt="Learn with AI Health"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="flex w-full max-w-[400px] pt-10 flex-col items-center gap-6 lg:items-start">
          <h1 className="text-center text-[32px] font-extrabold leading-tight text-neutral-700 lg:text-left">
            The free, fun, and effective way to improve your health!
          </h1>

          <div className="flex w-full flex-col gap-3">
            <Link href="/signup" className="w-full">
              <button className="h-[50px] w-full rounded-xl bg-[#ff4b4b] text-[15px] font-extrabold tracking-widest text-white shadow-[0_5px_0_#ea2b2b] transition active:shadow-none active:translate-y-[5px] uppercase hover:bg-[#ff5c5c]">
                Get Started
              </button>
            </Link>

            <Link href="/signin" className="w-full">
              <button className="h-[50px] w-full rounded-xl border-2 border-[#e5e5e5] bg-white text-[15px] font-extrabold tracking-wider text-[#3E9001] shadow-[0_5px_0_#e5e5e5] transition hover:bg-slate-50 active:shadow-none active:translate-y-[5px] uppercase">
                I already have an account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
