// // hooks/useLogin.ts
// import { useCallback, useState } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import { loginUser } from "../services/loginService";
// import { tokenService } from "@/services/tokenService";
// import { LoginRequestBody, LoginResult } from "../types/login";

// export function useLogin() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const execute = useCallback(async (data: LoginRequestBody): Promise<LoginResult> => {
//     setError(null);
//     setLoading(true);

//     try {
//       const response = await loginUser(data);
//       if (response.code !== 200) {
//         throw new Error(response.message || "Login failed");
//       }

//       const { accessToken, fullName, roles } = response.result;
//       tokenService.setAccessToken(accessToken);

//       toast.success("Login successful");
//       return { accessToken, fullName, roles };
//     } catch (err: any) {
//       const message = axios.isAxiosError(err)
//         ? err.response?.data?.message ?? err.message ?? "Login failed"
//         : err.message ?? "Login failed";
//       setError(message);
//       toast.error(message);
//       throw new Error(message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { execute, loading, error };
// }