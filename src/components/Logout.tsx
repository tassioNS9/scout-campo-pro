"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { signOut } from "@/lib/auth-client";

export const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.refresh();
  };
  return (
    <div className="flex items-center gap-3 border-slate-700 pl-4">
      <div className="text-right"></div>
      <button
        onClick={handleLogout}
        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-500"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
};
