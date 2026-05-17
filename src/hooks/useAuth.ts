"use client";

import { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "@firebase/auth";
import { authApp } from "@/lib/firebase/firebase-config";

export interface AuthState {
  user: User | null;
  loading: boolean;
}

/**
 * Hook that wraps Firebase onAuthStateChanged and returns the current
 * auth state with a loading flag.
 *
 * Replaces the broken getUserUUID() helper in authentication.ts, which
 * returned null immediately because onAuthStateChanged is asynchronous.
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authApp, (user) => {
      setState({ user, loading: false });
    });
    return unsubscribe;
  }, []);

  return state;
}
