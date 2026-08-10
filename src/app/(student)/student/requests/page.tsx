// app/requests/page.tsx
import { Suspense } from "react";
import { RequestsPageContent } from "./_components/requests-page-content";

export default function RequestsPage() {
  return (
    <Suspense fallback={null}>
      <RequestsPageContent />
    </Suspense>
  );
}