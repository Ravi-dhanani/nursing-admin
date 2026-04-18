import { Video } from "@/app/api/video/route";
import { useLanguage } from "@/common/LanguageContext";

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
  return (
    <div className="h-screen w-80 space-y-3 border-l p-3">
      <button
        onClick={onBack}
        className="mb-3 rounded bg-primary px-3 py-1 text-white"
      >
        ← Back
      </button>

      {videos.map((video) => (
        <div
          key={video.objectId}
          onClick={() =>
            onSelect(
              language === "English"
                ? video?.eng1_video_link
                : video.guj1_video_link,
            )
          }
          className={`flex cursor-pointer gap-3 rounded-lg p-2 hover:bg-gray-100 ${
            activeVideo === video?.eng1_video_link ? "bg-gray-200" : ""
          }`}
        >
          {video.thumbnail_image ? (
            <img
              src={video?.thumbnail_image}
              className="h-16 w-24 rounded object-cover"
            />
          ) : (
            <div className="flex h-16 w-24 items-center justify-center rounded bg-gray-200 text-xs">
              No Image
            </div>
          )}
          <p className="text-sm font-medium">{video.eng1_video_name}</p>
        </div>
      ))}
    </div>
  );
}
