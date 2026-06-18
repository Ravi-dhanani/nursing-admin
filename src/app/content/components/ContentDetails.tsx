import BackButton from "@/app/courses/subject/[id]/[slug]/components/BackButton";
import { Language } from "@/app/courses/subject/[id]/[slug]/components/ClientWrapper";
import { useLanguage } from "@/common/LanguageContext";
import NoData from "@/common/NoData";
import { useEffect, useState } from "react";
import MyPdfViewer from "./MyPdfViewer";

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
          <h1 className="select-none text-2xl font-bold text-black">
            {language === "English" ? title.english : title.gujrati}
          </h1>
        )}
      </div>
      {!data.length && !loading ? (
        <NoData title="No Materials Details Available" />
      ) : (
        <div className="flex h-screen overflow-hidden rounded-md bg-white p-2">
          {/* LEFT SIDE (Sticky) */}
          <div className="w-1/4 border-r border-gray-300">
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
                    className={`cursor-pointer select-none p-4 transition-all duration-200 ${
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
          <div className="min-w-0 flex-1 overflow-hidden p-4">
            {loading ? (
              <div className="h-full w-full animate-pulse rounded-lg bg-gray-200" />
            ) : activeItem?.p1_pdf_file?.url ? (
              <div style={{ height: "700px", width: "100%" }}>
                <MyPdfViewer pdfUrl={activeItem?.p1_pdf_file.url} />
              </div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: sans-serif;
            margin: 0;
            padding: 20px;
            background: #fff;
            user-select: none;
          }

          #content {
            transform-origin: top left;
            transition: transform 0.2s ease;
          }

          .zoom-controls {
            position: fixed;
            right: 20px;
            bottom: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 9999;
          }

          .zoom-btn {
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: #00858a;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          }

          .zoom-btn:hover {
            opacity: 0.9;
          }
        </style>
      </head>

      <body oncontextmenu="return false">

        <div id="content">
          ${htmlContent || ""}
        </div>

        <div class="zoom-controls">
          <button class="zoom-btn" onclick="zoomIn()">+</button>
          <button class="zoom-btn" onclick="zoomOut()">−</button>
        </div>

        <script>
          let scale = 1;

          function applyZoom() {
            document.getElementById('content').style.transform =
              'scale(' + scale + ')';
          }

          function zoomIn() {
            scale += 0.1;
            applyZoom();
          }

          function zoomOut() {
            scale = Math.max(0.5, scale - 0.1);
            applyZoom();
          }

          document.addEventListener('copy', e => e.preventDefault());
          document.addEventListener('cut', e => e.preventDefault());
          document.addEventListener('contextmenu', e => e.preventDefault());

          document.addEventListener('keydown', function(e) {
            if (
              (e.ctrlKey && ['c','u','s'].includes(e.key.toLowerCase())) ||
              e.key === 'F12'
            ) {
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
