import { useCallback, useState } from "react";
import { ApiResponse } from "@/types/api";
import { RegisterRequestBody, RegisterResult } from "../types/register";
import { registerUser } from "../services/registerService";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (body: RegisterRequestBody, citizenIdFile: File, studentCardFile: File) => {
      setError(null);
      setLoading(true);
      try {
        const res = await registerUser(body, citizenIdFile, studentCardFile);
        if (res.code !== 200) throw new Error(res.message || "Registration failed");
        return res as ApiResponse<RegisterResult>;
      } catch (err: any) {
        setError(err?.message ?? "Registration failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { execute, loading, error };
}