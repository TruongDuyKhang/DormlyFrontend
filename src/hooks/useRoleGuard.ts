"use client";
import { useAuth } from "@/app/(auth)/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useRoleGuard(allowedRoles: string[], fallbackPath: string) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const normalizedUserRoles = user.roles.map((r) => r.toLowerCase());
    const hasAccess = allowedRoles.some((r) =>
      normalizedUserRoles.includes(r.toLowerCase())
    );

    if (!hasAccess) {
      router.replace(fallbackPath);
      return;
    }

    setChecked(true);
  }, [user, loading, router, allowedRoles, fallbackPath]);

  return { checked, loading, user };
}