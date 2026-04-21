"use client";
import { Video } from "@/app/api/video/route";
import { useLanguage } from "@/common/LanguageContext";
import { useEffect, useState } from "react";

type Props = {
  videos: Video[];
  activeVideo: string | null;
  onSelect: (url: string) => void;
  onBack: () => void;
};

export default function VideoSidebar({
  videos,
  activeVideo,
  onSelect,
  onBack,
}: Props) {
  const { language } = useLanguage();
  const [videoLimit, setVideoLimit] = useState<number | null>(null);

  // ✅ Load limit from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const limit = localStorage.getItem("free-videos-limit");
      if (limit) {
        setVideoLimit(Number(limit));
      }
    }
  }, []);

  return (
    <div className="h-screen w-80 space-y-3 border-l p-3">
      <button
        onClick={onBack}
        className="mb-3 rounded bg-primary px-3 py-1 text-white"
      >
        ← Back
      </button>

      {videos.map((video, index) => {
        const isLocked = videoLimit !== null && index >= videoLimit;

        const videoUrl =
          language === "English"
            ? video?.eng1_video_link
            : video.guj1_video_link;

        return (
          <div key={video.objectId} className="relative">
            {/* 🔒 Overlay */}
            {isLocked && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 backdrop-blur-sm">
                <p className="text-xs font-semibold text-gray-700">
                  🔒 Unlock videos
                </p>
              </div>
            )}

            {/* Video Item */}
            <div
              onClick={() => {
                if (!isLocked) {
                  onSelect(videoUrl);
                }
              }}
              className={`flex cursor-pointer gap-3 rounded-lg p-2 hover:bg-gray-100 ${
                activeVideo === video?.eng1_video_link ? "bg-gray-200" : ""
              } ${isLocked ? "pointer-events-none blur-sm" : ""}`}
            >
              {video.thumbnail_image ? (
                <img
                  src={video.thumbnail_image}
                  className="h-16 w-24 rounded object-cover"
                />
              ) : (
                <div className="flex h-16 w-24 items-center justify-center rounded bg-gray-200 text-xs">
                  No Image
                </div>
              )}

              <p className="text-sm font-medium">
                {language === "English"
                  ? video.eng1_video_name
                  : video.guj1_video_name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
