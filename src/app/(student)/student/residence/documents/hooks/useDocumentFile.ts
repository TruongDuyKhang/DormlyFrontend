import { useState, useCallback } from "react";
import { fetchDocumentBlobUrl } from "../services/documentService";

type Status = "idle" | "loading" | "error";

export function useDocumentFile() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const openFile = useCallback(async (fileUrl: string) => {
    setStatus("loading");
    setError("");
    try {
      const blobUrl = await fetchDocumentBlobUrl(fileUrl);
      window.open(blobUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      setStatus("idle");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load file");
      setStatus("error");
    }
  }, []);

  const downloadFile = useCallback(async (fileUrl: string, fileName: string) => {
    setStatus("loading");
    setError("");
    try {
      const blobUrl = await fetchDocumentBlobUrl(fileUrl);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      setStatus("idle");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to download file");
      setStatus("error");
    }
  }, []);

  return { openFile, downloadFile, status, error };
}