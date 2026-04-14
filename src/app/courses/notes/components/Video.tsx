"use client";

import { useQuetionsContextHook } from "@/hooks/QuetionsHook";
import { useEffect, useState } from "react";

import VideoCategoryList from "./VideoCategoryList";
import VideoPlayer from "./VideoPlayer";
import VideoSidebar from "./VideoSidebar";

import { fetchVideos } from "../services/video.service";
import { fetchVideoCategories } from "../services/videoCategory.service";

export default function VideoPage() {
  const { paramsId } = useQuetionsContextHook();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // ✅ load categories
  useEffect(() => {
    const load = async () => {
      const data = await fetchVideoCategories(paramsId);
      setCategories(data);
    };
    load();
  }, [paramsId]);

  // ✅ load videos
  useEffect(() => {
    const load = async () => {
      if (!selectedCategory) return;

      const data = await fetchVideos(selectedCategory);
      console.log(data);
      setVideos(data);

      // auto play first video
      if (data.length > 0) {
        setActiveVideo(data[0].eng1_video_link);
      }
    };
    load();
  }, [selectedCategory]);

  if (!selectedCategory) {
    return (
      <div className="p-6">
        {categories && categories.length > 0 && (
          <>
            <h2 className="mb-4 text-xl font-bold">Select Subject</h2>
            <VideoCategoryList
              categories={categories}
              onSelect={setSelectedCategory}
            />
          </>
        )}
      </div>
    );
  }

  // ✅ SCREEN 2
  return (
    <div className="flex">
      <div className="flex-1">
        <VideoPlayer videoUrl={activeVideo} />
      </div>

      <VideoSidebar
        videos={videos}
        activeVideo={activeVideo}
        onSelect={setActiveVideo}
        onBack={() => setSelectedCategory(null)}
      />
    </div>
  );
}
