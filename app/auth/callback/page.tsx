"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Loader from "@/components/Loader";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session - since email verification is disabled,
        // we should already have a session after login
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          // User is logged in, redirect to generate page
          router.push("/generate");
        } else {
          // No valid session, redirect to auth page
          router.push("/auth");
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
        // Redirect to auth page on error
        router.push("/auth");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <Loader size="lg" color="blue" />
        <p className="mt-4 text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}
