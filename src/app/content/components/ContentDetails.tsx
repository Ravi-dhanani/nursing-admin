import BackButton from "@/app/courses/subject/[id]/[slug]/components/BackButton";
import { Language } from "@/app/courses/subject/[id]/[slug]/components/ClientWrapper";
import { useLanguage } from "@/common/LanguageContext";
import NoData from "@/common/NoData";
import { useEffect, useState } from "react";

type MaterialDetail = {
  objectId: string;
  c1_subtitle_eng: string;
  c2_subtitle_guj: string;
  p1_pdf_file: {
    url: string;
    __type: string;
    name: string;
  };
  b1_post_id: string;
};

export default function ContentDetails({ id }: { id?: string | string[] }) {
  const [data, setData] = useState<MaterialDetail[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [title, setTitle] = useState<Language>({
    english: "",
    gujrati: "",
  });
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/content/materials/material-details?id=${id}`,
        );
        const result = await res.json();

        setData(Array.isArray(result) ? result : []);

        if (result?.length > 0) {
          setActive(result[0].objectId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const activeItem = data?.find(
    (item: MaterialDetail) => item.objectId === active,
  );

  useEffect(() => {
    if (!activeItem) return;

    if (activeItem.p1_pdf_file?.url) {
      setHtmlContent("");
      return;
    }

    const fetchHtml = async () => {
      try {
        setContentLoading(true);

        const res = await fetch(`/api/post?id=${activeItem.b1_post_id}`);
        const result = await res.json();

        setHtmlContent(result?.content?.rendered || "");
      } catch (error) {
        console.error(error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchHtml();
  }, [activeItem]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("material-name");

      if (stored) {
        const parsed = JSON.parse(stored);

        setTitle({
          english: parsed.english || "",
          gujrati: parsed.gujrati || "",
        });
      }
    } catch (e) {
      console.error("Invalid localStorage data");
    }
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <BackButton />
      <div className="mb-6 rounded-lg bg-white p-3">
        {loading ? (
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        ) : (
          <h1 className="text-2xl font-bold text-black">
            {language === "English" ? title.english : title.gujrati}
          </h1>
        )}
      </div>
      {!data.length && !loading ? (
        <NoData title="No Materials Details Available" />
      ) : (
        <div className="flex h-screen overflow-hidden rounded-md bg-white p-2">
          {/* LEFT SIDE (Sticky) */}
          <div className="w-1/3 border-r border-gray-300">
            <div className="sticky top-0 h-screen overflow-y-auto">
              {loading ? (
                <div className="space-y-3 p-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-5 w-full animate-pulse rounded bg-gray-200"
                    />
                  ))}
                </div>
              ) : (
                data?.map((item) => (
                  <div
                    key={item.objectId}
                    onClick={() => setActive(item.objectId)}
                    className={`cursor-pointer p-4 transition-all duration-200 ${
                      active === item.objectId
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.c1_subtitle_eng}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT SIDE (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="h-full w-full animate-pulse rounded-lg bg-gray-200" />
            ) : activeItem?.p1_pdf_file?.url ? (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  activeItem.p1_pdf_file.url,
                )}&embedded=true`}
                className="h-full w-full rounded-lg border"
              />
            ) : contentLoading ? (
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-full animate-pulse rounded bg-gray-200"
                  />
                ))}
              </div>
            ) : htmlContent ? (
              <>
                <div className="sticky top-0 z-10 flex justify-end">
                  <button
                    onClick={() => {
                      const newWindow = window.open("", "_blank");

                      if (newWindow) {
                        newWindow.document.write(`
          <html>
            <head>
              <title>Content</title>
              <style>
                body { font-family: sans-serif; padding: 20px; }
                * { user-select: none; } /* disable selection */
              </style>
            </head>
            <body oncontextmenu="return false">
              ${htmlContent || ""}
              <script>
                document.addEventListener('copy', e => e.preventDefault());
                document.addEventListener('cut', e => e.preventDefault());
                document.addEventListener('contextmenu', e => e.preventDefault());
                document.addEventListener('keydown', function(e) {
                  if (e.ctrlKey && ['c','u','s'].includes(e.key.toLowerCase())) {
                    e.preventDefault();
                  }
                });
              </script>
            </body>
          </html>
        `);
                        newWindow.document.close();
                      }
                    }}
                    className="mb-4 rounded-lg bg-primary px-4 py-2 text-white"
                  >
                    Open in New Tab
                  </button>
                </div>
                <div
                  className="prose pointer-events-none max-w-none select-none"
                  style={{
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none",
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </>
            ) : (
              <NoData title="No Materials Available" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
