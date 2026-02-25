"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAuthGuard(skip = false) {
  const [loading, setLoading] = useState(!skip);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (skip) return;

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthenticated(!!user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [skip]);

  return { loading, authenticated };
}
