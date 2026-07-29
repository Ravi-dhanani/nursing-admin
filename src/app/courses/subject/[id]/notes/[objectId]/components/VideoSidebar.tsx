"use client";
import { Video } from "@/app/api/video/route";
import { useLanguage } from "@/common/LanguageContext";
import { usePaymentStatus } from "@/common/usePaymentStatus";
import { usePremiumAccess } from "@/common/usePremiumAccess";
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

  // Client-side LocalStorage States
  const [userMobile, setUserMobile] = useState<string>("");
  const [iapId, setIapId] = useState<string>("");

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

        const storedLimit = localStorage.getItem("free-videos-limit");
        if (storedLimit) {
          setVideoLimit(Number(storedLimit));
        }
      } catch (err) {
        console.error("Error reading localStorage:", err);
      }
    }
  }, []);

  // Access Hooks (Same logic as MCQ & Synopsis)
  const { hasAccess } = usePremiumAccess(userMobile, iapId);
  const { isPaid } = usePaymentStatus(userMobile);

  // User gets full access if EITHER check passes
  const userHasPaid = Boolean(hasAccess || isPaid);

  return (
    <div className="space-y-3 p-3">
      {videos.length > 0 && (
        <button
          onClick={onBack}
          className="mb-3 rounded bg-primary px-3 py-1 text-white"
        >
          ← Back
        </button>
      )}

      <div className="h-screen w-full space-y-3 overflow-scroll">
        {videos.map((video, index) => {
          const isLocked =
            !userHasPaid && videoLimit !== null && index >= videoLimit;

          const videoUrl =
            language === "English"
              ? video?.eng1_video_link
              : video.guj1_video_link;

          return (
            <div key={video.objectId} className="relative">
              {/* 🔒 Overlay for locked items */}
              {isLocked && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 backdrop-blur-sm">
                  <p className="text-xs font-semibold text-gray-700">
                    🔒 Unlock videos
                  </p>
                </div>
              )}

              <div
                onClick={() => {
                  if (!isLocked) {
                    onSelect(videoUrl);
                  }
                }}
                className={`flex cursor-pointer gap-3 rounded-lg p-2 hover:bg-primary hover:text-white ${
                  activeVideo === videoUrl
                    ? "bg-primary text-white"
                    : "bg-white"
                } ${isLocked ? "pointer-events-none blur-sm" : ""}`}
              >
                {video.thumbnail_image ? (
                  <img
                    src={video.thumbnail_image}
                    alt={video.eng1_video_name || "Video Thumbnail"}
                    className="h-16 w-24 select-none rounded object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-24 items-center justify-center rounded bg-gray-200 text-xs">
                    No Image
                  </div>
                )}

                <p className="select-none text-sm font-medium">
                  {language === "English"
                    ? video.eng1_video_name
                    : video.guj1_video_name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
