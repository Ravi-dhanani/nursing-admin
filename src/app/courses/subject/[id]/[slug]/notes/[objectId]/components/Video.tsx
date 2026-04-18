"use client";

import { useQuetionsContextHook } from "@/hooks/QuetionsHook";
import { useEffect, useRef, useState } from "react";

import VideoCategoryList from "./VideoCategoryList";
import VideoPlayer from "./VideoPlayer";
import VideoSidebar from "./VideoSidebar";

import NoData from "@/common/NoData";
import { fetchVideos } from "../services/video.service";
import { fetchVideoCategories } from "../services/videoCategory.service";

export default function VideoPage() {
  const { paramsId } = useQuetionsContextHook();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(false);

  // ✅ load categories
  const hasFetchedCategories = useRef(false);

  useEffect(() => {
    if (!paramsId || hasFetchedCategories.current) return;

    hasFetchedCategories.current = true;

    const load = async () => {
      try {
        setLoadingCategories(true);
        const data = await fetchVideoCategories(paramsId);
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };

    load();
  }, [paramsId]);

  const hasFetchedVideos = useRef(false);

  useEffect(() => {
    if (!selectedCategory || hasFetchedVideos.current) return;

    hasFetchedVideos.current = true;

    const load = async () => {
      try {
        setLoadingVideos(true);
        const data = await fetchVideos(selectedCategory);
        setVideos(data);

        if (data.length > 0) {
          setActiveVideo(data[0].eng1_video_link);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingVideos(false);
      }
    };

    load();
  }, [selectedCategory]);

  if (!selectedCategory) {
    return (
      <>
        {categories.length > 0 ? (
          <div className="p-6">
            {loadingCategories ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse cursor-pointer rounded-lg border bg-white p-4"
                  >
                    <div className="h-5 w-32 rounded bg-gray-300"></div>
                  </div>
                ))}
              </div>
            ) : (
              <VideoCategoryList
                categories={categories}
                onSelect={setSelectedCategory}
              />
            )}
          </div>
        ) : (
          <NoData title="No Videos Available" />
        )}
      </>
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
