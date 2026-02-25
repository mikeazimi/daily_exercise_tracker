"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAuthGuard(skip = false) {
  const [loading, setLoading] = useState(!skip);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (skip) return;

    // When transitioning from a public route (skip=true → false),
    // loading may still be false from initial state. Reset it so
    // AuthGuard doesn't redirect before getUser() resolves.
    setLoading(true);

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
