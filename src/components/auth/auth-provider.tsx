"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Only update state if the user ID actually changed,
    // preventing cascading re-renders from object reference changes.
    function updateUser(newUser: User | null) {
      const newId = newUser?.id ?? null;
      if (newId !== userIdRef.current) {
        userIdRef.current = newId;
        setUser(newUser);
      }
    }

    // Single getUser() call for the entire app
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      updateUser(u);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUser(session?.user ?? null);
      if (_event === "SIGNED_IN" || _event === "SIGNED_OUT") {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
