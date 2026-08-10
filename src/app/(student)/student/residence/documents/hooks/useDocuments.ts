import { useState, useCallback, useEffect } from "react";
import { getMyDocuments } from "../services/documentService";
import { DisplayDocument, mergeWithRequiredDocuments } from "../types/document";

type Status = "idle" | "loading" | "success" | "error";

export function useDocuments() {
  const [documents, setDocuments] = useState<DisplayDocument[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const fetchDocuments = useCallback(async () => {
    setStatus("loading");
    setError("");

    try {
      const response = await getMyDocuments();

      if (response.code !== 200) {
        throw new Error(response.message || "Failed to load documents");
      }

      setDocuments(mergeWithRequiredDocuments(response.result ?? []));
      setStatus("success");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || "Failed to load documents";
      setError(errorMessage);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    status,
    error,
    refetch: fetchDocuments,
  };
}