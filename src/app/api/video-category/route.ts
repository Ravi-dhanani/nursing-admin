import Parse from "@/app/components/parse";

export type VideoCategory = {
  objectId: string;

  a1_subject_id: string;
  a1_video_number: number;

  eng1_video_title: string;
  guj1_video_title: string;

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

    const Video = Parse.Object.extend("VideoCategoryItems");
    const query = new Parse.Query(Video);

    query.equalTo("a1_subject_id", id);

    const results = await query.find();

    const data = results.map((item) => ({
      objectId: item.id ?? "",

      a1_subject_id: item.get("a1_subject_id") ?? "",
      a1_video_number: item.get("a1_video_number") ?? 0,

      eng1_video_title: item.get("eng1_video_title") ?? "",
      guj1_video_title: item.get("guj1_video_title") ?? "",

      createdAt: item.createdAt?.toISOString() ?? "",
      updatedAt: item.updatedAt?.toISOString() ?? "",
    }));

    return Response.json(data);
  } catch (error) {
    console.error("API ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
