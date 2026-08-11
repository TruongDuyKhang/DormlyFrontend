"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { tokenService } from "@/services/tokenService";
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
  login: (email: string, password: string) => Promise<void>;
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

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(SESSION_KEY) : null;
      const token = tokenService.getAccessToken();

      if (raw && tokenService.hasValidToken()) {
        const parsedUser = JSON.parse(raw);
        setUser(parsedUser);
      } else {
        localStorage.removeItem(SESSION_KEY);
        tokenService.clearAccessToken();
        setUser(null);
      }
    } catch (err) {
      console.debug("AuthProvider: failed to parse session", err);
      localStorage.removeItem(SESSION_KEY);
      tokenService.clearAccessToken();
    } finally {
      setLoading(false);
    }
  }, []);

  // Guard xử lý cả 2 chiều
  useEffect(() => {
    if (!loading) {
      const isPublic = PUBLIC_ROUTES.includes(pathname);

      if (!user && !isPublic) {
        setIsRedirecting(true);
        router.replace("/login");
        return;
      }

      if (user && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
        setIsRedirecting(true);
        router.replace(getRedirectPathByRole(user.roles));
        return;
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
          const res = await api.post("/api/v1/auth/login", { email, password });
          const { accessToken, fullName, roles } = res.data.result;

          tokenService.setAccessToken(accessToken);

          const decoded = decodeJWT(accessToken);

          const authUser: AuthUser = {
            id: decoded?.id || "",
            fullname: fullName,
            email: decoded?.email || email,
            phonenumber: undefined,
            roles: roles ?? [],
          };

          localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
          setUser(authUser);
          toast.success("Login successful");
        } catch (err: any) {
          const msg = axios.isAxiosError(err)
            ? err.response?.data?.message ?? "Login failed"
            : "Login failed";
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
          const token = tokenService.getAccessToken();
          if (token) {
            await api.post("/api/v1/auth/logout");
          }
        } catch (err) {
          console.warn("Logout error:", err);
        } finally {
          setUser(null);
          localStorage.removeItem(SESSION_KEY);
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
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
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