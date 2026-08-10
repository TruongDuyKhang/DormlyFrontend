import { TokenData } from "@/types/auth";

const ACCESS_TOKEN_KEY = "access_token";

// Decode JWT để lấy exp
function decodeJwtExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

// Decode JWT để lấy thông tin user (tùy chọn)
export function decodeJWT(token: string) {
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

export const tokenService = {
  setAccessToken(token: string): void {
    const tokenData: TokenData = { accessToken: token };
    if (typeof window !== "undefined") {
      localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(tokenData));
    }
  },

  getAccessToken(): string {
    if (typeof window === "undefined") return "";
    try {
      const raw = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!raw) return "";
      const tokenData: TokenData = JSON.parse(raw);
      return tokenData.accessToken;
    } catch (err) {
      console.error("Error getting access token:", err);
      return "";
    }
  },

  clearAccessToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  },

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    const exp = decodeJwtExp(token);
    if (exp === null) return true;

    const nowInSeconds = Date.now() / 1000;
    return exp > nowInSeconds;
  },

  isExpiringSoon(bufferSeconds = 60): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    const exp = decodeJwtExp(token);
    if (exp === null) return false;
    return exp - Date.now() / 1000 < bufferSeconds;
  },
};