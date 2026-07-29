"use client";
import { Post } from "@/app/api/post/route";
import { SynopsisItem } from "@/app/api/synopsis/route";
import { useLanguage } from "@/common/LanguageContext";
import Loading from "@/common/Loading";
import NoData from "@/common/NoData";
import { usePaymentStatus } from "@/common/usePaymentStatus";
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
  const [loadingPost, setLoadingPost] = useState(false);
  const [mobileTab, setMobileTab] = useState<"units" | "content">("units");
  const { language } = useLanguage();

  // Client-side LocalStorage States
  const [userMobile, setUserMobile] = useState<string>("");
  const [iapId, setIapId] = useState<string>("");

  const hasFetchedSynopsis = useRef(false);

  // Safely read LocalStorage after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.a3_phone_number) {
            setUserMobile(String(parsedUser.a3_phone_number));
          }
        }

        const storedIapId = localStorage.getItem("iapid");
        if (storedIapId) {
          setIapId(storedIapId);
        }

        const storedLimit = localStorage.getItem("free-synopsis-limit");
        if (storedLimit) {
          setSynopsisLimit(Number(storedLimit));
        }
      } catch (err) {
        console.error("Error reading localStorage:", err);
      }
    }
  }, []);

  // Access Hooks (Same logic as MCQ)
  const { hasAccess } = usePremiumAccess(userMobile, iapId);
  const { isPaid } = usePaymentStatus(userMobile);

  // User gets full access if EITHER check passes
  const userHasPaid = Boolean(hasAccess || isPaid);

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
        console.error("Error fetching synopsis list:", error);
      } finally {
        setLoadingSynopsis(false);
      }
    };

    load();
  }, [paramsId, language]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingPost(true);
        setPost(null);

        const res = await fetch(`/api/post?id=${activeItem}`);
        if (!res.ok) throw new Error("Failed");

        const data: Post = await res.json();
        setPost(data);
      } catch (error) {
        setPost(null);
      } finally {
        setLoadingPost(false);
      }
    };

    if (activeItem) load();
  }, [activeItem]);

  // Determine if active unit is locked
  const activeIndex = synopsisList.findIndex((item) => {
    const link =
      language === "English" ? item.eng1_synp_link : item.guj1_synp_link;
    return link === activeItem;
  });

  const isActiveLocked =
    !userHasPaid &&
    synopsisLimit !== null &&
    activeIndex !== -1 &&
    activeIndex >= synopsisLimit;

  if (loadingSynopsis) {
    return <Loading />;
  }

  return (
    <>
      {synopsisList.length > 0 ? (
        <div className="flex h-[calc(100vh-140px)] flex-col overflow-hidden rounded-sm border md:h-[calc(100vh-200px)] md:flex-row">
          {/* 📱 MOBILE / TABLET TAB TOGGLE BAR */}
          <div className="flex border-b bg-gray-100 md:hidden">
            <button
              onClick={() => setMobileTab("units")}
              className={`flex-1 py-2.5 text-center text-sm font-semibold transition-colors ${
                mobileTab === "units"
                  ? "border-b-2 border-primary bg-white text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Units ({synopsisList.length})
            </button>
            <button
              onClick={() => setMobileTab("content")}
              className={`flex-1 py-2.5 text-center text-sm font-semibold transition-colors ${
                mobileTab === "content"
                  ? "border-b-2 border-primary bg-white text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Content
            </button>
          </div>

          {/* 👈 LEFT SIDE (Units List) */}
          <div
            className={`w-full overflow-y-auto border-r bg-gray-50 md:w-1/3 ${
              mobileTab === "units" ? "block" : "hidden md:block"
            }`}
          >
            <div className="sticky top-0 z-10 hidden border-b bg-white p-3 font-semibold md:block">
              Units
            </div>

            {synopsisList.map((item, index) => {
              const isLocked =
                !userHasPaid &&
                synopsisLimit !== null &&
                index >= synopsisLimit;
              const link =
                language === "English"
                  ? item.eng1_synp_link
                  : item.guj1_synp_link;

              return (
                <div key={item.objectId} className="relative">
                  {/* 🔒 Overlay for locked items */}
                  {isLocked && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 text-xs font-semibold text-gray-700 backdrop-blur-sm">
                      🔒 Locked
                    </div>
                  )}

                  <div
                    onClick={() => {
                      if (!isLocked) {
                        setActiveItem(link);
                        setMobileTab("content");
                      }
                    }}
                    className={`cursor-pointer select-none border-b p-3 text-sm transition ${
                      activeItem === link
                        ? "bg-primary font-medium text-white"
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

          {/* 👉 RIGHT SIDE (Content View) */}
          <div
            className={`w-full overflow-y-auto bg-white p-4 md:w-2/3 md:p-5 ${
              mobileTab === "content" ? "block" : "hidden md:block"
            }`}
          >
            <div className="sticky top-0 z-10 flex w-full items-center justify-between border-b bg-white/90 pb-3 backdrop-blur-sm">
              <button
                onClick={() => setMobileTab("units")}
                className="text-xs font-semibold text-primary underline md:hidden"
              >
                ← Back to Units
              </button>

              {loadingPost && (
                <div className="absolute left-0 top-0 h-1 w-full overflow-hidden bg-gray-200">
                  <div className="animate-progress h-full w-1/2 bg-primary"></div>
                </div>
              )}

              {/* 🔒 Open in New Tab Button guarded by userHasPaid logic */}
              <button
                disabled={isActiveLocked}
                onClick={() => {
                  if (isActiveLocked) return;

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
                className={`ml-auto rounded-lg px-3 py-1.5 text-xs text-white transition sm:text-sm md:px-4 md:py-2 ${
                  isActiveLocked
                    ? "cursor-not-allowed bg-gray-400 opacity-80"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {isActiveLocked ? "🔒 Locked" : "Open in New Tab"}
              </button>
            </div>

            {/* 🔒 Main Content Locked Area */}
            {isActiveLocked ? (
              <div className="flex h-64 flex-col items-center justify-center space-y-2 text-center">
                <span className="text-3xl">🔒</span>
                <p className="text-sm font-semibold text-gray-700">
                  This content is part of the premium plan.
                </p>
                <p className="text-xs text-gray-500">
                  Please subscribe to unlock all units.
                </p>
              </div>
            ) : post?.content?.rendered ? (
              <div
                className="pointer-events-none mt-4 select-none"
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
            ) : (
              !loadingPost && (
                <div className="flex h-40 items-center justify-center text-sm text-gray-500">
                  Select a unit to view details
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <NoData title="No Synopsis Available" />
      )}
    </>
  );
}
