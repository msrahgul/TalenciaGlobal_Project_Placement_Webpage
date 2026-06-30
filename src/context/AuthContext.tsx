import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase, hasSupabase } from "../lib/supabaseClient";

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  skills: string[];
  target_sectors: string[];
  readiness_score: number;
  current_milestone: string;
}

interface AuthContextType {
  user: User | null;
  profile: StudentProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "msrahgul@gmail.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    if (!hasSupabase) return;
    try {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (error && error.code !== "PGRST116") { // PGRST116 is no rows returned
        console.error("Error fetching profile:", error);
      }
      
      if (data) {
        setProfile(data as StudentProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  useEffect(() => {
    if (!hasSupabase) {
      setIsLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const email = session.user.email || "";
        
        // Allow the master admin account through regardless of domain.
        // All other accounts must use the @karunya.edu.in institutional domain.
        const isAdminEmail = email === ADMIN_EMAIL;
        const isKarunyaDomain = email.endsWith("@karunya.edu.in");

        if (!isAdminEmail && !isKarunyaDomain) {
          toast.error("Unauthorized Account", {
            description: "Please use your @karunya.edu.in account to access this platform.",
            duration: 5000,
          });
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!hasSupabase) {
      toast.error("Database Connection Missing", {
        description: "Supabase configuration is not available.",
      });
      return { error: new Error("No database") };
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        // NOTE: The `hd` param restricts the Google account-picker UI to
        // @karunya.edu.in, but does NOT prevent msrahgul@gmail.com from
        // manually choosing "Use another account". The domain check above
        // is the authoritative gate.
        queryParams: {
          hd: 'karunya.edu.in'
        }
      },
    });

    if (error) {
      toast.error("Login Failed", {
        description: error.message,
      });
    }
    
    return { error };
  };

  const signOut = async () => {
    if (!hasSupabase) return;
    await supabase.auth.signOut();
    toast.info("Signed out successfully.");
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, isAdmin, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
