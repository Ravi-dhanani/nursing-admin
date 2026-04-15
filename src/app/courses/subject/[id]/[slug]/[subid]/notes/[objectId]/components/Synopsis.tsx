import { Post } from "@/app/api/post/route";
import { SynopsisItem } from "@/app/api/synopsis/route";
import Loading from "@/common/Loading";
import NoData from "@/common/NoData";
import { useQuetionsContextHook } from "@/hooks/QuetionsHook";
import { useEffect, useState } from "react";

export default function Synopsis() {
  const { paramsId } = useQuetionsContextHook();
  const [synopsisList, setSynopsisList] = useState<SynopsisItem[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [loadingSynopsis, setLoadingSynopsis] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingSynopsis(true);

        const res = await fetch(`/api/synopsis?synopsisId=${paramsId}`);
        const data: SynopsisItem[] = await res.json();

        setSynopsisList(data);

        if (data.length > 0) {
          setActiveItem(data[0].eng1_synp_link);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSynopsis(false);
      }
    };

    if (paramsId) load();
  }, [paramsId]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/post?id=${activeItem}`);
        if (!res.ok) throw new Error("Failed");

        const data: Post = await res.json();
        setPost(data);
      } catch (error) {
        console.error(error);
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

            {synopsisList?.map((item) => (
              <div
                key={item.objectId}
                onClick={() => setActiveItem(item.eng1_synp_link)}
                className={`cursor-pointer border-b p-3 text-sm transition ${
                  activeItem === item.eng1_synp_link
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {item.eng1_synp_title}
              </div>
            ))}
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
