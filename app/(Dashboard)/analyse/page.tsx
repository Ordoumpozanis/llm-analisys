"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import Dashboard from "@/components/Dashboard/result-dashboard";
export default function Home() {
  const isUserDataSaved = useUserStore((state) => state.isUserDataSaved);
  const router = useRouter();

  useEffect(() => {
    if (!isUserDataSaved) {
      router.push("/");
    }
  }, [isUserDataSaved, router]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden max-h-full">
      <Dashboard />
    </div>
  );
}
