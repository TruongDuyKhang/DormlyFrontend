import { baseUrl, api } from "@/lib/axios";
import { tokenService } from "./tokenService";

export const fileServeService = {
  /**
   * Get secure full URL for an uploaded file
   */
  getFileUrl(fileUrlPath?: string | null): string {
    if (!fileUrlPath) return "";
    if (fileUrlPath.startsWith("http://") || fileUrlPath.startsWith("https://")) {
      return fileUrlPath;
    }
    const cleanPath = fileUrlPath.startsWith("/") ? fileUrlPath : `/${fileUrlPath}`;
    return `${baseUrl}${cleanPath}`;
  },

  /**
   * Fetch secure blob (e.g. for image or PDF download) with Authorization Bearer header
   */
  async fetchSecureBlob(fileUrlPath: string): Promise<string> {
    const fullUrl = this.getFileUrl(fileUrlPath);
    const token = tokenService.getAccessToken();
    const response = await fetch(fullUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.statusText}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },
};
