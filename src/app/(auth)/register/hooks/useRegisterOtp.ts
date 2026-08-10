// app/(auth)/register/hooks/useRegisterOtp.ts
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { sendRegisterCode } from "../services/registerService";
import { getErrorMessage } from "../_components/utils";

export function useRegisterOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const execute = useCallback(async (email: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await sendRegisterCode(email);
      if (res.code !== 200) throw new Error(res.message || "Failed to send code");
      setSent(true);
      setCooldown(60);
      return res;
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset OTP state so the user can change their email and request a new code
  const reset = useCallback(() => {
    setError(null);
    setSent(false);
    setCooldown(0);
  }, []);

  return { execute, loading, error, sent, cooldown, reset };
}