"use client";

import {
  Download,
  Eye,
  FileCheck2,
  FileText,
  Loader2,
  RefreshCw,
  UploadCloud,
} from "lucide-react";
import { ResidenceTabs } from "../_components/residence-tabs";
import { StatusBadge } from "../_components/status-badge";
import { useDocuments } from "./hooks/useDocuments";
import { useDocumentFile } from "./hooks/useDocumentFile";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function StudentDocumentsPage() {
  const { documents, status, error, refetch } = useDocuments();
  const { openFile, downloadFile, status: fileStatus } = useDocumentFile();
  const isLoading = status === "idle" || status === "loading";
  const isFileLoading = fileStatus === "loading";

  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            Residence
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">
            Documents
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Keep required residence files visible, verified, and easy to update.
          </p>
        </div>
        <ResidenceTabs />
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.45fr)]">
        <div className="rounded-[2rem] border border-white/60 bg-white/42 p-5 shadow-[0_34px_90px_-68px_rgba(38,35,31,0.7),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/36 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
                <FileText className="h-3.5 w-3.5 text-[#9d7443]" />
                Uploaded Documents
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-stone-900">
                Required files
              </h2>
            </div>
        
          </div>

          {isLoading && (
            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-stone-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading documents...
            </div>
          )}

          {status === "error" && (
            <div className="mt-7 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
              <button onClick={refetch} className="ml-3 font-medium underline underline-offset-2">
                Try again
              </button>
            </div>
          )}

          {status === "success" && (
            <div className="mt-7 space-y-3">
              {documents.map((document) => (
                <article
                  key={document.documentType}
                  className="rounded-[1.45rem] border border-stone-200/70 bg-[#f8f4ee]/76 p-4 transition hover:bg-white/72"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f2a24] text-[#d6bd8a]">
                        <FileCheck2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-900">{document.name}</h3>
                        <p className="mt-1 text-sm text-stone-500">
                          {document.uploaded
                            ? `Uploaded on ${formatDate(document.updatedAt)}`
                            : "Not uploaded yet"}
                        </p>
                        {document.status === "REJECTED" && document.rejectReason && (
                          <p className="mt-1 text-xs text-rose-600">
                            Reason: {document.rejectReason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={document.tone}>
                        {document.verificationLabel}
                      </StatusBadge>
                      {document.uploaded && document.fileUrl && (
                        <>
                          <button
                            disabled={isFileLoading}
                            onClick={() => openFile(document.fileUrl!)}
                            className="inline-flex h-9 items-center gap-2 rounded-full border border-stone-300/70 bg-white/44 px-3 text-xs font-medium text-stone-700 transition hover:bg-white active:scale-[0.98] disabled:opacity-50"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                          <button
                            disabled={isFileLoading}
                            onClick={() =>
                              downloadFile(
                                document.fileUrl!,
                                `${document.name}${document.fileUrl!.slice(document.fileUrl!.lastIndexOf("."))}`
                              )
                            }
                            className="inline-flex h-9 items-center gap-2 rounded-full border border-stone-300/70 bg-white/44 px-3 text-xs font-medium text-stone-700 transition hover:bg-white active:scale-[0.98] disabled:opacity-50"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button>
                        </>
                      )}
                      <button className="inline-flex h-9 items-center gap-2 rounded-full border border-stone-300/70 bg-white/44 px-3 text-xs font-medium text-stone-700 transition hover:bg-white active:scale-[0.98]">
                        <RefreshCw className="h-3.5 w-3.5" />
                        {document.uploaded ? "Replace" : "Upload"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/60 bg-[#2f2a24]/92 p-5 text-stone-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-400">
              Verification Status
            </p>
            <div className="mt-6 space-y-3">
              {documents.map((document) => (
                <div
                  key={document.documentType}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/7 p-4"
                >
                  <p className="text-sm font-medium text-stone-100">{document.name}</p>
                  <StatusBadge tone={document.tone}>
                    {document.verificationLabel}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#2f2a24]/10 bg-[#d9cbb8] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-600">
              Document Guidelines
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-[1.25rem] border border-stone-900/10 bg-white/34 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                  Accepted formats
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  PDF, JPG, PNG (max 10MB per file)
                </p>
              </div>

              <div className="rounded-[1.25rem] border border-stone-900/10 bg-white/34 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                  Clear & readable
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  Ensure all text and photos are sharp, well-lit, and uncropped
                </p>
              </div>

              <div className="rounded-[1.25rem] border border-stone-900/10 bg-white/34 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                  Processing time
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  Documents are usually verified within 2-3 business days
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[1.25rem] border border-stone-900/10 bg-white/34 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                Need help?
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                Contact the residence office at <strong>support@dormly.com</strong>
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}