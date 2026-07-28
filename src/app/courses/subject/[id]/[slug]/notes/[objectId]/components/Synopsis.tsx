import { Post } from "@/app/api/post/route";
import { SynopsisItem } from "@/app/api/synopsis/route";
import { useLanguage } from "@/common/LanguageContext";
import Loading from "@/common/Loading";
import NoData from "@/common/NoData";
import { usePremiumAccess } from "@/common/usePremiumAccess";
import { useQuetionsContextHook } from "@/hooks/QuetionsHook";
import { useEffect, useRef, useState } from "react";

export default function Synopsis() {
  const { paramsId } = useQuetionsContextHook();
  const [synopsisList, setSynopsisList] = useState<SynopsisItem[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [loadingSynopsis, setLoadingSynopsis] = useState(true);
  const [synopsisLimit, setSynopsisLimit] = useState<number | null>(null);

  const { language } = useLanguage();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const iapId = localStorage.getItem("iapid") || "";

  const { hasAccess } = usePremiumAccess(user.a3_phone_number, iapId);

  const hasFetchedSynopsis = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const limit = localStorage.getItem("free-synopsis-limit");
      if (limit) {
        setSynopsisLimit(Number(limit));
      }
    }
  }, []);

  useEffect(() => {
    if (!paramsId || hasFetchedSynopsis.current) return;

    hasFetchedSynopsis.current = true;

    const load = async () => {
      try {
        setLoadingSynopsis(true);
        const res = await fetch(`/api/synopsis?synopsisId=${paramsId}`);
        const data = await res.json();

        setSynopsisList(data);

        if (data.length > 0) {
          setActiveItem(
            language === "English"
              ? data[0].eng1_synp_link
              : data[0].guj1_synp_link,
          );
        }
      } catch (error) {
      } finally {
        setLoadingSynopsis(false);
      }
    };

    load();
  }, [paramsId]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/post?id=${activeItem}`);
        if (!res.ok) throw new Error("Failed");

        const data: Post = await res.json();
        setPost(data);
      } catch (error) {
        setPost(null);
      }
    };

    if (activeItem) load();
  }, [activeItem]);

  if (loadingSynopsis) {
    return <Loading />;
  }

  return (
    <>
      {synopsisList.length > 0 ? (
        <div className="flex h-[calc(100vh-200px)] overflow-hidden rounded-sm border">
          {/* ✅ LEFT SIDE (Sticky Titles) */}
          <div className="w-1/3 overflow-y-auto border-r bg-gray-50">
            <div className="sticky top-0 z-10 border-b bg-white p-3 font-semibold">
              Units
            </div>

            {synopsisList.map((item, index) => {
              const isLocked =
                !hasAccess && synopsisLimit !== null && index >= synopsisLimit;
              const link =
                language === "English"
                  ? item.eng1_synp_link
                  : item.guj1_synp_link;

              return (
                <div key={item.objectId} className="relative">
                  {/* 🔒 Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 text-xs font-semibold text-gray-700 backdrop-blur-sm">
                      🔒 Locked
                    </div>
                  )}

                  <div
                    onClick={() => {
                      if (!isLocked) {
                        setActiveItem(link);
                      }
                    }}
                    className={`cursor-pointer select-none border-b p-3 text-sm transition ${
                      activeItem === item.eng1_synp_link
                        ? "bg-primary text-white"
                        : "hover:bg-gray-200"
                    } ${isLocked ? "pointer-events-none blur-sm" : ""}`}
                  >
                    {language === "English"
                      ? item.eng1_synp_title
                      : item.guj1_synp_title}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-2/3 overflow-y-auto bg-white p-5">
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
          ${post?.content?.rendered || ""}
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
            {post?.content?.rendered && (
              <div
                className="pointer-events-none select-none"
                style={{
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                dangerouslySetInnerHTML={{
                  __html: post?.content?.rendered,
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <NoData title="No Synopsis Available" />
      )}
    </>
  );
}
