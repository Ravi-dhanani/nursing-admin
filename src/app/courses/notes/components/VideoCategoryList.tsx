"use client";
import { VideoCategory } from "@/app/api/video-category/route";

type Props = {
  categories: VideoCategory[];
  onSelect: (id: string) => void;
};

export default function VideoCategoryList({ categories, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((cat) => (
        <div
          key={cat.objectId}
          onClick={() => onSelect(cat.objectId)}
          className="cursor-pointer rounded-lg border bg-white p-4 hover:bg-primary hover:text-white"
        >
          {cat.eng1_video_title}
        </div>
      ))}
    </div>
  );
}
