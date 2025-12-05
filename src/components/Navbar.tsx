"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">AI Health</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/patients"
                className={`${
                  isActive("/patients")
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Patients
              </Link>
              <Link
                href="/intake"
                className={`${
                  isActive("/intake")
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                New Intake
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-4">{user.email}</span>
            <button
              onClick={() => signOut()}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
