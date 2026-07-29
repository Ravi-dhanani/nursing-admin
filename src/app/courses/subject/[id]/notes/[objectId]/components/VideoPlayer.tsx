"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";

type Props = {
  videoUrl: string | null;
};

export default function VideoPlayer({ videoUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();

      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }

    // Safari native HLS support
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
    }
  }, [videoUrl]);

  return (
    <video
      ref={videoRef}
      className="h-[400px] w-full rounded-lg bg-black object-contain"
      controls
      autoPlay
      playsInline
    />
  );
}
