import { useState } from "react";
import { supabase } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Use Supabase native authentication
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        return {
          success: false,
          error: supabaseError.message || "Email ou mot de passe invalide",
          user: null,
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: "Erreur lors de la connexion",
          user: null,
        };
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || "",
      };

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userId", user.id);
      return { success: true, error: null, user };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      return { success: false, error: errorMsg, user: null };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");
    }
  };

  const isAuthenticated = () => {
    return localStorage.getItem("isAuthenticated") === "true";
  };

  const getCurrentUser = (): AuthUser | null => {
    if (!isAuthenticated()) return null;
    const email = localStorage.getItem("userEmail");
    const id = localStorage.getItem("userId");
    if (email && id) {
      return { email, id };
    }
    return null;
  };

  return {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    loading,
    error,
  };
}
