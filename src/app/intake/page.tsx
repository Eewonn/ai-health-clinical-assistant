"use client";

import IntakeForm from "@/components/IntakeForm";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function IntakePage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-6 mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
        <button
          onClick={() => {
            signOut();
            router.push("/signin");
          }}
          className="text-sm text-red-600 hover:underline"
        >
          Sign Out
        </button>
      </div>
      <IntakeForm />
    </main>
  );
}
