"use client";
import { useState } from "react";

const videos = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: `Video ${i + 1}`,
  youtubeId: "dQw4w9WgXcQ",
  thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
}));

export default function Video() {
  const [activeVideo, setActiveVideo] = useState(videos[0].youtubeId);

  return (
    <div className="flex overflow-hidden">
      <div className="flex-1">
        <video className="object-cover" controls autoPlay muted>
          <source
            src="https://vz-927a9630-e47.b-cdn.net/d43cffc6-d1eb-4d18-9fb7-cfd086a169a1/playlist.m3u8"
            type="application/x-mpegURL"
          />
        </video>
      </div>

      <div className="h-screen w-80 space-y-3 border-l p-3">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => setActiveVideo(video.youtubeId)}
            className={`flex cursor-pointer gap-3 rounded-lg p-2 hover:bg-gray-100 ${
              activeVideo === video.youtubeId ? "bg-gray-200" : ""
            }`}
          >
            <img
              src={video.thumbnail}
              className="h-16 w-24 rounded object-cover"
            />
            <p className="text-sm font-medium">{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
