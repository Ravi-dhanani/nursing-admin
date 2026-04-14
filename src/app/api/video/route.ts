import Parse from "@/app/components/parse";

export type Video = {
  objectId: string;

  a1_video_number: number;

  eng1_video_name: string;
  guj1_video_name: string;

  eng1_video_link: string;
  guj1_video_link: string;

  a1_video_category_id: string;

  thumbnail_image: string | null;

  createdAt: string;
  updatedAt: string;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Missing id" }, { status: 400 });
    }

    const VideoModel = Parse.Object.extend("VideoSubItems");
    const query = new Parse.Query(VideoModel);

    query.equalTo("a1_video_category_id", id);

    const results = await query.find();

    const data = results.map((item) => ({
      objectId: item.id ?? "",

      a1_video_number: item.get("a1_video_number") ?? 0,

      eng1_video_name: item.get("eng1_video_name") ?? "",
      guj1_video_name: item.get("guj1_video_name") ?? "",

      eng1_video_link: item.get("eng1_video_link") ?? "",
      guj1_video_link: item.get("guj1_video_link") ?? "",

      a1_video_category_id: item.get("a1_video_category_id") ?? "",

      thumbnail_image: item.get("thumbnail_image") ?? null,

      createdAt: item.createdAt?.toISOString() ?? "",
      updatedAt: item.updatedAt?.toISOString() ?? "",
    }));

    return Response.json(data);
  } catch (error) {
    console.error("Video API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
