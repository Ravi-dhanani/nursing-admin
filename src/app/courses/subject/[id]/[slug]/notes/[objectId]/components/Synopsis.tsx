import { Post } from "@/app/api/post/route";
import { SynopsisItem } from "@/app/api/synopsis/route";
import { useLanguage } from "@/common/LanguageContext";
import Loading from "@/common/Loading";
import NoData from "@/common/NoData";
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
          setActiveItem(data[0].eng1_synp_link);
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
              const isLocked = synopsisLimit !== null && index >= synopsisLimit;

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
                    className={`cursor-pointer border-b p-3 text-sm transition ${
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
            <style>
              body { font-family: sans-serif; padding: 20px; }
              * { user-select: none; } /* disable selection */
            </style>
          </head>
          <body oncontextmenu="return false">
            ${post?.content?.rendered || ""}
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
            {post?.content?.rendered && (
              <div
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
