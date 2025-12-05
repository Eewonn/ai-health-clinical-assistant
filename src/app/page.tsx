"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/intake");
      } else {
        router.push("/signin");
      }
    }
  }, [user, isLoading, router]);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p>Loading...</p>
    </main>
  );
}
