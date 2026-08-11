// app/(auth)/context/auth-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { tokenService } from "@/services/tokenService";
import { authService } from "@/services/authService";
import { signInWithGoogle } from "@/lib/firebase";
import { AuthUser } from "@/types/auth";
import { getRedirectPathByRole } from "@/lib/getRedirectPathByRole";

type RegisterPayload = {
  fullname: string;
  email: string;
  phonenumber?: string;
  password: string;
};

type ForgetPasswordPayload = {
  email: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string>;
  loginWithGoogle: () => Promise<string>;
  register: (data: RegisterPayload) => Promise<{ email: string }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  forgetPassword: (data: ForgetPasswordPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "session.user";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/verify-otp",
  "/",
  "/forget-password",
  "/change-password",
  "/500",
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Restore session on mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(SESSION_KEY) : null;
      const token = tokenService.getAccessToken();

      if (raw && token && tokenService.hasValidToken()) {
        const parsedUser = JSON.parse(raw);
        setUser(parsedUser);
      } else {
        localStorage.removeItem(SESSION_KEY);
        tokenService.clearAccessToken();
        setUser(null);
      }
    } catch (err) {
      console.debug("AuthProvider: failed to restore session", err);
      localStorage.removeItem(SESSION_KEY);
      tokenService.clearAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Role-based route guard
  useEffect(() => {
    if (!loading) {
      const isPublic = PUBLIC_ROUTES.includes(pathname);

      // Not logged in -> redirect to login if attempting private route
      if (!user && !isPublic) {
        setIsRedirecting(true);
        router.replace("/login");
        return;
      }

      // Logged in -> redirect if on login/register/landing
      if (user && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
        setIsRedirecting(true);
        const target = getRedirectPathByRole(user.roles);
        router.replace(target);
        return;
      }

      // Role authorization protection: student cannot access /platform
      if (user && pathname.startsWith("/platform")) {
        const normalized = (user.roles || []).map((r) => r.toLowerCase().replace("role_", ""));
        const isStaffOrAdmin = normalized.some((r) => ["manager", "admin", "staff"].includes(r));
        if (!isStaffOrAdmin) {
          setIsRedirecting(true);
          toast.error("You do not have permission to access the management platform.");
          router.replace("/student/home");
          return;
        }
      }

      setIsRedirecting(false);
    }
  }, [user, pathname, loading, router]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,

      login: async (email, password) => {
        setLoading(true);
        try {
          const result = await authService.login({ email, password });
          const { accessToken, fullName, roles } = result;

          tokenService.setAccessToken(accessToken);
          const decoded = decodeJWT(accessToken);

          const authUser: AuthUser = {
            id: decoded?.id || "",
            fullname: fullName || decoded?.fullname || email.split("@")[0],
            email: decoded?.email || email,
            roles: roles ?? decoded?.roles ?? [],
          };

          localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
          setUser(authUser);
          toast.success("Login successful");

          const target = getRedirectPathByRole(authUser.roles);
          router.replace(target);
          return target;
        } catch (err: any) {
          const msg = axios.isAxiosError(err)
            ? err.response?.data?.message ?? "Login failed. Please check your credentials."
            : err.message || "Login failed";
          toast.error(msg);
          throw new Error(msg);
        } finally {
          setLoading(false);
        }
      },

      loginWithGoogle: async () => {
        setLoading(true);
        try {
          const idToken = await signInWithGoogle();
          const result = await authService.loginWithFirebase({ token: idToken });
          const { accessToken, fullName, roles } = result;

          tokenService.setAccessToken(accessToken);
          const decoded = decodeJWT(accessToken);

          const authUser: AuthUser = {
            id: decoded?.id || "",
            fullname: fullName || decoded?.fullname || "Google User",
            email: decoded?.email || "",
            roles: roles ?? decoded?.roles ?? ["ROLE_USER"],
          };

          localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
          setUser(authUser);
          toast.success("Google Login successful");

          const target = getRedirectPathByRole(authUser.roles);
          router.replace(target);
          return target;
        } catch (err: any) {
          const msg = axios.isAxiosError(err)
            ? err.response?.data?.message ?? "Google Login failed"
            : err.message || "Google Login failed";
          toast.error(msg);
          throw new Error(msg);
        } finally {
          setLoading(false);
        }
      },

      register: async (data) => {
        setLoading(true);
        try {
          await api.post("/api/v1/auth/register", data);
          toast.success("Verification code sent to your email");
          return { email: data.email };
        } catch (err: any) {
          const msg = axios.isAxiosError(err)
            ? err.response?.data?.message ?? "Registration failed"
            : "Registration failed";
          toast.error(msg);
          throw new Error(msg);
        } finally {
          setLoading(false);
        }
      },

      verifyOtp: async (email, otp) => {
        setLoading(true);
        try {
          await api.post("/api/v1/auth/verify-otp", { email, otp });
          toast.success("Verification successful, you can now log in");
          router.replace("/login");
        } catch (err: any) {
          const msg = axios.isAxiosError(err)
            ? err.response?.data?.message ?? "Invalid verification code"
            : "Invalid verification code";
          toast.error(msg);
          throw new Error(msg);
        } finally {
          setLoading(false);
        }
      },

      forgetPassword: async ({ email }) => {
        setLoading(true);
        try {
          await api.post("/api/v1/auth/forget-password", { email });
          toast.success("Password reset link sent");
          router.replace("/login");
        } catch (err: any) {
          const msg = axios.isAxiosError(err)
            ? err.response?.data?.message ?? "Request failed"
            : "Request failed";
          toast.error(msg);
          throw new Error(msg);
        } finally {
          setLoading(false);
        }
      },

      logout: async () => {
        setLoading(true);
        try {
          await authService.logout().catch(() => {});
        } catch (err) {
          console.warn("Logout error:", err);
        } finally {
          setUser(null);
          localStorage.removeItem(SESSION_KEY);
          localStorage.removeItem("user");
          tokenService.clearAccessToken();
          toast.success("Logged out successfully");
          await new Promise((resolve) => setTimeout(resolve, 100));
          window.location.replace("/login");
        }
      },
    }),
    [user, loading, router]
  );

  if (loading || isRedirecting) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f5f0]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#c3a26c] border-t-transparent" />
          <span className="text-sm font-medium text-stone-600">Authenticating session...</span>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Helper decode JWT
function decodeJWT(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id || "",
      email: payload.sub || "",
      fullname: payload.fullname || payload.name || "",
      roles: payload.roles || [],
    };
  } catch {
    return null;
  }
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}