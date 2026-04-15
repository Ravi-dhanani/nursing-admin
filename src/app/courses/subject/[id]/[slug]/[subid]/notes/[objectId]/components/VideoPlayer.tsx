type Props = {
  videoUrl: string | null;
};

export default function VideoPlayer({ videoUrl }: Props) {
  return (
    <>
      {videoUrl && (
        <video
          className="h-[400px] w-full object-cover"
          controls
          autoPlay
          muted
        >
          <source src={videoUrl} type="application/x-mpegURL" />
        </video>
      )}
    </>
  );
}
