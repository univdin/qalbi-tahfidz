"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/core/supabase/client";

export function AuthCallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { hash, pathname } = window.location;
    if (!hash.includes("access_token")) return;
    if (pathname.startsWith("/auth/")) return;

    const redirect =
      new URLSearchParams(window.location.search).get("redirect") || "/reader/1";

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN") return;
      const url = new URL(window.location.href);
      url.hash = "";
      window.history.replaceState(null, "", url.toString());
      router.replace(redirect);
    });

    void supabase.auth.getSession();

    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
