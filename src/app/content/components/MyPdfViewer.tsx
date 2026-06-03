"use client";
import { PDFViewer, PDFViewerRef } from "@embedpdf/react-pdf-viewer";
import { useCallback, useEffect, useRef, useState } from "react";

interface MyPdfViewerProps {
  pdfUrl: string;
  themePreference?: "light" | "dark";
}

export default function MyPdfViewer({
  pdfUrl,
  themePreference = "light",
}: MyPdfViewerProps) {
  const viewerRef = useRef<PDFViewerRef>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    viewerRef.current?.container?.setTheme({ preference: themePreference });
  }, [themePreference]);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="h-screen w-full overflow-hidden rounded-xl border border-gray-300 shadow-lg dark:border-gray-600">
        <PDFViewer
          ref={viewerRef}
          onReady={handleReady}
          config={{
            src: pdfUrl,
            theme: {
              preference: themePreference,
            },

            disabledCategories: [
              "annotation",
              "print",
              "export",
              "panel",
              "insert",
              "redaction",
              "form",
              "pointer",
              "pan",
              "selection",
              "selection-copy",
              "document-print",
              "document-capture",
              "document-protect",
              "document-export",
              "document-open",
              "document-close",
              "document-open",
            ],
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
